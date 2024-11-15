import { getDb } from '@/lib/db';

export async function getStaff() {
  const db = await getDb();
  const staff = await db.all(`
    SELECT * FROM staff 
    ORDER BY created_at DESC
  `);
  return staff;
}

export async function createStaff(data: {
  name: string;
  phone: string;
  address: string;
  skills: string[];
  status: string;
}) {
  const db = await getDb();
  const result = await db.run(
    'INSERT INTO staff (name, phone, address, skills, status) VALUES (?, ?, ?, ?, ?)',
    [data.name, data.phone, data.address, data.skills.join(','), data.status]
  );
  return result;
}

export async function updateStaff(id: number, data: {
  name?: string;
  phone?: string;
  address?: string;
  skills?: string[];
  status?: string;
}) {
  const db = await getDb();
  const updates = [];
  const values = [];

  if (data.name) {
    updates.push('name = ?');
    values.push(data.name);
  }
  if (data.phone) {
    updates.push('phone = ?');
    values.push(data.phone);
  }
  if (data.address) {
    updates.push('address = ?');
    values.push(data.address);
  }
  if (data.skills) {
    updates.push('skills = ?');
    values.push(data.skills.join(','));
  }
  if (data.status) {
    updates.push('status = ?');
    values.push(data.status);
  }

  if (updates.length === 0) return null;

  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  const result = await db.run(
    `UPDATE staff SET ${updates.join(', ')} WHERE id = ?`,
    values
  );
  return result;
}