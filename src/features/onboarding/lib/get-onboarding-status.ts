import { createClient } from "@/lib/supabase/server";

export interface OnboardingStatus {
  hasProfile: boolean;
  hasOrganizationMembership: boolean;
  organizationId: string | null;
}

export async function getOnboardingStatus(): Promise<OnboardingStatus> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      hasProfile: false,
      hasOrganizationMembership: false,
      organizationId: null,
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("profile_id", user.id)
    .limit(1)
    .maybeSingle();

  return {
    hasProfile: Boolean(profile),
    hasOrganizationMembership: Boolean(membership?.organization_id),
    organizationId: membership?.organization_id ?? null,
  };
}