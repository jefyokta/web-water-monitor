interface DashboardProps extends PageProps{
    botUsername:string
    [key: string]: unknown; 
}

interface DefaultMessage {
    event:string,
    message:any
}


interface SensorMessage {
    ph:number,
    distance:number,
    tds:number,
    temp:number
}
