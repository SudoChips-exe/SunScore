import { createClient } from "@supabase/supabase-js";

const REQUIRED_ENV_VARS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET",
] as const;

function getSupabaseConfig() {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing Supabase config: ${missing.join(", ")}`);
  }
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    bucket: process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET!,
  };
}

const { url, anonKey, bucket } = getSupabaseConfig();

export const supabase = createClient(url, anonKey);
export const STORAGE_BUCKET = bucket;

/**
 * Uploads a file to the configured storage bucket under `path`.
 * Used for both static provider assets (uploaded by the team) and any
 * future user-submitted files (e.g. a diesel receipt).
 * Returns the public URL on success, or null if the upload fails
 * (the error is logged; this never throws so callers can treat it as
 * non-blocking, matching the Firestore lead-write behaviour).
 */
export async function uploadFile(path: string, file: File | Blob): Promise<string | null> {
  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
    upsert: true,
  });
  if (error) {
    console.error("[SunScore] Supabase upload failed:", error);
    return null;
  }
  return getPublicUrl(path);
}

/** Returns the public URL for a file already in the bucket. */
export function getPublicUrl(path: string): string {
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
