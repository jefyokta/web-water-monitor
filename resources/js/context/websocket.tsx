import React, {
  createContext,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

export interface IWebSocketContext<T> {
  connected: boolean;
  sendMessage: (msg: string) => void;
  lastMessage: T | null;
  setLastMessage: Dispatch<SetStateAction<T | null>>;
  socket: WebSocket | null,
  espConnected: boolean,
  setEspConnected: Dispatch<SetStateAction<boolean>>,

}

export const WebSocketContext = createContext<IWebSocketContext<any>>(null);

interface Props {
  url: string;
  children: React.ReactNode;
}

export function WebSocketProvider<T = unknown>({ url, children }: Props) {
  const socketRef = useRef<WebSocket | null>(null);

  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<T | null>(null);
  const [espConnected, setEspConnected] = useState(false)


  useEffect(() => {
    const socket= new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      setConnected(true);
      socket.send(JSON.stringify({ event: "esp_status" }));
      console.log("WebSocket connected");

    };

    socket.onclose = () => {
      setConnected(false);
      console.log("WebSocket disconnected");
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => {
      socket.close();
    };
  }, [url]);

  const sendMessage = (msg: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(msg);
    }
  };


  return (
    <WebSocketContext.Provider value={{
      lastMessage,
      sendMessage,
      setLastMessage,
      connected,
      socket:socketRef.current,
      espConnected,
      setEspConnected
    }}>
      {children}
    </WebSocketContext.Provider>
  );
}
