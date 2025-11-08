'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function TopStudentsTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div>
          <Skeleton className="h-6 w-[150px]" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
