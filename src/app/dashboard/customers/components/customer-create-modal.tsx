"use client"

import { Button, FocusModal, Heading, Input, Label, Text, Hint } from "@medusajs/ui"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/form";
import { toast } from "@medusajs/ui";
import { createCustomer } from "@/commons/customers";

// Define the schema for customer creation
const CustomerCreateSchema = z.object({
  dni: z.number().min(1, { message: "DNI must be greater than 0" }),
  name: z.string(),
  last_name: z.string(),
  email: z.string().email({ message: "Invalid email address" }),
});

export function CreateCustomerModal() {
  // Create the form hook
  const form = useForm<z.infer<typeof CustomerCreateSchema>>({
    resolver: zodResolver(CustomerCreateSchema),
    defaultValues: {
      dni: 0,
      name: "",
      last_name: "",
      email: "",
    },
  });

  const validationError = form.formState.errors.dni?.message ||
    form.formState.errors.name?.message ||
    form.formState.errors.last_name?.message ||
    form.formState.errors.email?.message;

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await createCustomer(data);
      toast.success("Customer created successfully");
      form.reset();
    }
    catch (error) {
      toast.error("Failed to create customer");
    }
  });

  return (
    <FocusModal>
      <FocusModal.Trigger asChild>
        <Button>Create Customer</Button>
      </FocusModal.Trigger>
      <FocusModal.Content>
        <VisuallyHidden.Root>
          <FocusModal.Title>Create Customer</FocusModal.Title>
        </VisuallyHidden.Root>
        <FocusModal.Header />
        <FocusModal.Body className="flex flex-col items-center py-16 overflow-y-auto">
          <div className="flex w-full max-w-lg flex-col gap-y-8 px-2">
            <div className="flex flex-col gap-y-1">
              <Heading>Create Customer</Heading>
              <Text className="text-ui-fg-subtle">
                Fill in the form to create a new customer
              </Text>
            </div>
            <div className="flex flex-col gap-y-2">
              <Form {...form}>
                <form onSubmit={handleSubmit} className="flex w-full flex-col gap-y-6">
                  <div className="flex flex-row gap-x-6">
                    <Form.Field
                      control={form.control}
                      name="dni"
                      render={({ field }) => (
                        <Form.Item className="w-full">
                          <Form.Label>DNI</Form.Label>
                          <Form.Control>
                            <Input {...field} type="number" onChange={(e) => field.onChange(Number(e.target.value))} placeholder="DNI" />
                          </Form.Control>
                        </Form.Item>
                      )}
                    />
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
                  </div>
                  <Form.Field
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <Form.Item>
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control>
                          <Input {...field} placeholder="Last Name" />
                        </Form.Control>
                      </Form.Item>
                    )}
                  />
                  <Form.Field
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <Form.Item>
                        <Form.Label>Email</Form.Label>
                        <Form.Control>
                          <Input {...field} placeholder="Email" />
                        </Form.Control>
                      </Form.Item>
                    )}
                  />
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