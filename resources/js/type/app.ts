import type { WsMessage } from "./type";
type EspStatusMessage ={
    connected:boolean
}

export interface EspStatus  extends WsMessage<EspStatusMessage>{
    event:"esp_status"
    message:EspStatusMessage
}
