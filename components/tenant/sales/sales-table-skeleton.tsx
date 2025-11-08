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

export function SalesTableSkeleton() {
  return (
    <Card className="w-full overflow-auto">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap">
          <div className="flex flex-col gap-2">
            <div>
              <Skeleton className="h-6 w-[150px]" /> {/* Título */}
            </div>
            <div>
              <Skeleton className="h-4 w-[200px]" /> {/* Descrição */}
            </div>
          </div>
          <Skeleton className="h-6 w-[100px]" /> {/* Badge */}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-4 w-[100px]" /> {/* Produto */}
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-[100px]" /> {/* Preço */}
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-[100px]" /> {/* Aluno */}
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-[100px]" /> {/* Turma */}
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-[100px]" /> {/* Data do Pedido */}
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
                  <Skeleton className="h-4 w-[150px]" /> {/* Produto */}
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[100px]" /> {/* Preço */}
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[150px]" /> {/* Aluno */}
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[100px]" /> {/* Turma */}
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[100px]" /> {/* Data do Pedido */}
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
