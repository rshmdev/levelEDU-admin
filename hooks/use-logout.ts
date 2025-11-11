'use client';

import { signOut } from 'next-auth/react';

export function useLogout() {
  const logout = async () => {
    try {
      console.log('Starting logout process...');
      
      // Clear any local storage or session storage first
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
        console.log('Cleared localStorage and sessionStorage');
        
        // Get current hostname to determine domain for cookies
        const hostname = window.location.hostname;
        const isSubdomain = hostname.includes('.leveledu.com.br') && hostname !== 'leveledu.com.br';
        
        // Clear cookies more specifically
        const cookieNames = [
          'next-auth.session-token', 
          '__Secure-next-auth.session-token',
          'next-auth.csrf-token',
          '__Host-next-auth.csrf-token',
          'next-auth.callback-url'
        ];
        
        // Clear for current domain and parent domain
        cookieNames.forEach(name => {
          // Clear for current domain
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname};`;
          
          if (isSubdomain) {
            // Clear for parent domain
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.leveledu.com.br;`;
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=leveledu.com.br;`;
          }
        });
        
        console.log('Cleared authentication cookies');
      }

      // Sign out with NextAuth (without redirect to prevent URL concatenation)
      console.log('Calling NextAuth signOut...');
      await signOut({
        redirect: false
      });

      // Small delay to ensure signOut completes
      await new Promise(resolve => setTimeout(resolve, 100));

      // Force redirect to root domain
      console.log('Redirecting to root domain...');
      if (typeof window !== 'undefined') {
        window.location.href = 'https://leveledu.com.br';
      }
    } catch (error) {
      console.error('Error during logout:', error);
      // Force redirect even if logout fails
      if (typeof window !== 'undefined') {
        console.log('Forcing redirect after error...');
        window.location.href = 'https://leveledu.com.br';
      }
    }
  };

  return { logout };
}