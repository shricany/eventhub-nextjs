import { sql } from '@vercel/postgres';

// Database connection utility
export { sql };

// Initialize database tables
export async function initDatabase() {
  try {
    // Create admins table
    await sql`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(80) UNIQUE NOT NULL,
        email VARCHAR(120) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create students table
    await sql`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(120) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        department VARCHAR(100) NOT NULL,
        year INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create events table
    await sql`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        date DATE NOT NULL,
        time TIME NOT NULL,
        location VARCHAR(200) NOT NULL,
        department VARCHAR(100) NOT NULL,
        registration_deadline TIMESTAMP NOT NULL,
        award VARCHAR(500),
        description TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        admin_id INTEGER REFERENCES admins(id)
      )
    `;

    // Create event_participations table
    await sql`
      CREATE TABLE IF NOT EXISTS event_participations (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students(id),
        event_id INTEGER REFERENCES events(id),
        status VARCHAR(20) NOT NULL,
        participation_type VARCHAR(20),
        feedback TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(student_id, event_id)
      )
    `;

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}