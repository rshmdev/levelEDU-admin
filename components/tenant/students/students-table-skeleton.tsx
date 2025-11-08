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

export function StudentsTableSkeleton() {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-4 w-[100px]" /> {/* Aluno */}
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-[100px]" /> {/* Turma */}
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-[100px]" /> {/* QR Code */}
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-[100px]" /> {/* Estatísticas */}
              </TableHead>
              <TableHead className="text-right">
                <Skeleton className="h-4 w-[50px]" /> {/* Ações */}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-[150px]" /> {/* Aluno */}
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[100px]" /> {/* Turma */}
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[100px]" /> {/* QR Code */}
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[100px]" /> {/* Estatísticas */}
                </TableCell>
                <TableCell className="text-right">
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
