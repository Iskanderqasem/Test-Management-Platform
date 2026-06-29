'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import TopNav from '@/components/layout/TopNav';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60 * 1000, retry: 1 } },
});

const AUTH_PATHS = ['/login', '/register', '/forgot-password'];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PATHS.some((p) => pathname?.startsWith(p));

  return (
    <QueryClientProvider client={queryClient}>
      {isAuthPage ? (
        <main className="h-full">{children}</main>
      ) : (
        <div className="flex h-full bg-gray-50">
          <Sidebar />
          <div className="flex flex-1 flex-col overflow-hidden">
            <TopNav />
            <main className="flex-1 overflow-y-auto p-6 main-scroll">{children}</main>
          </div>
        </div>
      )}
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}
