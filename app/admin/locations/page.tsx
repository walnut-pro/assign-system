import { Suspense } from 'react';
import { getLocations } from './actions';
import { LocationList } from './components/LocationList';
import { LocationHeader } from './components/LocationHeader';
import { LocationListSkeleton } from './components/LocationListSkeleton';

export const dynamic = 'force-dynamic';

export default async function LocationsPage() {
  const locations = await getLocations();

  return (
    <div className="space-y-6">
      <LocationHeader />
      <Suspense fallback={<LocationListSkeleton />}>
        <LocationList initialLocations={locations} />
      </Suspense>
    </div>
  );
}