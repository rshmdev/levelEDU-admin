import api from '@/lib/api';
import { Class } from'@/types/classes';

export interface Student {
  _id: string;
  name: string;
  completedMissions: string[];
  coins: number;
  xp: number;
}

export async function getClassesByTeacher(teacherId: string) {
  const res = await api.get(`/classes/${teacherId}/teacher`);

  return res.data as Class[];
}

export async function getClassUsers(classId: string) {
  const res = await api.get(`/classes/${classId}/students`);

  return res.data as Student[];
}

export async function rewardStudent(studentId: string, attitudeId: string) {
  const res = await api.post(`/attitudes/reward`, {
    attitudeId,
    studentIds: [studentId]
  });

  return res.data;
}
