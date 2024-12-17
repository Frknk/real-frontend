"use client"

import { Button, FocusModal, Heading, Input, Text, Hint } from "@medusajs/ui"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/form";
import { toast } from "@medusajs/ui";
import { createCategory } from '@/commons/categories';

const CategoryCreateSchema = z.object({
  name: z.string().nonempty({ message: "Name is required" }),
});

export function CreateCategoryModal() {
  const form = useForm<z.infer<typeof CategoryCreateSchema>>({
    resolver: zodResolver(CategoryCreateSchema),
    defaultValues: {
      name: "",
    },
  });

  const validationError = form.formState.errors.name?.message;

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await createCategory(data);
      toast.success("Category created successfully");
      form.reset();
    }
    catch (error) {
      toast.error("Failed to create category");
    }
  });

  return (
    <FocusModal>
      <FocusModal.Trigger asChild>
        <Button>Create Category</Button>
      </FocusModal.Trigger>
      <FocusModal.Content>
        <VisuallyHidden.Root>
          <FocusModal.Title>Create Category</FocusModal.Title>
        </VisuallyHidden.Root>
        <FocusModal.Header />
        <FocusModal.Body className="flex flex-col items-center py-16 overflow-y-auto">
          <div className="flex w-full max-w-lg flex-col gap-y-8 px-2">
            <div className="flex flex-col gap-y-1">
              <Heading>Create Category</Heading>
              <Text className="text-ui-fg-subtle">
                Fill in the form to create a new category
              </Text>
            </div>
            <div className="flex flex-col gap-y-2">
              <Form {...form}>
                <form onSubmit={handleSubmit} className="flex w-full flex-col gap-y-6">
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