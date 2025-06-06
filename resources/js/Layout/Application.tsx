import { WebSocketProvider } from "@/context/websocket"
import { Slave } from "@/hooks/slave"
import { Head, Link } from "@inertiajs/react"
import type { PropsWithChildren } from "react"


export const Application: React.FC<PropsWithChildren> = ({ children }) => {

    return <>
        <Head title="RealTime Water Monitor"></Head>
        <div className="h-dvh bg-linear-to-br/hsl  from-[#cedffd] to-[#d6e7e9]/60 overflow-scroll relative px-10 py-2">
            <nav className="w-full flex p-2  justify-between items-center h-24">
                <div className="font-semibold text-sm">Monitoring Kolam Ikan Lele</div>
                <div className="flex space-x-5">
                    <Link href={"/dashboard"} className="text-sm text-neutral-600 cursor-pointer hover:underline">Dashboard</Link>
                    <Link href={"/history"} className="text-sm text-neutral-600 cursor-pointer hover:underline">History</Link>
                </div>
            </nav>
            <main className="space-y-5">
                    {children}
            </main>

        </div>
        <Slave />
    </>
}