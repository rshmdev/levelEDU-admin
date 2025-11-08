import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { UserRole } from '@/config/api';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
      tenantId?: string;
      tenantSubdomain?: string;
      tenantName?: string;
    } & DefaultSession['user'];
    accessToken: string;
    error?: string;
  }

  interface User extends DefaultUser {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    tenantId?: string;
    tenantSubdomain?: string;
    accessToken: string;
    refreshToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    tenantId?: string;
    tenantSubdomain?: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    error?: string;
  }
}