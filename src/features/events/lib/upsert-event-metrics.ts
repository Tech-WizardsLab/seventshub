import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/get-user";

export interface UpsertEventMetricsInput {
  eventId: string;
  expectedAttendance: string;
  actualAttendance: string;
  exhibitorsCount: string;
  speakersCount: string;
  participatingBrandsCount: string;
  emailReach: string;
  websiteVisits: string;
  appUsers: string;
  socialImpressions: string;
  socialEngagements: string;
  livestreamViews: string;
  videoViews: string;
  pressMentions: string;
  mediaReach: string;
  audienceB2BPercentage: string;
  audienceB2CPercentage: string;
  audienceTags: string;
  industryTags: string;
  demographicSummary: string;
  geographicSummary: string;
  pastSponsors: string;
  notes: string;
}

export interface UpsertEventMetricsResult {
  error: string | null;
}

function parseNullableInt(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number.parseInt(trimmed, 10);
  return Number.isNaN(parsed) ? NaN : parsed;
}

function parseRequiredInt(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return 0;
  const parsed = Number.parseInt(trimmed, 10);
  return Number.isNaN(parsed) ? NaN : parsed;
}

function parseNullableFloat(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number.parseFloat(trimmed);
  return Number.isNaN(parsed) ? NaN : parsed;
}

function parseCsv(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function upsertEventMetrics(
  input: UpsertEventMetricsInput
): Promise<UpsertEventMetricsResult> {
  const user = await getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  const supabase = await createClient();

  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("profile_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!membership?.organization_id) {
    return { error: "No organization found for this user." };
  }

  const { data: event } = await supabase
    .from("events")
    .select("id")
    .eq("id", input.eventId)
    .eq("organization_id", membership.organization_id)
    .maybeSingle();

  if (!event) {
    return { error: "Event not found or not accessible." };
  }

  const payload = {
    event_id: input.eventId,
    expected_attendance: parseRequiredInt(input.expectedAttendance),
    actual_attendance: parseNullableInt(input.actualAttendance),
    exhibitors_count: parseRequiredInt(input.exhibitorsCount),
    speakers_count: parseRequiredInt(input.speakersCount),
    participating_brands_count: parseRequiredInt(input.participatingBrandsCount),
    email_reach: parseRequiredInt(input.emailReach),
    website_visits: parseRequiredInt(input.websiteVisits),
    app_users: parseRequiredInt(input.appUsers),
    social_impressions: parseRequiredInt(input.socialImpressions),
    social_engagements: parseRequiredInt(input.socialEngagements),
    livestream_views: parseRequiredInt(input.livestreamViews),
    video_views: parseRequiredInt(input.videoViews),
    press_mentions: parseRequiredInt(input.pressMentions),
    media_reach: parseRequiredInt(input.mediaReach),
    audience_b2b_percentage: parseNullableFloat(input.audienceB2BPercentage),
    audience_b2c_percentage: parseNullableFloat(input.audienceB2CPercentage),
    audience_tags: parseCsv(input.audienceTags),
    industry_tags: parseCsv(input.industryTags),
    demographic_summary: input.demographicSummary.trim() || null,
    geographic_summary: input.geographicSummary.trim() || null,
    past_sponsors: parseCsv(input.pastSponsors),
    notes: input.notes.trim() || null,
  };

  const invalidNumber = Object.values(payload).some((value) => Number.isNaN(value));
  if (invalidNumber) {
    return { error: "One or more numeric fields are invalid." };
  }

  const { error } = await supabase
    .from("event_metrics")
    .upsert(payload, { onConflict: "event_id" });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}