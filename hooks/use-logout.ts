'use client';

import { signOut } from 'next-auth/react';

export function useLogout() {
  const logout = async () => {
    try {
      console.log('Starting logout process...');
      
      // Get root domain from environment variable (declare once at function level)
      const rootDomainWithPort = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'leveledu.com.br';
      const rootDomain = rootDomainWithPort.replace(/:\d+$/, ''); // Remove port if present
      
      // Clear any local storage or session storage first
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
        console.log('Cleared localStorage and sessionStorage');
        
        // Get current hostname to determine domain for cookies
        const hostname = window.location.hostname;
        const isSubdomain = hostname.includes(`.${rootDomain}`) && hostname !== rootDomain;
        
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
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${rootDomain};`;
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${rootDomain};`;
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
        const protocol = window.location.protocol;
        const redirectUrl = rootDomainWithPort.startsWith('http') 
          ? rootDomainWithPort 
          : `${protocol}//${rootDomainWithPort}`;
        window.location.href = redirectUrl;
      }
    } catch (error) {
      console.error('Error during logout:', error);
      // Force redirect even if logout fails
      if (typeof window !== 'undefined') {
        console.log('Forcing redirect after error...');
        const rootDomainWithPort = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'leveledu.com.br';
        const protocol = window.location.protocol;
        const redirectUrl = rootDomainWithPort.startsWith('http') 
          ? rootDomainWithPort 
          : `${protocol}//${rootDomainWithPort}`;
        window.location.href = redirectUrl;
      }
    }
  };

  return { logout };
}