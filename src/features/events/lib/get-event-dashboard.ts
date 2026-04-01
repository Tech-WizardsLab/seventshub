import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/get-user";

export interface EventDashboardData {
  id: string;
  name: string;
  slug: string;
  sport_type: string;
  city: string | null;
  country: string | null;
  venue_name: string | null;
  starts_at: string | null;
  ends_at: string | null;
  short_description: string | null;
  description: string | null;
  status: string;
  metrics: {
    expected_attendance: number;
    actual_attendance: number | null;
    exhibitors_count: number;
    speakers_count: number;
    participating_brands_count: number;
    email_reach: number;
    website_visits: number;
    app_users: number;
    social_impressions: number;
    social_engagements: number;
    livestream_views: number;
    video_views: number;
    press_mentions: number;
    media_reach: number;
    audience_b2b_percentage: number | null;
    audience_b2c_percentage: number | null;
    audience_tags: string[];
    industry_tags: string[];
    demographic_summary: string | null;
    geographic_summary: string | null;
    past_sponsors: string[];
    notes: string | null;
  } | null;
  slots: Array<{
    id: string;
    title: string;
    slot_type: string;
    tier_name: string | null;
    list_price_eur: number | null;
    minimum_price_eur: number | null;
    inventory_count: number;
    remaining_inventory: number;
    visibility: string;
    is_active: boolean;
  }>;
}

export async function getEventDashboard(
  eventId: string
): Promise<EventDashboardData | null> {
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

  const { data: event, error } = await supabase
    .from("events")
    .select(
      `
      id,
      name,
      slug,
      sport_type,
      city,
      country,
      venue_name,
      starts_at,
      ends_at,
      short_description,
      description,
      status
      `
    )
    .eq("id", eventId)
    .eq("organization_id", membership.organization_id)
    .maybeSingle();

  if (error || !event) {
    return null;
  }

  const [{ data: metrics }, { data: slots }] = await Promise.all([
    supabase
      .from("event_metrics")
      .select("*")
      .eq("event_id", eventId)
      .maybeSingle(),
    supabase
      .from("sponsorship_slots")
      .select(
        `
        id,
        title,
        slot_type,
        tier_name,
        list_price_eur,
        minimum_price_eur,
        inventory_count,
        remaining_inventory,
        visibility,
        is_active
        `
      )
      .eq("event_id", eventId)
      .order("created_at", { ascending: false }),
  ]);

  return {
    ...event,
    metrics: metrics ?? null,
    slots: slots ?? [],
  };
}