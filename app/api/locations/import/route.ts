import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { locations } = await request.json();
    const db = await getDb();
    
    await db.run('BEGIN TRANSACTION');

    for (const location of locations) {
      await db.run(
        'INSERT INTO locations (name, address, required_staff, difficulty, status) VALUES (?, ?, ?, ?, ?)',
        [location.name, location.address, location.required_staff, location.difficulty, 'active']
      );
    }

    await db.run('COMMIT');
    return NextResponse.json({ message: '現場データが正常にインポートされました。' });
  } catch (error) {
    const db = await getDb();
    await db.run('ROLLBACK');
    return NextResponse.json({ error: 'Failed to import locations' }, { status: 500 });
  }
}