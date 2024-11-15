import { getDb } from '@/lib/db';

export async function getAlerts() {
  const db = await getDb();
  const alerts = await db.all(`
    SELECT 
      shifts.id as shift_id,
      staff.id as staff_id,
      staff.name as staff_name,
      locations.name as location_name,
      shifts.date,
      wakeup_reports.reported_at,
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
    ORDER BY wakeup_reports.reported_at DESC
  `);
  return alerts;
}

export async function confirmAlert(shiftId: number) {
  const db = await getDb();
  await db.run(`
    UPDATE wakeup_reports
    SET confirmed = true,
        confirmed_at = CURRENT_TIMESTAMP
    WHERE shift_id = ?
  `, [shiftId]);
  return { success: true };
}