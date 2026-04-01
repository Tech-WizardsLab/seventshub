import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/get-user";

export interface ToggleShortlistEventResult {
  error: string | null;
  saved: boolean;
}

export async function toggleShortlistEvent(
  eventId: string
): Promise<ToggleShortlistEventResult> {
  const user = await getUser();

  if (!user) {
    return { error: "You must be logged in.", saved: false };
  }

  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, platform_role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.platform_role !== "sponsor") {
    return { error: "Only sponsor accounts can save events.", saved: false };
  }

  const { data: existing } = await supabase
    .from("sponsor_event_shortlists")
    .select("id")
    .eq("sponsor_profile_id", user.id)
    .eq("event_id", eventId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("sponsor_event_shortlists")
      .delete()
      .eq("id", existing.id);

    if (error) {
      return { error: error.message, saved: true };
    }

    return { error: null, saved: false };
  }

  const { error } = await supabase.from("sponsor_event_shortlists").insert({
    sponsor_profile_id: user.id,
    event_id: eventId,
  });

  if (error) {
    return { error: error.message, saved: false };
  }

  return { error: null, saved: true };
}