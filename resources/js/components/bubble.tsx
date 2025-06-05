import type { JSX } from "react"
import type React from "react"

interface BubbleProps {
    className?: string,
    name: string,
    status: "Connected" | "Disconnected",
    Icon:JSX.Element
}

export const Bubble: React.FC<BubbleProps> = ({className,name,status,Icon}) => {
    return <div className={`${className} space-x-3 rounded-4xl bg-white items-center w-56 px-1 p-1 h-16 shadow-xs flex`}>
        <div className="bg-[#d7e6f5] w-14 h-14 rounded-4xl flex items-center justify-center p-3">
           {Icon}
        </div>
        <div className="text-sm  -space-y-1">
            <div className="font-semibold">{name}</div>
            <div className={`${status == "Connected" ? "text-[#49cdbf]" :"text-[#B75D67]"} text-xs`}>{status}</div>
        </div>
    </div>
}