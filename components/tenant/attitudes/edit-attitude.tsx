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
import {
  Loader2,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Trophy,
  Edit,
  School
} from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Attitude } from'@/types/attitude';
import { editAttitude } from '@/app/s/[subdomain]/attitudes/actions';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getClasses } from '@/app/s/[subdomain]/classes/actions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'O titulo deve ter pelo menos 2 caracteres.'
  }),
  description: z.string().min(10, {
    message: 'A descrição deve ter pelo menos 5 caracteres.'
  }),
  isPositive: z.boolean(),
  coins: z.number().min(0, 'Coins não podem ser negativos.'),
  classId: z.string().min(1, 'Turma é obrigatória.'),
  xp: z.number().min(0, 'XP não pode ser negativo.')
});

export function EditAttitude({ attitude }: { attitude: Attitude }) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: attitude.title,
      description: attitude.description,
      classId: attitude.classId?._id,
      isPositive: attitude.isPositive,
      coins: attitude.coins,
      xp: attitude.xp
    }
  });

  const queryClient = useQueryClient();

  const watchIsPositive = form.watch('isPositive');

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) =>
      editAttitude(data, attitude._id),
    onSuccess: (data) => {
      toast({
        title: data.message
      });
      queryClient.invalidateQueries({
        queryKey: ['attitudes']
      });
      setOpen(false);
    },
    onError: (error: any) => {
      const apiErrorMessage = error?.response?.data?.message;

      toast({
        title: 'Erro ao atualizar atitude',
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
    queryKey: ['attitudes-class'],
    enabled: open
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Edit className="h-4 w-4 cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {watchIsPositive ? (
              <ThumbsUp className="h-5 w-5 text-green-500" />
            ) : (
              <ThumbsDown className="h-5 w-5 text-red-500" />
            )}
            Editar Atitude
          </DialogTitle>
          <DialogDescription>
            Edite os detalhes da atitude registrada.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPositive"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Atitude</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        {field.value ? (
                          <Badge variant="default" className="bg-green-500">
                            <ThumbsUp className="mr-1 h-3 w-3" />
                            Positiva
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <ThumbsDown className="mr-1 h-3 w-3" />
                            Negativa
                          </Badge>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea className="resize-none" {...field} />
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

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="coins"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>COINS</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Trophy className="absolute left-3 top-2.5 h-4 w-4 text-yellow-500" />
                        <Input
                          type="number"
                          className="pl-9"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="xp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>XP</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Sparkles className="absolute left-3 top-2.5 h-4 w-4 text-purple-500" />
                        <Input
                          type="number"
                          className="pl-9"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                  
                    <div>
                      <p className="font-medium">{attitude.userId.name}</p>
                      <p className="text-sm text-muted-foreground">Aluno</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span className={!watchIsPositive ? "text-red-500" : "text-green-500"}>
                        {!watchIsPositive ? "-" : "+"}
                        {watchCoins} COINS
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Sparkles className="h-4 w-4 text-purple-500" />
                      <span className={!watchIsPositive ? "text-red-500" : "text-green-500"}>
                        {!watchIsPositive ? "-" : "+"}
                        {watchXP} XP
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card> */}

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
                type="submit"
                disabled={isPending}
                className={
                  watchIsPositive
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Atualizando...
                  </>
                ) : (
                  <>
                    {watchIsPositive ? (
                      <ThumbsUp className="mr-2 h-4 w-4" />
                    ) : (
                      <ThumbsDown className="mr-2 h-4 w-4" />
                    )}
                    Atualizar Atitude
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
