'use client';

import { AlertTriangle, Zap, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface UsageAlert {
  type: 'warning' | 'critical' | 'upgrade';
  resource: string;
  current: number;
  limit: number;
  percentage: number;
}

interface UsageAlertsProps {
  alerts: UsageAlert[];
  planType: string;
  onUpgrade?: () => void;
}

export function UsageAlerts({ alerts, planType, onUpgrade }: UsageAlertsProps) {
  if (alerts.length === 0) {
    return null;
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case 'upgrade':
        return <TrendingUp className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getAlertVariant = (type: string): "default" | "destructive" => {
    return type === 'critical' ? 'destructive' : 'default';
  };

  const getAlertTitle = (alert: UsageAlert) => {
    switch (alert.type) {
      case 'critical':
        return `Limite de ${alert.resource} quase atingido!`;
      case 'warning':
        return `Uso de ${alert.resource} elevado`;
      case 'upgrade':
        return `Considere fazer upgrade do seu plano`;
      default:
        return `Alerta de ${alert.resource}`;
    }
  };

  const getAlertDescription = (alert: UsageAlert) => {
    const percentage = Math.round(alert.percentage);
    
    switch (alert.type) {
      case 'critical':
        return `Você está usando ${alert.current} de ${alert.limit} ${alert.resource}s disponíveis (${percentage}%). Considere fazer upgrade para continuar adicionando mais ${alert.resource}s.`;
      case 'warning':
        return `Você está usando ${alert.current} de ${alert.limit} ${alert.resource}s disponíveis (${percentage}%). Em breve você pode precisar fazer upgrade.`;
      case 'upgrade':
        return `Com o uso atual de ${percentage}% em ${alert.resource}s, um plano superior ofereceria mais capacidade e recursos avançados.`;
      default:
        return `Uso atual: ${alert.current}/${alert.limit} (${percentage}%)`;
    }
  };

  return (
    <div className="space-y-3">
      {alerts.map((alert, index) => (
        <Alert key={index} variant={getAlertVariant(alert.type)} className="border-l-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              {getAlertIcon(alert.type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm">
                    {getAlertTitle(alert)}
                  </h4>
                  <Badge 
                    variant={alert.type === 'critical' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {Math.round(alert.percentage)}%
                  </Badge>
                </div>
                <AlertDescription className="text-sm text-muted-foreground">
                  {getAlertDescription(alert)}
                </AlertDescription>
              </div>
            </div>
            
            {(alert.type === 'critical' || alert.type === 'upgrade') && onUpgrade && (
              <Button 
                size="sm" 
                variant={alert.type === 'critical' ? 'default' : 'outline'}
                onClick={onUpgrade}
                className="ml-3 shrink-0"
              >
                <Zap className="h-3 w-3 mr-1" />
                Fazer Upgrade
              </Button>
            )}
          </div>
        </Alert>
      ))}
    </div>
  );
}