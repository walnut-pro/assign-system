import { Suspense } from 'react';
import { getAlerts } from './actions';
import { AlertList } from './components/AlertList';
import { AlertListSkeleton } from './components/AlertListSkeleton';

export const dynamic = 'force-dynamic';

export default async function AlertsPage() {
  const alerts = await getAlerts();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">アラート</h1>
      </div>
      <Suspense fallback={<AlertListSkeleton />}>
        <AlertList initialAlerts={alerts} />
      </Suspense>
    </div>
  );
}