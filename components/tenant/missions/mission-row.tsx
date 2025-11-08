import { TableCell, TableRow } from '@/components/ui/table';
import { Mission } from'@/types/mission';
import { DeleteMission } from './delete-mission';
import { EditMission } from './edit-mission';
import { AssignMissionModal } from '../teacher-admin/complete-mission';

export function MissionRow({ mission }: { mission: Mission }) {
  return (
    <TableRow>
      <TableCell className="font-medium">{mission.title}</TableCell>

      <TableCell className="">{mission.description}</TableCell>

      <TableCell className="">{`${mission.coins} COINS`}</TableCell>

      <TableCell>
        <div className="flex items-center gap-4">
          {/* <AssignMissionModal mission={mission} /> */}
          <EditMission mission={mission} />

          <DeleteMission mission={mission} />
        </div>
      </TableCell>
    </TableRow>
  );
}
