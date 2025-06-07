'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavBar() {

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-neutral-100 shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 py-2 mx-auto">
        {/* Título/Marca */}
        <Link href="/" className="text-xl font-bold text-gray-800 hover:text-gray-950 transition-colors duration-200">
          App de Investimento
        </Link>
      </div>
    </header>
  );
}