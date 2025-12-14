le# Supabase Setup Guide - Refiners City Church

Complete guide to setting up your fresh Supabase project for the church website.

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"New Project"**
3. Sign in with GitHub (recommended) or email
4. Click **"New project"**
5. Fill in project details:
   - **Name**: `refiners-city-church`
   - **Database Password**: Generate a strong password (save it securely!)
   - **Region**: Choose closest to your location
   - **Pricing Plan**: Free tier is fine to start
6. Click **"Create new project"**
7. Wait 2-3 minutes for project to initialize

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, click **"Settings"** (gear icon) in sidebar
2. Click **"API"** under Project Settings
3. Copy these values:

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon public key: eyJhbGc...
service_role key: eyJhbGc... (keep this SECRET!)
```

## Step 3: Update Environment Variables

1. Open your project folder: `c:\Users\gener\OneDrive\Documents\Church\Refiners-City`
2. Create/edit `.env` file with:

```env
# Supabase Configuration
PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Site Configuration
PUBLIC_SITE_URL=http://localhost:4321
```

3. **IMPORTANT**: Never commit `.env` to git! It's already in `.gitignore`

## Step 4: Run Database Migrations

Open terminal in your project folder and run:

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

**OR** manually run migrations in Supabase dashboard:

1. Go to **SQL Editor** in Supabase dashboard
2. Copy content from each migration file in `supabase/migrations/`
3. Paste and run in order (oldest to newest)

## Step 5: Set Up Storage Buckets

1. In Supabase dashboard, go to **Storage**
2. Click **"Create a new bucket"**
3. Create bucket:
   - **Name**: `media`
   - **Public**: ✅ Yes (for public access to images/videos)
   - Click **"Create bucket"**

4. Set bucket policies:
   - Click on `media` bucket
   - Go to **Policies** tab
   - Click **"New Policy"**
   - Select **"For full customization"**
   - Add this policy:

```sql
-- Allow public read access
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'media');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

-- Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media');
```

## Step 6: Create Admin User

1. In Supabase dashboard, go to **Authentication** → **Users**
2. Click **"Add user"** → **"Create new user"**
3. Fill in:
   - **Email**: your-admin-email@example.com
   - **Password**: Create a strong password
   - **Auto Confirm User**: ✅ Yes
4. Click **"Create user"**

5. Copy the user's UUID (you'll see it in the users table)

6. Go to **SQL Editor** and run:

```sql
-- Make this user an admin
INSERT INTO admin_users (id, email, role)
VALUES ('paste-user-uuid-here', 'your-admin-email@example.com', 'admin');
```

## Step 7: Test Connection

1. Restart your dev server:
```bash
# Stop current server (Ctrl+C)
npm run dev
```

2. Visit `http://localhost:4321/test-supabase`
3. You should see "Successfully connected to Supabase!"

## Step 8: Access Admin Dashboard

1. Visit `http://localhost:4321/admin/login`
2. Login with your admin credentials
3. You should be redirected to admin dashboard!

## Troubleshooting

### "Missing Supabase environment variables"
- Check `.env` file exists and has correct values
- Restart dev server after changing `.env`

### "Failed to connect to Supabase"
- Verify Project URL and API keys are correct
- Check internet connection
- Ensure Supabase project is active (not paused)

### "Authentication failed"
- Verify admin user was created in Supabase dashboard
- Check email/password are correct
- Ensure user was added to `admin_users` table

### Migration errors
- Run migrations in order (check file timestamps)
- Check for syntax errors in SQL
- Verify you have correct permissions

## Next Steps

Once setup is complete:
- ✅ Login to admin dashboard
- ✅ Add your first sermon
- ✅ Create events
- ✅ Upload media files
- ✅ Set up live streaming

## Security Checklist

- [ ] `.env` file is in `.gitignore`
- [ ] Service role key is never exposed to frontend
- [ ] Admin users are verified before adding to `admin_users` table
- [ ] RLS policies are enabled on all tables
- [ ] Storage buckets have proper access policies

## Support

If you encounter issues:
1. Check Supabase project logs in dashboard
2. Review browser console for errors
3. Verify all environment variables are set
4. Ensure migrations ran successfully
