import { getDb } from '@/lib/db';

export async function seedDatabase() {
  const db = await getDb();

  // サンプルスタッフデータ
  await db.run(`
    INSERT INTO staff (name, phone, address, skills, status) VALUES
    ('山田太郎', '090-1234-5678', '東京都渋谷区...', 'フォークリフト,重機操作', 'active'),
    ('佐藤花子', '080-8765-4321', '東京都新宿区...', '荷物運搬,安全管理', 'active'),
    ('鈴木一郎', '070-9876-5432', '東京都豊島区...', 'フォークリフト,荷物運搬', 'active')
  `);

  // サンプル現場データ
  await db.run(`
    INSERT INTO locations (name, address, required_staff, difficulty, status) VALUES
    ('渋谷現場A', '東京都渋谷区...', 5, 'high', 'active'),
    ('新宿現場B', '東京都新宿区...', 4, 'medium', 'active'),
    ('池袋現場C', '東京都豊島区...', 3, 'low', 'active')
  `);

  // サンプルシフトデータ
  await db.run(`
    INSERT INTO shifts (date, staff_id, location_id, status) VALUES
    (date('now'), 1, 1, 'confirmed'),
    (date('now'), 2, 2, 'confirmed'),
    (date('now'), 3, 1, 'confirmed')
  `);

  // サンプル起床報告データ
  await db.run(`
    INSERT INTO wakeup_reports (staff_id, shift_id, reported_at) VALUES
    (1, 1, datetime('now')),
    (2, 2, datetime('now'))
  `);

  console.log('Database seeded successfully');
}