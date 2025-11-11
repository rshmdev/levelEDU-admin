'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { LogOut } from 'lucide-react';
import { useLogout } from '@/hooks/use-logout';

export function SignoutButton() {
  const { logout } = useLogout();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          onClick={logout}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 cursor-pointer"
        >
          <LogOut className="size-5" />
        </div>
      </TooltipTrigger>
      <TooltipContent side="right">Sair</TooltipContent>
    </Tooltip>
  );
}

export function SignoutButtonMobile() {
  const { logout } = useLogout();

  return (
    <span
      onClick={logout}
      className="flex items-center gap-4 px-2.5 transition-colors text-muted-foreground hover:text-foreground text-lg font-semibold cursor-pointer"
    >
      <LogOut className="size-5" />
      Sair
    </span>
  );
}
