import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/get-user";

export interface SponsorInquiryListItem {
  id: string;
  status: string;
  created_at: string;
  event_id: string;
  sponsorship_slot_id: string;
  event_name: string;
  event_city: string | null;
  event_country: string | null;
  slot_title: string;
  slot_type: string;
  organizer_name: string;
}

export async function getSponsorInquiries(): Promise<SponsorInquiryListItem[]> {
  const user = await getUser();

  if (!user) {
    return [];
  }

  const supabase = await createClient();

  const { data: membership, error: membershipError } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("profile_id", user.id)
    .limit(1)
    .maybeSingle();

  if (membershipError || !membership?.organization_id) {
    return [];
  }

  const { data: inquiries, error } = await supabase
    .from("slot_inquiries")
    .select("id, status, created_at, event_id, sponsorship_slot_id")
    .eq("sponsor_organization_id", membership.organization_id)
    .order("created_at", { ascending: false });

  if (error || !inquiries || inquiries.length === 0) {
    return [];
  }

  const eventIds = [...new Set(inquiries.map((inquiry) => inquiry.event_id))];
  const slotIds = [...new Set(inquiries.map((inquiry) => inquiry.sponsorship_slot_id))];

  const [{ data: events }, { data: slots }] = await Promise.all([
    supabase
      .from("events")
      .select("id, name, city, country, organization_id")
      .in("id", eventIds),
    supabase
      .from("sponsorship_slots")
      .select("id, title, slot_type")
      .in("id", slotIds),
  ]);

  const organizerIds = [...new Set((events ?? []).map((event) => event.organization_id))];

  const { data: organizations } = await supabase
    .from("organizations")
    .select("id, name")
    .in("id", organizerIds);

  const eventMap = new Map((events ?? []).map((event) => [event.id, event]));
  const slotMap = new Map((slots ?? []).map((slot) => [slot.id, slot]));
  const orgMap = new Map((organizations ?? []).map((org) => [org.id, org.name]));

  return inquiries.map((inquiry) => {
    const event = eventMap.get(inquiry.event_id);
    const slot = slotMap.get(inquiry.sponsorship_slot_id);

    return {
      id: inquiry.id,
      status: inquiry.status,
      created_at: inquiry.created_at,
      event_id: inquiry.event_id,
      sponsorship_slot_id: inquiry.sponsorship_slot_id,
      event_name: event?.name ?? "Unknown event",
      event_city: event?.city ?? null,
      event_country: event?.country ?? null,
      slot_title: slot?.title ?? "Unknown slot",
      slot_type: slot?.slot_type ?? "unknown",
      organizer_name: event?.organization_id
        ? orgMap.get(event.organization_id) ?? "Unknown organizer"
        : "Unknown organizer",
    };
  });
}