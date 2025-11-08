import { TableCell, TableRow } from '@/components/ui/table';
import { DeleteStudent } from './delete-student';
import { EditStudent } from './edit-student';
import { Student } from'@/types/student';
import { QrCode, School, Star, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function StudentRow({ student }: { student: Student }) {
  const handlePrintQrCode = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
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
                width: 400px; /* Largura fixa para o QR Code */
                display: block;
                margin: auto;
              }
            </style>
          </head>
          <body>
            <img src="${student.qrcode}" alt="QR Code do estudante ${student.name}" />
            <script>
              window.onload = function() {
                window.print();
                window.close();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <TableRow key={student._id}>
      <TableCell>
        <div className="flex items-center gap-2">
          <span className="font-medium">{student.name}</span>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="flex w-fit items-center gap-1">
          <School className="h-3 w-3" />
          {student?.class?.code} - {student?.class?.name}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge onClick={() => handlePrintQrCode()} variant="secondary" className="flex w-fit items-center gap-1 cursor-pointer">
          <QrCode className="h-3 w-3" />
          Imprimir
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span>{student.stats.coins}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-purple-500" />
            <span>{student.stats.xp}</span>
          </div>
          <Badge variant="outline" className="bg-green-500/10 text-green-500">
            +{student.stats.positiveAttitudes}
          </Badge>
          <Badge variant="outline" className="bg-red-500/10 text-red-500">
            -{student.stats.negativeAttitudes}
          </Badge>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <EditStudent student={student} />
          <DeleteStudent student={student} />
        </div>
      </TableCell>
    </TableRow>
  );
}
