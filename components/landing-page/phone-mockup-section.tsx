import { Star, Trophy, Flame, Award } from "lucide-react"

export function PhoneMockupSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/10 via-background to-background" />

      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-balance">
              Uma experiência{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                super interativa
              </span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Nosso aplicativo gamificado transforma cada atividade escolar em uma aventura emocionante, mantendo os
              alunos motivados e engajados.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Rankings Competitivos</h3>
                  <p className="text-sm text-muted-foreground">
                    Veja sua posição em tempo real e compete de forma saudável com colegas
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Loja de Prêmios</h3>
                  <p className="text-sm text-muted-foreground">
                    Troque seus pontos por recompensas exclusivas e incentivos reais
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Flame className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Sistema de Níveis</h3>
                  <p className="text-sm text-muted-foreground">
                    Evolua através de níveis e conquiste badges exclusivos
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative animate-float">
              {/* Phone mockup */}
              <div className="w-[300px] h-[600px] bg-gradient-to-b from-card to-secondary rounded-[3rem] border-8 border-foreground/10 shadow-2xl overflow-hidden relative">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-background rounded-b-3xl" />

                {/* Screen content */}
                <div className="p-6 pt-10 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-xs text-muted-foreground">Seu Nível</p>
                      <p className="text-2xl font-bold text-foreground">Nível 15</p>
                    </div>
                    <div className="flex items-center gap-2 bg-primary/20 px-3 py-1 rounded-full">
                      <Star className="w-4 h-4 text-primary fill-primary" />
                      <span className="text-sm font-semibold text-primary">2,450 XP</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-6">
                    <div className="h-3 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-primary to-accent rounded-full" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">750 XP até o próximo nível</p>
                  </div>

                  {/* Rankings */}
                  <div className="bg-card/50 backdrop-blur rounded-2xl p-4 mb-4">
                    <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-primary" />
                      Top Alunos da Semana
                    </h3>
                    <div className="space-y-2">
                      {[
                        { name: "João Silva", points: 3250, rank: 1 },
                        { name: "Maria Santos", points: 3100, rank: 2 },
                        { name: "Você", points: 2890, rank: 3, highlight: true },
                      ].map((student) => (
                        <div
                          key={student.rank}
                          className={`flex items-center justify-between p-2 rounded-lg ${
                            student.highlight ? "bg-primary/10 border border-primary/20" : "bg-secondary/50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-muted-foreground w-4">#{student.rank}</span>
                            <span className="text-sm font-medium text-foreground">{student.name}</span>
                          </div>
                          <span className="text-sm font-semibold text-primary">{student.points}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Missions */}
                  <div className="bg-card/50 backdrop-blur rounded-2xl p-4 flex-1">
                    <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Flame className="w-4 h-4 text-accent" />
                      Missões Diárias
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-accent/10">
                        <span className="text-xs text-foreground">Complete 5 exercícios</span>
                        <span className="text-xs font-semibold text-accent">+100 XP</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                        <span className="text-xs text-foreground">Ajude 2 colegas</span>
                        <span className="text-xs font-semibold text-muted-foreground">+50 XP</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
                <Star className="w-8 h-8 text-primary fill-primary" />
              </div>
              <div
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center animate-pulse"
                style={{ animationDelay: "0.5s" }}
              >
                <Trophy className="w-8 h-8 text-accent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
