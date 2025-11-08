'use client';

import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  Table
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { ProductRow } from './product-row';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/app/s/[subdomain]/products/actions';
import { AddProduct } from './add-product';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductsTableSkeleton } from './products-table-skeleton';
import { EditProduct } from './edit-product';
import { DeleteProduct } from './delete-product';
import { ColumnDef } from '@tanstack/react-table';
import { Product } from'@/types/product';
import { Coins } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/shared/data-table';

export function ProductsTable() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 flex-1 overflow-auto">
        <div className="flex items-center justify-between flex-wrap">
          <div>
            <Skeleton className="h-8 w-[200px]" /> {/* Título */}
            <Skeleton className="h-4 w-[300px] mt-2" /> {/* Descrição */}
          </div>
          <Skeleton className="h-10 w-[100px]" /> {/* Botão Adicionar */}
        </div>
        <ProductsTableSkeleton /> {/* Skeleton para a tabela */}
      </div>
    );
  }

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'name',
      header: 'Nome'
    },
    {
      accessorKey: 'category',
      header: 'Categoria'
    },
    {
      accessorKey: 'price',
      header: 'Preço',
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            <Coins className="h-4 w-4 text-yellow-500" />
            {row.original.price}
          </div>
        );
      }
    },
    {
      accessorKey: 'stock',
      header: 'Estoque'
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        return (
          <Badge variant={row.original.stock > 0 ? 'default' : 'destructive'}>
            {row.original.stock > 0 ? 'Disponível' : 'Indisponível'}
          </Badge>
        );
      }
    },
    {
      header: 'Ações',
      cell: ({ row }) => (
        <div className="flex items-center gap-4">
          <EditProduct product={row.original} />
          <DeleteProduct product={row.original} />
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-4 flex-1 overflow-auto pb-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Produtos</h1>
          <p className="text-muted-foreground">
            Gerencia os produtos disponiveis para os alunos{' '}
          </p>
        </div>
        <AddProduct />
      </div>

      <Card className="overflow-y-auto">
        <CardContent className="overflow-y-auto">
          <DataTable data={products || []} columns={columns} />
        </CardContent>
      </Card>
    </div>
  );
}
