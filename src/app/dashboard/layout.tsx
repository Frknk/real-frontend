"use client"
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { Spinner } from '@medusajs/icons';
import { SidebarProvider } from '@/components/sidebar/shell/sidebar-provider';
import { Shell } from '@/components/sidebar/shell';

export default function Dashboard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
        console.log(token)
      try {
        const response = await fetch(`http://localhost:8000/auth/verify_token/${token}`);

        if (!response.ok) {
          throw new Error('Token verification failed');
        }

        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('token');
        router.push('/');
      }
    };

    verifyToken();
  }, [router]);

  if (!isAuthenticated) {
    return (<div className="flex min-h-screen items-center justify-center">
    <Spinner className="text-ui-fg-interactive animate-spin" />
  </div>);
  }

  return (
    <div>
      <SidebarProvider>
        <Shell>
          {children}
        </Shell>
      </SidebarProvider>
    </div>
  )
}