import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/get-user";

export interface SubmitEventForReviewResult {
  error: string | null;
}

export async function submitEventForReview(
  eventId: string
): Promise<SubmitEventForReviewResult> {
  const user = await getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  const supabase = await createClient();

  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("profile_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!membership?.organization_id) {
    return { error: "No organization found for this user." };
  }

  const { data: event } = await supabase
    .from("events")
    .select("id, status, organization_id")
    .eq("id", eventId)
    .maybeSingle();

  if (!event || event.organization_id !== membership.organization_id) {
    return { error: "You do not have permission to submit this event." };
  }

  if (event.status !== "draft" && event.status !== "rejected") {
    return { error: "Only draft or rejected events can be submitted for review." };
  }

  const { error } = await supabase
    .from("events")
    .update({
      status: "pending_review",
      submitted_at: new Date().toISOString(),
      rejection_reason: null,
    })
    .eq("id", eventId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}