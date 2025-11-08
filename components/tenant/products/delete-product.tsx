'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeProduct } from '@/app/s/[subdomain]/products/actions';
import { AlertTriangle, Coins, Package, RefreshCw, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { Product } from'@/types/product';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export function DeleteProduct({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => removeProduct(product._id),
    onSuccess: () => {
      toast({
        title: `${product?.name} removido com sucesso`,
        description: 'O produto foi removido com sucesso do catálogo.'
      });
      queryClient.invalidateQueries({
        queryKey: ['products']
      });
      setOpen(false);
    },
    onError: () => {
      toast({
        title: 'Erro ao remover produto',
        description:
          'Ocorreu um erro ao tentar remover o produto. Tente novamente.',
        variant: 'destructive'
      });
    }
  });

  const remove = async () => {
    await mutateAsync();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Trash2 className="h-4 w-4 mr-2" />
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[400px]">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          </div>
          <div className="space-y-4 text-sm text-muted-foreground">
            <span>
              Você está prestes a excluir o produto{' '}
              <span className="font-medium text-foreground">
                {product.name}
              </span>
              . Esta ação não poderá ser desfeita e todos os dados relacionados
              serão permanentemente removidos.
            </span>

            <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Package className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {product.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {product.description}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">
                    {product.price} coins
                  </span>
                </div>
                <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                  {product.stock} em estoque
                </Badge>
              </div>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={() => remove()}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isPending ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Excluindo...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir produto
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
