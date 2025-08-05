import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      console.log('Creating event_comments table...');
      
      // Create comments table separately
      await sql`
        CREATE TABLE IF NOT EXISTS event_comments (
          id SERIAL PRIMARY KEY,
          event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
          student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
          comment TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      
      console.log('event_comments table created successfully');
      
      // Test if table exists by querying it
      const result = await sql`SELECT COUNT(*) FROM event_comments`;
      console.log('Table test query successful:', result.rows[0]);
      
      res.status(200).json({ 
        message: 'Comments table created successfully',
        count: result.rows[0].count 
      });
    } catch (error) {
      console.error('Error creating comments table:', error);
      res.status(500).json({ 
        message: 'Failed to create comments table', 
        error: error.message 
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}