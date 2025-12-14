# ⚠️ IMPORTANT: Setup Required for Media Upload

## The Error: "Failed to fetch"

This happens because Supabase isn't configured yet. You need to create a `.env` file.

---

## Quick Fix (2 Minutes)

### Step 1: Create `.env` File

In your project root (`Refiners-City` folder), create a file named `.env` with this content:

```env
PUBLIC_SUPABASE_URL=https://anxrjpnmyiblrmowgkeq.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFueHJqcG5teWlibHJtb3dna2VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMjAyNDksImV4cCI6MjA4MDg5NjI0OX0.tD7j1xyQulS8ROblUREpXXwCe-LZ6q4q4UByb8FF_2E
PUBLIC_SITE_URL=http://localhost:4321
```

### Step 2: Restart Dev Server

```bash
# Stop current server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

### Step 3: Setup Storage in Supabase

1. Go to https://supabase.com/dashboard/project/anxrjpnmyiblrmowgkeq
2. Click **Storage** in left sidebar
3. Click **New bucket**
4. Name it: `church-media`
5. Make it **Public**
6. Click **Create bucket**

### Step 4: Set Storage Policies

In Supabase Dashboard → Storage → church-media → Policies:

Click **New Policy** → **For full customization** → Use this:

**Policy Name:** `Public Access`
**Allowed Operations:** SELECT, INSERT, UPDATE, DELETE
**Target Roles:** public, authenticated, anon

**Policy Definition:**
```sql
true
```

Click **Save**

---

## That's It!

Now try uploading an image again. It should work!

---

## Alternative: Use Without Database (Temporary)

If you want to test the admin dashboard without setting up Supabase right now, you can:

1. Skip media uploads for now
2. Manually add sermon data directly in the code
3. Set up Supabase later when you're ready to go live

---

## Need Help?

If you get stuck, let me know which step you're on!
