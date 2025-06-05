export const More: React.FC<{ className?: string }> = ({className}) => {

    return <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-circle-ellipsis-icon lucide-circle-ellipsis ${className}`}><circle cx="12" cy="12" r="10" /><path d="M17 12h.01" /><path d="M12 12h.01" /><path d="M7 12h.01" /></svg>
}