import { getDb } from '@/lib/db';

export const getLocations = async () => {
  const db = await getDb();
  const locations = await db.all(`
    SELECT * FROM locations 
    WHERE status = 'active' 
    ORDER BY created_at DESC
  `);
  return locations;
};