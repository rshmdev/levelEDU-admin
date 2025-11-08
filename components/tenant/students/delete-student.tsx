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
import { removeStudent } from '@/app/s/[subdomain]/students/actions';
import { AlertCircle, Loader2, RefreshCw, Trash, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Student } from'@/types/student';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function DeleteStudent({ student }: { student: Student }) {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => removeStudent(student._id),
    onSuccess: () => {
      toast({
        title: `${student?.name} removido com sucesso`,
        description: 'O Aluno foi removido com sucesso.'
      });
      queryClient.invalidateQueries({
        queryKey: ['students']
      });
      setOpen(false);
    },
    onError: () => {
      toast({
        title: 'Erro ao remover aluno',
        description: 'Ocorreu um erro ao tentar remover o aluno.',
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
          <AlertDialogTitle className="flex items-center gap-2 text-xl text-red-500">
            <Trash2 className="h-5 w-5" />
            Excluir Aluno
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente o
            aluno e todos os seus dados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-6">
          <div className="flex items-center gap-4 rounded-lg border p-4">
            <div className="flex-1">
              <h3 className="font-semibold">{student.name}</h3>
              <Badge variant="outline" className="mt-1">
                {student?.class?.code} - {student?.class?.name}
              </Badge>
            </div>
          </div>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Atenção</AlertTitle>
          <AlertDescription>
            Ao excluir este aluno, você também removerá:
            <ul className="ml-4 mt-2 list-disc">
              <li>Histórico de atitudes</li>
              <li>Coins e XP acumulados</li>
              <li>Missões atribuídas</li>
              <li>Dados de progresso</li>
            </ul>
          </AlertDescription>
        </Alert>
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isPending}
            onClick={() => remove()}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Excluindo...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir Aluno
              </>
            )}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
