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

export function MissionsTableSkeleton() {
  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-4 w-[100px]" /> {/* Título */}
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-[150px]" /> {/* Descrição */}
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-[100px]" /> {/* Prêmio */}
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
                  <Skeleton className="h-4 w-[150px]" /> {/* Título */}
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[200px]" /> {/* Descrição */}
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[100px]" /> {/* Prêmio */}
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
