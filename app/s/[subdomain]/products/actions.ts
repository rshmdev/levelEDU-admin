import api from '@/lib/api';
import { Product, ProductActionRes, ProductBody } from'@/types/product';

export async function getProducts() {
  const res = await api.get('/products');

  return res.data as Product[];
}

export async function addProduct(product: ProductBody) {
  const res = await api.post('/products', product);

  return res.data as ProductActionRes;
}

export async function editProduct(product: ProductBody, productId: string) {
  const res = await api.put(`/products/${productId}`, product);

  return res.data as ProductActionRes;
}

export async function removeProduct(productId: string) {
  const res = await api.delete(`/products/${productId}`);

  return res.data as {
    message: string;
    error?: string;
  };
}
