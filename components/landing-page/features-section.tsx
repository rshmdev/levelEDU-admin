import { Award, BarChart3, Gift, Medal, Shield, Sparkles } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Medal,
      title: "Rankings Dinâmicos",
      description: "Sistema de classificação em tempo real que motiva a competição saudável entre alunos",
    },
    {
      icon: Gift,
      title: "Loja de Prêmios",
      description: "Marketplace interno onde alunos trocam pontos por recompensas reais e virtuais",
    },
    {
      icon: Sparkles,
      title: "Sistema de Níveis",
      description: "Progressão por níveis e conquista de badges especiais conforme o desempenho",
    },
    {
      icon: Award,
      title: "Prêmios por Comportamento",
      description: "Reconheça e recompense atitudes positivas e bom comportamento automaticamente",
    },
    {
      icon: BarChart3,
      title: "Relatórios Detalhados",
      description: "Análises completas do progresso e engajamento de cada aluno",
    },
    {
      icon: Shield,
      title: "Ambiente Seguro",
      description: "Plataforma protegida com controles apropriados para o ambiente escolar",
    },
  ]

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">
            Recursos que{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">transformam</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Tudo que você precisa para criar uma experiência educacional gamificada e envolvente
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:scale-105 group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
