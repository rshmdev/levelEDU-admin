import { TableCell, TableRow } from '@/components/ui/table';
import { Sales } from'@/types/sales';
import { DeliveryProduct } from './delivery-product';
import { Calendar, School } from 'lucide-react';

export function SaleRow({ sale }: { sale: Sales }) {
  return (
    <TableRow>
      <TableCell className="font-medium">{sale?.productId?.name}</TableCell>
      <TableCell>{sale.productId.price}</TableCell>
      <TableCell>{sale?.userId?.name}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <School className="h-4 w-4 text-muted-foreground" />
          {sale?.userId?.class?.name} - {sale?.userId?.class?.code}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          {new Date(sale.createdAt).toLocaleDateString('pt-BR')}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <DeliveryProduct sale={sale} />
      </TableCell>
    </TableRow>
  );
}
