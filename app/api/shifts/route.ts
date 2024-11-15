import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDb();
    const shifts = await db.all(`
      SELECT 
        shifts.*,
        staff.name as staff_name,
        locations.name as location_name,
        locations.address as location_address
      FROM shifts
      LEFT JOIN staff ON shifts.staff_id = staff.id
      LEFT JOIN locations ON shifts.location_id = locations.id
      ORDER BY shifts.date DESC
    `);
    return NextResponse.json(shifts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch shifts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, staffId, locationId, status } = body;
    
    const db = await getDb();
    const result = await db.run(
      'INSERT INTO shifts (date, staff_id, location_id, status) VALUES (?, ?, ?, ?)',
      [date, staffId, locationId, status]
    );

    return NextResponse.json({ id: result.lastID });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create shift' }, { status: 500 });
  }
}