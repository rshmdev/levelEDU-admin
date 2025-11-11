import { Trophy, Users, Target, Zap } from "lucide-react"

export function StatsSection() {
  const stats = [
    {
      icon: Users,
      value: "15.2K+",
      label: "Estudantes transformados",
      highlight: "Em apenas 18 meses"
    },
    {
      icon: Trophy,
      value: "87%",
      label: "Melhoria no engajamento",
      highlight: "Medido em 3 meses"
    },
    {
      icon: Target,
      value: "+2.3",
      label: "Pontos na média geral",
      highlight: "Resultado comprovado"
    },
    {
      icon: Zap,
      value: "92%",
      label: "Dos professores recomendam",
      highlight: "Satisfação real"
    },
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-border">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3 text-balance">
            Resultados que <span className="text-primary">falam por si</span>
          </h2>
          <p className="text-muted-foreground">Escolas reais, transformações reais, dados reais</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center justify-center gap-3 p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:scale-105 group"
            >
              {/* Badge de destaque */}
              {stat.highlight && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <div className="px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                    {stat.highlight}
                  </div>
                </div>
              )}
              
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-1 bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
