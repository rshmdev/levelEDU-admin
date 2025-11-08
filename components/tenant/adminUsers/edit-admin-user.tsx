'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
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
  Building2,
  Edit,
  Loader2,
  Lock,
  Mail,
  UserPlus,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminUser } from'@/types/adminUser';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';
import { Label } from '@/components/ui/label';
import { editAdminUser } from '@/app/s/[subdomain]/adminUsers/actions';
import { getClasses } from '@/app/s/[subdomain]/classes/actions';
import { PasswordField } from '@/components/shared/password-input';

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
  email: z.string().email({ message: 'Insira um email válido.' }),
  role: z.string({
    message: 'Selecione um cargo válido.'
  }),
  password: z
    .string()
    .min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
  classrooms: z.array(z.string(), {
    message: 'Escolha uma sala de aula'
  })
});

const roles = [
  { value: 'user', label: 'Professor' },
  { value: 'coordinator', label: 'Coordenador' },
  { value: 'admin', label: 'Administrador' }
];

export function EditAdminUser({ adminUser }: { adminUser: AdminUser }) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role,
      classrooms: adminUser.classrooms.map((item) => item._id)
    }
  });

  const queryClient = useQueryClient();

  const { mutateAsync, isPending: isLoading } = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) =>
      editAdminUser(data, adminUser._id),
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
        title: 'Erro ao atualizar professor',
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
    queryKey: ['admin-users-class'],
    enabled: open
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Edit className="h-4 w-4 cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
        </DialogHeader>
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <UserPlus className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Nome do usuário"
                        {...field}
                        className="pl-9"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="email@dominio.com"
                        {...field}
                        className="pl-9"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col ">
              <Label className="mb-2">Senha</Label>
              <PasswordField name="password" placeholder="Senha" />
            </div>

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cargo</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="pl-9 relative">
                        <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Selecione um cargo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch('role') === 'user' && (
              <FormField
                control={form.control}
                name="classrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salas de Aula</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={
                          classes?.map((classe) => ({
                            value: classe._id,
                            label: classe.name
                          })) || []
                        }
                        selected={field.value}
                        onChange={field.onChange}
                        placeholder="Selecione as salas"
                      />
                    </FormControl>
                    <FormDescription>
                      Selecione as salas que o professor terá acesso
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end gap-3 pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Editando...
                  </>
                ) : (
                  <>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar usuário
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
