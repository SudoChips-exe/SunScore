import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const REQUIRED_ENV_VARS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET",
] as const;

function getSupabaseConfig() {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.warn(`[SunScore] Missing Supabase config: ${missing.join(", ")}. Storage will be disabled.`);
    return null;
  }
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    bucket: process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET!,
  };
}

const config = getSupabaseConfig();

export const supabase: SupabaseClient | null = config ? createClient(config.url, config.anonKey) : null;
export const STORAGE_BUCKET = config?.bucket ?? null;

/**
 * Uploads a file to the configured storage bucket under `path`.
 * Used for both static provider assets (uploaded by the team) and
 * user-submitted files (e.g. a diesel receipt).
 * Returns the public URL on success, or null if the upload fails or
 * Supabase isn't configured — never throws, so callers can treat this
 * as non-blocking, matching the Firestore lead-write behaviour.
 */
export async function uploadFile(path: string, file: File | Blob): Promise<string | null> {
  if (!supabase || !STORAGE_BUCKET) {
    console.warn("[SunScore] Supabase not initialized. File not uploaded.");
    return null;
  }
  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
    upsert: true,
  });
  if (error) {
    console.error("[SunScore] Supabase upload failed:", error);
    return null;
  }
  return getPublicUrl(path);
}

/** Returns the public URL for a file already in the bucket, or null if unavailable. */
export function getPublicUrl(path: string): string | null {
  if (!supabase || !STORAGE_BUCKET) return null;
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
