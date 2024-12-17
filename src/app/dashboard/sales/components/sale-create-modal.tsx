"use client"

import { Button, FocusModal, Heading, Input, Text, Hint, Select } from "@medusajs/ui"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Form } from "@/components/form";
import { useQuery } from "@tanstack/react-query";
import { Trash, Plus } from "@medusajs/icons";
import { toast } from "@medusajs/ui";
import { createSale } from "@/commons/sales";
import { getProducts } from "@/commons/products";

const SaleProductSchema = z.object({
  product_id: z.number().min(1, { message: "Please select a product" }),
  quantity: z.number().min(1, { message: "Quantity must be greater than 0" })
});

const SaleCreateSchema = z.object({
  products: z.array(SaleProductSchema).min(1),
  customer_dni: z.number().min(10000000, { message: "Invalid DNI" })
});

export function SaleCreateModal() {
  const productsQuery = useQuery({ queryKey: ['products'], queryFn: getProducts });

  const form = useForm<z.infer<typeof SaleCreateSchema>>({
    resolver: zodResolver(SaleCreateSchema),
    defaultValues: {
      products: [{ product_id: 0, quantity: 1 }],
      customer_dni: 11111111
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "products"
  });

  const products = productsQuery.data;

  const validationError = form.formState.errors.products?.message || 
    form.formState.errors.customer_dni?.message;

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await createSale(data);
      toast.success("Sale created successfully");
      form.reset();
    } catch (error) {
      toast.error("Failed to create sale");
    }
  });

  return (
    <FocusModal>
      <FocusModal.Trigger asChild>
        <Button>Create Sale</Button>
      </FocusModal.Trigger>
      <FocusModal.Content>
        <VisuallyHidden.Root>
          <FocusModal.Title>Create Sale</FocusModal.Title>
        </VisuallyHidden.Root>
        <FocusModal.Header />
        <FocusModal.Body className="flex flex-col items-center py-16 overflow-y-auto">
          <div className="flex w-full max-w-lg flex-col gap-y-8 px-2">
            <div className="flex flex-col gap-y-1">
              <Heading>Create Sale</Heading>
              <Text className="text-ui-fg-subtle">
                Fill in the form to create a new sale
              </Text>
            </div>
            <div className="flex flex-col gap-y-2">
              <Form {...form}>
                <form onSubmit={handleSubmit} className="flex w-full flex-col gap-y-6">
                  <Form.Field
                    control={form.control}
                    name="customer_dni"
                    render={({ field }) => (
                      <Form.Item className="w-full">
                        <Form.Label>Customer DNI</Form.Label>
                        <Form.Control>
                          <Input 
                            {...field} 
                            type="number"
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            placeholder="Customer DNI" 
                          />
                        </Form.Control>
                      </Form.Item>
                    )}
                  />
                  
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex flex-row gap-x-4">
                      <Form.Field
                        control={form.control}
                        name={`products.${index}.product_id`}
                        render={({ field }) => (
                          <Form.Item className="w-full">
                            <Form.Label>Product</Form.Label>
                            <Form.Control>
                              <Select
                                value={String(field.value)}
                                onValueChange={(value) => field.onChange(Number(value))}
                              >
                                <Select.Trigger>
                                  <Select.Value placeholder="Select a product" />
                                </Select.Trigger>
                                <Select.Content>
                                  {products?.map((product) => {
                                    const isSelected = fields.some(f => f.product_id === product.id);
                                    return (
                                      <Select.Item 
                                        key={product.id} 
                                        value={String(product.id)} 
                                        disabled={isSelected}
                                        className={isSelected ? " text-ui-fg-muted " : ""}
                                      >
                                        {product.name}
                                      </Select.Item>
                                    );
                                  })}
                                </Select.Content>
                              </Select>
                            </Form.Control>
                          </Form.Item>
                        )}
                      />
                      
                      <Form.Field
                        control={form.control}
                        name={`products.${index}.quantity`}
                        render={({ field }) => (
                          <Form.Item className="w-full">
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control>
                              <Input
                                {...field}
                                type="number"
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                placeholder="Qty"
                              />
                            </Form.Control>
                          </Form.Item>
                        )}
                      />
                      
                      <Button
                        variant="secondary"
                        className="mt-6 w-16"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                      >
                        <Trash />
                      </Button>
                    </div>
                  ))}
                  
                  <Button
                  type="button"
                    variant="secondary"
                    onClick={() => append({ product_id: 0, quantity: 1 })}
                  >
                    <Plus className="mr-2" />
                    Add Product
                  </Button>

                  {validationError && (
                    <div className="text-center">
                      <Hint className="inline-flex" variant="error">
                        {validationError}
                      </Hint>
                    </div>
                  )}
                  
                  <Button type="submit">Create Sale</Button>
                </form>
              </Form>
            </div>
          </div>
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  );
}