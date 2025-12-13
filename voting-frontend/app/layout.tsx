'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import "./globals.css";

// Disable static generation for the entire app
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 min-h-screen antialiased" suppressHydrationWarning>
        <AuthProvider>
          <Header />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
