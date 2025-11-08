'use client';

import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Trophy, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {
  getClassesByTeacher,
  getClassUsers,
  Student
} from '@/app/s/[subdomain]/teacher-dashboard/actions';
import { useSession } from 'next-auth/react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/shared/data-table';
import { AssignMissionModal } from './complete-mission';
import { RewardModal } from './reward-modal';
import { Session } from 'next-auth';

export default function TeacherDashboard({
  session
}: {
  session: Session | null;
}) {
  const [selectedClass, setSelectedClass] = useState<string | undefined>();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: classes, isLoading: classesLoading } = useQuery({
    queryKey: ['teacher-dashboard-classes', session?.user?.id],
    queryFn: () => getClassesByTeacher(session?.user?.id!),
    enabled: !!session?.user?.id
  });

  const { data } = useQuery({
    queryKey: ['teacher-dashboard', selectedClass],
    queryFn: () => getClassUsers(selectedClass!),
    enabled: !!selectedClass && !classesLoading,
    select: (data: any) =>
      data?.filter((user: any) => user.name.includes(searchTerm))
  });

  useEffect(() => {
    if (!selectedClass && classes?.length) {
      setSelectedClass(classes[0]._id);
    }
  }, [classes]);

  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: 'name',
      header: 'Nome',
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      )
    },
    {
      accessorKey: 'completedMissions',
      header: 'Missões Concluídas',
      cell: ({ row }) => <span>{row.original.completedMissions.length}</span>
    },
    {
      accessorKey: 'rewards',
      header: 'Recompensas',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span>{row.original.coins}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-purple-500" />
            <span>{row.original.xp}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Ações',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <AssignMissionModal student={row.original} />
          <RewardModal student={row.original} />
        </div>
      )
    }
  ];

  return (
    <div className="p-2 flex-1 overflow-auto">
      <h1 className="text-3xl font-bold mb-6">Painel do Professor</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4 flex-wrap">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione a turma" />
            </SelectTrigger>
            <SelectContent>
              {classes?.map((cls) => (
                <SelectItem key={cls._id} value={cls._id}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar aluno"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 max-w-xl"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-y-auto flex flex-col">
        <CardHeader>
          <CardTitle>Lista de Alunos</CardTitle>
        </CardHeader>
        <CardContent className="overflow-y-auto flex-1">
          <DataTable data={data || []} columns={columns} />
        </CardContent>
      </Card>
    </div>
  );
}
