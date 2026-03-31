import type { SlotType, SlotVisibility } from "@/types/database";

export const SLOT_TYPES: SlotType[] = [
  "title_sponsor",
  "main_sponsor",
  "official_partner",
  "category_exclusive",
  "expo_booth",
  "branding",
  "digital",
  "content",
  "speaking",
  "hospitality",
  "sampling",
  "custom",
];

export const SLOT_VISIBILITIES: SlotVisibility[] = [
  "public",
  "private",
  "invite_only",
];