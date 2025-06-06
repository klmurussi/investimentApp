'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx'; 
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from '@/components/ui/navigation-menu';

export function NavBar() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Clientes', href: '/clients' },
    { name: 'Ativos', href: '/assets' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-neutral-100 shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 py-2 mx-auto">
        {/* Título/Marca */}
        <Link href="/" className="text-xl font-bold text-gray-800 hover:text-gray-950 transition-colors duration-200">
          App de Investimento
        </Link>

        {/* Navegação Principal */}
        <NavigationMenu>
          <NavigationMenuList className="flex items-center space-x-2 pr-4"> 
            {navLinks.map((link) => (
              <NavigationMenuItem key={link.name}>
                <Link href={link.href} legacyBehavior passHref> 
                  <NavigationMenuLink
                    className={clsx(
                      "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                      {
                        "text-primary-foreground bg-primary": pathname === link.href, // Link ativo (cor primária do tema)
                        "text-muted-foreground bg-background": pathname !== link.href, // Link inativo (cor de fundo)
                      }
                    )}
                  >
                    {link.name}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}