import { Student } from '@/types/student';

export interface Class {
  name: string;
  code: string;
  students: Student[];
  isCompleted: boolean;
  updatedAt: string;
  createdAt: string;
  __v: number;
  _id: string;
}

export interface ClassBody {
  name: string;
  code: string;
}

export interface ClassActionRes {
  message: string;
  newClass?: Class;
  error?: string;
}
