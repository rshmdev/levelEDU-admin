import { Metadata } from "next";
import { LoginForm } from "@/components/admin/login/login-form"
import Link from "next/link"
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

// SEO específico para página de login
export const metadata: Metadata = generateSEOMetadata({
  title: "Login - LevelEDU Admin",
  description: "Acesse o painel administrativo do LevelEDU. Faça login para gerenciar sua escola, alunos, turmas e acompanhar o progresso acadêmico.",
  keywords: [
    'login LevelEDU',
    'acesso admin',
    'painel administrativo',
    'gestão escolar',
    'dashboard educacional'
  ],
  noindex: true // Páginas de login não devem ser indexadas
});

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      {/* Animated background effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse delay-700" />

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-md mx-auto">
          {/* Logo and back link */}
          <div className="text-center mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 mb-6 text-muted-foreground hover:text-foreground transition-colors"
            >
             
              Voltar para home
            </Link>

            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/50">
                <span className="text-primary-foreground font-bold text-2xl">L</span>
              </div>
            </div>

            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
              Bem-vindo de volta
            </h1>
            <p className="text-muted-foreground">Faça login para acessar sua conta levelEdu</p>
          </div>

          {/* Login form card */}
          <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-8 shadow-2xl">
            <LoginForm />
          </div>

          {/* Sign up link */}
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Ainda não tem uma conta?{" "}
              <Link href="/#pricing" className="text-primary hover:text-primary/80 font-medium transition-colors">
                Começar agora
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
