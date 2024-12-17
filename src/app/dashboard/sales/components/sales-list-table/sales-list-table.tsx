'use client'
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { getSales } from "@/commons/sales"
import { Sale } from "@/commons/types"
import { useQuery } from "@tanstack/react-query"
import { Spinner, ArrowUpDown } from "@medusajs/icons"
import { Container, Heading, Input, Table, Button } from "@medusajs/ui"
import { useRouter } from "next/navigation"
import { format } from 'date-fns'
import { useState } from "react"
import {SaleCreateModal} from "../sale-create-modal"
import React from "react"

const columns: ColumnDef<Sale>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => <div>{row.getValue("id")}</div>,
        filterFn: (row, columnId, filterValue) => {
            return String(row.getValue(columnId)).includes(filterValue);
        },
    },
    {
        accessorKey: 'customer_dni',
        header: 'DNI',
        cell: ({ row }) => <div>{row.getValue("customer_dni")}</div>,
    },
    {
        accessorKey: 'total',
        header: 'Total',
        cell: ({ row }) => <div> PEN {row.getValue("total")}</div>,
    },
    {
        accessorKey: 'created_at',
        header: () => <div className="text-right">Date</div>,
        cell: ({ row }) => <div className=" text-right">{format(new Date(row.getValue("created_at")), 'yyyy-MM-dd HH:mm:ss')}</div>,
        enableSorting: true, // Enable sorting for the date column
    },
]

export function SalesListTable() {
    const { data, isLoading, isError } = useQuery({ queryKey: ['sales'], queryFn: getSales, refetchInterval: 10000, refetchOnWindowFocus: true })
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const router = useRouter()
    const [sorting, setSorting] = useState<SortingState>([{ id: 'created_at', desc: true }])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(), // Ensure this is included
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnFilters, // Ensure this is included
            columnVisibility,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters, // Ensure this is included
    })

    if (isLoading) return (
        <div className="flex min-h-screen items-center justify-center">
            <Spinner className="text-ui-fg-interactive animate-spin" />
        </div>
    );
    if (isError) return <div>Error</div>;

    return (
        <Container className="divide-y p-0">
            <div className="flex items-center justify-between px-6 py-4">
                <Heading level="h2">Sales</Heading>
                <div className="flex items-center justify-center gap-x-2">
                <SaleCreateModal />
                </div>
            </div>
            <div className="flex items-center px-3 py-4 justify-between">
                <Input
                    placeholder="Filter by ID"
                    value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => {
                        const value = event.target.value;
                        table.getColumn("id")?.setFilterValue(value === "" ? undefined : value);
                    }}
                    type="search"
                    className="max-w-sm"
                />
                <Button
                    variant="transparent"
                    onClick={() => {
                        const isDesc = sorting[0]?.desc ?? true
                        setSorting([{ id: 'created_at', desc: !isDesc }])
                    }}

                >
                    Sort by Date <ArrowUpDown />
                </Button>
            </div>
            <div className="rounded-md border">
                <div className="overflow-x-auto">
                    <Table>
                        <Table.Header>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <Table.Row key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <Table.HeaderCell key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </Table.HeaderCell>
                                        )
                                    })}
                                </Table.Row>
                            ))}
                        </Table.Header>
                        <Table.Body>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <Table.Row
                                        key={row.id}
                                        onClick={() => router.push(`/dashboard/sales/${row.original.id}`)}
                                        data-state={row.getIsSelected() && "selected"}
                                        className="cursor-pointer"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <Table.Cell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </Table.Cell>
                                        ))}
                                    </Table.Row>
                                ))
                            ) : (
                                <Table.Row>
                                    <td
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </td>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>

                </div>
            </div>
            <div className="flex items-center justify-end px-3 py-4 text-ui-fg-subtle">
                <div className="space-x-2">
                    <Button
                        variant="transparent"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="transparent"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </Container>
    )
}