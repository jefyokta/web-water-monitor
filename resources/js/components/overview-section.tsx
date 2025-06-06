import { Link, usePage } from "@inertiajs/react"
import { List } from "./list"
import { WebsocketIcon } from "./icon/websocket"
import { Bubble } from "./bubble"
import { More } from "./icon/more"
import { RefreshCcw } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { useEffect, useState, type Dispatch, type SetStateAction } from "react"
import { useWebSocket } from "@/hooks/useWebsocket"
import { ChartSection } from "./chart-section"
import { toast } from "sonner"
import type { DataPoint } from "./chart"


export const OverviewSection = () => {
    const { espIp } = usePage<DashboardProps>().props
    const [espData, setEspData] = useState<{ calibration: number, distance: number }>({ calibration: 21, distance: 21.0 })
    const { connected, lastMessage ,espConnected } = useWebSocket<SensorMessage | null>()
    const [dis, setDis] = useState<DataPoint[]>([{ value: 0, time: "now" }])
    const [temp, setTemp] = useState<DataPoint[]>([{ value: 0, time: "now" }])
    const [ph, setPh] = useState<DataPoint[]>([{ value: 0, time: "now" }])
    const [tds, setTds] = useState<DataPoint[]>([{ value: 0, time: "now" }])
    useEffect(() => {
        if (!lastMessage?.message) return

        setDis((prev) => {
            const updated = [...prev.slice(-10), { value: lastMessage.message.distance, time: 'now' }];
            const res = updated.map((item, index, arr) => ({
                ...item,
                time: index === arr.length - 1 ? 'now' : `${(arr.length - 1 - index) * 2}s ago`
            }));
            console.log(res);
            return res
        });

        setPh((prev) => {
            const updated = [...prev.slice(-10), { value: lastMessage.message.ph, time: 'now' }];
            return updated.map((item, index, arr) => ({
                ...item,
                time: index === arr.length - 1 ? 'now' : `${(arr.length - 1 - index) * 2}s ago`
            }));
        });

        setTds((prev) => {
            const updated = [...prev.slice(-10), { value: lastMessage.message.tds, time: 'now' }];
            return updated.map((item, index, arr) => ({
                ...item,
                time: index === arr.length - 1 ? 'now' : `${(arr.length - 1 - index) * 2}s ago`
            }));
        });

        setTemp((prev) => {
            const updated = [...prev.slice(-10), { value: lastMessage.message.temp, time: 'now' }];
            return updated.map((item, index, arr) => ({
                ...item,
                time: index === arr.length - 1 ? 'now' : `${(arr.length - 1 - index) * 2}s ago`
            }));
        });

        console.log(ph, )


    }, [lastMessage])
    return <>
        <section className="flex w-full space-x-5">

            <div className="bg-sky-50 flex flex-col flex-1 rounded-4xl p-5 space-y-5 ">
                <div className="rounded-3xl w-full  flex flex-col">
                    <div className="h-26 space-y-3">
                        <p className="text-neutral-600">Esp32 IP</p>
                        <h3 className="text-5xl font-semibold">
                            {espIp ? espIp :
                                "Out of Network"}
                        </h3>
                    </div>
                    <div className="flex w-full space-x-5">
                        <Bubble name="Esp32" status={espConnected ? "Connected" :"Disconnected"} Icon={<WebsocketIcon className="w-full h-full" />} />
                        <Bubble name="Websocket" status={connected ? "Connected" : "Disconnected"} Icon={<WebsocketIcon className="w-full h-full" />} />

                    </div>

                </div>
                <div className="font-semibold mt-5">Current Configuration</div>
                <div className="grid grid-cols-6 gap-3">

                    <div className="bg-[#b3cdfe] flex justify-end flex-col col-span-3 space-y-1 rounded-3xl w-full  p-5">
                        <h3 className="text-6xl font-semibold">{espData.distance}<span className="text-2xl">cm</span></h3>
                        <div>

                            <p className="text-zinc-500 text-xs">
                                Distance of
                            </p>
                            <span className="text-zinc-600 text-sm">
                                Base To Ultrasonic Sensor
                            </span>
                        </div>
                    </div>
                    <div className="bg-[#cce5e4] flex  flex-col col-span-2  space-y-1 rounded-3xl w-full  p-5">
                        <p className="text-zinc-500 text-xs">
                            With
                        </p>
                        <div className="flex-1 flex flex-col justify-center">
                            <h3 className="text-5xl font-semibold">{espData.calibration}</h3>

                        </div>
                        <div>
                            <span className="text-zinc-600 text-xs">
                                PH Calibration
                            </span>
                        </div>
                    </div>
                    <Esp32Config espdata={espData} setEspData={setEspData} />
                </div>
            </div>
            <SecondItem />
            <div className="bg-[#cce5e4]  rounded-4xl w-1/3 p-5 flex flex-col justify-between">
                <div>

                    <h3 className="text-lg">Realtime Data</h3>
                    <p className="text-sm text-neutral-600">
                        Sensors data that sending immediately by ESP32
                    </p>
                </div>
                <ul>
                    <List valueBefore={(() => ph.at(-2)?.value || 0)()} name="PH" value={(() => ph.at(-1)?.value || 0)()} unit="pH" />
                    <List valueBefore={(() => dis.at(-2)?.value || 0)()} name="Deep" value={(() => dis.at(-1)?.value || 0)()} unit="cm" />
                    <List valueBefore={(() => tds.at(-2)?.value || 0)()} name="Dissolved Solid" value={(() => tds.at(-1)?.value || 0)()} unit="ppm" />
                    <List valueBefore={(() => temp.at(-2)?.value || 0)()} name="Temperature" value={(() => temp.at(-1)?.value || 0)()} unit="c" />
                </ul>
                <div className="flex justify-end px-2">
                    <Link href={"/history"} className="text-sm text-neutral-600 underline cursor-pointer">
                        See full history
                    </Link>
                </div>
            </div>
        </section>
        <ChartSection
            data={ph}
            title="pH"
            desc="In catfish farming, maintaining the correct pH level is essential for fish health and growth. The ideal pH range for catfish is typically between 6.5 and 8.5. Water that is too acidic or too alkaline can cause stress, reduce immunity, and lead to poor feeding behavior. Real-time pH monitoring helps ensure that water conditions remain optimal for fish survival and productivity."
        />

        <ChartSection
            data={tds}
            title="TDS"
            desc="TDS (Total Dissolved Solids) represents the concentration of dissolved substances like minerals, salts, and organic matter in the pond. High TDS levels can indicate poor water quality, which may harm catfish by affecting their gills and metabolism. Monitoring TDS helps farmers manage water changes and feeding practices to maintain a healthy aquatic environment."
            reverse={true}
        />

        <ChartSection
            data={dis}
            title="Distance"
            desc="Distance sensors in catfish ponds are commonly used to measure water level or detect the presence of objects near feeders or drains. Monitoring water level helps prevent overflows and ensures consistent pond depth, which is important for fish comfort and effective oxygen distribution throughout the pond."
        />

        <ChartSection
            data={temp}
            title="Temperature"
            desc="Water temperature directly affects catfish metabolism, feeding behavior, and growth rate. If the water is too cold or too warm, it can stress the fish and make them more susceptible to disease. By monitoring temperature in real-time, farmers can take actions such as shading, aeration, or adjusting feeding times to create a stable and healthy environment."
            reverse={true}
        />
    </>
}


