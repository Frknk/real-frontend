'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import { Heading, Input, Button, Hint, Alert, Text } from "@medusajs/ui";
import AvatarBox from "@/components/logo-box/avatar-box";
import { useForm } from "react-hook-form";
import { Form } from "@/components/form";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const LoginSchema = z.object({
  username: z.string(),
  password: z.string(),
})

export default function Home() {

  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  // if there is a token
  if (localStorage.getItem('token')) {
    useEffect(() => {
      router.push('/dashboard/')
  }, [router])
  }

  const handleSubmit = form.handleSubmit(async (data) => {
    setLoading(true);

    const formDetails = new URLSearchParams();
    formDetails.append('username', data.username);
    formDetails.append('password', data.password);

    try {
      const response = await fetch('http://localhost:8000/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formDetails,
      });

      setLoading(false);

      if (response.ok) {
        const responseData = await response.json();
        localStorage.setItem('token', responseData.access_token);
        router.push('/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Authentication failed!');
      }
    } catch (error) {
      setLoading(false);
      setError('An error occurred. Please try again later.');
    }
  });

  return (
    <div className="bg-ui-bg-subtle flex min-h-dvh w-dvw items-center justify-center">
      <div className="m-4 flex w-full max-w-[280px] flex-col items-center">
        <AvatarBox />
        <div className="mb-4 flex flex-col items-center">
          <Heading>Welcome to Botica Real</Heading>
          <Text size="small" className="text-ui-fg-subtle text-center">
            Sign in to access the account area
          </Text>
        </div>
        <Form {...form}>
          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col gap-y-6"
          >
            <div className="flex flex-col gap-y-1">
              <Form.Field
                control={form.control}
                name="username"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Control>
                        <Input
                          autoComplete="username"
                          {...field}
                          className="bg-ui-bg-field-component"
                          placeholder="Username"
                        />
                      </Form.Control>
                    </Form.Item>
                  )
                }}
              />
              <Form.Field
                control={form.control}
                name="password"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label>{ }</Form.Label>
                      <Form.Control>
                        <Input
                          type="password"
                          autoComplete="current-password"
                          {...field}
                          className="bg-ui-bg-field-component"
                          placeholder="Password"
                        />
                      </Form.Control>
                    </Form.Item>
                  )
                }}
              />
            </div>
            {error && (
              <Alert
                className="bg-ui-bg-base items-center p-2"
                dismissible
                variant="error"
              >
                {error}
              </Alert>
            )}
            <Button className="w-full" type="submit" isLoading={loading}>
              Continue with email
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
