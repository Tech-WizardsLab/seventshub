import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/get-user";
import type { InquiryStatus } from "@/types/database";

export interface UpdateInquiryStatusInput {
  inquiryId: string;
  status: InquiryStatus;
}

export interface UpdateInquiryStatusResult {
  error: string | null;
}

export async function updateInquiryStatus(
  input: UpdateInquiryStatusInput
): Promise<UpdateInquiryStatusResult> {
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

  const { data: inquiry } = await supabase
    .from("slot_inquiries")
    .select("id, event_id")
    .eq("id", input.inquiryId)
    .maybeSingle();

  if (!inquiry) {
    return { error: "Inquiry not found." };
  }

  const { data: event } = await supabase
    .from("events")
    .select("organization_id")
    .eq("id", inquiry.event_id)
    .maybeSingle();

  if (!event || event.organization_id !== membership.organization_id) {
    return { error: "You do not have permission to update this inquiry." };
  }

  const { error } = await supabase
    .from("slot_inquiries")
    .update({ status: input.status })
    .eq("id", input.inquiryId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}