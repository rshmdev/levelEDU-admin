import api from '@/lib/api';
import { Mission, MissionActionRes, MissionBody } from'@/types/mission';

export async function getMissions() {
  const res = await api.get('/missions');

  return res.data as Mission[];
}

export async function addMission(mission: MissionBody) {
  const res = await api.post('/missions', mission);

  return res.data as MissionActionRes;
}

export async function editMission(mission: MissionBody, missionId: string) {
  const res = await api.put(`/missions/${missionId}`, mission);

  return res.data as MissionActionRes;
}

export async function removeMission(missionId: string) {
  const res = await api.delete(`/missions/${missionId}`);

  return res.data as {
    message: string;
    error?: string;
  };
}

export async function assignMissionToStudent(
  missionId: string,
  userIds: string[]
) {
  const res = await api.put(`/missions/${missionId}/allow`, {
    userIds
  });

  return res.data as MissionActionRes;
}
