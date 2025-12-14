# 🔧 Quick Troubleshooting Guide - Login Error

## The Error
"An unexpected error occurred. Please try again."

## Most Common Causes

### 1. ❌ Missing .env File
**Check:** Does `.env` file exist in your project root?

**Fix:** Create `.env` file with:
```env
PUBLIC_SUPABASE_URL=https://anxrjpnmyiblrmowgkeq.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFueHJqcG5teWlibHJtb3dna2VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMjAyNDksImV4cCI6MjA4MDg5NjI0OX0.tD7j1xyQulS8ROblUREpXXwCe-LZ6q4q4UByb8FF_2E
PUBLIC_SITE_URL=http://localhost:4321
```

**Then restart dev server:**
```bash
# Press Ctrl+C to stop
npm run dev
```

### 2. ❌ Admin User Not Created
**Check:** Did you create an admin user in Supabase?

**Fix:**
1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add user" → "Create new user"
3. Enter email and password
4. Check "Auto Confirm User"
5. Click "Create user"
6. **IMPORTANT:** Copy the user's UUID
7. Go to SQL Editor and run:
```sql
INSERT INTO admin_users (id, email, role)
VALUES ('paste-user-uuid-here', 'your-email@example.com', 'admin');
```

### 3. ❌ Database Migration Not Run
**Check:** Did the migration run successfully?

**Fix:**
1. Go to Supabase Dashboard → SQL Editor
2. Run this query to check if tables exist:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('admin_users', 'sermons', 'events', 'ministries');
```

If no results, run the full migration from:
`supabase/migrations/20251210000000_admin_dashboard_schema.sql`

### 4. ❌ Wrong Credentials
**Check:** Are you using the correct email/password?

**Fix:**
- Use the SAME email/password you created in Supabase Auth
- Password is case-sensitive
- Make sure there are no extra spaces

---

## Step-by-Step Debug Process

### Step 1: Verify .env File
```bash
# In project root, check if .env exists
ls .env

# If it doesn't exist, create it with the credentials above
```

### Step 2: Restart Dev Server
```bash
# Stop current server (Ctrl+C)
npm run dev

# Wait for "Local: http://localhost:4321/"
```

### Step 3: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Try logging in again
4. Look for error messages

**Common errors you might see:**
- `Missing Supabase environment variables` → Fix .env file
- `Invalid login credentials` → Wrong email/password
- `User not authorized` → User not in admin_users table
- `Failed to fetch` → Supabase connection issue

### Step 4: Test Supabase Connection
Visit this URL in browser:
```
http://localhost:4321/
```

Open browser console and run:
```javascript
console.log(import.meta.env.PUBLIC_SUPABASE_URL);
```

Should show: `https://anxrjpnmyiblrmowgkeq.supabase.co`

If it shows `undefined`, the .env file isn't being loaded.

---

## Quick Test Checklist

- [ ] `.env` file exists in project root
- [ ] `.env` has correct Supabase URL and anon key
- [ ] Dev server restarted after creating .env
- [ ] Database migration ran successfully
- [ ] Admin user created in Supabase Auth
- [ ] Admin user added to `admin_users` table
- [ ] Using correct email/password

---

## Still Not Working?

### Check Terminal for Errors
Look at your terminal where `npm run dev` is running. You might see:
- Import errors
- Supabase connection errors
- Missing dependencies

### Check Supabase Dashboard
1. Go to Project Settings → API
2. Verify the URL and anon key match your .env
3. Check if project is paused (free tier limitation)

### Nuclear Option - Fresh Start
```bash
# Stop server
Ctrl+C

# Clear cache
rm -rf node_modules/.vite
rm -rf .astro

# Restart
npm run dev
```

---

## What to Send Me

If still having issues, please provide:

1. **Browser Console Error** (F12 → Console tab)
2. **Terminal Output** (any errors when running `npm run dev`)
3. **Confirmation:**
   - [ ] .env file created? (Yes/No)
   - [ ] Dev server restarted? (Yes/No)
   - [ ] Migration ran successfully? (Yes/No)
   - [ ] Admin user created? (Yes/No)
   - [ ] Admin user in admin_users table? (Yes/No)

This will help me pinpoint the exact issue!
