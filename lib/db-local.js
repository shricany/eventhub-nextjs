import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'eventhub.db');
const db = new Database(dbPath);

// Initialize database tables
export function initDatabase() {
  try {
    // Create admins table
    db.exec(`
      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create students table
    db.exec(`
      CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        department TEXT NOT NULL,
        year INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create events table
    db.exec(`
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        date DATE NOT NULL,
        time TIME NOT NULL,
        location TEXT NOT NULL,
        department TEXT NOT NULL,
        registration_deadline DATETIME NOT NULL,
        award TEXT,
        description TEXT,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        admin_id INTEGER REFERENCES admins(id)
      )
    `);

    // Create event_participations table
    db.exec(`
      CREATE TABLE IF NOT EXISTS event_participations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER REFERENCES students(id),
        event_id INTEGER REFERENCES events(id),
        status TEXT NOT NULL,
        participation_type TEXT,
        feedback TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(student_id, event_id)
      )
    `);

    console.log('Local SQLite database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

export { db };