const Esp32Config = ({ espdata, setEspData }: { espdata: { calibration: number, distance: number }, setEspData: Dispatch<SetStateAction<{ calibration: number; distance: number; }>> }) => {
    const [data, setData] = useState<{ calibration: number; distance: number, password: string }>({
        calibration: espdata.calibration,
        distance: espdata.distance,
        password: ""
    });
    const [loading, setLoading] = useState<boolean>(false)

    const submit = async () => {
        setLoading(true)
        const result = await fetch("/esp", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "content-type": "application/json"
            }
        });
        if (result.ok) {
            setEspData({ calibration: data.calibration, distance: data.distance })
            toast("Configuration Changed")
        } else {

            const json = await result.json()
            toast.error(json.message)
        }
        setLoading(false)
    }

    return (
        <Dialog>
            <DropdownMenu>
                <DropdownMenuTrigger className="bg-zinc-900 col-span-1 cursor-pointer flex items-center justify-center space-y-1 rounded-3xl w-full p-5">
                    <More className="w-full text-white" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DialogTrigger asChild>
                        <DropdownMenuItem className="cursor-pointer border-0 w-full">
                            Settings
                        </DropdownMenuItem>
                    </DialogTrigger>
                </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>ESP32 Configuration</DialogTitle>
                    <DialogDescription>
                        Set configuration of ESP32 for reading sensor data.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-center gap-2">
                    <div className="grid flex-1 gap-2">
                        <label htmlFor="calibration">Calibration</label>
                        <input
                            type="number"
                            id="calibration"
                            value={data.calibration}
                            onChange={(e) =>
                                setData({ ...data, calibration: parseFloat(e.target.value) })
                            }
                            className="border border-slate-200 rounded-md p-1"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="grid flex-1 gap-2">
                        <label htmlFor="distance">
                            Base to Ultrasonic Sensor Distance
                        </label>
                        <input
                            type="number"
                            id="distance"
                            value={data.distance}
                            onChange={(e) =>
                                setData({ ...data, distance: parseFloat(e.target.value) })
                            }
                            className="border border-slate-200 rounded-md p-1"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="grid flex-1 gap-2">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="border border-slate-200 rounded-md p-1"
                            value={data.password}
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="grid flex-1 gap-2">
                        <button
                            disabled={loading}
                            className="w-full rounded-md bg-zinc-800 text-white p-1 cursor-pointer"
                            onClick={async () => await submit()}
                            type="button"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};




