import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDb();
    const locations = await db.all('SELECT * FROM locations ORDER BY created_at DESC');
    return NextResponse.json(locations);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, address, required_staff, difficulty, status } = body;
    
    const db = await getDb();
    const result = await db.run(
      'INSERT INTO locations (name, address, required_staff, difficulty, status) VALUES (?, ?, ?, ?, ?)',
      [name, address, required_staff, difficulty, status]
    );

    return NextResponse.json({ id: result.lastID });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create location' }, { status: 500 });
  }
}