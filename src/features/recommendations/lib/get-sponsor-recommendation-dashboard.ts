import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth/get-profile";

export interface SponsorRecommendationItem {
  id: string;
  eventId: string | null;
  eventName: string;
  location: string;
  organizerName: string;
  selectedPackage: string;
  fitScore: number;
  projectedReach: number;
  projectedAttendance: number;
  projectedTouchpoints: number;
  contribution: string;
  status: string;
  whyItFits: string;
  eventOverview: string;
  audienceProfile: string;
  organizerContext: string;
}

export interface SponsorRecommendationDashboardData {
  recommendationSet: {
    id: string;
    title: string;
    status: string;
    analystSummary: string | null;
  };
  summary: {
    recommendedBudget: number;
    projectedTotalReach: number;
    projectedAttendanceExposure: number;
    projectedTouchpoints: number;
    marketsCovered: string[];
    averageFitScore: number;
  };
  briefSummary: {
    category: string;
    geography: string[];
    annualBudget: string;
    perEventBudget: string;
    goals: string[];
    preferredSports: string[];
    kpiPriorities: string[];
  };
  opportunities: SponsorRecommendationItem[];
}

function asArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function asString(value: unknown, fallback = "Not specified") {
  return typeof value === "string" && value.trim() ? value : fallback;
}

