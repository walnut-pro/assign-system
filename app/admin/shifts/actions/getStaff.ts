import { getDb } from '@/lib/db';

export const getStaff = async () => {
  const db = await getDb();
  const staff = await db.all(`
    SELECT * FROM staff 
    WHERE status = 'active' 
    ORDER BY name ASC
  `);
  return staff;
};