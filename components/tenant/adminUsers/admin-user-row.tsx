import { TableCell, TableRow } from '@/components/ui/table';

import { AdminUser } from'@/types/adminUser';
import { EditAdminUser } from './edit-admin-user';
import { DeleteAdminUser } from './delete-admin-user';
import { Badge } from '@/components/ui/badge';

export function getRoleName(role: string) {
  switch (role) {
    case 'admin':
      return 'Administrador';
    case 'coordinator':
      return 'Coordenador';
    default:
      return 'Professor';
  }
}

export function AdminUserRow({ adminUser }: { adminUser: AdminUser }) {
  return (
    <TableRow>
      <TableCell className="font-medium">{adminUser.name}</TableCell>
      <TableCell>{adminUser.email}</TableCell>
      <TableCell>
        <Badge>{getRoleName(adminUser.role)}</Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-4">
          <EditAdminUser adminUser={adminUser} />
          <DeleteAdminUser adminUser={adminUser} />
        </div>
      </TableCell>
    </TableRow>
  );
}
