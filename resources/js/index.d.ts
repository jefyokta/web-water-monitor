interface DashboardProps extends PageProps{
    botUsername:string,
    espIp:string|false
    [key: string]: unknown; 
}
interface ConfigProps extends PageProps{
    kVal:number,
    calibration:number,
    distance:number,
    [key: string]: unknown; 
}

interface HistoryProps extends PageProps {
    data:HistoryData[],
    pagination:{
        last_page:number,
        page:number,
        total:number,
        per_page:number
    },
     [key: string]: unknown; 

}

type HistoryData = {
    temp:number
    ph:number
    tds:number
    deep:number
    created_at:string
    id:number,
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
    deep:number,
    tds:number,
    temp:number
}
