import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export async function POST() {
  const db = await getDb();
  
  try {
    // トランザクション開始
    await db.run('BEGIN TRANSACTION');

    // 本日のシフト情報を取得
    const shifts = await db.all(`
      SELECT 
        s.id,
        s.date,
        st.name as staff_name,
        st.line_user_id,
        l.name as location_name,
        l.address as location_address,
        s.status
      FROM shifts s
      JOIN staff st ON s.staff_id = st.id
      JOIN locations l ON s.location_id = l.id
      WHERE date(s.date) = date('now')
      AND s.status = 'confirmed'
      AND st.line_user_id IS NOT NULL
    `);

    if (shifts.length === 0) {
      await db.run('ROLLBACK');
      return NextResponse.json({
        success: true,
        message: '送信対象のシフトがありません'
      });
    }

    // 既存の通知を確認（重複送信防止）
    const existingNotifications = await db.all(`
      SELECT shift_id 
      FROM line_notifications 
      WHERE date(created_at) = date('now')
    `);
    const existingShiftIds = new Set(existingNotifications.map(n => n.shift_id));

    // 新規通知のみを送信
    const newShifts = shifts.filter(shift => !existingShiftIds.has(shift.id));

    if (newShifts.length === 0) {
      await db.run('ROLLBACK');
      return NextResponse.json({
        success: true,
        message: '本日の通知は既に送信済みです'
      });
    }

    // LINE通知レコードを作成
    for (const shift of newShifts) {
      await db.run(
        'INSERT INTO line_notifications (shift_id) VALUES (?)',
        [shift.id]
      );
    }

    // トランザクション確定
    await db.run('COMMIT');

    // デモ用のモックデータ
    const mockMessages = newShifts.map(shift => ({
      userId: shift.line_user_id,
      staffName: shift.staff_name,
      locationName: shift.location_name,
      date: format(new Date(shift.date), 'M月d日(E)', { locale: ja }),
      address: shift.location_address,
      timestamp: format(new Date(), 'HH:mm', { locale: ja })
    }));

    return NextResponse.json({
      success: true,
      message: `${newShifts.length}件のLINE通知を送信しました`,
      debug: {
        messages: mockMessages
      }
    });
  } catch (error) {
    // エラー時はロールバック
    await db.run('ROLLBACK');
    
    console.error('Error sending LINE notifications:', error);
    return NextResponse.json({
      success: false,
      message: 'LINE通知の送信に失敗しました',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}