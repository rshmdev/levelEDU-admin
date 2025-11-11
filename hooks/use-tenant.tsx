'use client';

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import axios from 'axios';

interface TenantBranding {
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  favicon?: string;
  customCSS?: string;
}

interface TenantSettings {
  timezone: string;
  language: string;
  currency: string;
  dateFormat: string;
}

interface TenantPlan {
  type: 'trial' | 'starter' | 'professional' | 'growth';
  limits: {
    maxUsers: number;
    maxClasses: number;
    maxMissions: number;
    maxStorage: number;
    customBranding: boolean;
    apiAccess: boolean;
    customDomain: boolean;
  };
}

interface Tenant {
  _id: string;
  name: string;
  subdomain: string;
  branding: TenantBranding;
  settings: TenantSettings;
  plan: TenantPlan;
  metadata?: {
    onboardingCompleted?: boolean;
  };
}

interface TenantContextType {
  tenant: Tenant | null;
  loading: boolean;
  error: string | null;
  refreshTenant: () => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

// Query keys
const tenantKeys = {
  all: ['tenant'] as const,
  detail: (subdomain: string) => [...tenantKeys.all, subdomain] as const,
};

// Helper function to extract subdomain from URL
function getSubdomainFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  
  const hostname = window.location.hostname;
  
  // Local development
  if (hostname.includes('localhost')) {
    // demo.localhost:3000 -> demo
    if (hostname !== 'localhost') {
      return hostname.split('.')[0];
    }
    return null;
  }
  
  // Production - assumindo que o domínio root é conhecido
  // exemplo.com.br -> null
  // demo.exemplo.com.br -> demo
  const parts = hostname.split('.');
  if (parts.length > 2) {
    return parts[0];
  }
  
  return null;
}

// Helper function to get tenant metadata
function getTenantMetadata() {
  if (typeof window === 'undefined') return null;
  
  const subdomain = getSubdomainFromUrl();
  
  if (!subdomain) {
    return null;
  }

  return {
    subdomain,
    // Removemos a dependência das meta tags
    // Os dados serão buscados diretamente da API
  };
}

// API function to fetch tenant data
async function fetchTenantData(subdomain: string): Promise<{ data: Tenant, success: boolean }> {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/tenants/public/${subdomain}`);
  
  if (!response.data) {
    throw new Error('Erro ao carregar dados da organização');
  }

  return response.data;
}

interface TenantProviderProps {
  children: ReactNode;
}

export function TenantProvider({ children }: TenantProviderProps) {
  const [mounted, setMounted] = useState(false);
  const queryClient = useQueryClient();
  const metadata = getTenantMetadata();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Query for tenant data
  const tenantQuery = useQuery({
    queryKey: tenantKeys.detail(metadata?.subdomain || ''),
    queryFn: () => fetchTenantData(metadata!.subdomain),
    enabled: mounted && !!metadata?.subdomain,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });

  const refreshTenant = () => {
    if (metadata?.subdomain) {
      queryClient.invalidateQueries({
        queryKey: tenantKeys.detail(metadata.subdomain),
      });
    }
  };

  // Apply tenant branding to DOM
//   useEffect(() => {
//     const tenant = tenantQuery?.data?.data;
//     if (!tenant?.branding) return;

//     const root = document.documentElement;
//     let customStyleElement: HTMLStyleElement | null = null;
//     const originalTitle = document.title;
//     const faviconElement = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
//     const originalFavicon = faviconElement?.href || '';

//     // Apply CSS variables
//     root.style.setProperty('--primary', tenant.branding.primaryColor);
//     root.style.setProperty('--secondary', tenant.branding.secondaryColor);
//     root.style.setProperty('--accent', tenant.branding.accentColor);
//     root.style.setProperty('--background', tenant.branding.backgroundColor);
//     root.style.setProperty('--foreground', tenant.branding.textColor);

//     // Apply custom CSS
//     if (tenant.branding.customCSS) {
//       customStyleElement = document.createElement('style');
//       customStyleElement.id = 'tenant-custom-css';
//       customStyleElement.textContent = tenant.branding.customCSS;
//       document.head.appendChild(customStyleElement);
//     }

//     // Apply favicon
//     if (tenant.branding.favicon && faviconElement) {
//       faviconElement.href = tenant.branding.favicon;
//     }

//     // Update page title
//     document.title = `${tenant.name} - Admin`;

//     // Cleanup function
//     return () => {
//       // Remove custom CSS
//       if (customStyleElement?.parentNode) {
//         customStyleElement.parentNode.removeChild(customStyleElement);
//       }

//       // Restore original values
//       document.title = originalTitle;
//       if (faviconElement && originalFavicon) {
//         faviconElement.href = originalFavicon;
//       }

//       // Remove custom CSS variables
//       root.style.removeProperty('--primary');
//       root.style.removeProperty('--secondary');
//       root.style.removeProperty('--accent');
//       root.style.removeProperty('--background');
//       root.style.removeProperty('--foreground');
//     };
//   }, [tenantQuery.status]);

  const contextValue: TenantContextType = {
    tenant: mounted ? (tenantQuery.data?.data || null) : null,
    loading: !mounted || tenantQuery.isLoading,
    error: tenantQuery.error?.message || null,
    refreshTenant,
  };

  return (
    <TenantContext.Provider value={contextValue}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  
  return context;
}

// Separate hook for tenant data using React Query directly
export function useTenantData(subdomain?: string) {
  const metadata = getTenantMetadata();
  const targetSubdomain = subdomain || metadata?.subdomain;
  
  return useQuery({
    queryKey: tenantKeys.detail(targetSubdomain || ''),
    queryFn: () => fetchTenantData(targetSubdomain!),
    enabled: !!targetSubdomain,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
}

// Hook para verificar permissões baseadas no plano
export function useTenantPermissions() {
  const { tenant } = useTenant();
  
  const hasFeature = (feature: keyof TenantPlan['limits']) => {
    return tenant?.plan.limits[feature] === true;
  };
  
  const getLimit = (resource: keyof Pick<TenantPlan['limits'], 'maxUsers' | 'maxClasses' | 'maxMissions' | 'maxStorage'>) => {
    return tenant?.plan.limits[resource] || 0;
  };
  
  const isUnlimited = (resource: keyof Pick<TenantPlan['limits'], 'maxUsers' | 'maxClasses' | 'maxMissions' | 'maxStorage'>) => {
    return getLimit(resource) === -1;
  };
  
  return {
    hasCustomBranding: hasFeature('customBranding'),
    hasApiAccess: hasFeature('apiAccess'),
    hasCustomDomain: hasFeature('customDomain'),
    getLimit,
    isUnlimited,
    planType: tenant?.plan.type,
  };
}

// Hook for tenant branding only
export function useTenantBranding() {
  const { tenant } = useTenant();
  return tenant?.branding || null;
}