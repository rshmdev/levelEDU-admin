import { Class } from "@/types/classes";

export interface Attitude {
    _id: string;
    classId: Class;
    isPositive: boolean;
    description: string
    title: string
    coins: number;
    xp: number;
    isClaimed: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CreateAttitude {
    classId: string;
    description: string
    title: string
    isPositive: boolean;
    coins: number;
    xp: number;
  }
  