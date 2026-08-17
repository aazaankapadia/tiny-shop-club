import type { SupabaseClient } from "@supabase/supabase-js";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function uploadProductPhoto(
  supabase: SupabaseClient,
  userId: string,
  photo: File,
): Promise<{ url: string } | { error: string }> {
  if (!photo.size) {
    return { error: "Please choose a photo." };
  }

  const ext = ALLOWED_TYPES[photo.type];
  if (!ext) {
    return { error: "Please use a JPG, PNG, WEBP, or GIF photo." };
  }

  if (photo.size > MAX_PHOTO_BYTES) {
    return { error: "Photo must be under 5 MB." };
  }

  const path = `${userId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("product-photos").upload(path, photo, {
    contentType: photo.type,
    upsert: false,
  });

  if (error) {
    return {
      error: `Could not upload photo. Did you run the product photos SQL in Supabase? (${error.message})`,
    };
  }

  const { data } = supabase.storage.from("product-photos").getPublicUrl(path);
  return { url: data.publicUrl };
}
