"use client"

import { Button, FocusModal, Heading, Input, Text, Hint, Select, Textarea, CurrencyInput } from "@medusajs/ui"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/form";

import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { getCategories } from "@/commons/categories";
import { getBrands } from "@/commons/brands";
import { getProviders } from "@/commons/providers";
import { toast } from "@medusajs/ui";
import { updateProduct, getProduct } from "@/commons/products";
const ProductCreateSchema = z.object({
    name: z.string(),
    description: z.string(),
    stock: z.number().min(1, { message: "Stock must be greater than 0" }),
    price: z.number().min(1, { message: "Price must be greater than 0" }),
    category: z.string(),
    brand: z.string(),
    provider: z.string(),
})


export function ProductEditModal({ id, open, onOpenChange }) {


    const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: getCategories });
    const brandsQuery = useQuery({ queryKey: ['brands'], queryFn: getBrands });
    const providersQuery = useQuery({ queryKey: ['providers'], queryFn: getProviders });

    const productQuery = useQuery({ queryKey: ['product', id], queryFn: () => getProduct(id), enabled: open });
    const product = productQuery.data;
        // At this point, we know data is available
        const categories = categoriesQuery.data;
        const brands = brandsQuery.data;
        const providers = providersQuery.data;
    

    
    const form = useForm<z.infer<typeof ProductCreateSchema>>({
        resolver: zodResolver(ProductCreateSchema),
        defaultValues: {
            name: "",
            description: "",
            stock: 0,
            price: 0,
            category: "",
            brand: "",
            provider: "",
        },
    });

    React.useEffect(() => {
        if (product) {
            form.reset({
                name: product.name || "",
                description: product.description || "",
                stock: product.stock || 0,
                price: product.price || 0,
                category: product.category.name || "",
                brand: product.brand.name || "",
                provider: product.provider.name || "",
            });
        }
    }, [product]);

    const validationError = form.formState.errors.name?.message ||
        form.formState.errors.description?.message ||
        form.formState.errors.stock?.message ||
        form.formState.errors.price?.message ||
        form.formState.errors.category?.message ||
        form.formState.errors.brand?.message ||
        form.formState.errors.provider?.message;

    const handleSubmit = form.handleSubmit(async (data) => {
        try {
            await updateProduct(id, data);
            toast.success("Product updated successfully");
            form.reset();
        }
        catch (error) {
            console.log(error);
            toast.error("Failed to update product");
        }
    });

    return (
        <FocusModal
            open={open}
            onOpenChange={onOpenChange}>
            <FocusModal.Content>
                <VisuallyHidden.Root>
                    <FocusModal.Title>Edit Product</FocusModal.Title>
                </VisuallyHidden.Root>
                <FocusModal.Header />
                <FocusModal.Body className="flex flex-col items-center py-16 overflow-y-auto">
                    <div className="flex w-full max-w-lg flex-col gap-y-8 px-2">
                        <div className="flex flex-col gap-y-1">
                            <Heading>Edit Product</Heading>
                            <Text className="text-ui-fg-subtle">
                                Fill in the form to edit the product
                            </Text>
                        </div>
                        <div className="flex flex-col gap-y-2">
                            <Form {...form}>
                                <form onSubmit={handleSubmit} className="flex w-full flex-col gap-y-6">
                                    <div className="flex flex-row gap-x-6">
                                        <Form.Field
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <Form.Item className="w-full">
                                                    <Form.Label>Name</Form.Label>
                                                    <Form.Control>
                                                        <Input {...field} placeholder="Name" />
                                                    </Form.Control>
                                                </Form.Item>
                                            )}
                                        />
                                        <Form.Field
                                            control={form.control}
                                            name="price"
                                            render={({ field }) => (
                                                <Form.Item className=" w-52">
                                                    <Form.Label>Price</Form.Label>
                                                    <Form.Control>
                                                        <CurrencyInput symbol="PEN" code="S/." {...field} onChange={(e) => {
                                                            const value = parseFloat(e.target.value);
                                                            if (!isNaN(value)) {
                                                                field.onChange(value);
                                                            }
                                                        }} placeholder="Price" />
                                                    </Form.Control>
                                                </Form.Item>
                                            )}
                                        />
                                    </div>
                                    <Form.Field
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <Form.Item>
                                                <Form.Label>Description</Form.Label>
                                                <Form.Control>
                                                    <Textarea {...field} placeholder="Description" />
                                                </Form.Control>
                                            </Form.Item>
                                        )}
                                    />
                                    <div className="flex flex-row gap-x-6">
                                        <Form.Field
                                            control={form.control}
                                            name="stock"
                                            render={({ field }) => (
                                                <Form.Item className="w-full">
                                                    <Form.Label>Stock</Form.Label>
                                                    <Form.Control>
                                                        <Input {...field} type="number" onChange={(e) => field.onChange(Number(e.target.value))} placeholder="Stock" />
                                                    </Form.Control>
                                                </Form.Item>
                                            )}
                                        />
                                        <Form.Field
                                            control={form.control}
                                            name="provider"
                                            render={({ field }) => (
                                                <Form.Item className="w-full">
                                                    <Form.Label>Provider</Form.Label>
                                                    <Form.Control>

                                                        <Select
                                                            {...field}
                                                            value={field.value}
                                                            onValueChange={(value) => field.onChange(value)}
                                                        >
                                                            <Select.Trigger>
                                                                <Select.Value placeholder="Select a provider" />
                                                            </Select.Trigger>
                                                            <Select.Content>
                                                                {providers.map((item) => (
                                                                    <Select.Item key={item.id} value={item.name}>
                                                                        {item.name}
                                                                    </Select.Item>
                                                                ))}
                                                            </Select.Content>
                                                        </Select>

                                                    </Form.Control>
                                                </Form.Item>
                                            )}
                                        />
                                    </div>
                                    <div className="flex flex-row gap-x-6">
                                        <Form.Field
                                            control={form.control}
                                            name="category"
                                            render={({ field }) => (
                                                <Form.Item className="w-full">
                                                    <Form.Label>Category</Form.Label>
                                                    <Form.Control>
                                                        <Select
                                                            {...field}
                                                            value={field.value}
                                                            onValueChange={(value) => field.onChange(value)}
                                                        >
                                                            <Select.Trigger>
                                                                <Select.Value placeholder="Select a category" />
                                                            </Select.Trigger>
                                                            <Select.Content>
                                                                {categories.map((item) => (
                                                                    <Select.Item key={item.id} value={item.name}>
                                                                        {item.name}
                                                                    </Select.Item>
                                                                ))}
                                                            </Select.Content>
                                                        </Select>
                                                    </Form.Control>
                                                </Form.Item>
                                            )}
                                        />
                                        <Form.Field
                                            control={form.control}
                                            name="brand"
                                            render={({ field }) => (
                                                <Form.Item className="w-full">
                                                    <Form.Label>Brand</Form.Label>
                                                    <Form.Control>

                                                        <Select
                                                            {...field}
                                                            value={field.value}
                                                            onValueChange={(value) => field.onChange(value)}
                                                        >
                                                            <Select.Trigger>
                                                                <Select.Value placeholder="Select a brand" />
                                                            </Select.Trigger>
                                                            <Select.Content>
                                                                {brands.map((item) => (
                                                                    <Select.Item key={item.id} value={item.name}>
                                                                        {item.name}
                                                                    </Select.Item>
                                                                ))}
                                                            </Select.Content>
                                                        </Select>

                                                    </Form.Control>
                                                </Form.Item>
                                            )}
                                        />
                                    </div>

                                    {validationError && (
                                        <div className="text-center">
                                            <Hint className="inline-flex" variant={"error"}>
                                                {validationError}
                                            </Hint>
                                        </div>
                                    )}
                                    <Button type="submit">Create</Button>
                                </form>
                            </Form>
                        </div>
                    </div>
                </FocusModal.Body>
            </FocusModal.Content>
        </FocusModal>
    )
}