export async function getSponsorRecommendationDashboardData(): Promise<SponsorRecommendationDashboardData | null> {
  const profile = await getProfile();

  if (profile?.platform_role !== "sponsor") {
    return null;
  }

  const supabase = await createClient();

  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("profile_id", profile.id)
    .limit(1)
    .maybeSingle();

  if (!membership?.organization_id) {
    return null;
  }

  const organizationId = membership.organization_id;

  const [{ data: latestBrief }, { data: recommendationSet }] = await Promise.all([
    supabase
      .from("sponsor_onboarding_briefs")
      .select("id, briefing_snapshot")
      .eq("organization_id", organizationId)
      .order("version", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("sponsor_recommendation_sets")
      .select(
        "id, title, status, analyst_summary, recommended_budget_eur, projected_total_reach, projected_attendance_exposure, projected_touchpoints, markets_covered, average_fit_score"
      )
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  if (!latestBrief) {
    return null;
  }

  let opportunities: SponsorRecommendationItem[] = [];

  if (recommendationSet?.id) {
    const { data: setItems } = await supabase
      .from("sponsor_recommendation_items")
      .select(
        "id, event_id, selected_package, fit_score, projected_reach, projected_attendance, projected_touchpoints, plan_contribution, recommendation_status, why_it_fits, audience_profile, organizer_context"
      )
      .eq("recommendation_set_id", recommendationSet.id)
      .order("fit_score", { ascending: false });

    if (setItems?.length) {
      const eventIds = setItems
        .map((item) => item.event_id)
        .filter((eventId): eventId is string => Boolean(eventId));

      const [{ data: events }, { data: eventMetrics }] = await Promise.all([
        eventIds.length
          ? supabase
              .from("events")
              .select(
                "id, name, short_description, city, country, organization_id"
              )
              .in("id", eventIds)
          : Promise.resolve({ data: [] as Array<Record<string, unknown>> }),
        eventIds.length
          ? supabase
              .from("event_metrics")
              .select("event_id, demographic_summary, geographic_summary")
              .in("event_id", eventIds)
          : Promise.resolve({ data: [] as Array<Record<string, unknown>> }),
      ]);

      const organizationIds = [...new Set((events ?? []).map((event) => event.organization_id))];

      const { data: organizers } = organizationIds.length
        ? await supabase
            .from("organizations")
            .select("id, name")
            .in("id", organizationIds)
        : { data: [] as Array<Record<string, unknown>> };

      const eventMap = new Map((events ?? []).map((event) => [event.id, event]));
      const eventMetricsMap = new Map((eventMetrics ?? []).map((metric) => [metric.event_id, metric]));
      const organizerMap = new Map((organizers ?? []).map((org) => [org.id, org.name]));

      opportunities = setItems.map((item) => {
        const event = item.event_id ? eventMap.get(item.event_id) : null;
        const metric = item.event_id ? eventMetricsMap.get(item.event_id) : null;

        return {
          id: item.id,
          eventId: item.event_id,
          eventName: event?.name ?? "Curated opportunity",
          location: [event?.city, event?.country].filter(Boolean).join(", ") || "Location TBD",
          organizerName: event?.organization_id
            ? organizerMap.get(event.organization_id) ?? "Organizer"
            : "Organizer",
          selectedPackage: item.selected_package ?? "Custom strategic package",
          fitScore: Number(item.fit_score ?? 0),
          projectedReach: item.projected_reach ?? 0,
          projectedAttendance: item.projected_attendance ?? 0,
          projectedTouchpoints: item.projected_touchpoints ?? 0,
          contribution: item.plan_contribution ?? "Portfolio anchor",
          status: item.recommendation_status,
          whyItFits: item.why_it_fits ?? "Aligned to your strategic brief.",
          eventOverview: event?.short_description ?? "Recommendation prepared by your strategy team.",
          audienceProfile:
            item.audience_profile ??
            metric?.demographic_summary ??
            "Audience profile available on request.",
          organizerContext:
            item.organizer_context ??
            metric?.geographic_summary ??
            "Organizer context available on request.",
        };
      });
    }
  }

  if (!opportunities.length) {
    const { data: fallbackEvents } = await supabase
      .from("events")
      .select(
        "id, name, sport_type, city, country, short_description, organization_id"
      )
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(3);

    const organizationIds = [...new Set((fallbackEvents ?? []).map((event) => event.organization_id))];
    const eventIds = (fallbackEvents ?? []).map((event) => event.id);

    const [{ data: organizers }, { data: metrics }] = await Promise.all([
      organizationIds.length
        ? supabase
            .from("organizations")
            .select("id, name")
            .in("id", organizationIds)
        : Promise.resolve({ data: [] as Array<Record<string, unknown>> }),
      eventIds.length
        ? supabase
            .from("event_metrics")
            .select("event_id, expected_attendance, social_impressions, demographic_summary")
            .in("event_id", eventIds)
        : Promise.resolve({ data: [] as Array<Record<string, unknown>> }),
    ]);

    const organizerMap = new Map((organizers ?? []).map((org) => [org.id, org.name]));
    const metricsMap = new Map((metrics ?? []).map((metric) => [metric.event_id, metric]));

    const briefSnapshot = latestBrief.briefing_snapshot as Record<string, unknown>;
    const preferredSports = asArray((briefSnapshot.sports as Record<string, unknown> | undefined)?.interests);

    opportunities = (fallbackEvents ?? []).map((event, index) => {
      const metric = metricsMap.get(event.id);
      const matchesPreferredSport = preferredSports.some(
        (sport) => sport.toLowerCase() === event.sport_type.toLowerCase()
      );
      const fitScore = Math.max(72, 88 - index * 5 + (matchesPreferredSport ? 4 : 0));

      return {
        id: `fallback-${event.id}`,
        eventId: event.id,
        eventName: event.name,
        location: [event.city, event.country].filter(Boolean).join(", ") || "Location TBD",
        organizerName: organizerMap.get(event.organization_id) ?? "Organizer",
        selectedPackage: "Curated partner mix",
        fitScore,
        projectedReach: metric?.social_impressions ?? 250000,
        projectedAttendance: metric?.expected_attendance ?? 3000,
        projectedTouchpoints: Math.round((metric?.expected_attendance ?? 3000) * 1.4),
        contribution: index === 0 ? "Primary portfolio anchor" : "Supporting portfolio slot",
        status: "recommended",
        whyItFits: matchesPreferredSport
          ? "Direct alignment with your preferred sports focus and market objectives."
          : "Strong audience and market overlap with your strategy brief.",
        eventOverview:
          event.short_description ?? "Curated by your sponsorship strategy team for current cycle.",
        audienceProfile:
          metric?.demographic_summary ?? "Audience profile available after organizer confirmation.",
        organizerContext: "Organizer delivery quality screened by strategy team.",
      };
    });
  }

  const briefSnapshot = latestBrief.briefing_snapshot as Record<string, unknown>;
  const company = (briefSnapshot.company as Record<string, unknown> | undefined) ?? {};
  const geography = (briefSnapshot.geography as Record<string, unknown> | undefined) ?? {};
  const budget = (briefSnapshot.budget as Record<string, unknown> | undefined) ?? {};

  const summary = {
    recommendedBudget:
      Number(recommendationSet?.recommended_budget_eur ?? budget.annual_budget_value ?? 0) || 0,
    projectedTotalReach:
      Number(
        recommendationSet?.projected_total_reach ??
          opportunities.reduce((total, item) => total + item.projectedReach, 0)
      ) || 0,
    projectedAttendanceExposure:
      Number(
        recommendationSet?.projected_attendance_exposure ??
          opportunities.reduce((total, item) => total + item.projectedAttendance, 0)
      ) || 0,
    projectedTouchpoints:
      Number(
        recommendationSet?.projected_touchpoints ??
          opportunities.reduce((total, item) => total + item.projectedTouchpoints, 0)
      ) || 0,
    marketsCovered:
      asArray(recommendationSet?.markets_covered ?? geography.target_markets ?? []),
    averageFitScore:
      Number(
        recommendationSet?.average_fit_score ??
          (opportunities.length
            ? opportunities.reduce((total, item) => total + item.fitScore, 0) /
              opportunities.length
            : 0)
      ) || 0,
  };

  return {
    recommendationSet: {
      id: recommendationSet?.id ?? "fallback-set",
      title: recommendationSet?.title ?? "Curated sponsorship recommendation set",
      status: recommendationSet?.status ?? "ready_for_review",
      analystSummary:
        recommendationSet?.analyst_summary ??
        "This recommendation set balances high-fit opportunities, budget discipline, and market coverage.",
    },
    summary,
    briefSummary: {
      category: asString(company.category),
      geography: asArray(geography.target_markets),
      annualBudget: asString(budget.annual_budget_input, "Not specified"),
      perEventBudget: asString(budget.per_event_budget_input, "Not specified"),
      goals: asArray(briefSnapshot.objectives),
      preferredSports: asArray((briefSnapshot.sports as Record<string, unknown> | undefined)?.interests),
      kpiPriorities: asArray(briefSnapshot.kpi_priorities),
    },
    opportunities,
  };
}