const SecondItem = () => {
    const { botUsername } = usePage<DashboardProps>().props
    const [currentHost, setCurrentHost] = useState<string | null>(null)

    useEffect(() => {
        fetch("/telegram/bot/webhook")
            .then(r => r.json())
            .then(rs => {
                setCurrentHost(rs.host || null);
                console.log(rs);
            })
            .catch(console.error);
    }, []);
    const actualDomain = window.location.origin

    const handleSync = () => {
        const data = { url: actualDomain };
        fetch("/telegram/bot/webhook", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then(res => {
                console.log(res)
                return res.json()
            })
            .then(rs => {
                console.log(rs)
                if (rs.host) {
                    setCurrentHost(actualDomain);
                }
            })
            .catch(console.error);
    };



    return <div className="space-y-5 flex flex-col w-1/4">
        <div className="w-full bg-linear-to-b from-[#b3cdfe] to-[#b3cdfe]/50  flex flex-col rounded-4xl p-5 flex-1 ">
            <div>
                <p className="text-neutral-600">
                    Telegram Endpoint
                </p>
            </div>
            <div className="flex flex-col flex-1 justify-center space-y-5">
                <div>
                    <h3 className="text-2xl font-semibold">Current Host</h3>
                    <p>{currentHost || "Not Set"}</p>
                </div>
                <div>
                    <h3 className="text-2xl font-semibold ">Actual Host</h3>
                    <p className="text-neutral-600">{actualDomain}</p>
                </div>
            </div>
            <div className="flex w-full justify-end items-end">
                <button disabled={currentHost == actualDomain} className="p-2 bg-white rounded-3xl space-x-2 cursor-pointer flex items-center justify-center px-3"
                    onClick={handleSync}
                >
                    <RefreshCcw className="w-3 h-3" />
                    <span className="text-sm">
                        {currentHost == actualDomain ? "Synced" : "Sync"}
                    </span>
                </button>
            </div>
        </div>
        <div className="w-full bg-[#cce5e4] rounded-4xl  flex flex-col justify-between  h-1/3 p-5">
            <h3 className="text-xl">Telegram Bot</h3>
            <p>@{botUsername}</p>
            <div className="flex w-full justify-end">
                <a href={`https://t.me/${botUsername}`} className=" p-2 px-4 bg-[#b3cdfe] rounded-3xl" target="_blank" >Chat</a>
            </div>
        </div>
    </div>

}
