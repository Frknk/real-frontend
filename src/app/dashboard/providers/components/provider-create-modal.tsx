"use client"

import { Button, FocusModal, Heading, Input, Label, Text, Hint } from "@medusajs/ui"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/form";
import { toast } from "@medusajs/ui";
import { createProvider } from '@/commons/providers';

const ProviderCreateSchema = z.object({
  ruc: z.string().nonempty({ message: "RUC is required" }),
  name: z.string().nonempty({ message: "Name is required" }),
  address: z.string().nonempty({ message: "Address is required" }),
  phone: z.string().nonempty({ message: "Phone is required" }),
  email: z.string().nonempty({ message: "Email is required" }).email({ message: "Invalid email address" }),
});

export function ProviderCreateModal() {
  const form = useForm<z.infer<typeof ProviderCreateSchema>>({
    resolver: zodResolver(ProviderCreateSchema),
    defaultValues: {
      ruc: "",
      name: "",
      address: "",
      phone: "",
      email: "",
    },
  });

  const validationError = form.formState.errors;

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await createProvider(data);
      toast.success("Provider created successfully");
      form.reset();
    }
    catch (error) {
      toast.error("Failed to create provider");
    }
  });

  return (
    <FocusModal>
      <FocusModal.Trigger asChild>
        <Button>Create Provider</Button>
      </FocusModal.Trigger>
      <FocusModal.Content>
        <VisuallyHidden.Root>
          <FocusModal.Title>Create Provider</FocusModal.Title>
        </VisuallyHidden.Root>
        <FocusModal.Header />
        <FocusModal.Body className="flex flex-col items-center py-16 overflow-y-auto">
          <div className="flex w-full max-w-lg flex-col gap-y-8 px-2">
            <div className="flex flex-col gap-y-1">
              <Heading>Create Provider</Heading>
              <Text className="text-ui-fg-subtle">
                Fill in the form to create a new provider
              </Text>
            </div>
            <div className="flex flex-col gap-y-2">
              <Form {...form}>
                <form onSubmit={handleSubmit} className="flex w-full flex-col gap-y-6">
                  <Form.Field
                    control={form.control}
                    name="ruc"
                    render={({ field }) => (
                      <Form.Item className="w-full">
                        <Form.Label>RUC</Form.Label>
                        <Form.Control>
                          <Input {...field} placeholder="RUC" />
                        </Form.Control>
                      </Form.Item>
                    )}
                  />
                  {validationError.ruc && (
                    <div className="text-center">
                      <Hint className="inline-flex" variant={"error"}>
                        {validationError.ruc.message}
                      </Hint>
                    </div>
                  )}
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
                  {validationError.name && (
                    <div className="text-center">
                      <Hint className="inline-flex" variant={"error"}>
                        {validationError.name.message}
                      </Hint>
                    </div>
                  )}
                  <Form.Field
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <Form.Item className="w-full">
                        <Form.Label>Address</Form.Label>
                        <Form.Control>
                          <Input {...field} placeholder="Address" />
                        </Form.Control>
                      </Form.Item>
                    )}
                  />
                  {validationError.address && (
                    <div className="text-center">
                      <Hint className="inline-flex" variant={"error"}>
                        {validationError.address.message}
                      </Hint>
                    </div>
                  )}
                  <Form.Field
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <Form.Item className="w-full">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control>
                          <Input {...field} placeholder="Phone" />
                        </Form.Control>
                      </Form.Item>
                    )}
                  />
                  {validationError.phone && (
                    <div className="text-center">
                      <Hint className="inline-flex" variant={"error"}>
                        {validationError.phone.message}
                      </Hint>
                    </div>
                  )}
                  <Form.Field
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <Form.Item className="w-full">
                        <Form.Label>Email</Form.Label>
                        <Form.Control>
                          <Input {...field} placeholder="Email" />
                        </Form.Control>
                      </Form.Item>
                    )}
                  />
                  {validationError.email && (
                    <div className="text-center">
                      <Hint className="inline-flex" variant={"error"}>
                        {validationError.email.message}
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
