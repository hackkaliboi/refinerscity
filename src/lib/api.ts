import { supabase } from './supabase';
import type { Database } from './database.types';

type Sermon = Database['public']['Tables']['sermons']['Row'];
type SermonInsert = Database['public']['Tables']['sermons']['Insert'];
type SermonUpdate = Database['public']['Tables']['sermons']['Update'];

type Event = Database['public']['Tables']['events']['Row'];
type EventInsert = Database['public']['Tables']['events']['Insert'];
type EventUpdate = Database['public']['Tables']['events']['Update'];

type Ministry = Database['public']['Tables']['ministries']['Row'];
type MinistryInsert = Database['public']['Tables']['ministries']['Insert'];
type MinistryUpdate = Database['public']['Tables']['ministries']['Update'];

// ============================================
// SERMONS CRUD
// ============================================

export async function getSermons(options?: {
    limit?: number;
    offset?: number;
    speaker?: string;
    series?: string;
    featured?: boolean;
    isLive?: boolean;
}) {
    let query = supabase
        .from('sermons')
        .select('*', { count: 'exact' })
        .order('date', { ascending: false });

    if (options?.speaker) {
        query = query.eq('speaker', options.speaker);
    }
    if (options?.series) {
        query = query.eq('series', options.series);
    }
    if (options?.featured !== undefined) {
        query = query.eq('featured', options.featured);
    }
    if (options?.isLive !== undefined) {
        query = query.eq('is_live', options.isLive);
    }
    if (options?.limit) {
        query = query.limit(options.limit);
    }
    if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    return await query;
}

export async function getSermon(id: string) {
    return await supabase
        .from('sermons')
        .select('*')
        .eq('id', id)
        .single();
}

export async function createSermon(sermon: SermonInsert) {
    return await supabase
        .from('sermons')
        .insert(sermon)
        .select()
        .single();
}

export async function updateSermon(id: string, updates: SermonUpdate) {
    return await supabase
        .from('sermons')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
}

export async function deleteSermon(id: string) {
    return await supabase
        .from('sermons')
        .delete()
        .eq('id', id);
}

export async function getLiveSermons() {
    return await supabase
        .from('sermons')
        .select('*')
        .eq('is_live', true)
        .order('scheduled_stream_time', { ascending: true });
}

// ============================================
// EVENTS CRUD
// ============================================

export async function getEvents(options?: {
    limit?: number;
    upcoming?: boolean;
    featured?: boolean;
}) {
    let query = supabase
        .from('events')
        .select('*', { count: 'exact' })
        .order('start_date', { ascending: true });

    if (options?.upcoming) {
        query = query.gte('start_date', new Date().toISOString());
    }
    if (options?.featured !== undefined) {
        query = query.eq('featured', options.featured);
    }
    if (options?.limit) {
        query = query.limit(options.limit);
    }

    return await query;
}

export async function getEvent(id: string) {
    return await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();
}

export async function createEvent(event: EventInsert) {
    return await supabase
        .from('events')
        .insert(event)
        .select()
        .single();
}

export async function updateEvent(id: string, updates: EventUpdate) {
    return await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
}

export async function deleteEvent(id: string) {
    return await supabase
        .from('events')
        .delete()
        .eq('id', id);
}

// ============================================
// MINISTRIES CRUD
// ============================================

export async function getMinistries(activeOnly = true) {
    let query = supabase
        .from('ministries')
        .select('*')
        .order('sort_order', { ascending: true });

    if (activeOnly) {
        query = query.eq('active', true);
    }

    return await query;
}

export async function getMinistry(id: string) {
    return await supabase
        .from('ministries')
        .select('*')
        .eq('id', id)
        .single();
}

export async function createMinistry(ministry: MinistryInsert) {
    return await supabase
        .from('ministries')
        .insert(ministry)
        .select()
        .single();
}

export async function updateMinistry(id: string, updates: MinistryUpdate) {
    return await supabase
        .from('ministries')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
}

export async function deleteMinistry(id: string) {
    return await supabase
        .from('ministries')
        .delete()
        .eq('id', id);
}

// ============================================
// LIVE STREAM HELPERS
// ============================================

/**
 * Extract video ID from various platform URLs
 */
export function extractVideoId(url: string, platform: 'youtube' | 'vimeo' | 'facebook'): string | null {
    if (!url) return null;

    try {
        if (platform === 'youtube') {
            // Handle various YouTube URL formats
            const patterns = [
                /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
                /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
            ];

            for (const pattern of patterns) {
                const match = url.match(pattern);
                if (match) return match[1];
            }
        } else if (platform === 'vimeo') {
            const match = url.match(/vimeo\.com\/(\d+)/);
            return match ? match[1] : null;
        } else if (platform === 'facebook') {
            const match = url.match(/facebook\.com\/.*\/videos\/(\d+)/);
            return match ? match[1] : null;
        }
    } catch {
        return null;
    }

    return null;
}

/**
 * Get embed URL for video platform
 */
export function getEmbedUrl(videoId: string, platform: 'youtube' | 'vimeo' | 'facebook'): string {
    switch (platform) {
        case 'youtube':
            return `https://www.youtube.com/embed/${videoId}`;
        case 'vimeo':
            return `https://player.vimeo.com/video/${videoId}`;
        case 'facebook':
            return `https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/video.php?v=${videoId}`;
        default:
            return '';
    }
}

/**
 * Check if YouTube stream is live (requires YouTube Data API)
 * This is a placeholder - you'll need to implement with YouTube API key
 */
export async function checkYouTubeLiveStatus(videoId: string): Promise<boolean> {
    // TODO: Implement with YouTube Data API
    // const apiKey = import.meta.env.YOUTUBE_API_KEY;
    // const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`);
    // const data = await response.json();
    // return data.items[0]?.snippet?.liveBroadcastContent === 'live';

    return false; // Placeholder
}

/**
 * Update sermon stream status
 */
export async function updateStreamStatus(
    sermonId: string,
    status: 'offline' | 'scheduled' | 'live' | 'ended'
) {
    return await supabase
        .from('sermons')
        .update({
            stream_status: status,
            is_live: status === 'live'
        })
        .eq('id', sermonId);
}

// ============================================
// STATISTICS
// ============================================

export async function getDashboardStats() {
    const [sermons, events, ministries, liveStreams] = await Promise.all([
        supabase.from('sermons').select('id', { count: 'exact', head: true }),
        supabase.from('events').select('id', { count: 'exact', head: true }),
        supabase.from('ministries').select('id', { count: 'exact', head: true }),
        supabase.from('sermons').select('id', { count: 'exact', head: true }).eq('is_live', true),
    ]);

    return {
        totalSermons: sermons.count || 0,
        totalEvents: events.count || 0,
        totalMinistries: ministries.count || 0,
        liveStreams: liveStreams.count || 0,
    };
}
