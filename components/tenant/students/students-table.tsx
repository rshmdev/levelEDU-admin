'use client';

import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  Table
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { StudentRow } from './student-row';
import { useQuery } from '@tanstack/react-query';
import { getStudents } from '@/app/s/[subdomain]/students/actions';
import { AddStudent } from './add-student';
import { BarChart3, QrCode, School, Star, Trophy, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { StatsCardSkeleton } from '../home/stats-card-skeleton';
import { StudentsTableSkeleton } from './students-table-skeleton';
import { EditStudent } from './edit-student';
import { DeleteStudent } from './delete-student';
import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { Student } from'@/types/student';
import { DataTable } from '@/components/shared/data-table';

export function StudentsTable() {
  const { data: students, isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents
  });

  const totalStudents = students?.length || 0;
  const totalCoins = students?.reduce(
    (acc, student) => acc + student.stats.coins,
    0
  );
  const totalXP = students?.reduce((acc, student) => acc + student.stats.xp, 0);
  const averagePositiveAttitudes =
    students &&
    students.reduce(
      (acc, student) => acc + student.stats.positiveAttitudes,
      0
    ) / totalStudents;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 flex-1 overflow-auto">
        <div className="flex items-center justify-between flex-wrap">
          <div>
            <Skeleton className="h-8 w-[200px]" /> {/* Título */}
            <Skeleton className="h-4 w-[300px] mt-2" /> {/* Descrição */}
          </div>
          <Skeleton className="h-10 w-[100px]" /> {/* Botão Adicionar */}
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <StatsCardSkeleton key={index} />
          ))}
        </div>
        <StudentsTableSkeleton /> {/* Skeleton para a tabela */}
      </div>
    );
  }

  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: 'name',
      header: 'Aluno',
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium">{row.original.name}</span>
          </div>
        );
      }
    },
    {
      accessorKey: 'class',
      header: 'Turma',
      cell: ({ row }) => {
        const classInfo = row.original?.class;
        return (
          <Badge variant="outline" className="flex w-fit items-center gap-1">
            <School className="h-3 w-3" />
            {classInfo?.code} - {classInfo?.name}
          </Badge>
        );
      }
    },
    {
      accessorKey: 'qrcode',
      header: 'QR Code',
      cell: ({ row }) => {
        const handlePrintQrCode = () => {
          const iframe = document.createElement('iframe');
          iframe.style.position = 'fixed';
          iframe.style.top = '-10000px';
          iframe.style.left = '-10000px';
          document.body.appendChild(iframe);

          let cleanupTimeout: NodeJS.Timeout | null = null;
          let cleaned = false;

          const cleanup = () => {
            if (cleaned) return;
            cleaned = true;
            
            if (cleanupTimeout) {
              clearTimeout(cleanupTimeout);
            }
            
            try {
              if (iframe.parentNode) {
                iframe.parentNode.removeChild(iframe);
              }
            } catch (e) {
              console.error(e);
            }
            window.focus();
          };

          window.onafterprint = () => {
            console.log('Impressão finalizada, retornando foco.');
            cleanup();
          };

          const htmlContent = `
            <html>
              <head>
                <title>Imprimir QR Code</title>
                <style>
                  body {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                  }
                  img {
                    max-width: 70%;
                    height: auto;
                    width: 400px;
                    display: block;
                    margin: auto;
                  }
                </style>
              </head>
              <body>
                <img id="qrcode-img" src="${row.original.qrcode}" alt="QR Code do estudante ${row.original.name}" />
                <script>
                  (function() {
                    function printWhenLoaded() {
                      window.print();
                    }
                    var img = document.getElementById("qrcode-img");
                    if (img.complete) {
                      // Se a imagem já estiver carregada, imprima imediatamente
                      printWhenLoaded();
                    } else {
                      // Caso contrário, aguarde o evento onload (ou onerror como fallback)
                      img.onload = printWhenLoaded;
                      img.onerror = printWhenLoaded;
                    }
                    // Após a impressão, acione a função definida na janela pai
                    window.onafterprint = function() {
                      if (parent && parent.afterPrint) {
                        parent.afterPrint();
                      }
                    };
                  })();
                <\/script>
              </body>
            </html>
          `;

          const iframeDoc = iframe?.contentWindow?.document;

          if (!iframeDoc) {
            console.error('Não foi possível acessar o documento do iframe');
            cleanup();
            return;
          }
          iframeDoc.open();
          iframeDoc.write(htmlContent);
          iframeDoc.close();

          // Fallback: caso o evento afterprint não seja disparado, remova o iframe após 3 segundos
          cleanupTimeout = setTimeout(() => {
            if (document.body.contains(iframe)) {
              console.log('Fallback: removendo iframe após impressão');
              cleanup();
            }
          }, 3000);
        };
        return (
          <Badge
            onClick={handlePrintQrCode}
            variant="secondary"
            className="flex w-fit items-center gap-1 cursor-pointer"
          >
            <QrCode className="h-3 w-3" />
            Imprimir
          </Badge>
        );
      }
    },
    {
      accessorKey: 'stats',
      header: 'Estatísticas',
      cell: ({ row }) => {
        const stats = row.original.stats;
        return (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span>{stats.coins}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-purple-500" />
              <span>{stats.xp}</span>
            </div>
            <Badge variant="outline" className="bg-green-500/10 text-green-500">
              +{stats.positiveAttitudes}
            </Badge>
            <Badge variant="outline" className="bg-red-500/10 text-red-500">
              -{stats.negativeAttitudes}
            </Badge>
          </div>
        );
      }
    },
    {
      header: 'Ações',
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <EditStudent student={row.original} />
          <DeleteStudent student={row.original} />
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-4 flex-1 overflow-auto pb-2">
      <div className="flex items-center justify-between flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Alunos</h1>
          <p className="text-muted-foreground">
            Gerencie os alunos cadastrados
          </p>
        </div>
        <AddStudent />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Alunos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de COINS
            </CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCoins}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de XP</CardTitle>
            <Star className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalXP}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Média de Atitudes Positivas
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {averagePositiveAttitudes?.toFixed(1) || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent>
          <DataTable data={students || []} columns={columns} />
        </CardContent>
      </Card>
    </div>
  );
}
