'use client';

import { useState } from 'react';
import {
  Package2,
  RefreshCw,
  Truck,
  School,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { delivery } from '@/app/s/[subdomain]/sales/actions';
import type { Sales } from'@/types/sales';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export function DeliveryProduct({ sale }: { sale: Sales }) {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => delivery(sale._id),
    onSuccess: (data) => {
      toast({
        title: 'Pedido entregue com sucesso!',
        description: data.message,
        action: (
          <div className="flex items-center gap-1 text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
            Concluído
          </div>
        )
      });
      queryClient.invalidateQueries({
        queryKey: ['sales']
      });
      setOpen(false);
    },
    onError: (error: any) => {
      const apiErrorMessage = error?.response?.data?.message;

      toast({
        title: 'Erro ao entregar pedido',
        description: apiErrorMessage,
        variant: 'destructive'
      });
    }
  });

  const deliver = async () => {
    await mutateAsync();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Package2 className="h-4 w-4 mr-2" />
          Marcar como entregue
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[500px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Confirmar entrega do pedido
          </AlertDialogTitle>
          <AlertDialogDescription>
            Verifique os detalhes abaixo antes de confirmar a entrega
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 my-4">
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Package2 className="h-4 w-4" />
              Detalhes do Produto
            </h4>
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">{sale.productId.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {sale.productId.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">R$ {sale.productId.price}</Badge>
                    <Badge variant="outline">{sale.productId.category}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <School className="h-4 w-4" />
              Detalhes do Aluno
            </h4>
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">{sale.userId?.name}</p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <School className="h-4 w-4" />
                    Turma {sale?.userId?.class?.name} •{' '}
                    {sale?.userId?.class?.code}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Pedido feito em{' '}
                    {new Date(sale?.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator />

        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={() => deliver()}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {isPending ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Confirmando...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Confirmar Entrega
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
