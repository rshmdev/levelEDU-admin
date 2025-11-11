"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Star, Gift, Target, ArrowRight, Play } from "lucide-react"

export function DemoSection() {
  const [currentDemo, setCurrentDemo] = useState<'ranking' | 'missions' | 'rewards'>('ranking')
  const [studentPoints, setStudentPoints] = useState(850)
  const [level, setLevel] = useState(3)

  const handleMissionComplete = () => {
    setStudentPoints(prev => prev + 100)
    if (studentPoints >= 900) setLevel(4)
  }

  const demoTabs = [
    { id: 'ranking', label: 'Rankings', icon: Trophy },
    { id: 'missions', label: 'Missões', icon: Target },
    { id: 'rewards', label: 'Recompensas', icon: Gift },
  ] as const

  const students = [
    { name: "Ana Silva", points: 1240, level: 5, badge: "🏆" },
    { name: "Carlos Santos", points: 1180, level: 4, badge: "🥈" },
    { name: "Maria Oliveira", points: 1120, level: 4, badge: "🥉" },
    { name: "Você (Demo)", points: studentPoints, level, badge: level >= 4 ? "⭐" : "🔥" },
  ]

  const missions = [
    { title: "Complete 5 exercícios de matemática", reward: 100, completed: false },
    { title: "Participe da discussão em grupo", reward: 50, completed: true },
    { title: "Entregue o projeto na data", reward: 150, completed: true },
    { title: "Ajude um colega", reward: 75, completed: false },
  ]

  const rewards = [
    { name: "Adesivo Especial", cost: 200, icon: "🌟" },
    { name: "Recreio Extra (+10min)", cost: 500, icon: "⏰" },
    { name: "Escolher Música da Turma", cost: 300, icon: "🎵" },
    { name: "Prêmio Surpresa", cost: 1000, icon: "🎁" },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Play className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Teste Agora • Sem Cadastro</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">
            Veja a <span className="text-primary">mágica</span> acontecer
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experimente como seus alunos vão interagir com o sistema. Clique, explore e veja os resultados na hora.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Tabs de Demo */}
          <div className="flex justify-center mb-8">
            <div className="flex gap-2 p-1 bg-muted rounded-lg">
              {demoTabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={currentDemo === tab.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentDemo(tab.id)}
                  className="gap-2"
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Demo Content */}
          <Card className="border-2 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                {currentDemo === 'ranking' && <Trophy className="w-5 h-5 text-primary" />}
                {currentDemo === 'missions' && <Target className="w-5 h-5 text-primary" />}
                {currentDemo === 'rewards' && <Gift className="w-5 h-5 text-primary" />}
                
                {currentDemo === 'ranking' && "Ranking da Turma 7A"}
                {currentDemo === 'missions' && "Suas Missões Ativas"}
                {currentDemo === 'rewards' && "Loja de Recompensas"}
              </CardTitle>
            </CardHeader>

            <CardContent>
              {/* Ranking Demo */}
              {currentDemo === 'ranking' && (
                <div className="space-y-4">
                  {students.sort((a, b) => b.points - a.points).map((student, index) => (
                    <div
                      key={student.name}
                      className={`flex items-center gap-4 p-4 rounded-lg border ${
                        student.name.includes('Demo') 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border'
                      }`}
                    >
                      <div className="text-2xl">{student.badge}</div>
                      <div className="flex-1">
                        <div className="font-semibold">{student.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Nível {student.level} • {student.points} pontos
                        </div>
                      </div>
                      <Badge variant={index < 3 ? "default" : "secondary"}>
                        #{index + 1}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}

              {/* Missions Demo */}
              {currentDemo === 'missions' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-2xl font-bold">Nível {level}</div>
                      <div className="text-muted-foreground">{studentPoints} pontos</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground mb-1">
                        Progresso para Nível {level + 1}
                      </div>
                      <Progress value={(studentPoints % 250) / 250 * 100} className="w-32" />
                    </div>
                  </div>

                  {missions.map((mission, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 rounded-lg border">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        mission.completed ? 'bg-primary border-primary' : 'border-muted-foreground'
                      }`}>
                        {mission.completed && <Star className="w-4 h-4 text-primary-foreground" />}
                      </div>
                      <div className="flex-1">
                        <div className={mission.completed ? "line-through text-muted-foreground" : ""}>
                          {mission.title}
                        </div>
                      </div>
                      <Badge variant="outline">+{mission.reward} pts</Badge>
                      {!mission.completed && index === 0 && (
                        <Button size="sm" onClick={handleMissionComplete}>
                          Completar
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Rewards Demo */}
              {currentDemo === 'rewards' && (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <div className="text-lg font-semibold mb-2">Seus Pontos: {studentPoints}</div>
                    <div className="text-sm text-muted-foreground">
                      Complete missões para ganhar mais pontos e trocar por recompensas!
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {rewards.map((reward, index) => (
                      <div key={index} className="p-4 rounded-lg border">
                        <div className="text-center mb-3">
                          <div className="text-3xl mb-2">{reward.icon}</div>
                          <div className="font-semibold">{reward.name}</div>
                          <div className="text-sm text-muted-foreground">{reward.cost} pontos</div>
                        </div>
                        <Button 
                          size="sm" 
                          className="w-full"
                          disabled={studentPoints < reward.cost}
                          variant={studentPoints >= reward.cost ? "default" : "secondary"}
                        >
                          {studentPoints >= reward.cost ? "Resgatar" : "Precisa de mais pontos"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* CTA após demo */}
          <div className="text-center mt-8">
            <p className="text-muted-foreground mb-4">
              Impressionado? Seus alunos vão ficar ainda mais engajados!
            </p>
            <Button size="lg" className="gap-2">
              Começar Minha Transformação
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}