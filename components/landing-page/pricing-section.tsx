'use client';

import { Button } from "@/components/ui/button"
import { useSubscriptionPlans, formatCurrency } from "@/lib/stripe-client"
import { Check, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function PricingSection() {
  const { data: plans, isLoading, error } = useSubscriptionPlans();
  const router = useRouter();

  // Mapeamento de badges para cada plano
  const planBadges: Record<string, string> = {
    trial: "🆓",
    starter: "📚",
    professional: "🎓",
    growth: "🚀"
  };

  // Definir qual plano é destacado
  const highlightedPlanId = "professional";

  if (isLoading) {
    return (
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">
              Planos para{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">cada escola</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Escolha o plano ideal para sua instituição e comece a transformar a educação hoje
            </p>
          </div>
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Carregando planos...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">
              Planos para{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">cada escola</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Escolha o plano ideal para sua instituição e comece a transformar a educação hoje
            </p>
          </div>
          <div className="text-center py-20">
            <p className="text-muted-foreground">Erro ao carregar os planos. Tente novamente mais tarde.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">
            Planos para{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">cada escola</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Escolha o plano ideal para sua instituição e comece a transformar a educação hoje
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans?.map((plan, index) => {
            const isHighlighted = plan.id === highlightedPlanId;
            const isTrialPlan = plan.id === 'trial';
            const badge = planBadges[plan.id] || "📋";

            return (
              <div
                key={plan.id}
                className={`relative p-6 rounded-2xl border transition-all duration-300 hover:scale-105 flex flex-col h-full ${isHighlighted
                    ? "bg-gradient-to-b from-primary/10 to-card border-primary shadow-xl shadow-primary/20"
                    : "bg-card border-border hover:border-primary/50"
                  }`}
              >
                {isHighlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary rounded-full text-xs font-semibold text-primary-foreground">
                    Mais Popular
                  </div>
                )}

                <div className="text-4xl mb-2">{badge}</div>
                <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-grow-0">{plan.description}</p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">
                      {isTrialPlan ? "Grátis" : formatCurrency(plan.priceMonthly)}
                    </span>
                    <span className="text-muted-foreground">
                      {isTrialPlan ? "30 dias" : "/mês"}
                    </span>
                  </div>
                  {!isTrialPlan && (
                    <div className="text-sm text-muted-foreground mt-1">
                      ou {formatCurrency(plan.priceYearly)} /ano
                    </div>
                  )}
                </div>

                {/* Features que crescem para ocupar o espaço disponível */}
                <div className="space-y-3 flex-grow mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Botão sempre no final do cartão */}
                <Button
                  onClick={() => {
                    const searchParams = new URLSearchParams({ plan: plan.id });
                    if (isTrialPlan) {
                      searchParams.set('trial', '30');
                    }
                    router.push(`/signup?${searchParams.toString()}`);
                  }}
                  className={`w-full mt-auto ${isHighlighted ? "bg-primary hover:bg-primary/90" : "bg-secondary hover:bg-secondary/80"
                    }`}
                >
                  {isTrialPlan ? "Começar Grátis" : "Assinar Plano"}
                </Button>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Precisa de um plano personalizado?{" "}
            <a href="#contact" className="text-primary hover:underline font-medium">
              Entre em contato
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
