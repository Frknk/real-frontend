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

import { getProviders } from "@/commons/providers"

import { Provider } from "@/commons/types"
import { useQuery } from "@tanstack/react-query"
import { Spinner } from "@medusajs/icons"
import { Container, Heading, Input, Table, Button } from "@medusajs/ui"
import { useState } from "react"
import {ProviderCreateModal} from './provider-create-modal'
import React from "react"

const columns: ColumnDef<Provider>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => <div>{row.getValue("id")}</div>,
        filterFn: (row, columnId, filterValue) => {
            return String(row.getValue(columnId)).includes(filterValue);
        },
    },
    {
        accessorKey: 'ruc',
        header: 'RUC',
        cell: ({ row }) => <div>{row.getValue("ruc")}</div>,
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
        accessorKey: 'address',
        header: 'Address',
        cell: ({ row }) => <div>{row.getValue("address")}</div>,
    },
    {
        accessorKey: 'phone',
        header: 'Phone',
        cell: ({ row }) => <div>{row.getValue("phone")}</div>,
    },
    {
        accessorKey: 'email',
        header: () => <div className="text-right">Email</div>,
        cell: ({ row }) => <div className="text-right">{row.getValue("email")}</div>,
    },
]

export function ProvidersListTable() {
    const { data, isLoading, isError } = useQuery({ queryKey: ['providers'], queryFn: getProviders, refetchInterval: 10000, refetchOnWindowFocus: true })
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
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
                <Heading level="h2">Providers</Heading>
                <ProviderCreateModal />
            </div>
            <div className="flex items-center px-3 py-4 justify-between">
                <Input
                    placeholder="Filter by RUC"
                    value={(table.getColumn("ruc")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => {
                        const value = event.target.value;
                        table.getColumn("ruc")?.setFilterValue(value === "" ? undefined : value);
                    }}
                    type="search"
                    className="max-w-sm"
                />
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