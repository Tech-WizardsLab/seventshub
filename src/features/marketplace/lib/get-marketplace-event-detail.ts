import { createClient } from "@/lib/supabase/server";

export interface MarketplaceEventDetail {
  id: string;
  name: string;
  slug: string;
  sport_type: string;
  short_description: string | null;
  description: string | null;
  city: string | null;
  country: string | null;
  venue_name: string | null;
  starts_at: string | null;
  ends_at: string | null;
  website_url: string | null;
  attendee_capacity: number | null;
  status: string;
  organization: {
    id: string;
    name: string;
    website_url: string | null;
    city: string | null;
    country: string | null;
    description: string | null;
    profile: {
      headline: string | null;
      overview: string | null;
      years_operating: number | null;
      primary_sports: string[];
      operating_regions: string[];
      notable_partners: string[];
      achievements: string[];
    } | null;
    metrics: {
      total_events_organized: number;
      annual_events_count: number;
      total_attendance_last_12m: number;
      total_social_followers: number;
      total_email_subscribers: number;
      total_impressions_last_12m: number;
      total_sponsors_served: number;
    } | null;
  };
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
    slug: string;
    slot_type: string;
    tier_name: string | null;
    description: string | null;
    benefits: string[];
    inventory_count: number;
    remaining_inventory: number;
    list_price_eur: number | null;
    minimum_price_eur: number | null;
    visibility: string;
    is_active: boolean;
    deliverables_summary: string | null;
    activation_summary: string | null;
    audience_fit_tags: string[];
  }>;
}

export async function getMarketplaceEventDetail(
  eventId: string
): Promise<MarketplaceEventDetail | null> {
  const supabase = await createClient();

  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .maybeSingle();

  if (eventError || !event) {
    return null;
  }

  const [
    { data: organization },
    { data: organizationProfile },
    { data: organizationMetrics },
    { data: eventMetrics },
    { data: slots },
  ] = await Promise.all([
    supabase
      .from("organizations")
      .select("id, name, website_url, city, country, description")
      .eq("id", event.organization_id)
      .maybeSingle(),
    supabase
      .from("organization_profiles")
      .select(
        "headline, overview, years_operating, primary_sports, operating_regions, notable_partners, achievements"
      )
      .eq("organization_id", event.organization_id)
      .maybeSingle(),
    supabase
      .from("organization_metrics")
      .select(
        "total_events_organized, annual_events_count, total_attendance_last_12m, total_social_followers, total_email_subscribers, total_impressions_last_12m, total_sponsors_served"
      )
      .eq("organization_id", event.organization_id)
      .maybeSingle(),
    supabase
      .from("event_metrics")
      .select("*")
      .eq("event_id", eventId)
      .maybeSingle(),
    supabase
      .from("sponsorship_slots")
      .select("*")
      .eq("event_id", eventId)
      .eq("is_active", true)
      .order("created_at", { ascending: false }),
  ]);

  if (!organization) {
    return null;
  }

  return {
    id: event.id,
    name: event.name,
    slug: event.slug,
    sport_type: event.sport_type,
    short_description: event.short_description,
    description: event.description,
    city: event.city,
    country: event.country,
    venue_name: event.venue_name,
    starts_at: event.starts_at,
    ends_at: event.ends_at,
    website_url: event.website_url,
    attendee_capacity: event.attendee_capacity,
    status: event.status,
    organization: {
      id: organization.id,
      name: organization.name,
      website_url: organization.website_url,
      city: organization.city,
      country: organization.country,
      description: organization.description,
      profile: organizationProfile ?? null,
      metrics: organizationMetrics ?? null,
    },
    metrics: eventMetrics ?? null,
    slots: slots ?? [],
  };
}