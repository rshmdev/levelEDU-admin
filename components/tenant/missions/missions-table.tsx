'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { getMissions } from '@/app/s/[subdomain]/missions/actions';
import { AddMission } from './add-mission';
import { Medal, Trophy, Users } from 'lucide-react';
import { getStudents } from '@/app/s/[subdomain]/students/actions';
import { Skeleton } from '@/components/ui/skeleton';
import { StatsCardSkeleton } from '../home/stats-card-skeleton';
import { MissionsTableSkeleton } from './missions-table-skeleton';
import { ColumnDef } from '@tanstack/react-table';
import { Mission } from'@/types/mission';
import { EditMission } from './edit-mission';
import { DeleteMission } from './delete-mission';
import { DataTable } from '@/components/shared/data-table';

export function MissionsTable() {
  const { data: missions, isLoading: isLoadingMissions } = useQuery({
    queryKey: ['missions'],
    queryFn: getMissions
  });

  const { data: students, isLoading: isLoadingStudents } = useQuery({
    queryKey: ['students-missions'],
    queryFn: getStudents
  });

  const totalStudents = students?.length || 1;

  // Criar um Set para armazenar IDs únicos de alunos que completaram pelo menos uma missão
  const uniqueCompletedStudents = new Set();
  missions?.forEach((mission) => {
    mission?.allowedUsers?.forEach((user) => uniqueCompletedStudents.add(user));
  });

  // Calcular a taxa de conclusão corretamente
  const completionRate = Math.round(
    (uniqueCompletedStudents.size / totalStudents) * 100
  );

  if (isLoadingMissions || isLoadingStudents) {
    return (
      <div className="flex flex-col gap-4 flex-1 overflow-auto">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-[200px]" /> {/* Título */}
            <Skeleton className="h-4 w-[300px] mt-2" /> {/* Descrição */}
          </div>
          <Skeleton className="h-10 w-[100px]" /> {/* Botão Adicionar */}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <StatsCardSkeleton key={index} />
          ))}
        </div>
        <MissionsTableSkeleton /> {/* Skeleton para a tabela */}
      </div>
    );
  }

  const columns: ColumnDef<Mission>[] = [
    {
      accessorKey: 'title',
      header: 'Título'
    },
    {
      accessorKey: 'description',
      header: 'Descrição'
    },
    {
      accessorKey: 'coins',
      header: 'Prêmio',
      cell: ({ row }) => {
        return `${row.original.coins} COINS`;
      }
    },
    {
      header: 'Ações',
      cell: ({ row }) => (
        <div className="flex items-center gap-4">
          {/* <AssignMissionModal mission={row.original} /> */}
          <EditMission mission={row.original} />
          <DeleteMission mission={row.original} />
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-4 w-full pb-2">
      <div className="flex items-center justify-between flex-wrap mt-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Missões</h1>
          <p className="text-muted-foreground">
            Gerencie as missões disponíveis para os alunos
          </p>
        </div>
        <AddMission />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Missões
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{missions?.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Missões Atribuídas
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students?.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Conclusão
            </CardTitle>
            <Medal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent>
          <DataTable columns={columns} data={missions || []} />
        </CardContent>
      </Card>
    </div>
  );
}
