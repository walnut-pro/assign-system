const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');

async function initializeDb() {
  // データディレクトリの作成
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  const db = await open({
    filename: path.join(dataDir, 'database.sqlite'),
    driver: sqlite3.Database
  });

  // テーブルの作成
  await db.exec(`
    CREATE TABLE IF NOT EXISTS shifts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      staff_id INTEGER,
      location_id INTEGER,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (staff_id) REFERENCES staff (id),
      FOREIGN KEY (location_id) REFERENCES locations (id)
    );

    CREATE TABLE IF NOT EXISTS locations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      required_staff INTEGER NOT NULL,
      difficulty TEXT CHECK(difficulty IN ('low', 'medium', 'high')),
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS staff (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      skills TEXT,
      line_user_id TEXT,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS wakeup_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      staff_id INTEGER NOT NULL,
      shift_id INTEGER NOT NULL,
      reported_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (staff_id) REFERENCES staff (id),
      FOREIGN KEY (shift_id) REFERENCES shifts (id)
    );

    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      value TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS line_notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      shift_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (shift_id) REFERENCES shifts (id)
    );
  `);

  // サンプルデータの挿入
  await db.run(`
    INSERT INTO staff (name, phone, address, skills, line_user_id, status) VALUES
    ('山田太郎', '090-1234-5678', '東京都渋谷区...', 'フォークリフト,重機操作', 'U1234567890abcdef', 'active'),
    ('佐藤花子', '080-8765-4321', '東京都新宿区...', '荷物運搬,安全管理', 'U2345678901abcdef', 'active'),
    ('鈴木一郎', '070-9876-5432', '東京都豊島区...', 'フォークリフト,荷物運搬', 'U3456789012abcdef', 'active')
  `);

  await db.run(`
    INSERT INTO locations (name, address, required_staff, difficulty, status) VALUES
    ('渋谷現場A', '東京都渋谷区...', 5, 'high', 'active'),
    ('新宿現場B', '東京都新宿区...', 4, 'medium', 'active'),
    ('池袋現場C', '東京都豊島区...', 3, 'low', 'active')
  `);

  await db.run(`
    INSERT INTO shifts (date, staff_id, location_id, status) VALUES
    (date('now'), 1, 1, 'confirmed'),
    (date('now'), 2, 2, 'confirmed'),
    (date('now'), 3, 1, 'confirmed')
  `);

  await db.run(`
    INSERT INTO wakeup_reports (staff_id, shift_id, reported_at) VALUES
    (1, 1, datetime('now')),
    (2, 2, datetime('now'))
  `);

  await db.run(`
    INSERT INTO settings (key, value) VALUES
    ('companyName', '株式会社サンプル'),
    ('timezone', 'Asia/Tokyo'),
    ('autoArchive', 'true'),
    ('emailNotifications', 'true'),
    ('lineNotifications', 'true'),
    ('wakeupAlerts', 'true')
  `);

  // LINE通知のサンプルデータ
  await db.run(`
    INSERT INTO line_notifications (shift_id) VALUES
    (1),
    (2),
    (3)
  `);

  console.log('Database initialized successfully');
  await db.close();
}

initializeDb().catch(console.error);