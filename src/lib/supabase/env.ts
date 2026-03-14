const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function hasSupabasePublicEnv() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export function hasSupabaseServiceRoleEnv() {
  return hasSupabasePublicEnv() && Boolean(supabaseServiceRoleKey);
}

export function getSupabaseEnv() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase public environment variables.");
  }

  return {
    supabaseUrl,
    supabaseAnonKey,
  };
}

export function getSupabaseServiceRoleKey() {
  if (!supabaseServiceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY.");
  }

  return supabaseServiceRoleKey;
}
