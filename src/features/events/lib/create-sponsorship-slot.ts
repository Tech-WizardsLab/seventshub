import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/get-user";
import type { SlotType, SlotVisibility } from "@/types/database";

export interface CreateSponsorshipSlotInput {
  eventId: string;
  title: string;
  slotType: SlotType;
  tierName: string;
  description: string;
  benefits: string;
  inventoryCount: string;
  listPriceEur: string;
  minimumPriceEur: string;
  visibility: SlotVisibility;
  deliverablesSummary: string;
  activationSummary: string;
  audienceFitTags: string;
}

export interface CreateSponsorshipSlotResult {
  error: string | null;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseCsv(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseNullableNumber(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number.parseFloat(trimmed);
  return Number.isNaN(parsed) ? NaN : parsed;
}

function parseRequiredInt(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return 1;
  const parsed = Number.parseInt(trimmed, 10);
  return Number.isNaN(parsed) ? NaN : parsed;
}

export async function createSponsorshipSlot(
  input: CreateSponsorshipSlotInput
): Promise<CreateSponsorshipSlotResult> {
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

  const inventoryCount = parseRequiredInt(input.inventoryCount);
  const listPriceEur = parseNullableNumber(input.listPriceEur);
  const minimumPriceEur = parseNullableNumber(input.minimumPriceEur);

  if (
    Number.isNaN(inventoryCount) ||
    Number.isNaN(listPriceEur) ||
    Number.isNaN(minimumPriceEur)
  ) {
    return { error: "One or more numeric fields are invalid." };
  }

  const slug = `${slugify(input.title)}-${crypto.randomUUID().slice(0, 8)}`;

  const { error } = await supabase.from("sponsorship_slots").insert({
    event_id: input.eventId,
    title: input.title.trim(),
    slug,
    slot_type: input.slotType,
    tier_name: input.tierName.trim() || null,
    description: input.description.trim() || null,
    benefits: parseCsv(input.benefits),
    inventory_count: inventoryCount,
    remaining_inventory: inventoryCount,
    list_price_eur: listPriceEur,
    minimum_price_eur: minimumPriceEur,
    visibility: input.visibility,
    deliverables_summary: input.deliverablesSummary.trim() || null,
    activation_summary: input.activationSummary.trim() || null,
    audience_fit_tags: parseCsv(input.audienceFitTags),
    is_active: true,
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}