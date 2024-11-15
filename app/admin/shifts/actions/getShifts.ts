import { getDb } from '@/lib/db';
import { format } from 'date-fns';
import { unstable_cache } from 'next/cache';

export const getShiftsForDate = async (date: Date) => {
  const db = await getDb();
  const formattedDate = format(date, 'yyyy-MM-dd');
  
  const shifts = await db.all(`
    SELECT 
      shifts.*,
      staff.name as staff_name,
      locations.name as location_name,
      locations.address as location_address
    FROM shifts
    LEFT JOIN staff ON shifts.staff_id = staff.id
    LEFT JOIN locations ON shifts.location_id = locations.id
    WHERE date(shifts.date) = date(?)
    ORDER BY shifts.created_at DESC
  `, [formattedDate]);

  return shifts;
};