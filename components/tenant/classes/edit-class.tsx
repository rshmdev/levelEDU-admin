'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { Edit } from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { editClass } from '@/app/s/[subdomain]/classes/actions';
import { Class } from'@/types/classes';

const formSchema = z.object({
  code: z.string().min(1, { message: 'O código é obrigatório.' }),
  name: z
    .string()
    .min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' })
});

export function EditClass({ classItem }: { classItem: Class }) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: classItem.code,
      name: classItem.name
    }
  });

  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) =>
      editClass(data, classItem._id),
    onSuccess: (data) => {
      toast({
        title: data.message
      });
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      setOpen(false);
    },
    onError: (error: any) => {
      const apiErrorMessage = error?.response?.data?.message;

      toast({
        title: 'Erro ao atualizar sala',
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
        <Edit className="h-4 w-4 cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl w-full">
        <DialogHeader>
          <DialogTitle>Editar Sala</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código</FormLabel>
                  <FormControl>
                    <Input placeholder="Código da sala" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da sala" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end">
              <Button type="submit">Editar Sala</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
