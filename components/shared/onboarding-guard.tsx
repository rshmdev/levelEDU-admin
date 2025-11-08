'use client';

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTenant } from "@/hooks/use-tenant";

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export default function OnboardingGuard({ children }: OnboardingGuardProps) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { tenant, loading } = useTenant();

  // Prevenir problemas de hidratação
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Só executar após componente estar montado
    if (!mounted) return;
    
    // Aguardar carregar dados do tenant
    if (loading || !tenant) return;

    // Se já estamos na página de setup, não redirecionar
    if (pathname.includes('/setup')) return;

    // Verificar se onboarding foi completado
    const onboardingCompleted = tenant.metadata?.onboardingCompleted;

    if (!onboardingCompleted) {
      console.log('🚀 Redirecionando para setup inicial...');
      // O middleware vai reescrever /setup para /s/[subdomain]/setup automaticamente
      router.push('/setup');
    }
  }, [tenant, loading, pathname, router, mounted]);

  // Renderizar loading até componente estar montado
  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span>Carregando sua escola...</span>
        </div>
      </div>
    );
  }

  // Se onboarding não foi completado e não estamos na página de setup, não renderizar nada
  // (o useEffect acima vai redirecionar)
  if (tenant && !tenant.metadata?.onboardingCompleted && !pathname.includes('/setup')) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span>Configurando sua escola...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}