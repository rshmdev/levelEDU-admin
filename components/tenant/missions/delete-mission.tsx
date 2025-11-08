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
import { removeMission } from '@/app/s/[subdomain]/missions/actions';
import { RefreshCw, Trash } from 'lucide-react';
import { useState } from 'react';
import { Mission } from'@/types/mission';

export function DeleteMission({ mission }: { mission: Mission }) {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => removeMission(mission._id),
    onSuccess: () => {
      toast({
        title: `${mission?.title} removido com sucesso`,
        description: 'A missão foi removido com sucesso.'
      });
      queryClient.invalidateQueries({
        queryKey: ['missions']
      });
      setOpen(false);
    },
    onError: () => {
      toast({
        title: 'Erro ao remover missão',
        description: 'Ocorreu um erro ao tentar remover a missão.',
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
        <Trash className="h-4 w-4" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deseja deletar essa missão ?</AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não poderá ser revertida
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={() => remove()}>
            {isPending && <RefreshCw className="size-4 mr-2" />}
            Sim
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
