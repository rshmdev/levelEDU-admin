import { Badge } from '@/components/ui/badge';

import { TableCell, TableRow } from '@/components/ui/table';
import { EditProduct } from './edit-product';
import { Product } from'@/types/product';
import { DeleteProduct } from './delete-product';
import { Coins } from 'lucide-react';

export function ProductRow({ product }: { product: Product }) {
  return (
    <TableRow key={product._id}>
      <TableCell className="font-medium">{product.name}</TableCell>
      <TableCell>{product.category}</TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Coins className="h-4 w-4 text-yellow-500" />
          {product.price}
        </div>
      </TableCell>
      <TableCell>{product.stock}</TableCell>
      <TableCell>
        <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
          {product.stock > 0 ? 'Disponível' : 'Indisponível'}
        </Badge>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-4">
          <EditProduct product={product} />

          <DeleteProduct product={product} />
        </div>
      </TableCell>
    </TableRow>
  );
}
