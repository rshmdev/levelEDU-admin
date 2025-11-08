'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils'; // Função utilitária para juntar classes

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export function NavLink({ href, icon, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-4 px-2.5 transition-colors',
        isActive
          ? 'text-foreground font-semibold'
          : 'text-muted-foreground hover:text-foreground'
      )}
    >
      {icon}
      {children}
    </Link>
  );
}
