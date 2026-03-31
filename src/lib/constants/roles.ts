import type { MembershipRole, PlatformRole } from "@/types/database";

export const PLATFORM_ROLES: PlatformRole[] = [
  "organizer",
  "sponsor",
  "admin",
];

export const MEMBERSHIP_ROLES: MembershipRole[] = [
  "owner",
  "admin",
  "member",
];