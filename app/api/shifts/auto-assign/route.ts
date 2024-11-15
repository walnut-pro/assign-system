import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

interface Staff {
  id: number;
  name: string;
  address: string;
  skills: string;
  status: string;
}

interface Location {
  id: number;
  name: string;
  address: string;
  required_staff: number;
  difficulty: string;
}

export async function POST() {
  try {
    const db = await getDb();

    // トランザクション開始
    await db.run('BEGIN TRANSACTION');

    // 未アサインのシフトを取得
    const unassignedShifts = await db.all(`
      SELECT s.*, l.required_staff, l.difficulty, l.address as location_address
      FROM shifts s
      JOIN locations l ON s.location_id = l.id
      WHERE s.staff_id IS NULL
      AND s.status = 'pending'
      AND date(s.date) >= date('now')
      ORDER BY s.date ASC, l.difficulty DESC
    `);

    // 利用可能なスタッフを取得
    const availableStaff = await db.all(`
      SELECT * FROM staff
      WHERE status = 'active'
    `);

    for (const shift of unassignedShifts) {
      // スタッフの優先順位付け
      const rankedStaff = availableStaff
        .map((staff: Staff) => {
          // スキルマッチングスコア
          const skillScore = calculateSkillScore(staff, shift.difficulty);
          
          // 距離スコア（住所の文字列一致度で簡易的に計算）
          const distanceScore = calculateDistanceScore(
            staff.address,
            shift.location_address
          );

          // 総合スコア
          const totalScore = skillScore + distanceScore;

          return { ...staff, score: totalScore };
        })
        .sort((a, b) => b.score - a.score);

      // 最適なスタッフを選択
      const bestStaff = rankedStaff[0];
      if (bestStaff) {
        await db.run(
          'UPDATE shifts SET staff_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [bestStaff.id, shift.id]
        );
      }
    }

    // トランザクション確定
    await db.run('COMMIT');

    return NextResponse.json({ 
      message: 'シフトの自動振り分けが完了しました。'
    });
  } catch (error) {
    const db = await getDb();
    await db.run('ROLLBACK');
    console.error('Error in auto-assign:', error);
    return NextResponse.json(
      { error: 'Failed to auto-assign shifts' },
      { status: 500 }
    );
  }
}

// スキルスコアを計算
function calculateSkillScore(staff: Staff, difficulty: string): number {
  const staffSkills = staff.skills.split(',');
  let score = 0;

  // 基本スコア
  score += staffSkills.length * 10;

  // 難易度に応じたボーナス
  if (difficulty === 'high' && staffSkills.includes('フォークリフト')) {
    score += 30;
  }
  if (difficulty === 'high' && staffSkills.includes('重機操作')) {
    score += 30;
  }
  if (staffSkills.includes('安全管理')) {
    score += 20;
  }

  return score;
}

// 距離スコアを計算（簡易版）
function calculateDistanceScore(staffAddress: string, locationAddress: string): number {
  // 住所の一致度で簡易的にスコアを計算
  const staffParts = staffAddress.split('区')[0];
  const locationParts = locationAddress.split('区')[0];
  
  if (staffParts === locationParts) {
    return 50; // 同じ区
  }
  
  if (staffParts.includes('東京都') && locationParts.includes('東京都')) {
    return 30; // 同じ都内
  }
  
  return 0;
}