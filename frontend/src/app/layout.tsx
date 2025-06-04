// frontend/src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { QueryProvider } from '@/components/QueryProvider'; // <-- Importe o novo wrapper

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gerenciador de Investimentos',
  description: 'Aplicação para gerenciar clientes e ativos financeiros',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider> {/* <-- Use o wrapper aqui */}
          <nav className="bg-gray-800 p-4 text-white">
            <ul className="flex space-x-4">
              <li>
                <Link href="/clients">
                  Clientes
                </Link>
              </li>
              <li>
                <Link href="/assets">
                  Ativos
                </Link>
              </li>
            </ul>
          </nav>
          <main className="min-h-screen">
            {children}
          </main>
        </QueryProvider>
      </body>
    </html>
  );
}