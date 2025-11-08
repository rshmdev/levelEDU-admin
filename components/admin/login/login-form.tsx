"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react"
import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { USER_ROLES } from "@/config/api"
import { protocol, rootDomain } from "@/lib/utils"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Backend vai decidir o tipo pelo email/senha
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
        setIsLoading(false)
        return
      }

      console.log('Resultado do signIn:', result);

      if (result?.ok) {
        // Backend já retornou o tipo correto na sessão
        const session = await getSession()
        if (session?.user) {
          if (session.user.role === USER_ROLES.SUPER_ADMIN) {
            router.push('/admin')
          } else {
            // Redirecionar para o subdomínio do tenant
            const tenantSubdomain = session.user.tenantSubdomain;
            console.log('Session data:', session.user);
            console.log('Tenant subdomain:', tenantSubdomain);
            console.log('Root domain:', rootDomain);
            console.log('Protocol:', protocol);
            
            if (tenantSubdomain) {
              // Construir a URL do tenant incluindo porta em desenvolvimento
              const tenantUrl = `${protocol}://${tenantSubdomain}.${rootDomain}`;

              console.log('Redirecionando para o subdomínio do tenant:', tenantUrl);
              
              // Usar window.location para redirecionamento entre domínios
              window.location.href = tenantUrl;
            } else {
              // Fallback para a estrutura de path
              router.replace(`/s/${session.user.tenantSubdomain}`);
            }
          }
        }
      }
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || "Erro durante o login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 bg-background/50 border-border focus:border-primary transition-colors"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium">
              Senha
            </Label>
            <button type="button" className="text-xs text-primary hover:text-primary/80 transition-colors">
              Esqueceu a senha?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 bg-background/50 border-border focus:border-primary transition-colors"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary/90 h-11 text-base font-medium shadow-lg shadow-primary/50 transition-all hover:shadow-primary/70"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Entrando...
            </>
          ) : (
            "Entrar"
          )}
        </Button>
      </form>

      {/* Security notice */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          🛡️ Login inteligente - o sistema detectará automaticamente seu tipo de acesso
        </p>
      </div>
    </div>
  )
}
