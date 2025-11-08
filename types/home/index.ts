export interface Home {
    totalUsers: number
    totalMissions: number
    totalProducts: number
    totalPendingPurchases: number
    topStudents: TopStudent[]
  }
  
  export interface TopStudent {
    name: string
    coins: number
  }
  