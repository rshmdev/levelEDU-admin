'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { Edit, Loader2, School, User } from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Student } from'@/types/student';
import { editStudent } from '@/app/s/[subdomain]/students/actions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { getClasses } from '@/app/s/[subdomain]/classes/actions';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'O nome deve ter pelo menos 2 caracteres.'
  }),
  classId: z.string({
    message: 'A Sala do aluno é obrigatória'
  })
});

export function EditStudent({ student }: { student: Student }) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: student.name || '',
      classId: student?.class?._id || ''
    }
  });

  const queryClient = useQueryClient();

  const { data: classes } = useQuery({
    queryFn: getClasses,
    queryKey: ['user-class'],
    enabled: open
  });

  const { mutateAsync, isPending: isLoading } = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) =>
      editStudent(data, student._id),
    onSuccess: (data) => {
      toast({
        title: data.message
      });
      queryClient.invalidateQueries({
        queryKey: ['students']
      });
      setOpen(false);
      form.reset()
    },
    onError: (error: any) => {
      const apiErrorMessage = error?.response?.data?.message;

      toast({
        title: 'Erro ao editar aluno',
        description: apiErrorMessage,
        variant: 'destructive'
      });
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await mutateAsync(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Edit className="h-4 w-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <User className="h-5 w-5" />
            Editar Aluno
          </DialogTitle>
          <DialogDescription>
            Atualize os dados do aluno. Faça as alterações necessárias nos
            campos abaixo.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="João da Silva"
                        className="pl-9"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>Nome completo do aluno.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="classId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Turma</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="pl-9 relative">
                        <School className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Selecione uma turma" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {classes?.map((classItem) => (
                        <SelectItem key={classItem._id} value={classItem._id}>
                          {classItem.code} - {classItem.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Turma em que o aluno será matriculado.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Atualizando...
                  </>
                ) : (
                  'Salvar Alterações'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
