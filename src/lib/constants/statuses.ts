import type { EntityStatus, InquiryStatus } from "@/types/database";

export const ENTITY_STATUSES: EntityStatus[] = [
  "draft",
  "pending_review",
  "approved",
  "rejected",
  "archived",
];

export const INQUIRY_STATUSES: InquiryStatus[] = [
  "submitted",
  "under_review",
  "contacted",
  "negotiating",
  "won",
  "lost",
  "withdrawn",
];

export const MARKETPLACE_VISIBLE_EVENT_STATUSES: EntityStatus[] = ["approved"];