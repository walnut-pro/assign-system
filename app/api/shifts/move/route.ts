import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function PUT(request: Request) {
  const db = await getDb();
  
  try {
    const { shiftId, newLocationId, date } = await request.json();

    if (!shiftId || !newLocationId || !date) {
      return NextResponse.json(
        { error: '必要なパラメータが不足しています' },
        { status: 400 }
      );
    }

    // トランザクション開始
    await db.run('BEGIN TRANSACTION');

    // 現在のシフト情報を取得
    const currentShift = await db.get(
      'SELECT staff_id, status FROM shifts WHERE id = ?',
      [shiftId]
    );

    if (!currentShift) {
      await db.run('ROLLBACK');
      return NextResponse.json(
        { error: '指定されたシフトが見つかりません' },
        { status: 404 }
      );
    }

    if (currentShift.status === 'confirmed') {
      await db.run('ROLLBACK');
      return NextResponse.json(
        { error: '確定済みのシフトは移動できません' },
        { status: 400 }
      );
    }

    // 新しい現場の必要人数を取得
    const location = await db.get(
      'SELECT required_staff FROM locations WHERE id = ?',
      [newLocationId]
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
      [newLocationId, date]
    );

    // 必要人数を超えていないかチェック
    if (currentAssignments.count >= location.required_staff) {
      await db.run('ROLLBACK');
      return NextResponse.json(
        { error: '移動先の現場は既に必要人数に達しています' },
        { status: 400 }
      );
    }

    // シフトの移動
    await db.run(
      'UPDATE shifts SET location_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newLocationId, shiftId]
    );

    // トランザクション確定
    await db.run('COMMIT');

    return NextResponse.json({ 
      success: true,
      message: 'スタッフを移動しました'
    });
  } catch (error) {
    // エラー時はロールバック
    await db.run('ROLLBACK');
    
    console.error('Error moving staff:', error);
    return NextResponse.json(
      { error: 'スタッフの移動に失敗しました' },
      { status: 500 }
    );
  }
}