import { type PropsWithChildren } from "react"



export const Card: React.FC<PropsWithChildren> = ({ children }) => {
    return <div className="flex-1">
        {children}
    </div>
}