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
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { Edit, Loader2, School, Trophy } from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Mission } from'@/types/mission';
import { editMission } from '@/app/s/[subdomain]/missions/actions';
import { getClasses } from '@/app/s/[subdomain]/classes/actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'O nome deve ter pelo menos 2 caracteres.'
  }),
  description: z.string().min(10, {
    message: 'A descrição deve ter pelo menos 10 caracteres.'
  }),
  coins: z.number().min(0, {
    message: 'O preço deve ser positivo.'
  }),
    classId: z.string({
      message: 'A turma é obrigatória'
    })
});

export function EditMission({ mission }: { mission: Mission }) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: mission?.title || '',
      description: mission?.description || '',
      coins: mission?.coins || 0,
      classId: mission?.classId?._id || ''
    }
  });

  const queryClient = useQueryClient();

  const { mutateAsync, isPending: isLoading } = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) =>
      editMission(data, mission._id),
    onSuccess: (data) => {
      toast({
        title: data.message
      });
      queryClient.invalidateQueries({
        queryKey: ['missions']
      });
      setOpen(false);
    },
    onError: (error: any) => {
      const apiErrorMessage = error?.response?.data?.message;

      toast({
        title: 'Erro ao editar missão',
        description: apiErrorMessage,
        variant: 'destructive'
      });
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await mutateAsync(values);
  }

  const { data: classes } = useQuery({
    queryFn: getClasses,
    queryKey: ['mission-class'],
    enabled: open
  });


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Edit className="h-4 w-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar missão</DialogTitle>
          <DialogDescription>
            Faça as alterações necessárias na missão. Clique em salvar quando
            terminar.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Não dormir na aula" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva os objetivos e regras da missão..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
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
            <FormField
              control={form.control}
              name="coins"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prêmio (COINS)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Trophy className="absolute left-3 top-2.5 h-4 w-4 text-yellow-500" />
                      <Input
                        type="number"
                        placeholder="100"
                        className="pl-9"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-3 pt-4">
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
                    Salvando...
                  </>
                ) : (
                  'Salvar'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
