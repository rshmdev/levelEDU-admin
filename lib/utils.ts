import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const protocol =
  process.env.NODE_ENV === 'production' ? 'https' : 'http';
export const rootDomain = (() => {
  if (process.env.NODE_ENV === 'production') {
    // Usar o novo domínio customizado em produção
    return process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'leveledu.com.br';
  } else {
    // Em desenvolvimento, usar lvh.me com porta
    return process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'lvh.me:3000';
  }
})();
  
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
