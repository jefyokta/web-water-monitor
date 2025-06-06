import { useEffect } from "react"
import { useWebSocket } from "./useWebsocket"
import { toast } from "sonner"

const myToast = (message: string, error: boolean = false) => error ? toast.error(message, { position: "bottom-right" }) : toast.success(message, { position: "bottom-right" })
const toaster = {
    espConnected: () => {
        myToast("Esp Connected")
    },
    espDisconnected: () => {
        myToast("Esp Disconnected", true)
    }
}

export const Slave = () => {
    const { setLastMessage, socket, setEspConnected } = useWebSocket<SensorMessage>()
    useEffect(() => {
        const handler = (e: MessageEvent) => {
            if (!socket) return
            const msg: DefaultMessage = JSON.parse(e.data)
            console.log(msg)
            switch (msg.event) {
                case "esp_join":
                    toaster.espConnected()
                    setEspConnected(true)
                    break;
                case "esp_status":
                    setEspConnected(msg.message.status)
                    break;
                case "esp_exit":
                    setEspConnected(false)
                    toaster.espDisconnected()
                    break
                case "publish":
                    setLastMessage(msg.message as SensorMessage)
                    break
                default:
                    break;
            }
        }
        socket?.addEventListener("message", handler)

        return () => socket?.removeEventListener("message", handler)
    }, [socket])
    return <></>
}