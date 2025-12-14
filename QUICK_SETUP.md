# Quick Setup Instructions

## ✅ Your Supabase Credentials

Copy these to your `.env` file:

```env
PUBLIC_SUPABASE_URL=https://anxrjpnmyiblrmowgkeq.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFueHJqcG5teWlibHJtb3dna2VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMjAyNDksImV4cCI6MjA4MDg5NjI0OX0.tD7j1xyQulS8ROblUREpXXwCe-LZ6q4q4UByb8FF_2E
PUBLIC_SITE_URL=http://localhost:4321
```

## 📝 Steps to Complete Setup

### 1. Update .env File
Create or edit `.env` in your project root:
```bash
# Open in your editor
code .env
```

Paste the credentials above.

### 2. Run Database Migration

**Option A: Using Supabase Dashboard (Recommended)**
1. Go to https://supabase.com/dashboard/project/anxrjpnmyiblrmowgkeq
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `supabase/migrations/20251210000000_admin_dashboard_schema.sql`
5. Paste into the SQL editor
6. Click **Run** (or press Ctrl+Enter)
7. Wait for "Success" message

**Option B: Using Supabase CLI**
```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref anxrjpnmyiblrmowgkeq

# Run migrations
supabase db push
```

### 3. Create Admin User

1. Go to **Authentication** → **Users** in Supabase dashboard
2. Click **Add user** → **Create new user**
3. Enter your email and password
4. Check **Auto Confirm User**
5. Click **Create user**
6. Copy the user's UUID

7. Go back to **SQL Editor** and run:
```sql
INSERT INTO admin_users (id, email, role)
VALUES ('paste-your-user-uuid-here', 'your-email@example.com', 'admin');
```

### 4. Restart Dev Server

```bash
# Stop current server (Ctrl+C in terminal)
# Start again
npm run dev
```

### 5. Test the Connection

Visit: http://localhost:4321/admin/login

Login with your admin credentials!

---

## 🎯 Next Steps After Login

1. **Create your first sermon** with live streaming
2. **Test the live stream features**
3. **Explore the admin dashboard**

---

## ⚠️ Troubleshooting

**"Missing Supabase environment variables"**
- Make sure `.env` file exists in project root
- Restart dev server after creating `.env`

**"Failed to connect"**
- Verify credentials are correct
- Check internet connection
- Ensure Supabase project is active

**"Authentication failed"**
- Verify admin user was created
- Check email/password are correct
- Ensure user was added to `admin_users` table
