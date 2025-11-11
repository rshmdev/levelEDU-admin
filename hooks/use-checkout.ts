"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSpecialOffer } from "./use-special-offer";

interface CheckoutOptions {
  plan?: string;
  trialDays?: number;
  useSpecialOffer?: boolean;
}

export function useCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { validateOffer, isActive: hasActiveOffer } = useSpecialOffer();

  const startCheckout = async (options: CheckoutOptions = {}) => {
    try {
      setLoading(true);
      setError(null);

      // Default para trial de 30 dias com plano starter
      const { plan = 'starter', trialDays = 30, useSpecialOffer = hasActiveOffer } = options;

      // Aplicar oferta especial se estiver ativa e solicitada
      let offerParams = {};
      if (useSpecialOffer && hasActiveOffer) {
        try {
          const offerDetails = await validateOffer('LAUNCH_50', plan as 'basic' | 'premium');
          offerParams = {
            offer: 'launch50',
            originalPrice: offerDetails.pricing.originalPrice,
            discountedPrice: offerDetails.pricing.discountedPrice,
            coupon: offerDetails.offer.couponCode
          };
        } catch (offerError) {
          console.error('Erro ao aplicar oferta:', offerError);
          // Continue sem a oferta se houver erro
        }
      }

      // Redirecionar para página de signup com parâmetros
      const searchParams = new URLSearchParams({
        plan,
        trial: trialDays.toString(),
        ...offerParams
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
    return startCheckout({ plan, trialDays: 30, useSpecialOffer: true });
  };

  const startSpecialOffer = async (plan: string = 'basic') => {
    return startCheckout({ plan, trialDays: 30, useSpecialOffer: true });
  };

  return {
    loading,
    error,
    startCheckout,
    startFreeTrial,
    startSpecialOffer,
    hasActiveOffer
  };
}