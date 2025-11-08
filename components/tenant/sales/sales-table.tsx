'use client';

import {
  Card,
  CardContent
} from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { getSales } from '@/app/s/[subdomain]/sales/actions';
import { Badge } from '@/components/ui/badge';
import { SalesTableSkeleton } from './sales-table-skeleton';
import { Calendar, School } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Sales } from'@/types/sales';
import { DeliveryProduct } from './delivery-product';
import { DataTable } from '@/components/shared/data-table';

export function SalesTable() {
  const { data: sales, isLoading } = useQuery({
    queryKey: ['sales'],
    queryFn: getSales
  });

  if (isLoading) {
    return <SalesTableSkeleton />; // Exibe o skeleton enquanto carrega
  }

  const columns: ColumnDef<Sales>[] = [
    {
      accessorKey: 'productId.name',
      header: 'Produto'
    },
    {
      accessorKey: 'productId.price',
      header: 'Preço'
    },
    {
      accessorKey: 'userId.name',
      header: 'Aluno'
    },
    {
      accessorKey: 'userId.class',
      header: 'Turma',
      cell: ({ row }) => {
        const classInfo = row.original.userId?.class;
        return (
          <div className="flex items-center gap-2">
            <School className="h-4 w-4 text-muted-foreground" />
            {classInfo?.name} - {classInfo?.code}
          </div>
        );
      }
    },
    {
      accessorKey: 'createdAt',
      header: 'Data do Pedido',
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt).toLocaleDateString(
          'pt-BR'
        );
        return (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            {date}
          </div>
        );
      }
    },
    {
      header: 'Ações',
      cell: ({ row }) => <DeliveryProduct sale={row.original} />
    }
  ];

  return (
    <div className="flex flex-col gap-4 flex-1 overflow-auto pb-2">
      <div className="flex items-center justify-between flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Vendas Pendentes
          </h1>
          <p className="text-muted-foreground">
            Faça a entrega das vendas pendentes{' '}
          </p>
        </div>
        <Badge variant="default" className="px-4 py-1">
          {sales?.length} pedidos pendentes
        </Badge>
      </div>

      <Card className="overflow-y-auto">
        <CardContent className="overflow-y-auto">
          <DataTable data={sales || []} columns={columns} />
        </CardContent>
      </Card>
    </div>
  );
}
