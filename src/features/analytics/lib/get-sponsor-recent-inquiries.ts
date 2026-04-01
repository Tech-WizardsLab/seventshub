import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/get-user";
import type { InquiryStatus } from "@/types/database";

export interface SponsorRecentInquiry {
  id: string;
  eventId: string;
  eventName: string;
  slotTitle: string;
  organizerName: string;
  status: InquiryStatus;
  createdAt: string;
}

export async function getSponsorRecentInquiries(): Promise<SponsorRecentInquiry[]> {
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

  const { data: inquiries } = await supabase
    .from("slot_inquiries")
    .select("id, event_id, sponsorship_slot_id, status, created_at")
    .eq("sponsor_organization_id", membership.organization_id)
    .order("created_at", { ascending: false })
    .limit(6);

  if (!inquiries || inquiries.length === 0) {
    return [];
  }

  const eventIds = [...new Set(inquiries.map((inquiry) => inquiry.event_id))];
  const slotIds = [...new Set(inquiries.map((inquiry) => inquiry.sponsorship_slot_id))];

  const [{ data: events }, { data: slots }] = await Promise.all([
    supabase
      .from("events")
      .select("id, name, organization_id")
      .in("id", eventIds),
    supabase
      .from("sponsorship_slots")
      .select("id, title")
      .in("id", slotIds),
  ]);

  const organizerIds = [...new Set((events ?? []).map((event) => event.organization_id))];

  const { data: organizations } = await supabase
    .from("organizations")
    .select("id, name")
    .in("id", organizerIds);

  const eventMap = new Map((events ?? []).map((event) => [event.id, event]));
  const slotMap = new Map((slots ?? []).map((slot) => [slot.id, slot.title]));
  const orgMap = new Map((organizations ?? []).map((org) => [org.id, org.name]));

  return inquiries.map((inquiry) => {
    const event = eventMap.get(inquiry.event_id);

    return {
      id: inquiry.id,
      eventId: inquiry.event_id,
      eventName: event?.name ?? "Unknown event",
      slotTitle: slotMap.get(inquiry.sponsorship_slot_id) ?? "Unknown slot",
      organizerName: event?.organization_id
        ? orgMap.get(event.organization_id) ?? "Unknown organizer"
        : "Unknown organizer",
      status: inquiry.status as InquiryStatus,
      createdAt: inquiry.created_at,
    };
  });
}