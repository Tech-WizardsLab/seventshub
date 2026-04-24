import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth/get-profile";
import { runMatchingForBrief } from "@/features/recommendations/lib/run-matching-for-brief";

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
    .select("id, strategy_status, submitted_at")
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

  if (latestBrief.strategy_status === "ready") {
    return {
      hasBrief: true,
      status: "ready",
      submittedAt: latestBrief.submitted_at,
    };
  }

  const { data: existingRecommendationSet } = await supabase
    .from("sponsor_recommendation_sets")
    .select("id")
    .eq("organization_id", membership.organization_id)
    .eq("brief_id", latestBrief.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingRecommendationSet?.id) {
    return {
      hasBrief: true,
      status: "ready",
      submittedAt: latestBrief.submitted_at,
    };
  }

  try {
    await runMatchingForBrief(latestBrief.id);
  } catch {
    return {
      hasBrief: true,
      status: latestBrief.strategy_status,
      submittedAt: latestBrief.submitted_at,
    };
  }

  const [{ data: refreshedBrief }, { data: refreshedRecommendationSet }] = await Promise.all([
    supabase
      .from("sponsor_onboarding_briefs")
      .select("strategy_status, submitted_at")
      .eq("id", latestBrief.id)
      .maybeSingle(),
    supabase
      .from("sponsor_recommendation_sets")
      .select("id")
      .eq("organization_id", membership.organization_id)
      .eq("brief_id", latestBrief.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  if (refreshedBrief?.strategy_status === "ready" || refreshedRecommendationSet?.id) {
    return {
      hasBrief: true,
      status: "ready",
      submittedAt: refreshedBrief?.submitted_at ?? latestBrief.submitted_at,
    };
  }

  return {
    hasBrief: true,
    status: refreshedBrief?.strategy_status ?? latestBrief.strategy_status,
    submittedAt: refreshedBrief?.submitted_at ?? latestBrief.submitted_at,
  };
}