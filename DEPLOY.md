# EventHub - Complete Vercel Deployment Guide

## 🚀 Overview

This guide covers deploying EventHub (Next.js) to Vercel with persistent database storage, including free tier options and pricing details.

## 💰 Vercel Pricing & Free Tier

### **Free Tier (Hobby Plan)**
- ✅ **Unlimited static deployments**
- ✅ **100GB bandwidth/month**
- ✅ **Serverless Functions**: 100GB-hours/month
- ✅ **Edge Functions**: 500,000 invocations/month
- ✅ **Custom domains**
- ✅ **HTTPS certificates**
- ✅ **Git integration**
- ✅ **Preview deployments**
- ✅ **Analytics (basic)**

### **Pro Plan ($20/month)**
- ✅ Everything in Free
- ✅ **1TB bandwidth/month**
- ✅ **1000GB-hours serverless functions**
- ✅ **Team collaboration**
- ✅ **Password protection**
- ✅ **Advanced analytics**
- ✅ **Priority support**

### **Database Pricing**
- **Vercel Postgres**: $0.50/month (512MB storage, 1GB transfer)
- **Vercel KV (Redis)**: $0.25/month (256MB storage, 1GB transfer)
- **External Options**: Supabase (free 500MB), PlanetScale (free 5GB)

## 📋 Prerequisites

1. **GitHub Account** (free)
2. **Vercel Account** (free)
3. **Node.js 18+** installed locally
4. **Git** installed locally

## 🔧 Step 1: Prepare Your Project

### 1.1 Initialize Git Repository
```bash
cd C:\Users\shrik\AI_Project\eventhub-nextjs
git init
git add .
git commit -m "Initial commit: EventHub Next.js app"
```

### 1.2 Create GitHub Repository
1. Go to [GitHub.com](https://github.com)
2. Click **"New repository"**
3. Repository name: `eventhub-nextjs`
4. Set to **Public** (required for free Vercel)
5. Click **"Create repository"**

### 1.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/eventhub-nextjs.git
git branch -M main
git push -u origin main
```

## 🗄️ Step 2: Database Setup (Choose One)

### Option A: Vercel Postgres (Recommended)

#### 2A.1 Update package.json
```json
{
  "dependencies": {
    "next": "14.0.0",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "@vercel/postgres": "^0.5.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2"
  }
}
```

#### 2A.2 Create Database Schema
Create `lib/db-postgres.js`:
```javascript
import { sql } from '@vercel/postgres';

export async function initDatabase() {
  try {
    // Create tables
    await sql`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(80) UNIQUE NOT NULL,
        email VARCHAR(120) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

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
    const result = await sql`SELECT * FROM events WHERE admin_id = ${adminId} ORDER BY created_at DESC`;
    return result.rows;
  },

  // Participation operations
  createParticipation: async (participation) => {
    const result = await sql`
      INSERT INTO event_participations (student_id, event_id, status, participation_type)
      VALUES (${participation.student_id}, ${participation.event_id}, ${participation.status}, ${participation.participation_type})
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
    const setClause = Object.keys(updates).map(key => `${key} = $${Object.keys(updates).indexOf(key) + 3}`).join(', ');
    const values = [studentId, eventId, ...Object.values(updates)];
    
    const result = await sql`
      UPDATE event_participations 
      SET status = ${updates.status}, participation_type = ${updates.participation_type}, feedback = ${updates.feedback}
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
  }
};
```

#### 2A.3 Update API Routes
Replace all imports from `../lib/db-memory` to `../lib/db-postgres` and add `await` to all database operations.

### Option B: Supabase (Free Alternative)

#### 2B.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up with GitHub
3. Create new project
4. Note your project URL and anon key

#### 2B.2 Install Supabase Client
```bash
npm install @supabase/supabase-js
```

#### 2B.3 Create Database Client
Create `lib/supabase.js`:
```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
```

## 🌐 Step 3: Deploy to Vercel

### 3.1 Connect GitHub to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click **"New Project"**
4. Import your `eventhub-nextjs` repository
5. Click **"Deploy"**

### 3.2 Configure Environment Variables
In Vercel Dashboard:
1. Go to your project
2. Click **"Settings"** tab
3. Click **"Environment Variables"**
4. Add these variables:

```env
# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# For Vercel Postgres (auto-populated when you add integration)
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=

# For Supabase (if using)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3.3 Add Database Integration
1. In Vercel Dashboard, go to **"Integrations"**
2. Search for **"Vercel Postgres"**
3. Click **"Add Integration"**
4. Select your project
5. Choose **"Create New Database"**
6. Database name: `eventhub-db`
7. Click **"Create & Continue"**

This automatically adds all Postgres environment variables.

## 🔧 Step 4: Update Code for Production

### 4.1 Update _app.js
```javascript
import '../styles/globals.css'
import { useEffect } from 'react'
import { initDatabase } from '../lib/db-postgres' // Changed from db-memory
import Navbar from '../components/Navbar'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Initialize database on app start
    initDatabase()
  }, [])

  return (
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
  )
}
```

### 4.2 Update All API Routes
Replace all database imports:
```javascript
// Before
import { db } from '../../../lib/db-memory';

