import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/get-user";
import type { InquiryStatus } from "@/types/database";

export interface UpcomingInquiryAction {
  id: string;
  sponsor_organization_name: string;
  event_name: string;
  slot_title: string;
  status: InquiryStatus;
  next_action: string | null;
  next_action_due_at: string | null;
  isOverdue: boolean;
}

export async function getUpcomingInquiryActions(): Promise<UpcomingInquiryAction[]> {
  const user = await getUser();

  if (!user) {
    return [];
  }

  const supabase = await createClient();

  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("profile_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!membership?.organization_id) {
    return [];
  }

  const { data: events } = await supabase
    .from("events")
    .select("id, name")
    .eq("organization_id", membership.organization_id);

  if (!events || events.length === 0) {
    return [];
  }

  const eventIds = events.map((event) => event.id);

  const { data: inquiries } = await supabase
    .from("slot_inquiries")
    .select(
      "id, status, sponsor_organization_id, event_id, sponsorship_slot_id, next_action, next_action_due_at"
    )
    .in("event_id", eventIds)
    .not("next_action_due_at", "is", null)
    .order("next_action_due_at", { ascending: true })
    .limit(10);

  if (!inquiries || inquiries.length === 0) {
    return [];
  }

  const sponsorOrgIds = [...new Set(inquiries.map((inquiry) => inquiry.sponsor_organization_id))];
  const slotIds = [...new Set(inquiries.map((inquiry) => inquiry.sponsorship_slot_id))];

  const [{ data: sponsorOrgs }, { data: slots }] = await Promise.all([
    supabase.from("organizations").select("id, name").in("id", sponsorOrgIds),
    supabase.from("sponsorship_slots").select("id, title").in("id", slotIds),
  ]);

  const eventMap = new Map(events.map((event) => [event.id, event.name]));
  const sponsorMap = new Map((sponsorOrgs ?? []).map((org) => [org.id, org.name]));
  const slotMap = new Map((slots ?? []).map((slot) => [slot.id, slot.title]));

  const now = Date.now();

  return inquiries.map((inquiry) => {
    const due = inquiry.next_action_due_at ? new Date(inquiry.next_action_due_at).getTime() : null;

    return {
      id: inquiry.id,
      sponsor_organization_name:
        sponsorMap.get(inquiry.sponsor_organization_id) ?? "Unknown sponsor",
      event_name: eventMap.get(inquiry.event_id) ?? "Unknown event",
      slot_title: slotMap.get(inquiry.sponsorship_slot_id) ?? "Unknown slot",
      status: inquiry.status as InquiryStatus,
      next_action: inquiry.next_action,
      next_action_due_at: inquiry.next_action_due_at,
      isOverdue: due !== null ? due < now : false,
    };
  });
}