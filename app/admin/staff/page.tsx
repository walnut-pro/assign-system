import { Suspense } from 'react';
import { getStaff } from './actions';
import { StaffList } from './components/StaffList';
import { StaffHeader } from './components/StaffHeader';
import { StaffListSkeleton } from './components/StaffListSkeleton';

export const dynamic = 'force-dynamic';

export default async function StaffPage() {
  const staff = await getStaff();

  return (
    <div className="space-y-6">
      <StaffHeader />
      <Suspense fallback={<StaffListSkeleton />}>
        <StaffList initialStaff={staff} />
      </Suspense>
    </div>
  );
}