import api from '@/lib/api';
import { Student, StudentActionRes, StudentBody } from'@/types/student';

export async function getStudents() {
  const res = await api.get('/users');

  return res.data as Student[];
}

export async function addStudent(student: StudentBody) {
  const res = await api.post('/users', student);

  return res.data as StudentActionRes;
}

export async function editStudent(student: StudentBody, userId: string) {
  const res = await api.put(`/users/${userId}`, student);

  return res.data as StudentActionRes;
}

export async function removeStudent(userId: string) {
  const res = await api.delete(`/users/${userId}`);

  return res.data as {
    message: string;
    error?: string;
  };
}