// After
import { db } from '../../../lib/db-postgres';
```

Add `await` to all database operations:
```javascript
// Before
const admin = db.findAdminByEmail(email);

// After
const admin = await db.findAdminByEmail(email);
```

### 4.3 Create vercel.json (Optional)
```json
{
  "functions": {
    "pages/api/**/*.js": {
      "maxDuration": 10
    }
  },
  "regions": ["iad1"]
}
```

## 🚀 Step 5: Deploy & Test

### 5.1 Push Changes
```bash
git add .
git commit -m "Add Vercel Postgres integration"
git push origin main
```

### 5.2 Automatic Deployment
Vercel automatically deploys when you push to main branch.

### 5.3 Monitor Deployment
1. Go to Vercel Dashboard
2. Click on your project
3. Watch the deployment logs
4. Once complete, click **"Visit"** to see your live app

### 5.4 Test Your Live App
Your app will be available at: `https://eventhub-nextjs-your-username.vercel.app`

Test all functionality:
- ✅ Admin registration/login
- ✅ Student registration/login
- ✅ Event creation
- ✅ Event participation
- ✅ Dashboard analytics

## 🔍 Step 6: Database Management

### 6.1 Access Database
1. In Vercel Dashboard, go to **"Storage"**
2. Click on your Postgres database
3. Use **"Query"** tab to run SQL commands
4. Use **"Data"** tab to view/edit records

### 6.2 Backup Strategy
```sql
-- Export data (run in Vercel Postgres Query tab)
COPY admins TO '/tmp/admins.csv' DELIMITER ',' CSV HEADER;
COPY students TO '/tmp/students.csv' DELIMITER ',' CSV HEADER;
COPY events TO '/tmp/events.csv' DELIMITER ',' CSV HEADER;
COPY event_participations TO '/tmp/participations.csv' DELIMITER ',' CSV HEADER;
```

## 📊 Step 7: Monitoring & Analytics

### 7.1 Vercel Analytics (Free)
1. Go to **"Analytics"** tab in your project
2. View page views, unique visitors, top pages
3. Monitor performance metrics

### 7.2 Function Logs
1. Go to **"Functions"** tab
2. Click on any API route
3. View real-time logs and errors

### 7.3 Performance Monitoring
1. **Core Web Vitals** automatically tracked
2. **Lighthouse scores** in deployment summary
3. **Error tracking** in function logs

## 💡 Step 8: Custom Domain (Optional)

### 8.1 Add Custom Domain
1. Go to **"Settings"** → **"Domains"**
2. Add your domain (e.g., `eventhub.yourdomain.com`)
3. Update DNS records as instructed
4. SSL certificate automatically provisioned

### 8.2 DNS Configuration
```
Type: CNAME
Name: eventhub (or @)
Value: cname.vercel-dns.com
```

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Errors
```javascript
// Add error handling
try {
  const result = await db.getAllEvents();
  return result;
} catch (error) {
  console.error('Database error:', error);
  return [];
}
```

#### Environment Variables Not Loading
1. Check spelling in Vercel dashboard
2. Redeploy after adding variables
3. Use `process.env.VARIABLE_NAME` in code

#### Build Failures
```bash
# Check build logs in Vercel dashboard
# Common fixes:
npm install  # Install dependencies
npm run build  # Test build locally
```

#### API Route Timeouts
```javascript
// Increase timeout in vercel.json
{
  "functions": {
    "pages/api/**/*.js": {
      "maxDuration": 30
    }
  }
}
```

## 💰 Cost Estimation

### Free Tier Usage (Monthly)
- **Bandwidth**: 100GB (sufficient for 10,000+ users)
- **Function Executions**: 100GB-hours (sufficient for moderate usage)
- **Database**: $0.50/month (Vercel Postgres 512MB)
- **Total**: ~$0.50/month

### Scaling Costs
- **Pro Plan**: $20/month (for team features)
- **Additional Bandwidth**: $40/TB
- **Additional Function Time**: $40/100GB-hours
- **Database Scaling**: Auto-scales with usage

## 🎯 Production Checklist

- [ ] GitHub repository created and pushed
- [ ] Vercel account connected to GitHub
- [ ] Database integration added (Postgres/Supabase)
- [ ] Environment variables configured
- [ ] Code updated for async database operations
- [ ] All API routes tested
- [ ] Custom domain configured (optional)
- [ ] Analytics enabled
- [ ] Error monitoring set up
- [ ] Backup strategy implemented

## 🚀 Go Live!

Your EventHub application is now live on Vercel with:
- ✅ **Global CDN** for fast loading
- ✅ **Automatic HTTPS** for security
- ✅ **Persistent database** for data storage
- ✅ **Serverless scaling** for high availability
- ✅ **Zero maintenance** infrastructure

**Live URL**: `https://eventhub-nextjs-your-username.vercel.app`

Congratulations! Your EventHub is now deployed and ready for users worldwide! 🎉