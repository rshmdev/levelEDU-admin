"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CheckoutOptions {
  plan?: string;
  trialDays?: number;
}

export function useCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const startCheckout = async (options: CheckoutOptions = {}) => {
    try {
      setLoading(true);
      setError(null);

      // Default para trial de 30 dias com plano starter
      const { plan = 'starter', trialDays = 30 } = options;

      // Redirecionar para página de signup com parâmetros
      const searchParams = new URLSearchParams({
        plan,
        trial: trialDays.toString()
      });

      router.push(`/signup?${searchParams.toString()}`);

    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Erro ao iniciar checkout');
    } finally {
      setLoading(false);
    }
  };

  const startFreeTrial = async (plan: string = 'starter') => {
    return startCheckout({ plan, trialDays: 30 });
  };

  return {
    loading,
    error,
    startCheckout,
    startFreeTrial
  };
}