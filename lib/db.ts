import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

export async function getDb() {
  return open({
    filename: path.join(process.cwd(), 'data', 'database.sqlite'),
    driver: sqlite3.Database
  });
}