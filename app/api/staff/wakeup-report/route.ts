import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { staffId, shiftId, timestamp } = await request.json();
    const db = await getDb();
    
    await db.run(
      'INSERT INTO wakeup_reports (staff_id, shift_id, reported_at) VALUES (?, ?, ?)',
      [staffId, shiftId, timestamp]
    );

    return NextResponse.json({ message: '起床報告が送信されました。' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit wakeup report' }, { status: 500 });
  }
}