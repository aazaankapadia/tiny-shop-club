import type { User } from "@supabase/supabase-js";

export function firstNameFromUser(user: User | null) {
  if (!user) return null;
  const full =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "";
  return full.split(" ").filter(Boolean)[0] ?? null;
}

export function avatarUrlFromUser(user: User | null) {
  if (!user) return null;
  return user.user_metadata?.avatar_url || user.user_metadata?.picture || null;
}
