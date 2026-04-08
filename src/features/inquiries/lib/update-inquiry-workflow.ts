"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/get-user";

export interface UpdateInquiryWorkflowInput {
  inquiryId: string;
  organizerNotes: string;
  adminNotes: string;
  nextAction: string;
  nextActionDueAt: string;
}

export interface UpdateInquiryWorkflowResult {
  error: string | null;
}

export async function updateInquiryWorkflow(
  input: UpdateInquiryWorkflowInput
): Promise<UpdateInquiryWorkflowResult> {
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

  const payload = {
    organizer_notes: input.organizerNotes.trim() || null,
    admin_notes: input.adminNotes.trim() || null,
    next_action: input.nextAction.trim() || null,
    next_action_due_at: input.nextActionDueAt || null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("slot_inquiries")
    .update(payload)
    .eq("id", input.inquiryId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}