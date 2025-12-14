import { supabase } from './supabase';
import type { User, Session } from '@supabase/supabase-js';

// ============================================
// AUTHENTICATION HELPERS
// ============================================

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { user: null, session: null, error };
  }

  // Check if user is admin
  const isAdmin = await checkIsAdmin(data.user.id);
  if (!isAdmin) {
    await supabase.auth.signOut();
    return {
      user: null,
      session: null,
      error: new Error('Unauthorized: Admin access required')
    };
  }

  return { user: data.user, session: data.session, error: null };
}

/**
 * Sign out current user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Get current session
 */
export async function getSession(): Promise<{ session: Session | null; error: any }> {
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
}

/**
 * Get current user
 */
export async function getUser(): Promise<{ user: User | null; error: any }> {
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const { session } = await getSession();
  return !!session;
}

/**
 * Check if user is admin
 */
export async function checkIsAdmin(userId?: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const id = userId || user?.id;

    if (!id) return false;

    const { data, error } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', id)
      .single();

    return !error && !!data;
  } catch {
    return false;
  }
}

/**
 * Get admin user details
 */
export async function getAdminUser(userId: string) {
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', userId)
    .single();

  return { data, error };
}

/**
 * Update admin last login time
 */
export async function updateLastLogin(userId: string) {
  const { error } = await supabase
    .from('admin_users')
    .update({ last_login: new Date().toISOString() })
    .eq('id', userId);

  return { error };
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(callback: (session: Session | null) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
}

// ============================================
// PROTECTED ROUTE HELPERS (for Astro)
// ============================================

/**
 * Check authentication for Astro pages
 * Usage in .astro files:
 * 
 * const auth = await requireAuth(Astro);
 * if (!auth.authenticated) return auth.redirect;
 */
export async function requireAuth(Astro: any) {
  const accessToken = Astro.cookies.get('sb-access-token')?.value;
  const refreshToken = Astro.cookies.get('sb-refresh-token')?.value;

  if (!accessToken || !refreshToken) {
    return {
      authenticated: false,
      redirect: Astro.redirect('/admin/login'),
      user: null,
    };
  }

  // Set session from cookies
  const { data: { session }, error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (error || !session) {
    return {
      authenticated: false,
      redirect: Astro.redirect('/admin/login'),
      user: null,
    };
  }

  // Check if user is admin
  const isAdmin = await checkIsAdmin(session.user.id);
  if (!isAdmin) {
    return {
      authenticated: false,
      redirect: Astro.redirect('/admin/login?error=unauthorized'),
      user: null,
    };
  }

  return {
    authenticated: true,
    redirect: null,
    user: session.user,
  };
}

/**
 * Set auth cookies (call after successful login)
 */
export function setAuthCookies(Astro: any, session: Session) {
  Astro.cookies.set('sb-access-token', session.access_token, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
    secure: false, // Set to true in production
  });

  Astro.cookies.set('sb-refresh-token', session.refresh_token, {
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    sameSite: 'lax',
    secure: false, // Set to true in production
  });
}

/**
 * Clear auth cookies (call on logout)
 */
export function clearAuthCookies(Astro: any) {
  Astro.cookies.delete('sb-access-token', { path: '/' });
  Astro.cookies.delete('sb-refresh-token', { path: '/' });
}
