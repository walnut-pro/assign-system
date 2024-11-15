import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { shiftId } = await request.json();
    const db = await getDb();
    
    await db.run(
      'UPDATE shifts SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['pending', shiftId]
    );

    return NextResponse.json({ 
      success: true,
      message: 'シフトの確定をキャンセルしました。'
    });
  } catch (error) {
    console.error('Error canceling shift confirmation:', error);
    return NextResponse.json(
      { error: 'Failed to cancel shift confirmation' },
      { status: 500 }
    );
  }
}