import { Droplet, Minus, TrendingDown, TrendingUp } from "lucide-react"

type ListProps = {
    name: string,
    value: number,
    unit: string,
    valueBefore: number
}

export const List: React.FC<ListProps> = ({ name, value, unit, valueBefore }) => {


    return <li className="p-3 grid grid-cols-6 gap-1  border-b border-green-700/20">
        <div className="w-full flex jusitfy-end items-center">

            <Droplet />
        </div>
        <div className="col-span-3 ">
            <h2>{name}</h2>
            <p className="text-xs text-neutral-600">{value} {unit}</p>
        </div>

        <div className="bg-transparent col-span-2 flex items-center justify-end">
            {value == valueBefore ? <Minus /> : (value > valueBefore ? <TrendingUp /> : <TrendingDown />)}
            <span>{(value - valueBefore) >= 0 ? '+' : ''}{(value - valueBefore).toFixed(2)}</span>
        </div>
    </li>
}