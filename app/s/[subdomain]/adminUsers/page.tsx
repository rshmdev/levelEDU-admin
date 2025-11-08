import { AdminUsersTable } from '@/components/tenant/adminUsers/admin-users-table';
import { AddAdminUser } from '@/components/tenant/adminUsers/add-admin-user';

export default async function AdminUsersPage() {
  return (
    <section className="flex flex-col gap-4 flex-1 overflow-auto">
      <section className="flex items-center justify-between flex-wrap gap-2 mt-2">
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">
            Usuários
          </h3>
          <span className="text-sm text-muted-foreground">
            Gerencie os usuários do sistema administrativo.
          </span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <AddAdminUser />
        </div>
      </section>
      <section className="flex-1">
        <AdminUsersTable />
      </section>
    </section>
  );
}
