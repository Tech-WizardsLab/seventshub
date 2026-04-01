import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/get-user";
import type { InquiryStatus } from "@/types/database";

export interface InquiryDetail {
  id: string;
  status: InquiryStatus;
  created_at: string;
  organizer_notes: string | null;
  admin_notes: string | null;
  next_action: string | null;
  next_action_due_at: string | null;
  sponsor_organization_name: string;
  event_name: string;
  slot_title: string;
  slot_type: string;
}

export async function getInquiryDetail(
  inquiryId: string
): Promise<InquiryDetail | null> {
  const user = await getUser();

  if (!user) {
    return null;
  }

  const supabase = await createClient();

  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("profile_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!membership?.organization_id) {
    return null;
  }

  const { data: inquiry, error } = await supabase
    .from("slot_inquiries")
    .select(
      "id, status, created_at, organizer_notes, admin_notes, next_action, next_action_due_at, sponsor_organization_id, event_id, sponsorship_slot_id"
    )
    .eq("id", inquiryId)
    .maybeSingle();

  if (error || !inquiry) {
    return null;
  }

  const { data: event } = await supabase
    .from("events")
    .select("id, name, organization_id")
    .eq("id", inquiry.event_id)
    .maybeSingle();

  if (!event || event.organization_id !== membership.organization_id) {
    return null;
  }

  const [{ data: sponsorOrg }, { data: slot }] = await Promise.all([
    supabase
      .from("organizations")
      .select("name")
      .eq("id", inquiry.sponsor_organization_id)
      .maybeSingle(),
    supabase
      .from("sponsorship_slots")
      .select("title, slot_type")
      .eq("id", inquiry.sponsorship_slot_id)
      .maybeSingle(),
  ]);

  return {
    id: inquiry.id,
    status: inquiry.status as InquiryStatus,
    created_at: inquiry.created_at,
    organizer_notes: inquiry.organizer_notes,
    admin_notes: inquiry.admin_notes,
    next_action: inquiry.next_action,
    next_action_due_at: inquiry.next_action_due_at,
    sponsor_organization_name: sponsorOrg?.name ?? "Unknown sponsor",
    event_name: event.name,
    slot_title: slot?.title ?? "Unknown slot",
    slot_type: slot?.slot_type ?? "unknown",
  };
}