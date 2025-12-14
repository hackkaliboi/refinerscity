-- Admin Dashboard Enhanced Schema
-- Creates all tables and adds live streaming, admin roles, and enhanced content management

-- ============================================
-- CREATE BASE TABLES FIRST
-- ============================================

-- Sermons table
CREATE TABLE IF NOT EXISTS sermons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    speaker TEXT NOT NULL,
    date DATE NOT NULL,
    video_url TEXT,
    audio_url TEXT,
    thumbnail_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    location TEXT,
    image_url TEXT,
    registration_required BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ministries table
CREATE TABLE IF NOT EXISTS ministries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    leader TEXT,
    meeting_time TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ADMIN USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'editor', 'viewer')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ
);

-- ============================================
-- ENHANCE SERMONS TABLE
-- ============================================
ALTER TABLE sermons ADD COLUMN IF NOT EXISTS live_stream_url TEXT;
ALTER TABLE sermons ADD COLUMN IF NOT EXISTS is_live BOOLEAN DEFAULT false;
ALTER TABLE sermons ADD COLUMN IF NOT EXISTS stream_platform VARCHAR(50);
ALTER TABLE sermons ADD COLUMN IF NOT EXISTS scheduled_stream_time TIMESTAMPTZ;
ALTER TABLE sermons ADD COLUMN IF NOT EXISTS stream_status VARCHAR(20) DEFAULT 'offline' 
    CHECK (stream_status IN ('offline', 'scheduled', 'live', 'ended'));
ALTER TABLE sermons ADD COLUMN IF NOT EXISTS youtube_video_id VARCHAR(50);
ALTER TABLE sermons ADD COLUMN IF NOT EXISTS vimeo_video_id VARCHAR(50);
ALTER TABLE sermons ADD COLUMN IF NOT EXISTS facebook_video_id VARCHAR(100);
ALTER TABLE sermons ADD COLUMN IF NOT EXISTS series VARCHAR(100);
ALTER TABLE sermons ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE sermons ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE sermons ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Podcast platform links
ALTER TABLE sermons ADD COLUMN IF NOT EXISTS spotify_url TEXT;
ALTER TABLE sermons ADD COLUMN IF NOT EXISTS apple_podcasts_url TEXT;
ALTER TABLE sermons ADD COLUMN IF NOT EXISTS google_podcasts_url TEXT;

-- ============================================
-- ENHANCE EVENTS TABLE
-- ============================================
ALTER TABLE events ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE events ADD COLUMN IF NOT EXISTS max_attendees INTEGER;
ALTER TABLE events ADD COLUMN IF NOT EXISTS current_registrations INTEGER DEFAULT 0;
ALTER TABLE events ADD COLUMN IF NOT EXISTS registration_url TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS category VARCHAR(50);
ALTER TABLE events ADD COLUMN IF NOT EXISTS recurring BOOLEAN DEFAULT false;
ALTER TABLE events ADD COLUMN IF NOT EXISTS recurrence_pattern JSONB;

-- ============================================
-- ENHANCE MINISTRIES TABLE
-- ============================================
ALTER TABLE ministries ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE ministries ADD COLUMN IF NOT EXISTS contact_phone TEXT;
ALTER TABLE ministries ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;
ALTER TABLE ministries ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- ============================================
-- MEDIA FILES TABLE (Enhanced)
-- ============================================
CREATE TABLE IF NOT EXISTS media_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bucket TEXT NOT NULL,
    path TEXT NOT NULL,
    title TEXT,
    description TEXT,
    size BIGINT NOT NULL,
    mime_type TEXT NOT NULL,
    metadata JSONB,
    user_id UUID REFERENCES auth.users(id) DEFAULT '00000000-0000-0000-0000-000000000000',
    public BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(bucket, path)
);

