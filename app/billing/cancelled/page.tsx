'use client';

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";

export default function BillingCancelledPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-destructive/20 rounded-full blur-[120px] animate-pulse delay-700" />

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-md mx-auto">
          <Card className="bg-card/50 backdrop-blur-xl border border-border shadow-2xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-secondary" />
              </div>
              <CardTitle className="text-xl font-bold text-secondary">
                Assinatura Cancelada
              </CardTitle>
              <CardDescription>
                Nenhum problema! Você pode tentar novamente a qualquer momento.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="rounded-lg bg-secondary/5 border border-secondary/20 p-4">
                <h3 className="font-medium text-secondary mb-2">Por que cancelar agora?</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>🚀 Transforme sua escola digitalmente</li>
                  <li>📊 Acompanhe o progresso dos alunos</li>
                  <li>🎯 Sistema de missões gamificadas</li>
                  <li>💝 Teste grátis por 14 dias</li>
                </ul>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={() => router.push('/#pricing')}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 text-base font-medium"
                >
                  Tentar novamente
                  <ArrowLeft className="mr-2 h-4 w-4" />
                </Button>

                <Link href="mailto:suporte@leveledu.com.br" className="block">
                  <Button 
                    variant="outline"
                    className="w-full h-11 border-border hover:bg-secondary/5"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Falar com nosso time
                  </Button>
                </Link>
              </div>

              <div className="text-center">
                <Link 
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Voltar para home
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}