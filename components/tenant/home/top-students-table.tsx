import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface TopStudent {
  name: string
  coins: number
}

interface TopStudentsTableProps {
  students: TopStudent[]
}

export function TopStudentsTable({ students }: TopStudentsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead className="text-right">Coins</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => (
          <TableRow key={student.name}>
            <TableCell className="font-medium">{student.name}</TableCell>
            <TableCell className="text-right">{student.coins}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

