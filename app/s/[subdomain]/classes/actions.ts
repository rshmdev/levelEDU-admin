import api from '@/lib/api';
import { Class, ClassActionRes, ClassBody } from'@/types/classes';
import { Student } from'@/types/student';

export async function getClasses() {
  const res = await api.get('/classes');

  return res.data as Class[];
}

export async function getClassUsers(classId: string) {
  const res = await api.get(`/classes/${classId}/students`);

  return res.data as Student[];
}

export async function addClass(classes: ClassBody) {
  const res = await api.post('/classes', classes);

  return res.data as ClassActionRes;
}

export async function editClass(classes: ClassBody, classId: string) {
  const res = await api.put(`/classes/${classId}`, classes);

  return res.data as ClassActionRes;
}

export async function removeClass(classId: string) {
  const res = await api.delete(`/classes/${classId}`);

  return res.data as {
    message: string;
    error?: string;
  };
}
