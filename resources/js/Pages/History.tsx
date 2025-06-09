import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Application } from "@/Layout/Application"
import { usePage, Link } from "@inertiajs/react"

const History = () => {
    const { data, pagination } = usePage<HistoryProps>().props
    const currentPage = pagination.page
    const lastPage = pagination.last_page
    const perPage = pagination.per_page


    const getPageNumbers = (current: number, last: number) => {
        const delta = 2
        const range = []
        for (let i = Math.max(1, current - delta); i <= Math.min(last, current + delta); i++) {
            range.push(i)
        }

        const pages = []

        if (range[0] > 1) {
            pages.push(1)
            if (range[0] > 2) pages.push('left-ellipsis')
        }

        pages.push(...range)

        if (range[range.length - 1] < last) {
            if (range[range.length - 1] < last - 1) pages.push('right-ellipsis')
            pages.push(last)
        }

        return pages
    }

    const pages = getPageNumbers(currentPage, lastPage)

    return (
        <Application>
            <div className="space-y-4 flex flex-col relative bg-sky-50 p-5  rounded-4xl">
                <h3 className="my-5 text-xl font-semibold">History</h3>
                <span className="text-zinc-600 text-sm">Sensors data that given by esp32 all time</span>

                <Table className="table-fixed w-full flex-1">
                    <TableHeader>
                        <TableRow className="capitalize">
                            <TableHead className="w-[50px]">No</TableHead>
                            <TableHead>pH</TableHead>
                            <TableHead>deep</TableHead>
                            <TableHead>tds</TableHead>
                            <TableHead>temp</TableHead>
                            <TableHead>date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length > 0 ? data.map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell>{(currentPage - 1) * perPage + index + 1}</TableCell>
                                <TableCell>{item.ph}</TableCell>
                                <TableCell>{item.deep}</TableCell>
                                <TableCell>{item.tds}</TableCell>
                                <TableCell>{item.temp}</TableCell>
                                <TableCell>{item.created_at}</TableCell>
                            </TableRow>
                        )) : <TableRow><TableCell colSpan={6} className="text-center">No Data Available</TableCell></TableRow>}
                    </TableBody>
                </Table>

                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            {currentPage > 1 ? (
                                <Link href={`?page=${currentPage - 1}`} preserveScroll>
                                    <PaginationPrevious />
                                </Link>
                            ) : (
                                <span className="pointer-events-none opacity-50">
                                    <PaginationPrevious />
                                </span>
                            )}
                        </PaginationItem>

                        {pages.map((page, idx) => {
                            if (page === 'left-ellipsis' || page === 'right-ellipsis') {
                                return (
                                    <PaginationItem key={page + idx}>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                )
                            } else {
                                return (
                                    <PaginationItem key={page}>
                                        <Link href={`?page=${page}`} preserveScroll>
                                            <PaginationLink isActive={page === currentPage} >{page}</PaginationLink>
                                        </Link>
                                    </PaginationItem>
                                )
                            }
                        })}

                        <PaginationItem>
                            {currentPage < lastPage ? (
                                <Link href={`?page=${currentPage + 1}`} preserveScroll>
                                    <PaginationNext />
                                </Link>
                            ) : (
                                <span className="pointer-events-none opacity-50">
                                    <PaginationNext />
                                </span>
                            )}
                        </PaginationItem>

                    </PaginationContent>
                </Pagination>
            </div>
        </Application>
    )
}

export default History
