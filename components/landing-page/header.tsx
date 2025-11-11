"use client"

import { Button } from "@/components/ui/button"
import { Menu, X, LogIn, LayoutDashboard, Loader2 } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { USER_ROLES } from "@/config/api"
import { protocol, rootDomain } from "@/lib/utils"
import { useCheckout } from "@/hooks/use-checkout"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session } = useSession()
  const { startFreeTrial, loading } = useCheckout()

  const getDashboardUrl = () => {
    if (!session?.user) return null
    
    if (session.user.role === USER_ROLES.SUPER_ADMIN) {
      return '/admin'
    } else if (session.user.tenantSubdomain) {
      return `${protocol}://${session.user.tenantSubdomain}.${rootDomain}`
    }
    return null
  }

  const dashboardUrl = getDashboardUrl()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
           <Image src="/leveledu-logo.png" alt="LevelEDU" width={32} height={32} />
            <span className="text-xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              LevelEDU
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Recursos
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Planos
            </a>
            <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sobre
            </a>
            {session?.user && dashboardUrl ? (
              <Link href={dashboardUrl}>
                <Button variant="ghost" size="sm" className="gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="sm" className="gap-2">
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </Link>
            )}
            {!session?.user && (
              <Button 
                size="sm" 
                className="bg-primary hover:bg-primary/90"
                onClick={() => startFreeTrial()}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    Carregando...
                  </>
                ) : (
                  'Começar Grátis'
                )}
              </Button>
            )}
          </nav>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Recursos
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Planos
            </a>
            <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sobre
            </a>
            {session?.user && dashboardUrl ? (
              <Link href={dashboardUrl}>
                <Button variant="outline" size="sm" className="gap-2 w-full bg-transparent">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm" className="gap-2 w-full bg-transparent">
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </Link>
            )}
            {!session?.user && (
              <Button 
                size="sm" 
                className="bg-primary hover:bg-primary/90 w-full"
                onClick={() => startFreeTrial()}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    Carregando...
                  </>
                ) : (
                  'Começar Grátis'
                )}
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
