import { auth } from '@/lib/auth';
import { getSession } from 'next-auth/react';

// Configuração para isolamento de tenant
export const TENANT_HEADERS = {
  TENANT_ID: 'X-Tenant-ID',
  TENANT_SUBDOMAIN: 'X-Tenant-Subdomain',
} as const;

// Função para obter headers de tenant baseados na sessão
export async function getTenantHeaders() {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return {};
    }

    const headers: Record<string, string> = {};

    // Para usuários que não são super admin, adicionar headers de tenant
    if (session.user.role !== 'super_admin') {
      if (session.user.tenantId) {
        headers[TENANT_HEADERS.TENANT_ID] = session.user.tenantId;
      }
      if (session.user.tenantSubdomain) {
        headers[TENANT_HEADERS.TENANT_SUBDOMAIN] = session.user.tenantSubdomain;
      }
    }

    return headers;
  } catch (error) {
    console.error('Erro ao obter headers de tenant:', error);
    return {};
  }
}

// Função wrapper para fetch que adiciona automaticamente os headers de tenant
export async function tenantAwareFetch(url: string, options: RequestInit = {}) {
  const tenantHeaders = await getTenantHeaders();
  
  const headers = {
    'Content-Type': 'application/json',
    ...tenantHeaders,
    ...options.headers,
  };

  return fetch(url, {
    ...options,
    headers,
  });
}

// Hook para usar em componentes do lado do cliente
export function useTenantHeaders() {
  return getTenantHeaders();
}