interface DashboardProps extends PageProps{
    botUsername:string,
    espIp:string|false
    [key: string]: unknown; 
}

interface DefaultMessage {
    event:string,
    message:any
}

interface SensorMessage  extends DefaultMessage{
    message?:SensorData
}

interface SensorData {
    ph:number,
    distance:number,
    tds:number,
    temp:number
}