-- ============================================
-- LIVE STREAM LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS live_stream_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sermon_id UUID REFERENCES sermons(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    stream_url TEXT NOT NULL,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    peak_viewers INTEGER,
    total_views INTEGER,
    status VARCHAR(20) DEFAULT 'live',
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_sermons_date ON sermons(date DESC);
CREATE INDEX IF NOT EXISTS idx_sermons_speaker ON sermons(speaker);
CREATE INDEX IF NOT EXISTS idx_sermons_series ON sermons(series);
CREATE INDEX IF NOT EXISTS idx_sermons_live ON sermons(is_live) WHERE is_live = true;
CREATE INDEX IF NOT EXISTS idx_sermons_featured ON sermons(featured) WHERE featured = true;

CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_featured ON events(featured) WHERE featured = true;

CREATE INDEX IF NOT EXISTS idx_ministries_active ON ministries(active) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_ministries_sort ON ministries(sort_order);

CREATE INDEX IF NOT EXISTS idx_media_files_bucket ON media_files(bucket);
CREATE INDEX IF NOT EXISTS idx_media_files_created ON media_files(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Admin users policies
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all admin users"
    ON admin_users FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid()
        )
    );

-- Sermons policies (update existing)
DROP POLICY IF EXISTS "Allow public read access to sermons" ON sermons;
CREATE POLICY "Public can view published sermons"
    ON sermons FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Admins can insert sermons"
    ON sermons FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Admins can update sermons"
    ON sermons FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Admins can delete sermons"
    ON sermons FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid()
        )
    );

-- Events policies (update existing)
DROP POLICY IF EXISTS "Allow public read access to events" ON events;
CREATE POLICY "Public can view events"
    ON events FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Admins can manage events"
    ON events FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid()
        )
    );

-- Ministries policies (update existing)
DROP POLICY IF EXISTS "Allow public read access to ministries" ON ministries;
CREATE POLICY "Public can view active ministries"
    ON ministries FOR SELECT
    TO public
    USING (active = true);

CREATE POLICY "Admins can manage ministries"
    ON ministries FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid()
        )
    );

-- Media files policies
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view public media"
    ON media_files FOR SELECT
    TO public
    USING (public = true);

CREATE POLICY "Authenticated users can upload media"
    ON media_files FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Users can update their media"
    ON media_files FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid() OR EXISTS (
        SELECT 1 FROM admin_users WHERE id = auth.uid()
    ));

CREATE POLICY "Users can delete their media"
    ON media_files FOR DELETE
    TO authenticated
    USING (user_id = auth.uid() OR EXISTS (
        SELECT 1 FROM admin_users WHERE id = auth.uid()
    ));

-- Live stream logs policies
ALTER TABLE live_stream_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view stream logs"
    ON live_stream_logs FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Admins can manage stream logs"
    ON live_stream_logs FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid()
        )
    );

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update sermon view count
CREATE OR REPLACE FUNCTION increment_sermon_views(sermon_uuid UUID)
RETURNS void AS $$
BEGIN
    UPDATE sermons
    SET view_count = view_count + 1
    WHERE id = sermon_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_users
        WHERE id = user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update last login time
CREATE OR REPLACE FUNCTION update_admin_last_login()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE admin_users
    SET last_login = NOW()
    WHERE id = auth.uid();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Update sermons updated_at
CREATE TRIGGER update_sermons_updated_at
    BEFORE UPDATE ON sermons
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Update events updated_at
CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Update ministries updated_at
CREATE TRIGGER update_ministries_updated_at
    BEFORE UPDATE ON ministries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Update media_files updated_at
CREATE TRIGGER update_media_files_updated_at
    BEFORE UPDATE ON media_files
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Uncomment to insert sample sermon
/*
INSERT INTO sermons (title, speaker, date, description, series)
VALUES (
    'Welcome to Our New Website',
    'Pastor John Smith',
    CURRENT_DATE,
    'Celebrating the launch of our new church website with enhanced features.',
    'Announcements'
);
*/
