import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth/get-profile";

export interface SponsorStrategyStatus {
  hasBrief: boolean;
  status: "preparing" | "ready" | "archived" | null;
  submittedAt: string | null;
}

export async function getSponsorStrategyStatus(): Promise<SponsorStrategyStatus> {
  const profile = await getProfile();

  if (profile?.platform_role !== "sponsor") {
    return {
      hasBrief: false,
      status: null,
      submittedAt: null,
    };
  }

  const supabase = await createClient();

  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("profile_id", profile.id)
    .limit(1)
    .maybeSingle();

  if (!membership?.organization_id) {
    return {
      hasBrief: false,
      status: null,
      submittedAt: null,
    };
  }

  const { data: latestBrief } = await supabase
    .from("sponsor_onboarding_briefs")
    .select("strategy_status, submitted_at")
    .eq("organization_id", membership.organization_id)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!latestBrief) {
    return {
      hasBrief: false,
      status: null,
      submittedAt: null,
    };
  }

  return {
    hasBrief: true,
    status: latestBrief.strategy_status,
    submittedAt: latestBrief.submitted_at,
  };
}