type ListProps = {
    name: string,
    value: number,
    unit:string
}

export const List: React.FC<ListProps> = ({ name,value,unit}) => {


    return <li className="p-3 grid grid-cols-6 gap-3  border-b border-green-700/20">
        <div className="bg-white rounded-full"></div>
        <div className="col-span-3 ">
            <h2>{name}</h2>
            <p className="text-xs text-neutral-600">{value} {unit}</p>
        </div>
        <div className="bg-white col-span-2"></div>
    </li>
}