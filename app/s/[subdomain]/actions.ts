

import api from '@/lib/api';
import { Home } from'@/types/home';

export async function getHomeData() {
  const res = await api.get('/home');

  return (res.data as Home) || [];
}
