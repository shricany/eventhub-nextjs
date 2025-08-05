# Database Fix Instructions

## Problem
- Database tables not created in Neon
- Environment variables empty
- Comments not persisting

## Solution Steps

### 1. Get Neon Database URL
1. Go to https://console.neon.tech
2. Select your project
3. Go to "Connection Details"
4. Copy the "Connection string"

### 2. Add to Vercel Environment Variables
1. Go to https://vercel.com/dashboard
2. Select your project "eventhub-nextjs"
3. Go to Settings > Environment Variables
4. Add these variables:

```
POSTGRES_URL = your_neon_connection_string
POSTGRES_PRISMA_URL = your_neon_connection_string
POSTGRES_URL_NON_POOLING = your_neon_connection_string
JWT_SECRET = your-jwt-secret-key-here
```

### 3. Redeploy
1. Go to Deployments tab
2. Click "Redeploy" on latest deployment

### 4. Test Database
After redeployment, run:
```bash
python force_db_init.py
python create_test_event.py
```

## Expected Result
- Tables created in Neon console
- Comments working properly
- Data persisting correctly