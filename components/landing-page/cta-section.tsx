import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Comece Hoje Mesmo</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-balance">
            Pronto para revolucionar sua{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">sala de aula?</span>
          </h2>

          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed text-pretty">
            Junte-se a milhares de educadores que já estão transformando a experiência de aprendizado com levelEdu.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 group">
              Começar Grátis por 30 Dias
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
           Configuração em minutos • Suporte dedicado
          </p>
        </div>
      </div>
    </section>
  )
}
