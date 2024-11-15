import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { shiftId } = await request.json();
    const db = await getDb();
    
    await db.run(
      'UPDATE shifts SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['confirmed', shiftId]
    );

    return NextResponse.json({ message: 'シフトが確定されました。' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to confirm shift' }, { status: 500 });
  }
}