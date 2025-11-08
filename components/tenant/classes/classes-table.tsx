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
import { ClassRow } from './class-row';
import { useQuery } from '@tanstack/react-query';
import { getClasses } from '@/app/s/[subdomain]/classes/actions';
import { ClassesTableSkeleton } from './classes-table-skeleton';
import { DataTable } from '@/components/shared/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Class } from'@/types/classes';
import { EditClass } from './edit-class';
import { DeleteClass } from './delete-class';

export function ClassesTable() {
  const { data: classes, isLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: getClasses
  });

  if (isLoading) {
    return <ClassesTableSkeleton />; // Exibe o skeleton enquanto carrega
  }

  const columns: ColumnDef<Class>[] = [
    {
      accessorKey: 'code',
      header: 'Código'
    },
    {
      accessorKey: 'name',
      header: 'Nome'
    },
    {
      header: 'Ações',
      cell: ({ row }) => (
        <div>
          <div className="flex items-center gap-4">
            <EditClass classItem={row.original} />
            <DeleteClass classItem={row.original} />
          </div>
        </div>
      )
    }
  ];

  return (
    <Card>
      <CardContent>
        <DataTable data={classes || []} columns={columns} />
      </CardContent>
    </Card>
  );
}
