'use client'

import { Product, Category, Provider, Brand } from "@/commons/types";
import * as React from "react"
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
import { ArrowUpDown, EllipsisHorizontal, ChevronDown, Spinner, PencilSquare, Plus, Trash } from "@medusajs/icons"
import { Button, Input, Table, DropdownMenu, Container, Heading, usePrompt, toast } from "@medusajs/ui"
import { ProductCreateModal } from "../create-product-modal/create-product-modal";
import { ProductEditModal } from "../create-product-modal/edit-product-modal";
import { useQuery } from '@tanstack/react-query';
import { getProducts, deleteProduct } from "@/commons/products";
import Link from "next/link";

const handleDeleteProduct = async (id: number) => {
    const dialog = usePrompt();
    const userHasConfirmed = await dialog({
        title: "Please confirm",
        description: "Are you sure you want to do this?",
    });
    if (userHasConfirmed) {
        // Perform Delete
        try {
            await deleteProduct(id);
            toast.success("Product deleted successfully");
        } catch (error) {
            toast.error("An error occurred while deleting the product");
        }
    } else {
        toast.info("Operation canceled");
    }
};

const columns: ColumnDef<Product>[] = [

    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => <div>{(row.getValue("category") as Category)?.name ?? 'No Category'}</div>,
    },
    {
        accessorKey: "provider",
        header: "Provider",
        cell: ({ row }) => <div>{(row.getValue("provider") as Provider)?.name ?? 'No Provider'}</div>,
    },
    {
        accessorKey: "brand",
        header: "Brand",
        cell: ({ row }) => <div>{(row.getValue("brand") as Brand)?.name ?? 'No Brand'}</div>,
    },
    {
        accessorKey: "stock",
        header: "Stock",
        cell: ({ row }) => <div>{row.getValue("stock")}</div>,
    },
    {
        accessorKey: "price",
        header: () => <div className="text-right">Price</div>,
        cell: ({ row }) => {
            const price = parseFloat(row.getValue("price"));
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "PEN",
            }).format(price);
            return <div className="text-right font-medium">{formatted}</div>;
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const [modalOpen, setModalOpen] = React.useState(false)
            const product = row.original
            const id = product.id

            return (
                <div className="flex justify-end">
                    <ProductEditModal id={id} open={modalOpen}
                        onOpenChange={setModalOpen} />
                    <DropdownMenu>
                        <DropdownMenu.Trigger asChild>
                            <Button variant="transparent" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <EllipsisHorizontal />
                            </Button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content>
                            <DropdownMenu.Item onClick={() => setModalOpen(true)} className="gap-x-2">
                                <PencilSquare className="text-ui-fg-subtle" />
                                Edit
                            </DropdownMenu.Item>
                            <DropdownMenu.Separator />
                            <DropdownMenu.Item onClick={() => handleDeleteProduct(product.id)} className="gap-x-2">
                                <Trash className="text-ui-fg-subtle" />
                                Delete
                            </DropdownMenu.Item>
                        </DropdownMenu.Content>
                    </DropdownMenu>
                </div>
            )
        },
    },
];


export function ProductListTable() {
    const { data, isLoading, isError } = useQuery({ queryKey: ['products'], queryFn: getProducts, refetchInterval: 1000, refetchOnWindowFocus: true })
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
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
                <Heading level="h2">Products</Heading>
                <div className="flex items-center justify-center gap-x-2">
                    < ProductCreateModal />
                </div>
            </div>
            <div className="flex items-center px-3 py-4">
                <Input
                    placeholder="Filter products..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    type="search"
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenu.Trigger asChild>
                        <Button variant="transparent" className="ml-auto">
                            Columns <ChevronDown />
                        </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenu.CheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenu.CheckboxItem>
                                )
                            })}
                    </DropdownMenu.Content>
                </DropdownMenu>
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