import type { Metadata } from 'next';
import './globals.css';
import ClientLayout from '@/components/layout/ClientLayout';

export const metadata: Metadata = {
  title: 'TestOS v2 — AI-Powered Test Management',
  description: 'Enterprise test management platform powered by AI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
