import axios from 'axios';
import { getSession } from 'next-auth/react';
import { getTenantHeaders } from './tenant';

const API_BASE_URL =
  `${process.env.NEXT_PUBLIC_API_URL}/admin` || 'http://localhost:5000/admin';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Timeout de 10 segundos
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

// Interceptor para adicionar o token e headers de tenant automaticamente
api.interceptors.request.use(
  async (config) => {
    const token = await fetchToken();
    const tenantHeaders = await getTenantHeaders();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Adicionar headers de tenant
    if (tenantHeaders && config.headers) {
      Object.assign(config.headers, tenantHeaders);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas ou erros globais
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

export default api;
