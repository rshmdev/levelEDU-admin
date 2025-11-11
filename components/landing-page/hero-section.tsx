"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Loader2 } from "lucide-react"
import { useCheckout } from "@/hooks/use-checkout"

export function HeroSection() {
  const { startFreeTrial, loading } = useCheckout();
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-glow"
        style={{ animationDelay: "1.5s" }}
      />

      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">+2.3 pontos na média em 90 dias</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-balance">
            Suas notas vão{" "}
            <span className="bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
              subir 40%
            </span>{" "}
            em 3 meses
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed text-pretty">
            15.200+ estudantes já transformaram seu desempenho. Professores relatam 87% mais engajamento. 
            Sua escola será a próxima a ver resultados reais.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-lg px-8 group"
              onClick={() => startFreeTrial()}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Carregando...
                </>
              ) : (
                <>
                  Começar Grátis
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span>30 dias grátis • Sem cartão</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
              <span>Resultados em 30 dias ou seu dinheiro de volta</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
