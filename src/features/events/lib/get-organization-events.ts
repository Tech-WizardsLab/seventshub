import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/get-user";

export interface OrganizationEventListItem {
  id: string;
  name: string;
  slug: string;
  sport_type: string;
  city: string | null;
  country: string | null;
  starts_at: string | null;
  status: string;
  is_featured: boolean;
  created_at: string;
}

export async function getOrganizationEvents(): Promise<OrganizationEventListItem[]> {
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

  const { data, error } = await supabase
    .from("events")
    .select(
      "id, name, slug, sport_type, city, country, starts_at, status, is_featured, created_at"
    )
    .eq("organization_id", membership.organization_id)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data;
}