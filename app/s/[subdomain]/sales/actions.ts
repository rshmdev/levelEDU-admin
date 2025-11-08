import api from '@/lib/api';
import { Sales, SalesDeliveryRes } from'@/types/sales';

export async function getSales() {
  const res = await api.get('/purchases/pending');

  return res.data as Sales[];
}

export async function delivery(purchaseId: string) {

    const res = await api.put(`/purchases/${purchaseId}/deliver`);

    return res.data as SalesDeliveryRes;
    
} 