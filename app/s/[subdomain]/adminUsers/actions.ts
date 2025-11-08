import api from '@/lib/api';
import { AdminUser, CreateAdminUser } from '@/types/adminUser';

export async function getAdminUsers(): Promise<AdminUser[]> {
  const response = await api.get('/auth/users');
  return response.data;
}

export async function addAdminUser(data: CreateAdminUser): Promise<{
  message: string;
  adminUser?: AdminUser;
  error?: string;
}> {
  const response = await api.post('/auth/register', data);
  return response.data;
}

export async function editAdminUser(
  data: Partial<CreateAdminUser>,
  id: string
): Promise<{
  message: string;
  adminUser?: AdminUser;
  error?: string;
}> {
  const response = await api.put(`/auth/users/${id}`, data);
  return response.data;
}

export async function removeAdminUser(id: string): Promise<{
  message: string;
  error?: string;
}> {
  const res = await api.delete(`/auth/users/${id}`);

  return res.data;
}
