import { useContext } from "react";
import { WebSocketContext, type IWebSocketContext } from "@/context/websocket";

export function useWebSocket<T = DefaultMessage>(): IWebSocketContext<T> {
  return useContext(WebSocketContext) as IWebSocketContext<T>;
}
