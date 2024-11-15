import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDb();
    const staff = await db.get('SELECT * FROM staff WHERE id = ?', [params.id]);
    
    if (!staff) {
      return NextResponse.json(
        { error: 'Staff member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(staff);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch staff member' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, phone, address, skills, status } = body;
    
    const db = await getDb();
    await db.run(
      `UPDATE staff 
       SET name = ?, phone = ?, address = ?, skills = ?, status = ?, 
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [name, phone, address, skills.join(','), status, params.id]
    );

    return NextResponse.json({ message: 'Staff member updated successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update staff member' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDb();
    await db.run('DELETE FROM staff WHERE id = ?', [params.id]);
    return NextResponse.json({ message: 'Staff member deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete staff member' },
      { status: 500 }
    );
  }
}