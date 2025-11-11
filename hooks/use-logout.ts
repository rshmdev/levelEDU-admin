'use client';

import { signOut } from 'next-auth/react';

export function useLogout() {
  const logout = async () => {
    try {
      // Clear any local storage or session storage first
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
        
        // Clear all cookies for this domain and parent domain
        document.cookie.split(";").forEach(function(c) { 
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/;domain=" + window.location.hostname);
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/;domain=." + window.location.hostname.split('.').slice(-2).join('.'));
        });
      }

      // Call backend logout endpoint if available
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.log('Backend logout failed, continuing with client logout:', error);
      }

      // Sign out with NextAuth
      await signOut({
        callbackUrl: process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'https://leveledu.com.br',
        redirect: false
      });

      // Force redirect to root domain after logout
      if (typeof window !== 'undefined') {
        window.location.href = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'https://leveledu.com.br';
      }
    } catch (error) {
      console.error('Error during logout:', error);
      // Force redirect even if logout fails
      if (typeof window !== 'undefined') {
        window.location.href = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'https://leveledu.com.br';
      }
    }
  };

  return { logout };
}