import { Link, usePage } from "@inertiajs/react"
import { List } from "./list"
import { WebsocketIcon } from "./icon/websocket"
import { Bubble } from "./bubble"
import { More } from "./icon/more"
import { RefreshCcw } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"


export const OverviewSection = () => {

    return <section className="flex w-full space-x-5">

        <div className="bg-sky-50 flex flex-col flex-1 rounded-4xl p-5 space-y-5 ">
            <div className="rounded-3xl w-full  flex flex-col">
                <div className="h-26 space-y-3">
                    <p className="text-neutral-600">Esp32 IP</p>
                    <h3 className="text-5xl font-semibold">
                        {true ? "192.168.xx.xx" :
                            "Out of Network"}
                    </h3>
                </div>
                <div className="flex w-full space-x-5">
                    <Bubble name="Esp32" status="Disconnected" Icon={<WebsocketIcon className="w-full h-full" />} />
                    <Bubble name="Websocket" status="Connected" Icon={<WebsocketIcon className="w-full h-full" />} />

                </div>

            </div>
            <div className="font-semibold mt-5">Current Configuration</div>
            <div className="grid grid-cols-6 gap-3">

                <div className="bg-[#b3cdfe] flex justify-end flex-col col-span-3 space-y-1 rounded-3xl w-full  p-5">
                    <h3 className="text-6xl font-semibold">21<span className="text-2xl">cm</span></h3>
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
                        <h3 className="text-5xl font-semibold">21.0</h3>

                    </div>
                    <div>
                        <span className="text-zinc-600 text-xs">
                            PH Calibration
                        </span>
                    </div>
                </div>
                <Esp32Config />
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
                <List name="PH" value={7} unit="" />
                <List name="Deep" value={7} unit="" />
                <List name="Dissolved Solid" value={7} unit="" />
                <List name="Temperature" value={7} unit="" />

            </ul>
            <div className="flex justify-end px-2">
                <Link href={"/history"} className="text-sm text-neutral-600 underline cursor-pointer">
                    See full history
                </Link>
            </div>
        </div>
    </section>
}


const Esp32Config = () => {


    return <Dialog >

        <DropdownMenu>
            <DropdownMenuTrigger className="bg-zinc-900 col-span-1 cursor-pointer flex items-center justify-center space-y-1 rounded-3xl w-full  p-5">
                <More className="w-full text-white" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DialogTrigger>

                    <DropdownMenuItem className="cursor-pointer border-0 w-full"> Settings</DropdownMenuItem>
                </DialogTrigger>
            </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                </DialogDescription>
            </DialogHeader>
        </DialogContent>
    </Dialog>

}

const SecondItem = () => {
    const { botUsername } = usePage<DashboardProps>().props
    const { protocol, host } = window.location

    const actualDomain = `${protocol}//${host}`;
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
                    <p>https://example.com</p>
                </div>
                <div>
                    <h3 className="text-2xl font-semibold ">Actual Host</h3>
                    <p className="text-neutral-600">{actualDomain}</p>
                </div>
            </div>
            <div className="flex w-full justify-end items-end">
                <button className="p-2 bg-white rounded-3xl space-x-2 cursor-pointer flex items-center justify-center px-3">
                    <RefreshCcw className="w-3 h-3" />
                    <span className="text-sm">
                        Sync
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
