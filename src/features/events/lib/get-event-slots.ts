import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/get-user";

export interface EventSlotListItem {
  id: string;
  title: string;
  slug: string;
  slot_type: string;
  tier_name: string | null;
  description: string | null;
  inventory_count: number;
  remaining_inventory: number;
  list_price_eur: number | null;
  minimum_price_eur: number | null;
  visibility: string;
  is_active: boolean;
  benefits: string[];
  audience_fit_tags: string[];
  created_at: string;
}

export async function getEventSlots(eventId: string): Promise<EventSlotListItem[]> {
  const user = await getUser();

  if (!user) {
    return [];
  }

  const supabase = await createClient();

  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("profile_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!membership?.organization_id) {
    return [];
  }

  const { data: event } = await supabase
    .from("events")
    .select("id")
    .eq("id", eventId)
    .eq("organization_id", membership.organization_id)
    .maybeSingle();

  if (!event) {
    return [];
  }

  const { data, error } = await supabase
    .from("sponsorship_slots")
    .select(
      "id, title, slug, slot_type, tier_name, description, inventory_count, remaining_inventory, list_price_eur, minimum_price_eur, visibility, is_active, benefits, audience_fit_tags, created_at"
    )
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data;
}