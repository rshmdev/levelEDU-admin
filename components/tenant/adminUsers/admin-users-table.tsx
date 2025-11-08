'use client';


import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { getRoleName } from './admin-user-row';
import { AdminUsersTableSkeleton } from './admin-users-table-skeleton'; // Importe o skeleton
import { EditAdminUser } from './edit-admin-user';
import { DeleteAdminUser } from './delete-admin-user';
import { AdminUser } from'@/types/adminUser';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { getAdminUsers } from '@/app/s/[subdomain]/adminUsers/actions';
import { DataTable } from '@/components/shared/data-table';

export function AdminUsersTable() {
  const { data: adminUsers, isLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: getAdminUsers
  });

  if (isLoading) {
    return <AdminUsersTableSkeleton />; // Exibe o skeleton enquanto carrega
  }

  const columns: ColumnDef<AdminUser>[] = [
    {
      accessorKey: 'name',
      header: 'Nome'
    },
    {
      accessorKey: 'email',
      header: 'Email'
    },
    {
      accessorKey: 'role',
      header: 'Cargo',
      cell: ({ row }) => {
        return <Badge>{getRoleName(row.original.role)}</Badge>;
      }
    },

    {
      header: 'Ações',
      cell: ({ row }) => (
        <div>
          <div className="flex items-center gap-4">
            <EditAdminUser adminUser={row.original} />
            <DeleteAdminUser adminUser={row.original} />
          </div>
        </div>
      )
    }
  ];

  return (
    <Card className="overflow-auto">
      <CardContent className="overflow-auto">
        <DataTable data={adminUsers || []} columns={columns} />
      </CardContent>
    </Card>
  );
}
