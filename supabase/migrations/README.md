# ✅ READY TO RUN - Admin Dashboard Migration

This is the **ONLY** migration file you need to run for your fresh Supabase project.

## What This Migration Does

This migration sets up everything you need for the admin dashboard:

### Tables Created:
- ✅ **admin_users** - Admin user roles and permissions
- ✅ **sermons** (enhanced) - With live streaming fields
- ✅ **events** (enhanced) - With registration and featured flags
- ✅ **ministries** (enhanced) - With contact info and sorting
- ✅ **media_files** - File storage metadata
- ✅ **live_stream_logs** - Stream analytics and history
- ✅ **contact_submissions** - Contact form data

### Features Added:
- ✅ Multi-platform live streaming (YouTube, Vimeo, Facebook)
- ✅ Stream scheduling and status tracking
- ✅ Podcast platform links (Spotify, Apple, Google)
- ✅ Featured content flags
- ✅ View counters
- ✅ Row Level Security (RLS) policies
- ✅ Performance indexes
- ✅ Helper functions

## How to Run

### Option 1: Supabase Dashboard (Recommended)

1. Go to: https://supabase.com/dashboard/project/anxrjpnmyiblrmowgkeq
2. Click **SQL Editor** in sidebar
3. Click **New Query**
4. Copy the **ENTIRE** contents of this file:
   ```
   supabase/migrations/20251210000000_admin_dashboard_schema.sql
   ```
5. Paste into SQL editor
6. Click **Run** (or Ctrl+Enter)
7. Wait for "Success. No rows returned" message

### Option 2: Supabase CLI

```bash
# Make sure you're in project directory
cd c:\Users\gener\OneDrive\Documents\Church\Refiners-City

# Run migration
supabase db push
```

## After Running Migration

1. **Create Admin User** (see QUICK_SETUP.md)
2. **Restart Dev Server**
3. **Login at** http://localhost:4321/admin/login

## Troubleshooting

**"relation already exists" errors:**
- Your database already has some tables
- Safe to ignore if you're updating an existing project
- For fresh start, create a new Supabase project

**"permission denied" errors:**
- Make sure you're logged into Supabase dashboard
- Check you're in the correct project

**Migration runs but can't login:**
- Make sure you created admin user
- Check admin user was added to `admin_users` table
- Verify email/password are correct

---

## ⚠️ Important Notes

- This migration is **idempotent** - safe to run multiple times
- Uses `IF NOT EXISTS` and `IF EXISTS` to prevent errors
- Will not delete existing data
- Only adds new tables/columns/policies

---

**File:** `20251210000000_admin_dashboard_schema.sql`
**Size:** ~10KB
**Tables:** 7 (including enhancements)
**Policies:** 15+
**Functions:** 3
