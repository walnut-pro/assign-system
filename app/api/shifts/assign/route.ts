import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function PUT(request: Request) {
  const db = await getDb();
  
  try {
    const { staffId, locationId, date } = await request.json();

    if (!staffId || !locationId || !date) {
      return NextResponse.json(
        { error: '必要なパラメータが不足しています' },
        { status: 400 }
      );
    }

    // トランザクション開始
    await db.run('BEGIN TRANSACTION');

    // 現場の必要人数を取得
    const location = await db.get(
      'SELECT required_staff FROM locations WHERE id = ?',
      [locationId]
    );

    if (!location) {
      await db.run('ROLLBACK');
      return NextResponse.json(
        { error: '指定された現場が見つかりません' },
        { status: 404 }
      );
    }

    // 現在のアサイン数を取得（指定された日付の）
    const currentAssignments = await db.get(
      'SELECT COUNT(*) as count FROM shifts WHERE location_id = ? AND staff_id IS NOT NULL AND date = date(?)',
      [locationId, date]
    );

    // 必要人数を超えていないかチェック
    if (currentAssignments.count >= location.required_staff) {
      await db.run('ROLLBACK');
      return NextResponse.json(
        { error: '必要人数を超えてアサインすることはできません' },
        { status: 400 }
      );
    }

    // スタッフが同じ日の他の現場にアサインされていないかチェック
    const existingAssignment = await db.get(
      `SELECT l.name as location_name 
       FROM shifts s
       JOIN locations l ON s.location_id = l.id
       WHERE s.staff_id = ? 
       AND date(s.date) = date(?)
       AND s.location_id != ?`,
      [staffId, date, locationId]
    );

    if (existingAssignment) {
      await db.run('ROLLBACK');
      return NextResponse.json(
        { error: `このスタッフは同じ日に${existingAssignment.location_name}にアサインされています` },
        { status: 400 }
      );
    }

    // 既存のシフトを確認（同じ現場の同じ日）
    const existingShift = await db.get(
      'SELECT id FROM shifts WHERE location_id = ? AND staff_id = ? AND date = date(?)',
      [locationId, staffId, date]
    );

    if (existingShift) {
      await db.run('ROLLBACK');
      return NextResponse.json(
        { error: 'このスタッフは既にこの日の同じ現場にアサインされています' },
        { status: 400 }
      );
    }

    // シフトを作成
    const result = await db.run(
      'INSERT INTO shifts (date, location_id, staff_id, status) VALUES (?, ?, ?, ?)',
      [date, locationId, staffId, 'pending']
    );

    // トランザクション確定
    await db.run('COMMIT');

    return NextResponse.json({ 
      success: true,
      message: 'スタッフがアサインされました',
      shiftId: result.lastID
    });
  } catch (error) {
    // エラー時はロールバック
    await db.run('ROLLBACK');
    
    console.error('Error assigning staff:', error);
    return NextResponse.json(
      { error: 'スタッフのアサインに失敗しました' },
      { status: 500 }
    );
  }
}