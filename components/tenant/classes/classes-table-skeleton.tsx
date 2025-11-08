'use client';

import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';

export function ClassesTableSkeleton() {
  return (
    <Card className="overflow-auto">
      <CardHeader>
        <div>
          <Skeleton className="h-6 w-[100px]" /> {/* Título */}
        </div>
        <div>
          <Skeleton className="h-4 w-[200px]" /> {/* Descrição */}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-4 w-[100px]" /> {/* Código */}
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-[100px]" /> {/* Nome */}
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
                  <Skeleton className="h-4 w-[150px]" /> {/* Código */}
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[200px]" /> {/* Nome */}
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
