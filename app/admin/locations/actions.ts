import { getDb } from '@/lib/db';

export async function getLocations() {
  const db = await getDb();
  const locations = await db.all(`
    SELECT * FROM locations 
    ORDER BY created_at DESC
  `);
  return locations;
}

export async function createLocation(data: {
  name: string;
  address: string;
  required_staff: number;
  difficulty: 'low' | 'medium' | 'high';
  status: string;
}) {
  const db = await getDb();
  const result = await db.run(
    'INSERT INTO locations (name, address, required_staff, difficulty, status) VALUES (?, ?, ?, ?, ?)',
    [data.name, data.address, data.required_staff, data.difficulty, data.status]
  );
  return result;
}

export async function updateLocation(id: number, data: {
  name?: string;
  address?: string;
  required_staff?: number;
  difficulty?: 'low' | 'medium' | 'high';
  status?: string;
}) {
  const db = await getDb();
  const updates = [];
  const values = [];

  if (data.name) {
    updates.push('name = ?');
    values.push(data.name);
  }
  if (data.address) {
    updates.push('address = ?');
    values.push(data.address);
  }
  if (data.required_staff) {
    updates.push('required_staff = ?');
    values.push(data.required_staff);
  }
  if (data.difficulty) {
    updates.push('difficulty = ?');
    values.push(data.difficulty);
  }
  if (data.status) {
    updates.push('status = ?');
    values.push(data.status);
  }

  if (updates.length === 0) return null;

  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  const result = await db.run(
    `UPDATE locations SET ${updates.join(', ')} WHERE id = ?`,
    values
  );
  return result;
}