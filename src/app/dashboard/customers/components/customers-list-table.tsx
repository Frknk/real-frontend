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


import { Customer } from "@/commons/types"
import { useQuery } from "@tanstack/react-query"
import { Spinner } from "@medusajs/icons"
import { Container, Heading, Input, Table, Button } from "@medusajs/ui"
import { useRouter } from "next/navigation"
import { useState } from "react"
import React from "react"
import {CreateCustomerModal} from "./customer-create-modal"
import { getCustomers } from "@/commons/customers"

const columns: ColumnDef<Customer>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => <div>{row.getValue("id")}</div>,
        filterFn: (row, columnId, filterValue) => {
            return String(row.getValue(columnId)).includes(filterValue);
        },
    },
    {
        accessorKey: 'dni',
        header: 'DNI',
        cell: ({ row }) => <div>{row.getValue("dni")}</div>,
        filterFn: (row, columnId, filterValue) => {
            const value = String(row.getValue(columnId));
            return value.startsWith(filterValue) || value.includes(filterValue);
        },
    },
    {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
        accessorKey: 'last_name',
        header: 'Last Name',
        cell: ({ row }) => <div>{row.getValue("last_name")}</div>,
    },
    {
        accessorKey: 'email',
        header: () => <div className="text-right">Email</div>,
        cell: ({ row }) => <div className="text-right">{row.getValue("email")}</div>,
    },
]

export function CustomersListTable() {
    const { data, isLoading, isError } = useQuery({ queryKey: ['customers'], queryFn: getCustomers, refetchInterval: 10000, refetchOnWindowFocus: true })
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const router = useRouter()
    const [sorting, setSorting] = useState<SortingState>([]) // Remove default sorting
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
                <Heading level="h2">Customers</Heading>
                <div className="flex items-center justify-center gap-x-2">
                <CreateCustomerModal />
                </div>
            </div>
            <div className="flex items-center px-3 py-4 justify-between">
                <Input
                    placeholder="Filter by DNI" // Change placeholder to DNI
                    value={(table.getColumn("dni")?.getFilterValue() as string) ?? ""} // Change filter column to DNI
                    onChange={(event) => {
                        const value = event.target.value;
                        table.getColumn("dni")?.setFilterValue(value === "" ? undefined : value); // Change filter column to DNI
                    }}
                    type="search"
                    className="max-w-sm"
                />
                {/* Remove sort button */}
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
                                        data-state={row.getIsSelected() && "selected"}
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