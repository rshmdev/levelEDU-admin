import { AddClass } from '@/components/tenant/classes/add-class';
import { ClassesTable } from '@/components/tenant/classes/classes-table';

export default async function ClassesPage() {
  return (
    <section className="flex flex-col gap-4 flex-1 pb-2 overflow-auto">
      <div className="flex items-center justify-between flex-wrap mt-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sala de aula</h1>
          <p className="text-muted-foreground">Gerencie as salas da escola</p>
        </div>
        <AddClass />
      </div>
      <section className="flex-1">
        <ClassesTable />
      </section>
    </section>
  );
}
