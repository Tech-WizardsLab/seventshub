import { createClient } from "@/lib/supabase/server";

export interface MarketplaceOrganizationDetail {
  id: string;
  name: string;
  slug: string;
  organization_type: string;
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
    avg_event_attendance: number | null;
    avg_event_impressions: number | null;
    instagram_followers: number;
    linkedin_followers: number;
    youtube_followers: number;
    tiktok_followers: number;
    x_followers: number;
    facebook_followers: number;
  } | null;
  approvedEvents: Array<{
    id: string;
    name: string;
    sport_type: string;
    city: string | null;
    country: string | null;
    starts_at: string | null;
    short_description: string | null;
  }>;
}

export async function getMarketplaceOrganizationDetail(
  organizationId: string
): Promise<MarketplaceOrganizationDetail | null> {
  const supabase = await createClient();

  const [{ data: organization }, { data: profile }, { data: metrics }, { data: events }] =
    await Promise.all([
      supabase
        .from("organizations")
        .select("id, name, slug, organization_type, website_url, city, country, description")
        .eq("id", organizationId)
        .maybeSingle(),
      supabase
        .from("organization_profiles")
        .select(
          "headline, overview, years_operating, primary_sports, operating_regions, notable_partners, achievements"
        )
        .eq("organization_id", organizationId)
        .maybeSingle(),
      supabase
        .from("organization_metrics")
        .select(
          `
          total_events_organized,
          annual_events_count,
          total_attendance_last_12m,
          total_social_followers,
          total_email_subscribers,
          total_impressions_last_12m,
          total_sponsors_served,
          avg_event_attendance,
          avg_event_impressions,
          instagram_followers,
          linkedin_followers,
          youtube_followers,
          tiktok_followers,
          x_followers,
          facebook_followers
          `
        )
        .eq("organization_id", organizationId)
        .maybeSingle(),
      supabase
        .from("events")
        .select("id, name, sport_type, city, country, starts_at, short_description")
        .eq("organization_id", organizationId)
        .eq("status", "approved")
        .order("starts_at", { ascending: true }),
    ]);

  if (!organization) {
    return null;
  }

  return {
    ...organization,
    profile: profile ?? null,
    metrics: metrics ?? null,
    approvedEvents: events ?? [],
  };
}