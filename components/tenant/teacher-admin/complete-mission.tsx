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

import {
  Book,
  CheckCircle,
  CheckCircle2,
  Loader2,
  Medal,
  Star,
  Trophy,
  Users
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import {
  assignMissionToStudent,
  getMissions
} from '@/app/s/[subdomain]/missions/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Student } from '@/app/s/[subdomain]/teacher-dashboard/actions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Mission } from'@/types/mission';

const formSchema = z.object({
  usersId: z.array(z.string()).min(1, 'Selecione pelo menos um aluno'),
  missionId: z.string().nonempty()
});

export function AssignMissionModal({ student }: { student: Student }) {
  const [open, setOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState<Mission | undefined>();

  const { data: missions } = useQuery({
    queryKey: ['complete-mission-missions'],
    queryFn: () => getMissions()
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      usersId: [student._id],
      missionId: ''
    }
  });

  const { mutateAsync, isPending: isLoading } = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) =>
      assignMissionToStudent(data.missionId, data.usersId),
    onSuccess: (data) => {
      toast({
        title: data.message
      });
      form.reset();
      setSelectedMission(undefined);
      setOpen(false);
    },
    onError: (error: any) => {
      const apiErrorMessage = error?.response?.data?.message;

      toast({
        title: 'Erro ao completar missão',
        description: apiErrorMessage,
        variant: 'destructive'
      });
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await mutateAsync(values);
  }

  const daysSinceStart = Math.ceil(
    (new Date().getTime() -
      new Date(
        selectedMission?.createdAt || new Date().toISOString()
      ).getTime()) /
      (1000 * 3600 * 24)
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <CheckCircle className="h-4 w-4 mr-1" />
          Concluir Missão
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Medal className="h-5 w-5 text-yellow-500" />
            Concluir Missão para {student.name}
          </DialogTitle>
          <DialogDescription>
            Selecione a missão que deseja concluir para o aluno.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          {selectedMission && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  Detalhes da Missão
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium">{selectedMission?.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedMission?.description}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Trophy className="h-3 w-3 text-yellow-500" />
                    {selectedMission?.coins} COINS
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Em progresso há {daysSinceStart} dias
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Student Selection */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="missionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Missão</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedMission(
                          missions?.find((mission) => mission._id === value)
                        );
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="pl-9 relative">
                          <Book className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Selecione uma missão" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {missions?.map((mission) => (
                          <SelectItem key={mission._id} value={mission._id}>
                            {mission.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Missão completada pelo aluno.
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
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Concluindo...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Concluir Missão
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
