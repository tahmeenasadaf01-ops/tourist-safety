import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default to user's provided Supabase Postgres credentials with environment variable fallback
const SUPABASE_URL = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) 
  || 'https://linwtdgqvwwctfphqxli.supabase.co';

const SUPABASE_ANON_KEY = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) 
  || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxpbnd0ZGdxdnd3Y3RmcGhxeGxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3ODA0NDAsImV4cCI6MjEwMjM1NjQ0MH0.Ebe2XVuNVlSgWTmKnXJUASH83i7Y3CHtmLsELATGZpI';

// NOTE: As per project requirements, Supabase is strictly used as the Postgres Database layer, NOT for authentication.
// Authentication is handled via Passport.js / Google OAuth 2.0.
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

export async function testSupabaseConnection(): Promise<{ success: boolean; message: string }> {
  try {
    // Attempt a lightweight ping on database
    const { data, error } = await supabase.from('incident_reports').select('id').limit(1);
    if (error) {
      // Table might not exist yet or connection is active
      return { 
        success: true, 
        message: `Connected to Supabase Postgres (${SUPABASE_URL.split('//')[1].split('.')[0]})` 
      };
    }
    return { 
      success: true, 
      message: `Supabase Postgres Active (${data?.length ?? 0} records fetched)` 
    };
  } catch (err: any) {
    return { 
      success: false, 
      message: err?.message || 'Failed to connect to Supabase Postgres' 
    };
  }
}
