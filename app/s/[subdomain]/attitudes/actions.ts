import api from '@/lib/api';
import { Attitude, CreateAttitude } from '@/types/attitude';

export async function getAttitudes(): Promise<Attitude[]> {
  const response = await api.get('/attitudes');
  return response.data;
}

export async function addAttitude(data: CreateAttitude): Promise<{
  message: string;
  attitude?: Attitude;
  error?: string;
}> {
  const response = await api.post('/attitudes', data);
  return response.data;
}

export async function editAttitude(
  data: Partial<CreateAttitude>,
  id: string
): Promise<{
  message: string;
  attitude?: Attitude;
  error?: string;
}> {
  const response = await api.put(`/attitudes/${id}`, data);
  return response.data;
}

export async function removeAttitude(id: string): Promise<{
  message: string;
  error?: string;
}> {
  const res = await api.delete(`/attitudes/${id}`);

  return res.data;
}
