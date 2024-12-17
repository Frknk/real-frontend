"use client"
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { Spinner } from '@medusajs/icons';
import { SidebarProvider } from '@/components/sidebar/shell/sidebar-provider';
import { Shell } from '@/components/sidebar/shell';
import { Toaster } from '@medusajs/ui';
import axios from '@/commons/api';

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
      try {
        const response = await axios.get(`auth/verify_token/${token}`);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('token');
        router.push('/');
      }
    }

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
        <Toaster />
        <Shell>
          {children}
        </Shell>
      </SidebarProvider>
    </div>
  )
}