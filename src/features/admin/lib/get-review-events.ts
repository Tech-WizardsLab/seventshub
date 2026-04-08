import { createClient } from "@/lib/supabase/server";

interface ReviewEventRow {
  id: string;
  name: string;
  sport_type: string;
  city: string | null;
  country: string | null;
  status: string;
  created_at: string;
  organization_id: string;
}

interface OrganizationRow {
  id: string;
  name: string;
}

export interface ReviewEventItem {
  id: string;
  name: string;
  sport_type: string;
  city: string | null;
  country: string | null;
  status: string;
  created_at: string;
  organization_name: string;
}

export async function getReviewEvents(): Promise<ReviewEventItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select("id, name, sport_type, city, country, status, created_at, organization_id")
    .in("status", ["pending_review", "approved", "rejected"])
    .order("created_at", { ascending: false });

  const events = (data ?? []) as ReviewEventRow[];

  if (error || events.length === 0) {
    return [];
  }

  const orgIds = [...new Set(events.map((event) => event.organization_id))];

  const { data: orgData } = await supabase
    .from("organizations")
    .select("id, name")
    .in("id", orgIds);

  const organizations = (orgData ?? []) as OrganizationRow[];

  const orgMap = new Map(organizations.map((org) => [org.id, org.name]));

  return events.map((event) => ({
    id: event.id,
    name: event.name,
    sport_type: event.sport_type,
    city: event.city,
    country: event.country,
    status: event.status,
    created_at: event.created_at,
    organization_name: orgMap.get(event.organization_id) ?? "Unknown organizer",
  }));
}