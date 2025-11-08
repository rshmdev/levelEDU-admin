'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSession, useSession } from 'next-auth/react';
import axios from 'axios';

// Configurar instância do Axios para subscriptions
const subscriptionsApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Função para buscar o token do endpoint do Next.js
async function fetchToken(): Promise<string | null> {
  try {
   const session = await getSession();
    return session?.accessToken || null;
  } catch (error) {
    return null;
  }
}

// Interceptor para adicionar o token automaticamente
subscriptionsApi.interceptors.request.use(
  async (config) => {
    const token = await fetchToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas
subscriptionsApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Subscription API Error:', error);
    return Promise.reject(error);
  }
);

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  limits: {
    maxStudents: number;
    maxTeachers: number;
    maxAdmins: number;
  };
}

export interface SubscriptionStatus {
  hasSubscription: boolean;
  subscription?: {
    id: string;
    status: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    planName: string;
    isYearly: boolean;
    amount: number;
    currency: string;
  };
}

// API wrapper functions for subscription management
export class SubscriptionAPI {
  // Get available subscription plans (PUBLIC - no auth required)
  async getPlans(): Promise<SubscriptionPlan[]> {
    // Use fetch for public endpoints (no auth needed)
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subscriptions/plans`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  }

  // Create checkout session (pode ser usado sem auth para novos signups)
  async createCheckoutSession(
    planId: string, 
    isYearly: boolean, 
    tenantSubdomain: string,
    customerData?: {
      email: string;
      name: string;
    }
  ): Promise<string> {
    const requestData = {
      planId,
      isYearly,
      tenantSubdomain,
      ...(customerData && {
        customerEmail: customerData.email,
        customerName: customerData.name
      })
    };

    // Para novos signups, usar fetch sem auth
    if (customerData) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subscriptions/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data?.sessionUrl;
    }

    // Para usuários autenticados, usar axios com interceptor
    const response = await subscriptionsApi.post('/api/subscriptions/create-checkout', requestData);
    return response.data.data?.sessionUrl;
  }

  // Get subscription status
  async getSubscriptionStatus(tenantSubdomain: string): Promise<SubscriptionStatus> {
    const response = await subscriptionsApi.get(`/api/subscriptions/${tenantSubdomain}/status`);
    return response.data.data;
  }

  // Cancel subscription
  async cancelSubscription(tenantSubdomain: string, immediately = false): Promise<void> {
    await subscriptionsApi.post(`/api/subscriptions/${tenantSubdomain}/cancel`, {
      immediately,
    });
  }

  // Create customer portal session
  async createPortalSession(tenantSubdomain: string, returnUrl?: string): Promise<string> {
    const response = await subscriptionsApi.post(`/api/subscriptions/${tenantSubdomain}/portal`, {
      returnUrl,
    });

    return response.data.data?.portalUrl;
  }
}

// Create a singleton instance
export const subscriptionAPI = new SubscriptionAPI();

// Helper functions
export function formatCurrency(amount: number, currency = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency,
  }).format(amount / 100);
}

// Query keys for consistent cache management
export const subscriptionKeys = {
  all: ['subscriptions'] as const,
  plans: () => [...subscriptionKeys.all, 'plans'] as const,
  status: (tenantSubdomain: string) => [...subscriptionKeys.all, 'status', tenantSubdomain] as const,
};

// Hook para buscar planos (PÚBLICO - sem necessidade de autenticação)
export function useSubscriptionPlans() {
  return useQuery({
    queryKey: subscriptionKeys.plans(),
    queryFn: () => subscriptionAPI.getPlans(),
    staleTime: 10 * 60 * 1000, // 10 minutes - plans don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

// Hook para status da subscription (requer autenticação)
export function useSubscriptionStatus(tenantSubdomain?: string) {
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: subscriptionKeys.status(tenantSubdomain || ''),
    queryFn: async () => {
      if (!session?.accessToken) {
        throw new Error('No access token available');
      }
      return subscriptionAPI.getSubscriptionStatus(tenantSubdomain!);
    },
    enabled: !!(tenantSubdomain && session?.accessToken && status === 'authenticated'),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

// Hook para criar checkout (funciona com e sem auth)
export function useCreateCheckout() {
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async ({ 
      planId, 
      isYearly, 
      tenantSubdomain,
      customerData 
    }: {
      planId: string;
      isYearly: boolean;
      tenantSubdomain: string;
      customerData?: {
        email: string;
        name: string;
      };
    }) => {
      // Para novos signups (sem auth), passa customerData
      // Para usuários existentes (com auth), não precisa
      if (customerData) {
        // Novo signup - não precisa de auth
        const checkoutUrl = await subscriptionAPI.createCheckoutSession(
          planId, 
          isYearly, 
          tenantSubdomain, 
          customerData
        );
        window.location.href = checkoutUrl;
        return checkoutUrl;
      }
      
      // Usuário existente - precisa de auth
      if (!session?.accessToken) {
        throw new Error('Authentication required for existing users');
      }
      
      const checkoutUrl = await subscriptionAPI.createCheckoutSession(planId, isYearly, tenantSubdomain);
      window.location.href = checkoutUrl;
      return checkoutUrl;
    },
    onError: (error) => {
      console.error('Error creating checkout:', error);
    },
  });
}

// Hook para cancelar subscription
export function useCancelSubscription() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      tenantSubdomain, 
      immediately = false 
    }: {
      tenantSubdomain: string;
      immediately?: boolean;
    }) => {
      if (!session?.accessToken) {
        throw new Error('Authentication required');
      }
      
      await subscriptionAPI.cancelSubscription(tenantSubdomain, immediately);
      return tenantSubdomain;
    },
    onSuccess: (tenantSubdomain) => {
      // Invalidate subscription status
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.status(tenantSubdomain),
      });
    },
    onError: (error) => {
      console.error('Error cancelling subscription:', error);
    },
  });
}

// Hook para abrir customer portal
export function useCustomerPortal() {
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async ({ 
      tenantSubdomain, 
      returnUrl 
    }: {
      tenantSubdomain: string;
      returnUrl?: string;
    }) => {
      if (!session?.accessToken) {
        throw new Error('Authentication required');
      }
      
      const portalUrl = await subscriptionAPI.createPortalSession(tenantSubdomain, returnUrl);
      
      // Redirect to portal
      window.location.href = portalUrl;
      return portalUrl;
    },
    onError: (error) => {
      console.error('Error opening customer portal:', error);
    },
  });
}

export default subscriptionAPI;