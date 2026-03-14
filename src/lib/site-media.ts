const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const siteMediaBucket = "site-media";

export function getSiteMediaUrl(fileName: string, fallbackPath: string) {
  if (!supabaseUrl) {
    return fallbackPath;
  }

  return `${supabaseUrl}/storage/v1/object/public/${siteMediaBucket}/${fileName}`;
}
