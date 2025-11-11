"use client"

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { USER_ROLES } from "@/config/api";
import { protocol, rootDomain } from "@/lib/utils";

export function AuthRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Ainda carregando

    if (session?.user) {
      if (session.user.role === USER_ROLES.SUPER_ADMIN) {
        // Super admin vai para /admin
        router.push('/admin');
      } else if (session.user.tenantSubdomain) {
        // Tenant admin vai para o subdomínio
        const tenantUrl = `${protocol}://${session.user.tenantSubdomain}.${rootDomain}`;
        window.location.href = tenantUrl;
      }
    }
  }, [session, status, router]);

  // Este componente não renderiza nada
  return null;
}