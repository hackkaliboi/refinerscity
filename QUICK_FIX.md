# Quick Fix - Clear Cache and Restart

The error is happening because Astro is caching the old version of the file.

## Steps to Fix:

### 1. Stop ALL Running Servers
Press `Ctrl+C` in BOTH terminal windows to stop all npm processes.

### 2. Clear Cache
Run these commands in your terminal:
```bash
# Remove Astro cache
Remove-Item -Path ".astro" -Recurse -Force -ErrorAction SilentlyContinue

# Remove Vite cache
Remove-Item -Path "node_modules\.vite" -Recurse -Force -ErrorAction SilentlyContinue
```

### 3. Create .env File (IMPORTANT!)
Create a file named `.env` in your project root with:
```env
PUBLIC_SUPABASE_URL=https://anxrjpnmyiblrmowgkeq.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFueHJqcG5teWlibHJtb3dna2VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMjAyNDksImV4cCI6MjA4MDg5NjI0OX0.tD7j1xyQulS8ROblUREpXXwCe-LZ6q4q4UByb8FF_2E
PUBLIC_SITE_URL=http://localhost:4321
```

### 4. Restart Dev Server
```bash
npm run dev
```

### 5. Visit the Site
Open: **http://localhost:4321/**

---

## If Still Getting Errors:

The error might be because the `.env` file doesn't exist yet. Without it, the Supabase connection will fail.

**Check if `.env` exists:**
```bash
Test-Path .env
```

If it returns `False`, you MUST create the `.env` file first!

---

## Alternative: Temporarily Disable Live Stream Check

If you want to test the login without setting up Supabase first, I can temporarily comment out the live stream code on the homepage.

Let me know if you want me to do that!
