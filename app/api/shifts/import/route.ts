import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { shifts } = await request.json();
    const db = await getDb();
    
    await db.run('BEGIN TRANSACTION');

    for (const shift of shifts) {
      await db.run(
        'INSERT INTO shifts (date, staff_id, location_id, status) VALUES (?, ?, ?, ?)',
        [shift.date, shift.staffId, shift.locationId, 'pending']
      );
    }

    await db.run('COMMIT');
    return NextResponse.json({ message: 'シフトデータが正常にインポートされました。' });
  } catch (error) {
    const db = await getDb();
    await db.run('ROLLBACK');
    return NextResponse.json({ error: 'Failed to import shifts' }, { status: 500 });
  }
}