"use client"
import { Container, Heading } from "@medusajs/ui"
import { Table } from "@medusajs/ui"
import { useMemo, useState } from "react"
import { DataTableDemo } from "./product-list-table"
import { ProductCreateModal} from "./create-product-modal/create-product-modal"


type Product = {
    id: number
    name: string
    price: number
    brand: string
    category: string
    provider: string
}


export default function TableDemo() {

    const fakeData: Product[] = useMemo(
        () => [
            {
                id: 1,
                name: "Product 1",
                price: 100,
                brand: "Brand 1",
                category: "Category 1",
                provider: "Provider 1",
            },
            {
                id: 2,
                name: "Product 2",
                price: 200,
                brand: "Brand 2",
                category: "Category 2",
                provider: "Provider 2",
            },
            {
                id: 3,
                name: "Product 3",
                price: 300,
                brand: "Brand 3",
                category: "Category 3",
                provider: "Provider 3",
            },
            {
                id: 4,
                name: "Product 4",
                price: 400,
                brand: "Brand 4",
                category: "Category 4",
                provider: "Provider 4",
            },
            {
                id: 5,
                name: "Product 5",
                price: 500,
                brand: "Brand 5",
                category: "Category 5",
                provider: "Provider 5",
            },
            {
                id: 6,
                name: "Product 6",
                price: 600,
                brand: "Brand 6",
                category: "Category 6",
                provider: "Provider 6",
            },
            {
                id: 7,
                name: "Product 7",
                price: 700,
                brand: "Brand 7",
                category: "Category 7",
                provider: "Provider 7",
            },
            {
                id: 8,
                name: "Product 8",
                price: 800,
                brand: "Brand 8",
                category: "Category 8",
                provider: "Provider 8",
            },
            {
                id: 9,
                name: "Product 9",
                price: 900,
                brand: "Brand 9",
                category: "Category 9",
                provider: "Provider 9",
            },
            {
                id: 10,
                name: "Product 10",
                price: 1000,
                brand: "Brand 10",
                category: "Category 10",
                provider: "Provider 10",
            },
        ],
        []
    )

    const [currentPage, setCurrentPage] = useState(0)
    const pageSize = 3
    const pageCount = Math.ceil(fakeData.length / pageSize)
    const canNextPage = useMemo(
        () => currentPage < pageCount - 1,
        [currentPage, pageCount]

    )

    const canPreviousPage = useMemo(() => currentPage - 1 >= 0, [currentPage])

    const nextPage = () => {
        if (canNextPage) {
            setCurrentPage(currentPage + 1)
        }
    }


    const previousPage = () => {
        if (canPreviousPage) {
            setCurrentPage(currentPage - 1)
        }
    }

    const currentOrders = useMemo(() => {
        const offset = currentPage * pageSize
        const limit = Math.min(offset + pageSize, fakeData.length)
        return fakeData.slice(offset, limit)
    }, [currentPage, pageSize, fakeData])


    return (
        <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h2">Products</Heading>
          <div className="flex items-center justify-center gap-x-2">
            < ProductCreateModal />
          </div>
        </div>
            <div className="overflow-x-auto">
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>#</Table.HeaderCell>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Category</Table.HeaderCell>
                            <Table.HeaderCell>Brand</Table.HeaderCell>
                            <Table.HeaderCell>Provider</Table.HeaderCell>
                            <Table.HeaderCell className="text-right">Price</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {currentOrders.map((product) => {
                            return (
                                <Table.Row
                                    key={product.id}
                                    className="[&_td:last-child]:w-[1%] [&_td:last-child]:whitespace-nowrap"
                                >
                                    <Table.Cell>{product.id}</Table.Cell>
                                    <Table.Cell>{product.name}</Table.Cell>
                                    <Table.Cell>{product.category}</Table.Cell>
                                    <Table.Cell>{product.brand}</Table.Cell>
                                    <Table.Cell>{product.provider}</Table.Cell>
                                    <Table.Cell className="text-right">
                                        S/{product.price}
                                    </Table.Cell>
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table>
            </div>
            <Table.Pagination
                count={fakeData.length}
                pageSize={pageSize}
                pageIndex={currentPage}
                pageCount={fakeData.length}
                canPreviousPage={canPreviousPage}
                canNextPage={canNextPage}
                previousPage={previousPage}
                nextPage={nextPage}
            />
            <DataTableDemo />
        </Container>
    )
}