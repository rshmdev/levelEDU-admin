import { Class } from "@/types/classes";

export interface Mission {
  title: string;
  description: string;
  coins: number;
  allowedUsers: any[]
  classId: Class;
  isCompleted: boolean
  updatedAt: string;
  createdAt: string;
  __v: number;
  _id: string;
}

export interface MissionBody {
  title: string;
  description: string;
  coins: number;
}

export interface MissionActionRes {
  message: string;
  mission?: Mission;
  error?: string;
}
