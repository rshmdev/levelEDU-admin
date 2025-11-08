import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, RefreshCw, Trash, User } from 'lucide-react';
import { useState } from 'react';
import { AdminUser } from'@/types/adminUser';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getRoleName } from './admin-user-row';
import { removeAdminUser } from '@/app/s/[subdomain]/adminUsers/actions';

export function DeleteAdminUser({ adminUser }: { adminUser: AdminUser }) {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => removeAdminUser(adminUser._id),
    onSuccess: (data) => {
      toast({
        title: data.message
      });
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      setOpen(false);
    },
    onError: (error: any) => {
      const apiErrorMessage = error?.response?.data?.message;

      toast({
        title: 'Erro ao remover professor',
        description: apiErrorMessage,
        variant: 'destructive'
      });
    }
  });

  const remove = async () => {
    await mutateAsync();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Trash className="h-4 w-4 cursor-pointer" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deletar usuário?</AlertDialogTitle>
          <AlertDialogDescription>
            Verifique os detalhes abaixo antes remover o usuário.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <User className="h-4 w-4" />
            Detalhes do usuário
          </h4>
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3 flex items-center justify-between">
                <div>
                  <p className="font-medium">{adminUser.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {adminUser.email}
                  </p>
                  
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {getRoleName(adminUser.role)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={() => remove()}
            className="bg-red-600 hover:bg-red-700"
          >
            {isPending ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Removendo...
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4 mr-2" />
                Confirmar remoção
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
