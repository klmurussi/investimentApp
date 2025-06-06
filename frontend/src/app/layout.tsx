import './globals.css'; 
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Meu App',
  description: 'Um aplicativo com navbar, conteúdo variável e footer',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <NavBar /> 
        <main className="flex-grow container mx-auto p-4">
          {children} 
        </main>
        <Footer />
      </body>
    </html>
  );
}