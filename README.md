# EventHub - Next.js Version

A modern, AI-powered campus event management system built with Next.js and deployed on Vercel.

<!-- Deployed with Neon Postgres database -->

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Vercel account (for database)
- Gemini API key

### Installation

1. **Clone and install dependencies:**
```bash
cd eventhub-nextjs
npm install
```

2. **Set up environment variables:**
Create `.env.local` file with:
```env
# Vercel Postgres (get from Vercel dashboard)
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=

# JWT Secret
JWT_SECRET=your-jwt-secret-key-here
```

3. **Run the development server:**
```bash
npm run dev
```

4. **Open [http://localhost:3000](http://localhost:3000)**

## 🌐 Deployment

### Deploy to Vercel

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Add Vercel Postgres database**
4. **Set environment variables**
5. **Deploy!**

```bash
# Or deploy directly
npx vercel
```

## 📁 Project Structure

```
eventhub-nextjs/
├── pages/
│   ├── api/                 # API routes
│   │   ├── auth/           # Authentication
│   │   └── events/         # Event management
│   ├── index.js            # Landing page
│   └── _app.js             # App component
├── lib/
│   ├── db.js               # Database utilities
│   ├── auth.js             # Authentication
│   └── gemini.js           # AI image generation
├── styles/
│   └── globals.css         # Global styles
└── public/
    └── generated-images/   # AI-generated images
```

## ✨ Features

- **Single Command**: `npm run dev` runs everything
- **Vercel Postgres**: Managed database
- **JWT Authentication**: Secure login system
- **Responsive Design**: Mobile-first approach
- **Zero Config Deployment**: Deploy with one click

## 🔧 Tech Stack

- **Framework**: Next.js 14
- **Database**: Vercel Postgres
- **Authentication**: JWT + bcrypt
- **Styling**: CSS Modules
- **Deployment**: Vercel

## 🎯 Single Command Development

Unlike the Flask version that required running frontend and backend separately, this Next.js version runs everything with:

```bash
npm run dev
```

This starts:
- Frontend (React pages)
- Backend (API routes)
- Database connection
- Hot reload for both frontend and backend

## 🚀 Production Ready

- **Automatic scaling** on Vercel
- **Edge functions** for global performance
- **Built-in CDN** for static assets
- **Zero downtime** deployments
- **Custom domains** included

Perfect for college projects, portfolios, and production applications!