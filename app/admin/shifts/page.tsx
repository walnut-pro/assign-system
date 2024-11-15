import { Suspense } from 'react';
import { ShiftPageHeader } from './components/ShiftPageHeader';
import { ShiftTabs } from './components/ShiftTabs';
import { ShiftPageSkeleton } from './components/ShiftPageSkeleton';

export const dynamic = 'auto';
export const revalidate = 0;

export default function ShiftsPage() {
  return (
    <div className="space-y-6">
      <ShiftPageHeader />
      <Suspense fallback={<ShiftPageSkeleton />}>
        <ShiftTabs />
      </Suspense>
    </div>
  );
}