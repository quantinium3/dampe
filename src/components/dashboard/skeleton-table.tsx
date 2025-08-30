import { Button } from "../ui/button"
import { Skeleton } from "../ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"

interface LoadingDataTableProps {
    rowCount?: number
    columnCount?: number
    columnHeaders?: string[]
    showFilter?: boolean
    showColumnsDropdown?: boolean
    showPagination?: boolean
}

export function LoadingDataTable({
    rowCount = 5,
    columnCount = 4,
    columnHeaders,
    showFilter = true,
    showColumnsDropdown = true,
    showPagination = true
}: LoadingDataTableProps) {
    const headers = columnHeaders || Array.from(
        { length: columnCount },
        (_, i) => `Column ${i + 1}`
    )

    return (
        <div className="w-full">
            {(showFilter || showColumnsDropdown) && (
                <div className="flex items-center py-4">
                    {showFilter && (
                        <div className="max-w-sm">
                            <Skeleton className="h-10 w-64" />
                        </div>
                    )}
                    {showColumnsDropdown && (
                        <div className="ml-auto">
                            <Skeleton className="h-10 w-20" />
                        </div>
                    )}
                </div>
            )}
            
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {headers.map((_header, index) => (
                                <TableHead key={index}>
                                    <Skeleton className="h-4 w-20" />
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: rowCount }).map((_, rowIndex) => (
                            <TableRow key={rowIndex}>
                                {Array.from({ length: columnCount }).map((_, colIndex) => (
                                    <TableCell key={colIndex}>
                                        <Skeleton className="h-4 w-full" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            
            {showPagination && (
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button variant="outline" size="sm" disabled>
                        Previous
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                        Next
                    </Button>
                </div>
            )}
        </div>
    )
}
