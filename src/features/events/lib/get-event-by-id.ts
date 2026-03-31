import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/get-user";

export interface OrganizerEventDetail {
  id: string;
  name: string;
  slug: string;
  sport_type: string;
  city: string | null;
  country: string | null;
  status: string;
  starts_at: string | null;
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
}

export async function getEventById(
  eventId: string
): Promise<OrganizerEventDetail | null> {
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
      "id, name, slug, sport_type, city, country, status, starts_at"
    )
    .eq("id", eventId)
    .eq("organization_id", membership.organization_id)
    .maybeSingle();

  if (error || !event) {
    return null;
  }

  const { data: metrics } = await supabase
    .from("event_metrics")
    .select("*")
    .eq("event_id", eventId)
    .maybeSingle();

  return {
    ...event,
    metrics: metrics
      ? {
          expected_attendance: metrics.expected_attendance,
          actual_attendance: metrics.actual_attendance,
          exhibitors_count: metrics.exhibitors_count,
          speakers_count: metrics.speakers_count,
          participating_brands_count: metrics.participating_brands_count,
          email_reach: metrics.email_reach,
          website_visits: metrics.website_visits,
          app_users: metrics.app_users,
          social_impressions: metrics.social_impressions,
          social_engagements: metrics.social_engagements,
          livestream_views: metrics.livestream_views,
          video_views: metrics.video_views,
          press_mentions: metrics.press_mentions,
          media_reach: metrics.media_reach,
          audience_b2b_percentage: metrics.audience_b2b_percentage,
          audience_b2c_percentage: metrics.audience_b2c_percentage,
          audience_tags: metrics.audience_tags,
          industry_tags: metrics.industry_tags,
          demographic_summary: metrics.demographic_summary,
          geographic_summary: metrics.geographic_summary,
          past_sponsors: metrics.past_sponsors,
          notes: metrics.notes,
        }
      : null,
  };
}