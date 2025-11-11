"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Clock, Zap, ArrowRight } from "lucide-react"
import { useCheckout } from "@/hooks/use-checkout"
import { useSpecialOffer } from "@/hooks/use-special-offer"

export function UrgencySection() {
  const { startSpecialOffer, loading } = useCheckout()
  const { offer, timeRemaining, schoolsRemaining, isActive } = useSpecialOffer()

  // Não renderizar se não houver oferta ativa
  if (!isActive || !offer || timeRemaining.isExpired) {
    return null;
  }

  const timeUnits = [
    { value: timeRemaining.days, label: "Dias" },
    { value: timeRemaining.hours, label: "Horas" },
    { value: timeRemaining.minutes, label: "Min" },
    { value: timeRemaining.seconds, label: "Seg" },
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/30">
      <div className="container mx-auto max-w-4xl">
        <Card className="p-8 border-2 border-primary/20 shadow-2xl relative overflow-hidden">
          {/* Background effect */}
          <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-accent/5" />
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">⚡ OFERTA ESPECIAL POR TEMPO LIMITADO</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">
                <span className="text-primary">50% OFF</span> no primeiro ano + <br/>
                <span className="text-accent">Setup GRATUITO</span> (valor R$ 497)
              </h2>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Transforme sua escola agora e economize <strong>mais de R$ 1.200</strong> no primeiro ano. 
                Oferta válida apenas para as próximas escolas que se inscreverem.
              </p>
            </div>

            {/* Countdown Timer */}
            <div className="mb-8">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Esta oferta expira em:
                </span>
              </div>
              
              <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
                {timeUnits.map((unit, index) => (
                  <div key={unit.label} className="text-center">
                    <div className="bg-linear-to-br from-primary to-accent text-primary-foreground text-2xl sm:text-3xl font-bold py-3 px-2 rounded-lg shadow-lg min-h-[60px] flex items-center justify-center">
                      {unit.value.toString().padStart(2, '0')}
                    </div>
                    <div className="text-sm font-medium text-muted-foreground mt-2">
                      {unit.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits List */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">✅ Incluído na oferta:</h3>
                <ul className="space-y-2 text-sm">
                  {offer.benefits.map((benefit, index) => (
                    <li key={index}>• {benefit}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">🚀 Resultados garantidos:</h3>
                <ul className="space-y-2 text-sm">
                  {offer.guarantees.map((guarantee, index) => (
                    <li key={index}>• {guarantee}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="text-center space-y-4">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-300 group"
                onClick={() => startSpecialOffer()}
                disabled={loading}
              >
                {loading ? "Carregando..." : (
                  <>
                    🔥 GARANTIR MINHA OFERTA AGORA
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
              
              <div className="text-sm text-muted-foreground">
                <strong>Apenas {schoolsRemaining} escolas restantes</strong> para esta oferta.<br/>
                ✅ Sem compromisso • ✅ Cancele quando quiser • ✅ Setup em 24h
              </div>
            </div>

            {/* Testimonial snippet */}
            <div className="mt-8 p-4 bg-card border border-border rounded-lg">
              <div className="text-sm italic text-center">
                "Em 2 meses, nossas notas subiram 45% e os problemas de comportamento praticamente sumiram. 
                O LevelEDU transformou nossa escola completamente!"
              </div>
              <div className="text-xs text-center mt-2 text-muted-foreground">
                — Diretora Ana Paula, Colégio Santa Mônica (SP)
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}