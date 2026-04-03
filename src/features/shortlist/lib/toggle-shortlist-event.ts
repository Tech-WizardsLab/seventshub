import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export interface ToggleShortlistEventResult {
  error: string | null;
  saved: boolean;
}

export async function toggleShortlistEvent(
  eventId: string
): Promise<ToggleShortlistEventResult> {
  const supabase = createBrowserSupabaseClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "You must be logged in.", saved: false };
  }

  const profileQuery = (supabase as typeof supabase & {
    from: (table: "profiles") => {
      select: (columns: string) => {
        eq: (column: string, value: string) => {
          maybeSingle: () => Promise<{
            data: { id: string; platform_role: string } | null;
            error: { message: string } | null;
          }>;
        };
      };
    };
  }).from("profiles");

  const { data: profile, error: profileError } = await profileQuery
    .select("id, platform_role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile || profile.platform_role !== "sponsor") {
    return { error: "Only sponsor accounts can save events.", saved: false };
  }

  const shortlistQuery = (supabase as typeof supabase & {
    from: (table: "sponsor_event_shortlists") => {
      select: (columns: string) => {
        eq: (column: string, value: string) => {
          eq: (column: string, value: string) => {
            maybeSingle: () => Promise<{
              data: { id: string } | null;
              error: { message: string } | null;
            }>;
          };
        };
      };
      delete: () => {
        eq: (column: string, value: string) => Promise<{
          error: { message: string } | null;
        }>;
      };
      insert: (values: {
        sponsor_profile_id: string;
        event_id: string;
      }) => Promise<{
        error: { message: string } | null;
      }>;
    };
  }).from("sponsor_event_shortlists");

  const { data: existing, error: existingError } = await shortlistQuery
    .select("id")
    .eq("sponsor_profile_id", user.id)
    .eq("event_id", eventId)
    .maybeSingle();

  if (existingError) {
    return { error: existingError.message, saved: false };
  }

  if (existing) {
    const { error } = await shortlistQuery.delete().eq("id", existing.id);

    if (error) {
      return { error: error.message, saved: true };
    }

    return { error: null, saved: false };
  }

  const { error } = await shortlistQuery.insert({
    sponsor_profile_id: user.id,
    event_id: eventId,
  });

  if (error) {
    return { error: error.message, saved: false };
  }

  return { error: null, saved: true };
}