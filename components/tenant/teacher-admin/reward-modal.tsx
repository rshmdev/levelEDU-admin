'use client';

import { useState, useEffect, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Award, ThumbsUp, ThumbsDown } from 'lucide-react';
import {
  rewardStudent,
  Student
} from '@/app/s/[subdomain]/teacher-dashboard/actions';
import { Attitude } from'@/types/attitude';
import { getAttitudes } from '@/app/s/[subdomain]/attitudes/actions';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

interface RewardModalProps {
  student: Student;
}

export function RewardModal({ student }: RewardModalProps) {
  const [attitudeDetails, setAttitudeDetails] = useState<Attitude | null>(null);
  const [open, setOpen] = useState(false);
  const [isPending, startTransaction] = useTransition();

  const { data: attitudes } = useQuery({
    queryKey: ['attitudes'],
    queryFn: () => getAttitudes()
  });

  const onReward = async () => {
    startTransaction(async () => {
      if (!attitudeDetails) return;

      try {
        await rewardStudent(student._id, attitudeDetails._id);

        setAttitudeDetails(null);

        setOpen(false);
        toast({
          title: 'Recompensa atribuída',
          description: `O aluno ${student.name} foi recompensado com sucesso.`,
          variant: 'default'
        });
      } catch (error: any) {
        toast({
          title: 'Erro ao recompensar aluno',
          description: error.message,
          variant: 'destructive'
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Award className="h-4 w-4 mr-1" />
          Recompensar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Recompensar {student.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select
            onValueChange={(value) => {
              const selectedAttitude = attitudes?.find(
                (attitude) => attitude._id === value
              );
              setAttitudeDetails(selectedAttitude || null);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma atitude" />
            </SelectTrigger>
            <SelectContent>
              {attitudes?.map((attitude) => (
                <SelectItem key={attitude._id} value={attitude._id}>
                  {attitude.isPositive ? (
                    <ThumbsUp className="inline-block w-4 h-4 mr-2 text-green-500" />
                  ) : (
                    <ThumbsDown className="inline-block w-4 h-4 mr-2 text-red-500" />
                  )}
                  {attitude.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {attitudeDetails && (
            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-semibold mb-2">{attitudeDetails.title}</h3>
              <p className="text-sm mb-2">{attitudeDetails.description}</p>
              <div className="flex justify-between text-sm">
                <span
                  className={
                    attitudeDetails.isPositive
                      ? 'text-green-600'
                      : 'text-red-600'
                  }
                >
                  XP: {attitudeDetails.xp > 0 ? '+' : ''}
                  {attitudeDetails.xp}
                </span>
                <span
                  className={
                    attitudeDetails.isPositive
                      ? 'text-green-600'
                      : 'text-red-600'
                  }
                >
                  Moedas: {attitudeDetails.coins > 0 ? '+' : ''}
                  {attitudeDetails.coins}
                </span>
              </div>
            </div>
          )}

          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            disabled={isPending}
            onClick={() => {
              onReward();
            }}
          >
            {isPending ? 'Aguarde...' : 'Confirmar Recompensa'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
