"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/get-user";

export interface UpdateEventReviewStatusInput {
  eventId: string;
  status: "approved" | "rejected";
}

export interface UpdateEventReviewStatusResult {
  error: string | null;
}

export async function updateEventReviewStatus(
  input: UpdateEventReviewStatusInput
): Promise<UpdateEventReviewStatusResult> {
  const user = await getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("platform_role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.platform_role !== "admin") {
    return { error: "Only admin users can review events." };
  }

  const payload =
    input.status === "approved"
      ? {
          status: "approved",
          approved_at: new Date().toISOString(),
          approved_by: user.id,
          rejection_reason: null,
        }
      : {
          status: "rejected",
          approved_at: null,
          approved_by: null,
        };

  const { error } = await supabase
    .from("events")
    .update(payload)
    .eq("id", input.eventId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}