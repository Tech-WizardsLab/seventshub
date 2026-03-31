import { createClient } from "@/lib/supabase/server";

export interface MarketplaceEventCard {
  id: string;
  name: string;
  slug: string;
  sport_type: string;
  city: string | null;
  country: string | null;
  short_description: string | null;
  starts_at: string | null;
  organization_name: string;
  metrics: {
    expected_attendance: number;
    social_impressions: number;
    participating_brands_count: number;
    past_sponsors: string[];
  } | null;
}

export async function getMarketplaceEvents(): Promise<MarketplaceEventCard[]> {
  const supabase = await createClient();

  const { data: events, error } = await supabase
    .from("events")
    .select(
      "id, name, slug, sport_type, city, country, short_description, starts_at, organization_id, status"
    )
    .eq("status", "draft")
    .order("created_at", { ascending: false });

  if (error || !events) {
    return [];
  }

  const organizationIds = [...new Set(events.map((event) => event.organization_id))];

  const [{ data: organizations }, { data: metrics }] = await Promise.all([
    supabase
      .from("organizations")
      .select("id, name")
      .in("id", organizationIds),
    supabase
      .from("event_metrics")
      .select(
        "event_id, expected_attendance, social_impressions, participating_brands_count, past_sponsors"
      )
      .in("event_id", events.map((event) => event.id)),
  ]);

  const organizationMap = new Map(
    (organizations ?? []).map((organization) => [organization.id, organization.name])
  );

  const metricsMap = new Map(
    (metrics ?? []).map((metric) => [metric.event_id, metric])
  );

  return events.map((event) => ({
    id: event.id,
    name: event.name,
    slug: event.slug,
    sport_type: event.sport_type,
    city: event.city,
    country: event.country,
    short_description: event.short_description,
    starts_at: event.starts_at,
    organization_name: organizationMap.get(event.organization_id) ?? "Unknown",
    metrics: metricsMap.get(event.id) ?? null,
  }));
}