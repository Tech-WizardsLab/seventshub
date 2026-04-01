import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/get-user";
import type { InquiryStatus } from "@/types/database";

export interface OrganizerInquiryListItem {
  id: string;
  status: InquiryStatus;
  created_at: string;
  sponsor_organization_name: string;
  event_name: string;
  slot_title: string;
  slot_type: string;
}

export async function getOrganizerInquiries(): Promise<OrganizerInquiryListItem[]> {
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

  const { data: inquiries, error } = await supabase
    .from("slot_inquiries")
    .select("id, status, created_at, sponsor_organization_id, event_id, sponsorship_slot_id")
    .in("event_id", eventIds)
    .order("created_at", { ascending: false });

  if (error || !inquiries || inquiries.length === 0) {
    return [];
  }

  const sponsorOrgIds = [...new Set(inquiries.map((inquiry) => inquiry.sponsor_organization_id))];
  const slotIds = [...new Set(inquiries.map((inquiry) => inquiry.sponsorship_slot_id))];

  const [{ data: sponsorOrgs }, { data: slots }] = await Promise.all([
    supabase
      .from("organizations")
      .select("id, name")
      .in("id", sponsorOrgIds),
    supabase
      .from("sponsorship_slots")
      .select("id, title, slot_type")
      .in("id", slotIds),
  ]);

  const eventMap = new Map(events.map((event) => [event.id, event.name]));
  const orgMap = new Map((sponsorOrgs ?? []).map((org) => [org.id, org.name]));
  const slotMap = new Map((slots ?? []).map((slot) => [slot.id, slot]));

  return inquiries.map((inquiry) => {
    const slot = slotMap.get(inquiry.sponsorship_slot_id);

    return {
      id: inquiry.id,
      status: inquiry.status as InquiryStatus,
      created_at: inquiry.created_at,
      sponsor_organization_name:
        orgMap.get(inquiry.sponsor_organization_id) ?? "Unknown sponsor",
      event_name: eventMap.get(inquiry.event_id) ?? "Unknown event",
      slot_title: slot?.title ?? "Unknown slot",
      slot_type: slot?.slot_type ?? "unknown",
    };
  });
}