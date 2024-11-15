import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDb();
    const shiftId = parseInt(params.id);

    // 現在時刻を起床報告時刻として記録
    await db.run(`
      INSERT INTO wakeup_reports (staff_id, shift_id, reported_at)
      SELECT staff_id, id, CURRENT_TIMESTAMP
      FROM shifts
      WHERE id = ?
      AND NOT EXISTS (
        SELECT 1 FROM wakeup_reports WHERE shift_id = ?
      )
    `, [shiftId, shiftId]);

    return NextResponse.json({ 
      success: true,
      message: 'アラートが確認されました。'
    });
  } catch (error) {
    console.error('Error confirming alert:', error);
    return NextResponse.json(
      { error: 'Failed to confirm alert' },
      { status: 500 }
    );
  }
}