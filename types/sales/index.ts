import { Product } from'@/types/product';
import { Student } from'@/types/student';

export interface Sales {
  userId: Student;
  productId: Product;
  isDelivered: boolean;
  updatedAt: string;
  createdAt: string;
  __v: number;
  _id: string;
}

export interface SalesDeliveryRes {
  message: string;
  purchase?: Sales;
  error?: string;
}
