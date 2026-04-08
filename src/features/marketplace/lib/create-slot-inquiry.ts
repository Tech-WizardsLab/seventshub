"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/get-user";

export interface CreateSlotInquiryInput {
  eventId: string;
  sponsorshipSlotId: string;
}

export interface CreateSlotInquiryResult {
  error: string | null;
}

export async function createSlotInquiry(
  input: CreateSlotInquiryInput
): Promise<CreateSlotInquiryResult> {
  const user = await getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  const supabase = await createClient();

  const { data: membership, error: membershipError } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("profile_id", user.id)
    .limit(1)
    .maybeSingle();

  if (membershipError || !membership?.organization_id) {
    return { error: "No organization found for this user." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("platform_role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.platform_role !== "sponsor") {
    return { error: "Only sponsor accounts can create inquiries." };
  }

  const { data: existingInquiry } = await supabase
    .from("slot_inquiries")
    .select("id")
    .eq("sponsor_organization_id", membership.organization_id)
    .eq("event_id", input.eventId)
    .eq("sponsorship_slot_id", input.sponsorshipSlotId)
    .limit(1)
    .maybeSingle();

  if (existingInquiry) {
    return { error: "You already submitted an inquiry for this slot." };
  }

  const { error } = await supabase.from("slot_inquiries").insert({
    sponsor_organization_id: membership.organization_id,
    event_id: input.eventId,
    sponsorship_slot_id: input.sponsorshipSlotId,
    submitted_by: user.id,
    status: "submitted",
    message: null,
    sponsor_goals: [],
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}