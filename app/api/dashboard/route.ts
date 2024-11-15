import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDb();

    // 本日の現場数
    const locationCount = await db.get(`
      SELECT COUNT(DISTINCT location_id) as count
      FROM shifts
      WHERE date = date('now')
    `);

    // 本日の稼働スタッフ数
    const activeStaffCount = await db.get(`
      SELECT COUNT(DISTINCT staff_id) as count
      FROM shifts
      WHERE date = date('now')
      AND status = 'confirmed'
    `);

    // 未確定シフト数
    const pendingShiftCount = await db.get(`
      SELECT COUNT(*) as count
      FROM shifts
      WHERE date >= date('now')
      AND status = 'pending'
    `);

    // 未確認アラート数（起床報告未提出）
    const unconfirmedAlertCount = await db.get(`
      SELECT COUNT(*) as count
      FROM shifts s
      LEFT JOIN wakeup_reports w ON s.id = w.shift_id
      WHERE s.date = date('now')
      AND s.status = 'confirmed'
      AND w.id IS NULL
    `);

    // 本日の現場状況
    const todayLocations = await db.all(`
      SELECT 
        l.name,
        l.required_staff,
        COUNT(DISTINCT s.staff_id) as confirmed_staff,
        COUNT(DISTINCT w.id) as wakeup_reports
      FROM locations l
      JOIN shifts s ON l.id = s.location_id
      LEFT JOIN wakeup_reports w ON s.id = w.shift_id
      WHERE s.date = date('now')
      GROUP BY l.id
    `);

    return NextResponse.json({
      locationCount: locationCount.count,
      activeStaffCount: activeStaffCount.count,
      pendingShiftCount: pendingShiftCount.count,
      unconfirmedAlertCount: unconfirmedAlertCount.count,
      todayLocations
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}