import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/get-user";

export interface ShortlistedEventItem {
  id: string;
  event_id: string;
  created_at: string;
  event_name: string;
  sport_type: string;
  city: string | null;
  country: string | null;
  short_description: string | null;
  organization_name: string;
  expected_attendance: number;
  social_impressions: number;
  email_reach: number;
}

export async function getShortlistedEvents(): Promise<ShortlistedEventItem[]> {
  const user = await getUser();

  if (!user) {
    return [];
  }

  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, platform_role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.platform_role !== "sponsor") {
    return [];
  }

  const { data: shortlistRows } = await supabase
    .from("sponsor_event_shortlists")
    .select("id, event_id, created_at")
    .eq("sponsor_profile_id", user.id)
    .order("created_at", { ascending: false });

  if (!shortlistRows || shortlistRows.length === 0) {
    return [];
  }

  const eventIds = shortlistRows.map((row) => row.event_id);

  const [{ data: events }, { data: eventMetrics }] = await Promise.all([
    supabase
      .from("events")
      .select("id, name, sport_type, city, country, short_description, organization_id")
      .in("id", eventIds),
    supabase
      .from("event_metrics")
      .select("event_id, expected_attendance, social_impressions, email_reach")
      .in("event_id", eventIds),
  ]);

  const organizationIds = [...new Set((events ?? []).map((event) => event.organization_id))];

  const { data: organizations } = await supabase
    .from("organizations")
    .select("id, name")
    .in("id", organizationIds);

  const eventMap = new Map((events ?? []).map((event) => [event.id, event]));
  const metricsMap = new Map(
    (eventMetrics ?? []).map((metric) => [metric.event_id, metric])
  );
  const orgMap = new Map((organizations ?? []).map((org) => [org.id, org.name]));

  return shortlistRows
    .map((row) => {
      const event = eventMap.get(row.event_id);
      if (!event) return null;

      const metric = metricsMap.get(row.event_id);

      return {
        id: row.id,
        event_id: row.event_id,
        created_at: row.created_at,
        event_name: event.name,
        sport_type: event.sport_type,
        city: event.city,
        country: event.country,
        short_description: event.short_description,
        organization_name: orgMap.get(event.organization_id) ?? "Unknown organizer",
        expected_attendance: metric?.expected_attendance ?? 0,
        social_impressions: metric?.social_impressions ?? 0,
        email_reach: metric?.email_reach ?? 0,
      };
    })
    .filter((item): item is ShortlistedEventItem => item !== null);
}