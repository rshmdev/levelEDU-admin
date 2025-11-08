import { Class } from "@/types/classes";

export interface AdminUser {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    classrooms: Class[]
  }
  
  export interface CreateAdminUser {
    name: string;
    email: string;
    password: string;
    role: string;
    classrooms: string[]
  }
  