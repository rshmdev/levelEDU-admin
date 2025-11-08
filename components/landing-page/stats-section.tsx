import { Trophy, Users, Target, Zap } from "lucide-react"

export function StatsSection() {
  const stats = [
    {
      icon: Users,
      value: "10k+",
      label: "Alunos engajados",
    },
    {
      icon: Trophy,
      value: "95%",
      label: "Taxa de participação",
    },
    {
      icon: Target,
      value: "40%",
      label: "Aumento em notas",
    },
    {
      icon: Zap,
      value: "3x",
      label: "Mais motivação",
    },
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-border">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:scale-105"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
