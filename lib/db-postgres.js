import { sql } from '@vercel/postgres';

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

    // Create comments table
    await sql`
      CREATE TABLE IF NOT EXISTS event_comments (
        id SERIAL PRIMARY KEY,
        event_id INTEGER REFERENCES events(id),
        student_id INTEGER REFERENCES students(id),
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

export const db = {
  // Admin operations
  createAdmin: async (admin) => {
    const result = await sql`
      INSERT INTO admins (username, email, password)
      VALUES (${admin.username}, ${admin.email}, ${admin.password})
      RETURNING *
    `;
    return result.rows[0];
  },

  findAdminByEmail: async (email) => {
    const result = await sql`SELECT * FROM admins WHERE email = ${email}`;
    return result.rows[0];
  },

  findAdminByUsername: async (username) => {
    const result = await sql`SELECT * FROM admins WHERE username = ${username}`;
    return result.rows[0];
  },

  // Student operations
  createStudent: async (student) => {
    const result = await sql`
      INSERT INTO students (name, email, password, department, year)
      VALUES (${student.name}, ${student.email}, ${student.password}, ${student.department}, ${student.year})
      RETURNING *
    `;
    return result.rows[0];
  },

  findStudentByEmail: async (email) => {
    const result = await sql`SELECT * FROM students WHERE email = ${email}`;
    return result.rows[0];
  },

  findStudentById: async (id) => {
    const result = await sql`SELECT * FROM students WHERE id = ${id}`;
    return result.rows[0];
  },

  // Event operations
  createEvent: async (event) => {
    const result = await sql`
      INSERT INTO events (name, date, time, location, department, registration_deadline, award, description, admin_id)
      VALUES (${event.name}, ${event.date}, ${event.time}, ${event.location}, ${event.department}, ${event.registration_deadline}, ${event.award}, ${event.description}, ${event.admin_id})
      RETURNING *
    `;
    return result.rows[0];
  },

  getAllEvents: async () => {
    const result = await sql`
      SELECT e.*, 
             (SELECT COUNT(*) FROM event_participations ep WHERE ep.event_id = e.id AND ep.status = 'interested') as interested_count,
             (SELECT COUNT(*) FROM event_participations ep WHERE ep.event_id = e.id AND ep.status = 'joined') as participants_count
      FROM events e 
      WHERE e.is_active = true 
      ORDER BY e.created_at DESC
    `;
    return result.rows;
  },

  getEventsByAdmin: async (adminId) => {
    const result = await sql`
      SELECT e.*, 
             (SELECT COUNT(*) FROM event_participations ep WHERE ep.event_id = e.id AND ep.status = 'interested') as interested_count,
             (SELECT COUNT(*) FROM event_participations ep WHERE ep.event_id = e.id AND ep.status = 'joined') as participants_count
      FROM events e 
      WHERE e.admin_id = ${adminId} 
      ORDER BY e.created_at DESC
    `;
    return result.rows;
  },

  // Participation operations
  createParticipation: async (participation) => {
    const result = await sql`
      INSERT INTO event_participations (student_id, event_id, status, participation_type)
      VALUES (${participation.student_id}, ${participation.event_id}, ${participation.status}, ${participation.participation_type || 'participant'})
      RETURNING *
    `;
    return result.rows[0];
  },

  findParticipation: async (studentId, eventId) => {
    const result = await sql`
      SELECT * FROM event_participations 
      WHERE student_id = ${studentId} AND event_id = ${eventId}
    `;
    return result.rows[0];
  },

  updateParticipation: async (studentId, eventId, updates) => {
    const result = await sql`
      UPDATE event_participations 
      SET status = ${updates.status}, 
          participation_type = ${updates.participation_type || 'participant'}, 
          feedback = ${updates.feedback || null}
      WHERE student_id = ${studentId} AND event_id = ${eventId}
      RETURNING *
    `;
    return result.rows[0];
  },

  deleteParticipation: async (studentId, eventId) => {
    const result = await sql`
      DELETE FROM event_participations 
      WHERE student_id = ${studentId} AND event_id = ${eventId}
    `;
    return result.rowCount > 0;
  },

  getEventParticipations: async (eventId) => {
    const result = await sql`
      SELECT ep.*, s.name, s.email, s.department, s.year
      FROM event_participations ep
      JOIN students s ON ep.student_id = s.id
      WHERE ep.event_id = ${eventId}
    `;
    return result.rows.map(row => ({
      ...row,
      student: {
        id: row.student_id,
        name: row.name,
        email: row.email,
        department: row.department,
        year: row.year
      }
    }));
  },

  getStudentParticipations: async (studentId) => {
    const result = await sql`
      SELECT * FROM event_participations WHERE student_id = ${studentId}
    `;
    return result.rows;
  },

  // Comment operations
  createComment: async (comment) => {
    const result = await sql`
      INSERT INTO event_comments (event_id, student_id, comment)
      VALUES (${comment.event_id}, ${comment.student_id}, ${comment.comment})
      RETURNING *
    `;
    return result.rows[0];
  },

  getEventComments: async (eventId) => {
    const result = await sql`
      SELECT ec.*, s.name, s.department, s.year
      FROM event_comments ec
      JOIN students s ON ec.student_id = s.id
      WHERE ec.event_id = ${eventId}
      ORDER BY ec.created_at DESC
    `;
    return result.rows;
  },

  deleteEvent: async (eventId) => {
    const result = await sql`
      DELETE FROM events WHERE id = ${eventId}
    `;
    return result.rowCount > 0;
  },

  getEventById: async (eventId) => {
    const result = await sql`
      SELECT * FROM events WHERE id = ${eventId}
    `;
    return result.rows[0];
  },

  deleteComment: async (commentId) => {
    const result = await sql`
      DELETE FROM event_comments WHERE id = ${commentId}
    `;
    return result.rowCount > 0;
  }
};