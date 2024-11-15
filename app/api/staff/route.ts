import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDb();
    const staff = await db.all('SELECT * FROM staff ORDER BY created_at DESC');
    return NextResponse.json(staff);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, address, skills, status } = body;
    
    const db = await getDb();
    const result = await db.run(
      'INSERT INTO staff (name, phone, address, skills, status) VALUES (?, ?, ?, ?, ?)',
      [name, phone, address, skills.join(','), status]
    );

    return NextResponse.json({ id: result.lastID });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create staff' }, { status: 500 });
  }
}