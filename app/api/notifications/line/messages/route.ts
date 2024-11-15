import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export async function GET() {
  const db = await getDb();
  
  try {
    // 本日のシフト通知を取得
    const notifications = await db.all(`
      SELECT 
        n.id,
        n.created_at,
        s.date,
        st.name as staff_name,
        st.line_user_id,
        l.name as location_name,
        l.address as location_address
      FROM line_notifications n
      JOIN shifts s ON n.shift_id = s.id
      JOIN staff st ON s.staff_id = st.id
      JOIN locations l ON s.location_id = l.id
      WHERE date(n.created_at) = date('now')
      ORDER BY n.created_at DESC
    `);

    const messages = notifications.map(n => ({
      userId: n.line_user_id,
      staffName: n.staff_name,
      locationName: n.location_name,
      date: format(new Date(n.date), 'M月d日(E)', { locale: ja }),
      address: n.location_address,
      timestamp: format(new Date(n.created_at), 'HH:mm', { locale: ja })
    }));

    return NextResponse.json({
      success: true,
      messages
    });
  } catch (error) {
    console.error('Error fetching LINE messages:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch LINE messages'
    }, { status: 500 });
  }
}