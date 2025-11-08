import { Class } from "@/types/classes";
import { Mission } from "@/types/mission";

export interface Student {
    _id: string;
    name: string;
    qrcode: string;
    completedMissions: Mission[];
    class: Class;
 
    stats: {
      coins: number;
      xp: number
      negativeAttitudes: number
      positiveAttitudes: number
    }
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  
  export interface StudentBody {
    name: string;

  }
  
  export interface StudentActionRes {
    message: string;
    user?: Student;
    error?: string;
  }
  