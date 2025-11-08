'use client';

import { Users, Briefcase, Package, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/tenant/home/stats-card';
import { TopStudentsTable } from '@/components/tenant/home/top-students-table';
import { getHomeData } from './actions';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { TopStudentsTableSkeleton } from '@/components/tenant/home/top-students-table-skeleton';
import { StatsCardSkeleton } from '@/components/tenant/home/stats-card-skeleton';

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryFn: getHomeData,
    queryKey: ['home-data']
  });

  if (isLoading) {
    return (
      <div className="space-y-6 flex-1 overflow-auto">
        <Skeleton className="h-9 w-[200px]" /> {/* Título */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <StatsCardSkeleton key={index} />
          ))}
        </div>
        <TopStudentsTableSkeleton /> {/* Skeleton para a tabela */}
      </div>
    );
  }

  return (
    <div className="space-y-6 flex-1 overflow-auto pb-2">
      <h1 className="text-3xl font-bold mt-2">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de alunos"
          value={data?.totalUsers || 0}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Total de missões"
          value={data?.totalMissions || 0}
          icon={<Briefcase className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Total de produtos"
          value={data?.totalProducts || 0}
          icon={<Package className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Entrega pendentes"
          value={data?.totalPendingPurchases || 0}
          icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Alunos</CardTitle>
        </CardHeader>
        <CardContent>
          <TopStudentsTable students={data?.topStudents || []} />
        </CardContent>
      </Card>
    </div>
  );
}
