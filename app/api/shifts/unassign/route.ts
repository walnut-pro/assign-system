import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function PUT(request: Request) {
  const db = await getDb();
  
  try {
    const { shiftId } = await request.json();

    if (!shiftId) {
      return NextResponse.json(
        { error: '必要なパラメータが不足しています' },
        { status: 400 }
      );
    }

    // トランザクション開始
    await db.run('BEGIN TRANSACTION');

    // シフトの存在確認とステータスチェック
    const shift = await db.get(
      'SELECT status FROM shifts WHERE id = ?',
      [shiftId]
    );

    if (!shift) {
      await db.run('ROLLBACK');
      return NextResponse.json(
        { error: '指定されたシフトが見つかりません' },
        { status: 404 }
      );
    }

    if (shift.status === 'confirmed') {
      await db.run('ROLLBACK');
      return NextResponse.json(
        { error: '確定済みのシフトは解除できません' },
        { status: 400 }
      );
    }

    // スタッフのアサインを解除
    await db.run(
      'UPDATE shifts SET staff_id = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [shiftId]
    );

    // トランザクション確定
    await db.run('COMMIT');

    return NextResponse.json({ 
      success: true,
      message: 'スタッフのアサインを解除しました'
    });
  } catch (error) {
    // エラー時はロールバック
    await db.run('ROLLBACK');
    
    console.error('Error unassigning staff:', error);
    return NextResponse.json(
      { error: 'スタッフのアサイン解除に失敗しました' },
      { status: 500 }
    );
  }
}