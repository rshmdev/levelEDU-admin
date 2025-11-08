import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from '@/components/ui/alert-dialog';
  import { toast } from '@/hooks/use-toast';
  import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeClass } from '@/app/s/[subdomain]/classes/actions';
  import { RefreshCw, Trash } from 'lucide-react';
  import { useState } from 'react';
import { Class } from'@/types/classes';
  
  export function DeleteClass({ classItem }: { classItem: Class }) {
    const [open, setOpen] = useState(false);
  
    const queryClient = useQueryClient();
  
    const { mutateAsync, isPending } = useMutation({
      mutationFn: () => removeClass(classItem._id),
      onSuccess: () => {
        toast({
          title: 'Sala removida com sucesso',
          description: 'A sala foi deletada.',
        });
        queryClient.invalidateQueries({ queryKey: ['classes'] });
        setOpen(false);
      },
      onError: () => {
        toast({
          title: 'Erro ao remover sala',
          description: 'Não foi possível deletar a sala.',
          variant: 'destructive',
        });
      },
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
            <AlertDialogTitle>Deletar Sala?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não poderá ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction disabled={isPending} onClick={() => remove()}>
              {isPending && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
              Sim
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  
