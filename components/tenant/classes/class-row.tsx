import { TableCell, TableRow } from '@/components/ui/table';
import { DeleteClass } from './delete-class';
import { EditClass } from './edit-class';
import { Class } from'@/types/classes';

export function ClassRow({ classItem }: { classItem: Class }) {
  return (
    <TableRow>
      <TableCell className="font-medium">{classItem.code}</TableCell>
      <TableCell>{classItem.name}</TableCell>
      <TableCell>
        <div className="flex items-center gap-4">
          <EditClass classItem={classItem} />
          <DeleteClass classItem={classItem} />
        </div>
      </TableCell>
    </TableRow>
  );
}
