
'use client'

import {
  Book,
  GraduationCap,
  GraduationCapIcon,
  Home,
  ListChecks,
  LoaderIcon,
  Package,
  PanelLeft,
  Shield,
  ShoppingCart,
  SmilePlus,
  Users2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { NavItem } from '@/components/shared/nav-item';
import {
  SignoutButton,
  SignoutButtonMobile
} from '@/components/shared/signout-button';
import NavAnimatedLogo from '@/components/shared/nav-animated-logo';
import { Suspense } from 'react';
import { NavLink } from '@/components/shared/nav-link';
import { USER_ROLES } from '@/config/api';
import { useSession } from 'next-auth/react';

export function DesktopNav() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex justify-between">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <div className="w-8 h-8 bg-muted rounded animate-pulse" />
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-8 h-8 bg-muted rounded animate-pulse" />
          ))}
        </nav>
      </aside>
    );
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex justify-between">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Suspense fallback={<LoaderIcon className="animate-spin size-3" />}>
          <NavAnimatedLogo />
        </Suspense>

        {(session?.user?.role === USER_ROLES.SUPER_ADMIN ||
          session?.user?.role === USER_ROLES.TENANT_ADMIN ||
          session?.user?.role === USER_ROLES.TEACHER) && (
            <>
              <NavItem href="/" label="Inicio">
                <Home className="h-5 w-5" />
              </NavItem>

              <NavItem href="/attitudes" label="Atitudes">
                <SmilePlus className="h-5 w-5" />
              </NavItem>

              <NavItem href="/sales" label="Vendas">
                <ShoppingCart className="h-5 w-5" />
              </NavItem>

              <NavItem href="/adminUsers" label="Usuarios">
                <Shield className="h-5 w-5" />
              </NavItem>

              <NavItem href="/teacher-dashboard" label="Painel do Professor">
                <GraduationCap className="h-5 w-5" />
              </NavItem>

              <NavItem href="/missions" label="Missões">
                <ListChecks className="h-5 w-5" />
              </NavItem>

              <NavItem href="/products" label="Produtos">
                <Package className="h-5 w-5" />
              </NavItem>

              <NavItem href="/classes" label="Classes">
                <Book className="h-5 w-5" />
              </NavItem>

              <NavItem href="/students" label="Alunos">
                <Users2 className="h-5 w-5" />
              </NavItem>
            </>
          )}

        {session?.user?.role === USER_ROLES.TEACHER && (
          <NavItem href="/teacher-dashboard" label="Painel do Professor">
            <GraduationCap className="h-5 w-5" />
          </NavItem>
        )}
      </nav>

      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <SignoutButton />
      </nav>
    </aside>
  );
}

export function MobileNav() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Button size="icon" variant="outline" className="sm:hidden" disabled>
        <LoaderIcon className="h-5 w-5 animate-spin" />
      </Button>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="sm:max-w-xs flex flex-col justify-between"
      >
        <nav className="grid gap-6 text-lg font-medium">
          {(session?.user?.role === USER_ROLES.SUPER_ADMIN ||
            session?.user?.role === USER_ROLES.TENANT_ADMIN ||
            session?.user?.role === USER_ROLES.TEACHER) && (
              <>
                <NavLink href="/" icon={<Home className="h-5 w-5" />}>
                  Inicio
                </NavLink>
                <NavLink
                  href="/attitudes"
                  icon={<SmilePlus className="h-5 w-5" />}
                >
                  Atitudes
                </NavLink>
                <NavLink
                  href="/sales"
                  icon={<ShoppingCart className="h-5 w-5" />}
                >
                  Vendas
                </NavLink>
                <NavLink href="/adminUsers" icon={<Shield className="h-5 w-5" />}>
                  Usuarios
                </NavLink>
                <NavLink
                  href="/teacher-dashboard"
                  icon={<GraduationCapIcon className="h-5 w-5" />}
                >
                  Painel do Professor
                </NavLink>
                <NavLink
                  href="/missions"
                  icon={<ListChecks className="h-5 w-5" />}
                >
                  Missões
                </NavLink>
                <NavLink href="/products" icon={<Package className="h-5 w-5" />}>
                  Produtos
                </NavLink>
                <NavLink href="/classes" icon={<Book className="h-5 w-5" />}>
                  Classes
                </NavLink>
                <NavLink href="/students" icon={<Users2 className="h-5 w-5" />}>
                  Alunos
                </NavLink>
              </>
            )}

          {session?.user?.role === USER_ROLES.TEACHER && (
            <NavLink
              href="/teacher-dashboard"
              icon={<GraduationCapIcon className="h-5 w-5" />}
            >
              Painel do Professor
            </NavLink>
          )}
        </nav>

        <nav className="">
          <SignoutButtonMobile />
        </nav>
      </SheetContent>
    </Sheet>
  );
}