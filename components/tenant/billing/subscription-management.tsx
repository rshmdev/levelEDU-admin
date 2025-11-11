"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, CreditCard, AlertCircle, CheckCircle2, X } from "lucide-react";
import { useTenant } from "@/hooks/use-tenant";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SubscriptionData {
  id: string;
  status: 'active' | 'trial' | 'canceled' | 'past_due' | 'unpaid';
  planName: string;
  planPrice: number;
  currency: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEnd?: string;
  isTrialing?: boolean;
}

export function SubscriptionManagement() {
  const { tenant } = useTenant();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    fetchSubscriptionData();
  }, [tenant?._id]);

  const fetchSubscriptionData = async () => {
    if (!tenant?._id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/subscription/${tenant._id}`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar dados da assinatura');
      }

      const data = await response.json();
      setSubscription(data);
    } catch (err: any) {
      setError(err.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription || !tenant?._id) return;

    try {
      setCanceling(true);
      setError(null);

      const response = await fetch(`/api/subscription/${tenant._id}/cancel`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Erro ao cancelar assinatura');
      }

      // Atualizar dados da assinatura
      await fetchSubscriptionData();
    } catch (err: any) {
      setError(err.message || 'Erro desconhecido');
    } finally {
      setCanceling(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Ativo', variant: 'default' as const },
      trial: { label: 'Trial', variant: 'secondary' as const },
      canceled: { label: 'Cancelado', variant: 'destructive' as const },
      past_due: { label: 'Vencido', variant: 'destructive' as const },
      unpaid: { label: 'Não Pago', variant: 'destructive' as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || 
                   { label: status, variant: 'secondary' as const };

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(price / 100); // Stripe prices are in cents
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2">Carregando dados da assinatura...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-muted-foreground">Nenhuma assinatura encontrada.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status da Assinatura */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Detalhes da Assinatura
              </CardTitle>
              <CardDescription>
                Status atual e informações do plano
              </CardDescription>
            </div>
            {getStatusBadge(subscription.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Plano</p>
              <p className="text-lg font-semibold">{subscription.planName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Valor</p>
              <p className="text-lg font-semibold">
                {formatPrice(subscription.planPrice, subscription.currency)}/mês
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            {subscription.isTrialing && subscription.trialEnd && (
              <div className="flex items-center gap-2 text-blue-600">
                <CalendarDays className="h-4 w-4" />
                <span className="text-sm">
                  Trial termina em: <strong>{formatDate(subscription.trialEnd)}</strong>
                </span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span className="text-sm text-muted-foreground">
                Período atual: {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
              </span>
            </div>

            {subscription.cancelAtPeriodEnd && (
              <div className="flex items-center gap-2 text-amber-600">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">
                  Assinatura será cancelada em: <strong>{formatDate(subscription.currentPeriodEnd)}</strong>
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Ações da Assinatura */}
      {subscription.status === 'active' && !subscription.cancelAtPeriodEnd && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Zona de Perigo</CardTitle>
            <CardDescription>
              Ações irreversíveis relacionadas à sua assinatura
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-red-800">
                      Cancelar Assinatura
                    </h4>
                    <p className="text-sm text-red-600 mt-1">
                      Sua assinatura será cancelada ao final do período atual. 
                      Você manterá acesso até {formatDate(subscription.currentPeriodEnd)}.
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleCancelSubscription}
                    disabled={canceling}
                  >
                    {canceling ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Cancelando...
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4 mr-2" />
                        Cancelar Assinatura
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {subscription.cancelAtPeriodEnd && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            Sua assinatura foi cancelada e terminará em {formatDate(subscription.currentPeriodEnd)}. 
            Você ainda pode usar todos os recursos até esta data.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}