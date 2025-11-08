'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import BrandingSetup from "@/components/admin/branding/branding-setup";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, ArrowRight, Sparkles } from "lucide-react";
import { useTenant } from "@/hooks/use-tenant";

export default function InitialSetupPage() {
  const router = useRouter();
  const { tenant, refreshTenant } = useTenant();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'welcome' | 'branding' | 'complete'>('welcome');

  const handleStartSetup = () => {
    setStep('branding');
  };

  const handleBrandingSave = async (brandingData: any) => {
    setIsLoading(true);
    
    try {
      // Atualizar branding do tenant
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tenants/${tenant?.subdomain}/branding`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          branding: brandingData
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar personalização');
      }

      // Marcar onboarding como completo
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tenants/${tenant?.subdomain}/onboarding`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          onboardingCompleted: true
        }),
      });

      // Refresh dos dados do tenant
      refreshTenant();
      
      setStep('complete');
      
      // Redirecionar para dashboard após 2 segundos
      setTimeout(() => {
        router.push('/admin');
      }, 2000);

    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar personalização. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipSetup = async () => {
    setIsLoading(true);
    
    try {
      // Apenas marcar onboarding como completo sem personalizar
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tenants/${tenant?.subdomain}/onboarding`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          onboardingCompleted: true
        }),
      });

      router.push('/admin');
    } catch (error) {
      console.error('Erro:', error);
      router.push('/admin'); // Redirecionar mesmo em caso de erro
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'welcome') {
    return (
      <div className="w-full flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center pb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">
              🎉 Bem-vindo à {tenant?.name}!
            </CardTitle>
            <CardDescription className="text-lg">
              Sua escola foi criada com sucesso. Vamos personalizá-la para que tenha a cara da sua instituição!
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/5 border border-accent/20">
                <Sparkles className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <h4 className="font-medium text-accent mb-1">Personalização Visual</h4>
                  <p className="text-sm text-muted-foreground">
                    Escolha cores que representem sua escola e mantenha a identidade visual consistente.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                <ArrowRight className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-primary mb-1">Preview em Tempo Real</h4>
                  <p className="text-sm text-muted-foreground">
                    Veja como sua escola ficará com as cores escolhidas antes de salvar.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={handleStartSetup}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isLoading}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Personalizar Agora
              </Button>
              <Button
                variant="outline"
                onClick={handleSkipSetup}
                disabled={isLoading}
              >
                Pular por Agora
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Você poderá personalizar sua escola a qualquer momento nas configurações
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'branding') {
    return (
      <div className="w-full p-4 overflow-y-auto">
        <BrandingSetup 
          onSave={handleBrandingSave}
          initialBranding={tenant?.branding}
        />
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="w-full flex items-center justify-center p-4">
        <Card className="max-w-lg w-full text-center">
          <CardHeader>
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-accent" />
            </div>
            <CardTitle className="text-2xl font-bold text-accent">
              Personalização Salva!
            </CardTitle>
            <CardDescription>
              Sua escola agora tem a identidade visual personalizada. 
              Redirecionando para o dashboard...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
}