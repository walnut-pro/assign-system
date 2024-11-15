import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDb();
    const alerts = await db.all(`
      SELECT 
        shifts.id as shift_id,
        staff.id as staff_id,
        staff.name as staff_name,
        locations.name as location_name,
        shifts.date,
        CASE 
          WHEN wakeup_reports.id IS NULL THEN '未連絡'
          ELSE '報告済み'
        END as status
      FROM shifts
      JOIN staff ON shifts.staff_id = staff.id
      JOIN locations ON shifts.location_id = locations.id
      LEFT JOIN wakeup_reports ON shifts.id = wakeup_reports.shift_id
      WHERE shifts.date = date('now')
      AND shifts.status = 'confirmed'
    `);

    return NextResponse.json({ alerts });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 });
  }
}