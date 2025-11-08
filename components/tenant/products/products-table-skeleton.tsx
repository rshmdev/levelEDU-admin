'use client';

import { Skeleton } from '@/components/ui/skeleton';
import {

  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';

export function ProductsTableSkeleton() {
  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-4 w-[100px]" /> {/* Nome */}
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-[100px]" /> {/* Preço */}
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-[100px]" /> {/* Estoque */}
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-[50px]" /> {/* Ações */}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-[150px]" /> {/* Nome */}
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[100px]" /> {/* Preço */}
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[100px]" /> {/* Estoque */}
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[50px]" /> {/* Ações */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
