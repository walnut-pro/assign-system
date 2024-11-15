import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDb();
    const settings = await db.all('SELECT * FROM settings');
    return NextResponse.json(
      settings.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {})
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const db = await getDb();
    
    for (const [key, value] of Object.entries(body)) {
      await db.run(
        `INSERT INTO settings (key, value) 
         VALUES (?, ?) 
         ON CONFLICT(key) DO UPDATE SET value = ?`,
        [key, value, value]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}