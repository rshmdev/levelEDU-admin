import { Class } from "@/types/classes";

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  maxPerUser: number;
  classId: Class
  category: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ProductBody {
  name: string;
  description: string;
  price: number;
  maxPerUser: number;
  stock: number;
}

export interface ProductActionRes {
  message: string;
  product?: Product;
  error?: string;
}
