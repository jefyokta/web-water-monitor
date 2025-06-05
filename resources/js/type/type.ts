
export interface WsMessage<T> {
    event:string,
    message:T
}