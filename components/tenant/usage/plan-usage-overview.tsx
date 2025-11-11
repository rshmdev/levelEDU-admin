'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { UsageAlerts } from './usage-alerts';
import { 
  Users, 
  UserCheck, 
  Shield, 
  BookOpen, 
  Target, 
  Package, 
  Heart,
  TrendingUp,
  Zap 
} from 'lucide-react';
import { useCheckout } from '@/hooks/use-checkout';

interface UsageData {
  currentUsage: {
    students: number;
    teachers: number;
    admins: number;
    classes: number;
    missions: number;
    products: number;
    attitudes: number;
  };
  limits: {
    maxStudents: number;
    maxTeachers: number;
    maxAdmins: number;
    maxClasses: number;
    maxMissions: number;
    maxProducts: number;
    maxAttitudes: number;
  };
  planType: string;
}

interface UsageAlert {
  type: 'warning' | 'critical' | 'upgrade';
  resource: string;
  current: number;
  limit: number;
  percentage: number;
}

const resourceConfig = [
  {
    key: 'students' as keyof UsageData['currentUsage'],
    limitKey: 'maxStudents' as keyof UsageData['limits'],
    label: 'Alunos',
    icon: Users,
  },
  {
    key: 'teachers' as keyof UsageData['currentUsage'],
    limitKey: 'maxTeachers' as keyof UsageData['limits'],
    label: 'Professores',
    icon: UserCheck,
  },
  {
    key: 'admins' as keyof UsageData['currentUsage'],
    limitKey: 'maxAdmins' as keyof UsageData['limits'],
    label: 'Administradores',
    icon: Shield,
  },
  {
    key: 'classes' as keyof UsageData['currentUsage'],
    limitKey: 'maxClasses' as keyof UsageData['limits'],
    label: 'Turmas',
    icon: BookOpen,
  },
  {
    key: 'missions' as keyof UsageData['currentUsage'],
    limitKey: 'maxMissions' as keyof UsageData['limits'],
    label: 'Missões',
    icon: Target,
  },
  {
    key: 'products' as keyof UsageData['currentUsage'],
    limitKey: 'maxProducts' as keyof UsageData['limits'],
    label: 'Produtos',
    icon: Package,
  },
  {
    key: 'attitudes' as keyof UsageData['currentUsage'],
    limitKey: 'maxAttitudes' as keyof UsageData['limits'],
    label: 'Atitudes',
    icon: Heart,
  },
];

export function PlanUsageOverview() {
  const { data, isLoading } = useQuery<{ data: UsageData }>({
    queryKey: ['usage-data'],
    queryFn: async () => {
      const response = await fetch('/api/admin/usage');
      if (!response.ok) {
        throw new Error('Falha ao carregar dados de uso');
      }
      return response.json();
    },
  });

  const { startCheckout } = useCheckout();

  // Calculate alerts based on usage thresholds
  const calculateAlerts = (usageData: UsageData): UsageAlert[] => {
    const alerts: UsageAlert[] = [];

    resourceConfig.forEach(({ key, limitKey, label }) => {
      const current = usageData.currentUsage[key];
      const limit = usageData.limits[limitKey];
      const percentage = (current / limit) * 100;

      if (percentage >= 90) {
        alerts.push({
          type: 'critical',
          resource: label.toLowerCase(),
          current,
          limit,
          percentage,
        });
      } else if (percentage >= 75) {
        alerts.push({
          type: 'warning',
          resource: label.toLowerCase(),
          current,
          limit,
          percentage,
        });
      } else if (percentage >= 60 && usageData.planType === 'trial') {
        alerts.push({
          type: 'upgrade',
          resource: label.toLowerCase(),
          current,
          limit,
          percentage,
        });
      }
    });

    return alerts;
  };

  const handleUpgrade = async () => {
    const plans = ['starter', 'professional', 'growth'];
    const currentPlanIndex = plans.indexOf(data?.data?.planType || 'trial');
    const nextPlan = plans[Math.max(0, currentPlanIndex + 1)] || 'professional';
    
    await startCheckout({ plan: nextPlan });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Uso do Plano</CardTitle>
          <Skeleton className="h-6 w-16" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!data?.data) {
    return null;
  }

  const usageData = data.data;
  const alerts = calculateAlerts(usageData);

  const getPlanDisplayName = (planType: string) => {
    const planNames: Record<string, string> = {
      trial: 'Período de Teste',
      starter: 'Starter',
      professional: 'Professional',
      growth: 'Growth',
    };
    return planNames[planType] || planType;
  };

  const getPlanBadgeVariant = (planType: string) => {
    switch (planType) {
      case 'trial':
        return 'secondary';
      case 'starter':
        return 'outline';
      case 'professional':
        return 'default';
      case 'growth':
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-4">
      {/* Usage Alerts */}
      {alerts.length > 0 && (
        <UsageAlerts 
          alerts={alerts} 
          planType={usageData.planType} 
          onUpgrade={handleUpgrade}
        />
      )}

      {/* Usage Overview Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base font-medium">Uso do Plano</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={getPlanBadgeVariant(usageData.planType)}>
              {getPlanDisplayName(usageData.planType)}
            </Badge>
            {(usageData.planType === 'trial' || alerts.some(a => a.type === 'critical')) && (
              <Button size="sm" onClick={handleUpgrade}>
                <Zap className="h-3 w-3 mr-1" />
                Upgrade
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {resourceConfig.map(({ key, limitKey, label, icon: Icon }) => {
              const current = usageData.currentUsage[key];
              const limit = usageData.limits[limitKey];
              const percentage = Math.round((current / limit) * 100);
              
              const getProgressColor = () => {
                if (percentage >= 90) return 'bg-red-500';
                if (percentage >= 75) return 'bg-amber-500';
                if (percentage >= 50) return 'bg-blue-500';
                return 'bg-green-500';
              };

              return (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {current}/{limit}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <Progress 
                      value={percentage} 
                      className="h-2"
                      style={{
                        '--progress-foreground': getProgressColor()
                      } as React.CSSProperties}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{percentage}% usado</span>
                      {percentage >= 75 && (
                        <span className={percentage >= 90 ? 'text-red-600' : 'text-amber-600'}>
                          {percentage >= 90 ? 'Crítico' : 'Alto'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}