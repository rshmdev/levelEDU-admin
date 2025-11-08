'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { getAttitudes } from '@/app/s/[subdomain]/attitudes/actions';
import { Trophy, ThumbsUp, ThumbsDown, Sparkles } from 'lucide-react';
import { AddAttitude } from './add-attitude';
import { Skeleton } from '@/components/ui/skeleton';
import { StatsCardSkeleton } from '../home/stats-card-skeleton';
import { AttitudesTableSkeleton } from './attitudes-table-skeleton';
import { ColumnDef } from '@tanstack/react-table';
import { Attitude } from'@/types/attitude';
import { EditAttitude } from './edit-attitude';
import { DeleteAttitude } from './delete-attitude';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/shared/data-table';

export function AttitudesTable() {
  const { data: attitudes, isLoading } = useQuery({
    queryKey: ['attitudes'],
    queryFn: getAttitudes
  });

  const positiveAttitudes = attitudes?.filter((a) => a.isPositive) || [];
  const negativeAttitudes = attitudes?.filter((a) => !a.isPositive) || [];
  const totalCoins = attitudes?.reduce((acc, curr) => acc + curr.coins, 0) || 0;
  const totalXP = attitudes?.reduce((acc, curr) => acc + curr.xp, 0) || 0;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 w-full overflow-auto">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-[200px]" /> {/* Título */}
            <Skeleton className="h-4 w-[300px] mt-2" /> {/* Descrição */}
          </div>
          <Skeleton className="h-10 w-[100px]" /> {/* Botão Adicionar */}
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <StatsCardSkeleton key={index} />
          ))}
        </div>
        <AttitudesTableSkeleton /> {/* Skeleton para a tabela */}
      </div>
    );
  }

  const columns: ColumnDef<Attitude>[] = [
    {
      accessorKey: 'title',
      header: 'Atitude',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.title}</span>
          <span className="text-sm text-muted-foreground">
            {row.original.description}
          </span>
        </div>
      )
    },
    {
      accessorKey: 'class',
      header: 'Turma',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.classId?.name}
        </span>
      )
    },
    {
      accessorKey: 'isPositive',
      header: 'Tipo',
      cell: ({ row }) => {
        const isPositive = row.original.isPositive;

        return (
          <>
            {isPositive ? (
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
          </>
        );
      }
    },
    {
      accessorKey: 'coins',
      header: 'Recompensa',
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span
              className={
                row.original.isPositive ? 'text-green-500' : 'text-red-500'
              }
            >
              {row.original.isPositive
                ? `+${row.original.coins}`
                : `-${Math.abs(row.original.coins)}`}{' '}
              COINS
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span
              className={
                row.original.isPositive ? 'text-green-500' : 'text-red-500'
              }
            >
              {row.original.isPositive
                ? `+${row.original.xp}`
                : `-${Math.abs(row.original.xp)}`}{' '}
              XP
            </span>
          </div>
        </div>
      )
    },
    {
      accessorKey: 'createdAt',
      header: 'Data'
    },
    {
      header: 'Ações',
      cell: ({ row }) => (
        <div>
          <div className="flex items-center gap-4">
            <EditAttitude attitude={row.original} />
            <DeleteAttitude attitude={row.original} />
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-4 w-full overflow-auto pb-2">
      <div className="flex items-center justify-between flex-wrap pt-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Atitudes</h1>
          <p className="text-muted-foreground">
            Gerencie as atitudes registradas
          </p>
        </div>
        <AddAttitude />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Atitudes Positivas
            </CardTitle>
            <ThumbsUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{positiveAttitudes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Atitudes Negativas
            </CardTitle>
            <ThumbsDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{negativeAttitudes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Coins
            </CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCoins}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de XP</CardTitle>
            <Sparkles className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalXP}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent>
          <DataTable data={attitudes || []} columns={columns} />
        </CardContent>
      </Card>
    </div>
  );
}
