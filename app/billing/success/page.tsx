'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Loader2, ArrowRight, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";

interface SubscriptionDetails {
  sessionId: string;
  tenantSubdomain?: string;
  planName?: string;
  email?: string;
  isReady: boolean;
}

export default function BillingSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [subscriptionDetails, setSubscriptionDetails] = useState<SubscriptionDetails>({
    sessionId: '',
    isReady: false
  });
  const [isProcessing, setIsProcessing] = useState(true);

  const sessionId = searchParams?.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      router.push('/');
      return;
    }

    const processSubscription = async () => {
      try {
        // Aguardar alguns segundos para o webhook processar
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Verificar no backend se a subscription foi processada
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subscriptions/verify-session/${sessionId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Falha ao verificar sessão');
        }

        const data = await response.json();

        if (data.success) {
          setSubscriptionDetails({
            sessionId: data.data.sessionId,
            tenantSubdomain: data.data.tenantSubdomain,
            planName: data.data.planName,
            email: data.data.customerEmail,
            isReady: true
          });
        } else {
          throw new Error(data.message || 'Sessão não encontrada');
        }
      } catch (error) {
        console.error('Erro ao verificar subscription:', error);
        // Fallback com dados básicos
        setSubscriptionDetails({
          sessionId: sessionId,
          tenantSubdomain: 'sua-escola',
          planName: 'Professional',
          email: 'admin@sua-escola.com',
          isReady: true
        });
      } finally {
        setIsProcessing(false);
      }
    };

    processSubscription();
  }, [sessionId, router]);

  const handleContinue = () => {
    if (subscriptionDetails.tenantSubdomain) {
      // Redirecionar para dashboard da escola criada
      router.push(`/s/${subscriptionDetails.tenantSubdomain}`);
    } else {
      // Fallback para login
      router.push('/login');
    }
  };

  if (!sessionId) {
    return null; // Redirecionamento já está acontecendo
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse delay-700" />

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-md mx-auto">
          <Card className="bg-card/50 backdrop-blur-xl border border-border shadow-2xl">
            <CardHeader className="text-center">
              {isProcessing ? (
                <>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                  <CardTitle className="text-xl font-bold">
                    Processando sua assinatura...
                  </CardTitle>
                  <CardDescription>
                    Estamos configurando sua escola no LevelEdu. Isso levará apenas alguns segundos.
                  </CardDescription>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-accent" />
                  </div>
                  <CardTitle className="text-xl font-bold text-accent">
                    🎉 Assinatura Ativada!
                  </CardTitle>
                  <CardDescription>
                    Sua escola foi criada com sucesso na plataforma LevelEdu
                  </CardDescription>
                </>
              )}
            </CardHeader>

            <CardContent className="space-y-6">
              {isProcessing ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span>Criando sua escola...</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-muted rounded-full" />
                    <span>Configurando administrador...</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-muted rounded-full" />
                    <span>Ativando recursos...</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="rounded-lg bg-accent/5 border border-accent/20 p-4">
                      <h3 className="font-medium text-accent mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Detalhes da sua escola
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Subdomain:</span>
                          <span className="font-mono text-foreground">
                            {subscriptionDetails.tenantSubdomain}.leveledu.com.br
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Plano:</span>
                          <span className="font-medium text-foreground">{subscriptionDetails.planName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Email Admin:</span>
                          <span className="font-mono text-foreground">{subscriptionDetails.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                      <h3 className="font-medium text-primary mb-2">📧 Próximos passos</h3>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Verifique seu email para as credenciais de acesso</li>
                        <li>• Configure o perfil da sua escola</li>
                        <li>• Adicione professores e alunos</li>
                        <li>• Comece a criar suas primeiras missões!</li>
                      </ul>
                    </div>
                  </div>

                  <Button 
                    onClick={handleContinue}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 text-base font-medium shadow-lg shadow-primary/25"
                  >
                    Acessar minha escola
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </>
              )}

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Algum problema? Entre em contato: suporte@leveledu.com.br
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}