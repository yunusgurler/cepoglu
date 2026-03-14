import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv, getSupabaseServiceRoleKey } from "./env";

export function createSupabaseAdminClient() {
  const { supabaseUrl } = getSupabaseEnv();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
