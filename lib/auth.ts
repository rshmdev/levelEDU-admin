import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { API_CONFIG, SECURITY_CONFIG } from '@/config/api';

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN?.replace(/^https?:\/\//, '').split(':')[0] || 'lvh.me';
const IS_PROD = process.env.NODE_ENV === 'production'

const getCookieDomain = () => {
  if (IS_PROD) {
    // Para produção, usar .leveledu.com.br para compartilhar cookies entre subdomínios
    return `.${ROOT_DOMAIN}`;
  } else {
    // Para desenvolvimento local, usar .lvh.me que funciona com subdomínios
    const domain = '.lvh.me';
    console.log('Cookie domain configurado para:', domain);
    return domain;
  }
};

// em prod: cookies __Secure-* e secure: true
const cookieBase = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
  secure: IS_PROD,
  domain: getCookieDomain(),
} as const

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: IS_PROD ? false : true, // Debug apenas em desenvolvimento
  trustHost: true,
  useSecureCookies: IS_PROD,
  secret: process.env.NEXTAUTH_SECRET, // Garantir que o secret está definido
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'seu@email.com'
        },
        password: { 
          label: 'Password', 
          type: 'password' 
        },
        subdomain: {
          label: 'Subdomain',
          type: 'text',
          placeholder: 'escola (opcional para super admin)'
        }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email e senha são obrigatórios');
        }

        try {
          // For super admin login, we use a different endpoint
          const loginUrl = `${API_CONFIG.baseUrl}/admin/auth/login`;

          const requestBody: any = {
            email: credentials.email,
            password: credentials.password,
          };

          const response = await fetch(loginUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Credenciais inválidas');
          }

          const userData = await response.json();

          // Validate user data structure
          if (!userData.user || !userData.accessToken) {
            throw new Error('Resposta inválida do servidor');
          }

          const user = userData.user;

          return {
            id: user.id || user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            tenantId: user.tenantId,
            tenantSubdomain: user.tenantSubdomain || credentials.subdomain,
            tenantName: user.tenantName,
            accessToken: userData.accessToken,
            refreshToken: userData.refreshToken,
          };
        } catch (error: any) {
          console.error('Authentication error:', error);
          throw new Error(error.message || 'Erro durante a autenticação');
        }
      }
    })
  ],
  cookies: {
    sessionToken: {
      name: IS_PROD ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        ...cookieBase,
        // Usar o domain configurado para compartilhar entre subdomínios
        domain: cookieBase.domain,
      },
    },
    callbackUrl: {
      name: IS_PROD ? '__Secure-next-auth.callback-url' : 'next-auth.callback-url',
      options: {
        ...cookieBase,
        domain: cookieBase.domain,
      },
    },
    csrfToken: {
      name: 'next-auth.csrf-token', // Usar nome padrão para evitar problemas
      options: {
        ...cookieBase,
        domain: cookieBase.domain,
        path: '/',
      },
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: SECURITY_CONFIG.session.maxAge,
    updateAge: SECURITY_CONFIG.session.updateAge,
  },
  pages: {
    signIn: '/login',
    error: '/login',
    signOut: '/' // Redirect to root domain after sign out
  },
  callbacks: {
    async jwt({ token, user, account }): Promise<JWT> {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          id: user.id as string,
          email: user.email as string,
          name: user.name as string,
          role: user.role,
          tenantId: user.tenantId,
          tenantSubdomain: user.tenantSubdomain,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
        } as JWT;
      }

      // Simplesmente retorna o token existente sem verificar expiração
      return token;
    },
    async session({ session, token }) {      
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          email: token.email,
          name: token.name,
          role: token.role,
          tenantId: token.tenantId,
          tenantSubdomain: token.tenantSubdomain,
        },
        accessToken: token.accessToken,
      };
    },
    async signIn({ user }) {
      // Additional security checks could be added here
      return true;
    },
    async redirect({ url, baseUrl }) {
      console.log('NextAuth redirect called:', { url, baseUrl });
      
      // Se estamos fazendo logout ou signout, sempre redirecionar para o domínio raiz
      if (url.includes('signout') || url.includes('logout')) {
        console.log('Logout detected, redirecting to root domain');
        const rootDomainWithPort = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'leveledu.com.br';
        const protocol = typeof window !== 'undefined' ? window.location.protocol : 'https:';
        const redirectUrl = rootDomainWithPort.startsWith('http') 
          ? rootDomainWithPort 
          : `${protocol}//${rootDomainWithPort}`;
        return redirectUrl;
      }
      
      // Se a URL já é absoluta e válida, usar ela
      if (url.startsWith('http')) {
        return url;
      }
      
      // Se estamos fazendo login, redirecionar para o subdomínio correto
      if (url === baseUrl || url === `${baseUrl}/`) {
        return baseUrl;
      }
      
      // Allow any valid URL that starts with our base URL
      if (url.startsWith(baseUrl)) return url;
      
      // Allow relative URLs
      if (url.startsWith('/')) return baseUrl + url;
      
      // Default redirect to base URL
      return baseUrl;
    },
  },
  events: {
    async signOut(message) {
      // Invalidate session on the server
      try {
        if ('token' in message && message.token?.accessToken) {
          await fetch(`${API_CONFIG.baseUrl}/auth/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${message.token.accessToken}`,
            },
          });
        }
      } catch (error) {
        console.error('Error during logout:', error);
      }
    },
  }
});