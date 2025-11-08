import TeacherDashboard from '@/components/tenant/teacher-admin/teacher-dashboard';
import { auth } from '@/lib/auth';

export default async function ClassesPage() {
  const session = await auth();
  return <TeacherDashboard session={session} />;
}
