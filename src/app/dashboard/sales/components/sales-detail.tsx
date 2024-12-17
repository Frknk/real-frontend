"use client"

import { getSale } from "@/commons/sales"
import { useQuery } from "@tanstack/react-query";
import { Container, Heading, Text, Copy, TooltipProvider, Badge, Table } from "@medusajs/ui";
import { Spinner } from "@medusajs/icons";


export function SalesDetail({ id }) {
    const saleQuery = useQuery({ queryKey: ['sale', id], queryFn: () => getSale(id) });
    const sale = saleQuery.data;

    if (saleQuery.isLoading) return (<div className="flex min-h-screen items-center justify-center">
        <Spinner className="text-ui-fg-interactive animate-spin" />
    </div>);
    if (saleQuery.isError) return <div>Error loading sale details</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1 row-span-1">
                <Container className="p-0 h-full ">
                    <div className="py-2 md:py-8">
                        <div className="flex items-center space-x-2 px-6 py-4">
                            <Heading level="h2">Sale #{sale.id}</Heading>
                            <TooltipProvider><Copy content={sale.id} /></TooltipProvider>
                            <Badge color="green" size="small">Successful</Badge>
                        </div>
                        <div className="flex px-6 pb-6 justify-between">
                            <Text>Created at: {new Date(sale.created_at).toLocaleString()}</Text>
                        </div>
                    </div>
                </Container>
            </div>
            <div className="col-span-1 row-span-1">
                <Container className="p-0 divide-y">
                    <div className="flex items-center space-x-2 px-6 py-4">
                        <Heading level="h2">Customer</Heading>
                    </div>
                    <div className="flex justify-between px-6 py-2">
                        <Text weight="plus">Name:</Text><Text> {sale.customer.name} {sale.customer.last_name}</Text>
                    </div>
                    <div className="flex justify-between px-6 py-2">
                        <Text weight="plus">Email:</Text>
                        <div className="flex flex-row items-center space-x-2"><Text> {sale.customer.email}</Text><TooltipProvider><Copy content={sale.customer.email} /></TooltipProvider></div>
                    </div>
                    <div className="flex justify-between px-6 py-2">
                        <Text weight="plus">DNI:</Text>
                        <div className="flex flex-row items-center space-x-2"><Text> {sale.customer.dni}</Text><TooltipProvider><Copy content={sale.customer.dni} /></TooltipProvider></div>
                    </div>

                </Container>
            </div>
            <div className="col-span-1 md:col-span-2 row-span-1">
                <Container className="p-0">
                    <div className="flex items-center space-x-2 px-6 py-4">
                        <Heading level="h2">Summary</Heading>
                    </div>
                    <div className="px-6">
                        <div className="overflow-x-auto">
                            <Table>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell><strong>#</strong></Table.HeaderCell>
                                        <Table.HeaderCell><strong>Product</strong></Table.HeaderCell>
                                        <Table.HeaderCell><strong>Quantity</strong></Table.HeaderCell>
                                        <Table.HeaderCell className="text-right"><strong>Amount</strong></Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {sale.products.map((product, index) => (
                                        <Table.Row key={index}>
                                            <Table.Cell>{index + 1}</Table.Cell>
                                            <Table.Cell>{product.name}</Table.Cell>
                                            <Table.Cell>{product.quantity}</Table.Cell>
                                            <Table.Cell className="text-right"> PEN {product.price}</Table.Cell>
                                        </Table.Row>
                                    ))}
                                    <Table.Row>
                                        <Table.Cell colSpan={2}></Table.Cell>
                                        <Table.Cell><strong>Total</strong></Table.Cell>
                                        <Table.Cell className="text-right">PEN {sale.total}</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            </Table>
                        </div>
                    </div>
                </Container>
            </div>
        </div>
    )
}