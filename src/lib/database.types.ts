export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      sermons: {
        Row: {
          id: string
          title: string
          description: string | null
          speaker: string
          date: string
          video_url: string | null
          audio_url: string | null
          thumbnail_url: string | null
          live_stream_url: string | null
          is_live: boolean
          stream_platform: string | null
          scheduled_stream_time: string | null
          stream_status: string
          youtube_video_id: string | null
          vimeo_video_id: string | null
          facebook_video_id: string | null
          series: string | null
          tags: string[] | null
          view_count: number
          featured: boolean
          spotify_url: string | null
          apple_podcasts_url: string | null
          google_podcasts_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          speaker: string
          date: string
          video_url?: string | null
          audio_url?: string | null
          thumbnail_url?: string | null
          live_stream_url?: string | null
          is_live?: boolean
          stream_platform?: string | null
          scheduled_stream_time?: string | null
          stream_status?: string
          youtube_video_id?: string | null
          vimeo_video_id?: string | null
          facebook_video_id?: string | null
          series?: string | null
          tags?: string[] | null
          view_count?: number
          featured?: boolean
          spotify_url?: string | null
          apple_podcasts_url?: string | null
          google_podcasts_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          speaker?: string
          date?: string
          video_url?: string | null
          audio_url?: string | null
          thumbnail_url?: string | null
          live_stream_url?: string | null
          is_live?: boolean
          stream_platform?: string | null
          scheduled_stream_time?: string | null
          stream_status?: string
          youtube_video_id?: string | null
          vimeo_video_id?: string | null
          facebook_video_id?: string | null
          series?: string | null
          tags?: string[] | null
          view_count?: number
          featured?: boolean
          spotify_url?: string | null
          apple_podcasts_url?: string | null
          google_podcasts_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          start_date: string
          end_date: string | null
          location: string | null
          image_url: string | null
          registration_required: boolean
          featured: boolean
          max_attendees: number | null
          current_registrations: number
          registration_url: string | null
          category: string | null
          recurring: boolean
          recurrence_pattern: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          start_date: string
          end_date?: string | null
          location?: string | null
          image_url?: string | null
          registration_required?: boolean
          featured?: boolean
          max_attendees?: number | null
          current_registrations?: number
          registration_url?: string | null
          category?: string | null
          recurring?: boolean
          recurrence_pattern?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          start_date?: string
          end_date?: string | null
          location?: string | null
          image_url?: string | null
          registration_required?: boolean
          featured?: boolean
          max_attendees?: number | null
          current_registrations?: number
          registration_url?: string | null
          category?: string | null
          recurring?: boolean
          recurrence_pattern?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      ministries: {
        Row: {
          id: string
          name: string
          description: string | null
          leader: string | null
          meeting_time: string | null
          image_url: string | null
          contact_email: string | null
          contact_phone: string | null
          active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          leader?: string | null
          meeting_time?: string | null
          image_url?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          leader?: string | null
          meeting_time?: string | null
          image_url?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      contact_submissions: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          message: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          message?: string
          created_at?: string
        }
      }
      admin_users: {
        Row: {
          id: string
          email: string
          role: string
          created_at: string
          last_login: string | null
        }
        Insert: {
          id: string
          email: string
          role?: string
          created_at?: string
          last_login?: string | null
        }
        Update: {
          id?: string
          email?: string
          role?: string
          created_at?: string
          last_login?: string | null
        }
      }
      media_files: {
        Row: {
          id: string
          bucket: string
          path: string
          title: string | null
          description: string | null
          size: number
          mime_type: string
          metadata: Json | null
          user_id: string
          public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          bucket: string
          path: string
          title?: string | null
          description?: string | null
          size: number
          mime_type: string
          metadata?: Json | null
          user_id?: string
          public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          bucket?: string
          path?: string
          title?: string | null
          description?: string | null
          size?: number
          mime_type?: string
          metadata?: Json | null
          user_id?: string
          public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      live_stream_logs: {
        Row: {
          id: string
          sermon_id: string | null
          platform: string
          stream_url: string
          started_at: string
          ended_at: string | null
          peak_viewers: number | null
          total_views: number | null
          status: string
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          sermon_id?: string | null
          platform: string
          stream_url: string
          started_at?: string
          ended_at?: string | null
          peak_viewers?: number | null
          total_views?: number | null
          status?: string
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          sermon_id?: string | null
          platform?: string
          stream_url?: string
          started_at?: string
          ended_at?: string | null
          peak_viewers?: number | null
          total_views?: number | null
          status?: string
          metadata?: Json | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}