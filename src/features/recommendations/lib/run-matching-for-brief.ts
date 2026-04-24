import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import {
  calculateActivationSignalStrength,
  calculateBudgetCompatibility,
  calculateTimelineFeasibility,
} from "@/features/recommendations/lib/matching-signals";
import { computeScoringResult, normalizeMatchTags } from "@/features/recommendations/lib/scoring";

interface RunMatchingResult {
  recommendationSetId: string;
  generatedItems: number;
}

interface CandidateScore {
  eventId: string;
  slotTitle: string;
  fitScore: number;
  audienceFitScore: number | null;
  sportFitScore: number | null;
  brandFitScore: number | null;
  geographicFitScore: number | null;
  activationFitScore: number | null;
  budgetFitScore: number | null;
  timingFeasibilityScore: number | null;
  marketFitScore: number | null;
  confidenceScore: number | null;
  projectedReach: number;
  projectedAttendance: number;
  projectedTouchpoints: number;
  planContribution: string;
  whyItFits: string;
  audienceProfile: string;
  organizerContext: string;
  matchingInput: Record<string, unknown>;
  scoringInputs: Record<string, unknown>;
}

function asArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as string[];
  }

  return value.filter((entry): entry is string => typeof entry === "string");
}

function asObject(value: unknown) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return {} as Record<string, unknown>;
}

function parseDate(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Number(value.toFixed(2))));
}

function overlapScore(left: string[], right: string[]) {
  if (!left.length || !right.length) {
    return null;
  }

  const leftSet = new Set(left.map((entry) => entry.toLowerCase()));
  const rightSet = new Set(right.map((entry) => entry.toLowerCase()));

  let overlap = 0;
  leftSet.forEach((entry) => {
    if (rightSet.has(entry)) {
      overlap += 1;
    }
  });

  return clampScore((overlap / leftSet.size) * 100);
}

function midpoint(min: number | null, max: number | null) {
  if (typeof min === "number" && typeof max === "number") {
    return (min + max) / 2;
  }

  if (typeof min === "number") {
    return min;
  }

  if (typeof max === "number") {
    return max;
  }

  return null;
}

function toDateOnlyIso(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  return value.slice(0, 10);
}

export async function runMatchingForBrief(briefId: string): Promise<RunMatchingResult> {
  const supabase = createAdminClient();

  const { data: brief, error: briefError } = await supabase
    .from("sponsor_onboarding_briefs")
    .select("id, organization_id, version, strategy_status, briefing_snapshot")
    .eq("id", briefId)
    .maybeSingle();

  if (briefError) {
    throw new Error(`Could not load sponsor brief: ${briefError.message}`);
  }

  if (!brief) {
    throw new Error("Sponsor brief not found.");
  }

  const organizationId = brief.organization_id;
  const snapshot = asObject(brief.briefing_snapshot);
  const companySnapshot = asObject(snapshot.company);
  const geographySnapshot = asObject(snapshot.geography);
  const audienceSnapshot = asObject(snapshot.audience);
  const sportsSnapshot = asObject(snapshot.sports);
  const budgetSnapshot = asObject(snapshot.budget);

  const { data: sponsorPreference } = await supabase
    .from("sponsor_preferences")
    .select(
      "target_sports, target_regions, target_countries, target_audience_tags, preferred_activation_types, min_budget_eur, max_budget_eur, brand_positioning"
    )
    .eq("organization_id", organizationId)
    .maybeSingle();

  const sponsorSports = normalizeMatchTags([
    ...asArray(sportsSnapshot.interests),
    ...asArray(sponsorPreference?.target_sports),
  ]);

  const sponsorMarkets = normalizeMatchTags([
    ...asArray(geographySnapshot.target_markets),
    ...asArray(sponsorPreference?.target_regions),
    ...asArray(sponsorPreference?.target_countries),
  ]);

  const sponsorAudienceTags = normalizeMatchTags([
    ...asArray(audienceSnapshot.segments),
    ...asArray(sponsorPreference?.target_audience_tags),
  ]);

  const sponsorActivationPreferences = normalizeMatchTags([
    ...asArray(snapshot.activation_preferences),
    ...asArray(sponsorPreference?.preferred_activation_types),
  ]);

  const sponsorBudgetMin =
    sponsorPreference?.min_budget_eur ??
    (typeof budgetSnapshot.per_event_budget_value === "number"
      ? budgetSnapshot.per_event_budget_value
      : null);

  const sponsorBudgetMax =
    sponsorPreference?.max_budget_eur ??
    (typeof budgetSnapshot.annual_budget_value === "number" ? budgetSnapshot.annual_budget_value : null);

  const sponsorBrandPositioning =
    sponsorPreference?.brand_positioning ??
    (typeof companySnapshot.brand_positioning === "string" ? companySnapshot.brand_positioning : null);

  const { data: existingSet } = await supabase
    .from("sponsor_recommendation_sets")
    .select("id")
    .eq("organization_id", organizationId)
    .eq("brief_id", brief.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let recommendationSetId = existingSet?.id ?? null;
  if (!recommendationSetId) {
    const { data: createdSet, error: createSetError } = await supabase
      .from("sponsor_recommendation_sets")
      .insert({
        organization_id: organizationId,
        brief_id: brief.id,
        title: `Automated recommendation set (brief v${brief.version})`,
        status: "ready_for_review",
      })
      .select("id")
      .single();

    if (createSetError || !createdSet) {
      throw new Error(createSetError?.message ?? "Could not create recommendation set.");
    }

    recommendationSetId = createdSet.id;
  }

  const { error: clearItemsError } = await supabase
    .from("sponsor_recommendation_items")
    .delete()
    .eq("recommendation_set_id", recommendationSetId);

  if (clearItemsError) {
    throw new Error(`Could not clear previous recommendation items: ${clearItemsError.message}`);
  }

  const { data: events, error: eventsError } = await supabase
    .from("events")
    .select(
      "id, organization_id, name, sport_type, category_tags, short_description, city, country, event_positioning, start_date, starts_at, sponsorship_sales_deadline, activation_lock_date, asset_delivery_deadline, logistics_cutoff_date, archived_at, status"
    )
    .eq("status", "approved")
    .is("archived_at", null);

  if (eventsError) {
    throw new Error(`Could not load candidate events: ${eventsError.message}`);
  }

  const candidateEvents = events ?? [];
  if (!candidateEvents.length) {
    await supabase
      .from("sponsor_recommendation_sets")
      .update({
        status: "ready_for_review",
        recommended_budget_eur: midpoint(sponsorBudgetMin, sponsorBudgetMax),
        projected_total_reach: 0,
        projected_attendance_exposure: 0,
        projected_touchpoints: 0,
        average_fit_score: 0,
        markets_covered: sponsorMarkets,
        analyst_summary: "No active events currently match the approved inventory filters.",
      })
      .eq("id", recommendationSetId);

    await supabase
      .from("sponsor_onboarding_briefs")
      .update({ strategy_status: "ready" })
      .eq("id", brief.id);

    return {
      recommendationSetId,
      generatedItems: 0,
    };
  }

  const eventIds = candidateEvents.map((event) => event.id);

  const [{ data: eventMetrics, error: metricsError }, { data: slots, error: slotsError }, { data: organizers }] =
    await Promise.all([
      supabase
        .from("event_metrics")
        .select(
          "event_id, expected_attendance, social_impressions, audience_tags, audience_segments, demographic_summary, geographic_summary"
        )
        .in("event_id", eventIds),
      supabase
        .from("sponsorship_slots")
        .select(
          "event_id, title, tier_name, list_price_eur, minimum_price_eur, price_range_min, price_range_max, audience_fit_tags, activation_summary, benefits, estimated_reach, estimated_impressions, inventory_count, remaining_inventory, is_active, archived_at"
        )
        .in("event_id", eventIds)
        .eq("is_active", true)
        .is("archived_at", null),
      supabase.from("organizations").select("id, name").in(
        "id",
        Array.from(new Set(candidateEvents.map((event) => event.organization_id)))
      ),
    ]);

  if (metricsError) {
    throw new Error(`Could not load event metrics: ${metricsError.message}`);
  }

  if (slotsError) {
    throw new Error(`Could not load sponsorship slots: ${slotsError.message}`);
  }

  const metricMap = new Map((eventMetrics ?? []).map((metric) => [metric.event_id, metric]));
  const slotMap = new Map<string, Array<(typeof slots)[number]>>();
  (slots ?? []).forEach((slot) => {
    const previous = slotMap.get(slot.event_id) ?? [];
    previous.push(slot);
    slotMap.set(slot.event_id, previous);
  });
  const organizerMap = new Map((organizers ?? []).map((org) => [org.id, org.name]));

  const scoredCandidates: CandidateScore[] = [];
  const now = new Date();

  candidateEvents.forEach((event) => {
    const eventSlots = slotMap.get(event.id) ?? [];
    if (!eventSlots.length) {
      return;
    }

    const metric = metricMap.get(event.id);
    const eventAudienceTags = normalizeMatchTags([
      ...asArray(metric?.audience_tags),
      ...asArray(metric?.audience_segments),
      ...asArray(event.category_tags),
    ]);
    const eventSportTags = normalizeMatchTags([event.sport_type, ...asArray(event.category_tags)]);

    eventSlots.forEach((slot) => {
      const marketFitScore =
        sponsorMarkets.length > 0
          ? sponsorMarkets.includes((event.country ?? "").toLowerCase())
            ? 100
            : sponsorMarkets.includes((event.city ?? "").toLowerCase())
              ? 90
              : 35
          : null;

      const sportFitScore = overlapScore(sponsorSports, eventSportTags);
      const audienceTagFitScore = overlapScore(sponsorAudienceTags, eventAudienceTags);
      const audienceFitScore =
        audienceTagFitScore !== null && sportFitScore !== null
          ? clampScore((audienceTagFitScore + sportFitScore) / 2)
          : audienceTagFitScore ?? sportFitScore;

      const brandFitScore =
        sponsorBrandPositioning && event.event_positioning
          ? sponsorBrandPositioning === event.event_positioning
            ? 100
            : 55
          : null;

      const activationTags = normalizeMatchTags([
        ...asArray(slot.audience_fit_tags),
        ...asArray(slot.benefits),
        slot.activation_summary ?? "",
      ]);

      const activationResult = calculateActivationSignalStrength({
        preferredActivationTypes: sponsorActivationPreferences,
        availableActivationTags: activationTags,
      });

      const packageMinPrice = slot.price_range_min ?? slot.minimum_price_eur ?? slot.list_price_eur ?? null;
      const packageMaxPrice = slot.price_range_max ?? slot.list_price_eur ?? slot.minimum_price_eur ?? null;

      const budgetResult = calculateBudgetCompatibility({
        sponsorMinBudgetEur: sponsorBudgetMin,
        sponsorMaxBudgetEur: sponsorBudgetMax,
        packagePriceMinEur: packageMinPrice,
        packagePriceMaxEur: packageMaxPrice,
      });

      const timelineResult = calculateTimelineFeasibility({
        now,
        eventStartDate: parseDate(event.start_date ?? event.starts_at),
        sponsorshipSalesDeadline: parseDate(event.sponsorship_sales_deadline),
        activationLockDate: parseDate(event.activation_lock_date),
        assetDeliveryDeadline: parseDate(event.asset_delivery_deadline),
        logisticsCutoffDate: parseDate(event.logistics_cutoff_date),
      });

      const scoreResult = computeScoringResult({
        audienceFitScore,
        brandFitScore,
        geographicFitScore: marketFitScore,
        activationFitScore: activationResult.strength,
        budgetFitScore: budgetResult.score,
        timingFeasibilityScore: timelineResult.score,
      });

      const compositeScore = scoreResult.weightedCompositeScore ?? 0;
      const projectedReach =
        slot.estimated_impressions ??
        slot.estimated_reach ??
        metric?.social_impressions ??
        0;
      const projectedAttendance = metric?.expected_attendance ?? 0;
      const projectedTouchpoints = Math.round(projectedAttendance * 1.2);

      const organizerName = organizerMap.get(event.organization_id) ?? "Organizer";
      const matchedSignals = [
        sportFitScore !== null && sportFitScore >= 70 ? "sport focus alignment" : null,
        marketFitScore !== null && marketFitScore >= 70 ? "target market overlap" : null,
        activationResult.strength !== null && activationResult.strength >= 50
          ? "activation fit"
          : null,
        budgetResult.score !== null && budgetResult.score >= 60 ? "budget compatibility" : null,
      ]
        .filter(Boolean)
        .join(", ");

      scoredCandidates.push({
        eventId: event.id,
        slotTitle: slot.tier_name ? `${slot.title} (${slot.tier_name})` : slot.title,
        fitScore: compositeScore,
        audienceFitScore,
        sportFitScore,
        brandFitScore,
        geographicFitScore: marketFitScore,
        activationFitScore: activationResult.strength,
        budgetFitScore: budgetResult.score,
        timingFeasibilityScore: timelineResult.score,
        marketFitScore,
        confidenceScore: scoreResult.confidenceScore,
        projectedReach,
        projectedAttendance,
        projectedTouchpoints,
        planContribution: "Portfolio candidate",
        whyItFits: matchedSignals
          ? `Strong match due to ${matchedSignals}.`
          : "Solid baseline alignment with available sponsor and event data.",
        audienceProfile:
          metric?.demographic_summary ??
          "Audience profile is based on currently available organizer metrics.",
        organizerContext: `${organizerName} · ${event.city ?? "City TBD"}, ${event.country ?? "Country TBD"}`,
        matchingInput: {
          sponsor_markets: sponsorMarkets,
          sponsor_target_sports: sponsorSports,
          sponsor_audience_tags: sponsorAudienceTags,
          sponsor_activation_preferences: sponsorActivationPreferences,
          sponsor_budget_min_eur: sponsorBudgetMin,
          sponsor_budget_max_eur: sponsorBudgetMax,
          event_market_country: event.country,
          event_market_city: event.city,
          event_sport_type: event.sport_type,
          event_category_tags: event.category_tags ?? [],
          event_expected_attendance: metric?.expected_attendance ?? null,
          event_social_impressions: metric?.social_impressions ?? null,
          event_demographic_summary: metric?.demographic_summary ?? null,
          event_geographic_summary: metric?.geographic_summary ?? null,
          event_start_date: toDateOnlyIso(event.start_date ?? event.starts_at),
          sponsorship_sales_deadline: toDateOnlyIso(event.sponsorship_sales_deadline),
          activation_lock_date: toDateOnlyIso(event.activation_lock_date),
          asset_delivery_deadline: toDateOnlyIso(event.asset_delivery_deadline),
          logistics_cutoff_date: toDateOnlyIso(event.logistics_cutoff_date),
          is_timeline_feasible: timelineResult.isFeasible,
          timeline_days_buffer: timelineResult.daysBuffer,
          has_activation_inventory: activationResult.hasActivationInventory,
          activation_signal_strength: activationResult.strength,
          sponsor_budget_mid_eur: budgetResult.sponsorBudgetMidEur,
          package_price_min_eur: packageMinPrice,
          package_price_max_eur: packageMaxPrice,
          budget_compatibility_ratio: budgetResult.ratio,
        },
        scoringInputs: {
          source: "phase_a_mvp",
          weights: scoreResult.normalizedWeights,
          scored_dimension_count: scoreResult.scoredDimensionCount,
          audience_fit_score: audienceFitScore,
          sport_fit_score: sportFitScore,
          brand_fit_score: brandFitScore,
          geographic_fit_score: marketFitScore,
          activation_fit_score: activationResult.strength,
          budget_fit_score: budgetResult.score,
          timing_feasibility_score: timelineResult.score,
        },
      });
    });
  });

  const topCandidates = scoredCandidates
    .sort((left, right) => right.fitScore - left.fitScore)
    .slice(0, 6);

  if (!topCandidates.length) {
    await supabase
      .from("sponsor_recommendation_sets")
      .update({
        status: "ready_for_review",
        recommended_budget_eur: midpoint(sponsorBudgetMin, sponsorBudgetMax),
        projected_total_reach: 0,
        projected_attendance_exposure: 0,
        projected_touchpoints: 0,
        average_fit_score: 0,
        markets_covered: sponsorMarkets,
        analyst_summary: "No active event/package combinations were eligible for recommendations.",
      })
      .eq("id", recommendationSetId);

    await supabase
      .from("sponsor_onboarding_briefs")
      .update({ strategy_status: "ready" })
      .eq("id", brief.id);

    return {
      recommendationSetId,
      generatedItems: 0,
    };
  }

  const itemsPayload = topCandidates.map((candidate, index) => ({
    recommendation_set_id: recommendationSetId,
    event_id: candidate.eventId,
    selected_package: candidate.slotTitle,
    fit_score: candidate.fitScore,
    projected_reach: candidate.projectedReach,
    projected_attendance: candidate.projectedAttendance,
    projected_touchpoints: candidate.projectedTouchpoints,
    plan_contribution: index === 0 ? "Primary portfolio anchor" : "Supporting portfolio slot",
    recommendation_status: "recommended" as const,
    why_it_fits: candidate.whyItFits,
    audience_profile: candidate.audienceProfile,
    organizer_context: candidate.organizerContext,
  }));

  const { data: insertedItems, error: insertItemsError } = await supabase
    .from("sponsor_recommendation_items")
    .insert(itemsPayload)
    .select("id, event_id, selected_package, fit_score");

  if (insertItemsError || !insertedItems) {
    throw new Error(insertItemsError?.message ?? "Could not persist recommendation items.");
  }

  const candidateKeyMap = new Map(
    topCandidates.map((candidate) => [`${candidate.eventId}::${candidate.slotTitle}`, candidate])
  );

  const matchingInputsPayload = insertedItems.map((item) => {
    const key = `${item.event_id}::${item.selected_package ?? ""}`;
    const candidate = candidateKeyMap.get(key);
    if (!candidate) {
      throw new Error("Could not map matching input candidate to inserted recommendation item.");
    }

    return {
      recommendation_item_id: item.id,
      source_recommendation_set_id: recommendationSetId,
      sponsor_organization_id: organizationId,
      source_brief_id: brief.id,
      sponsor_markets: (candidate.matchingInput.sponsor_markets as string[]) ?? [],
      sponsor_target_sports: (candidate.matchingInput.sponsor_target_sports as string[]) ?? [],
      sponsor_audience_tags: (candidate.matchingInput.sponsor_audience_tags as string[]) ?? [],
      sponsor_activation_preferences:
        (candidate.matchingInput.sponsor_activation_preferences as string[]) ?? [],
      sponsor_budget_min_eur: (candidate.matchingInput.sponsor_budget_min_eur as number | null) ?? null,
      sponsor_budget_max_eur: (candidate.matchingInput.sponsor_budget_max_eur as number | null) ?? null,
      sponsor_budget_mid_eur: (candidate.matchingInput.sponsor_budget_mid_eur as number | null) ?? null,
      event_market_country: (candidate.matchingInput.event_market_country as string | null) ?? null,
      event_market_city: (candidate.matchingInput.event_market_city as string | null) ?? null,
      event_sport_type: (candidate.matchingInput.event_sport_type as string | null) ?? null,
      event_category_tags: (candidate.matchingInput.event_category_tags as string[]) ?? [],
      event_expected_attendance:
        (candidate.matchingInput.event_expected_attendance as number | null) ?? null,
      event_social_impressions:
        (candidate.matchingInput.event_social_impressions as number | null) ?? null,
      event_demographic_summary:
        (candidate.matchingInput.event_demographic_summary as string | null) ?? null,
      event_geographic_summary:
        (candidate.matchingInput.event_geographic_summary as string | null) ?? null,
      event_start_date: (candidate.matchingInput.event_start_date as string | null) ?? null,
      sponsorship_sales_deadline:
        (candidate.matchingInput.sponsorship_sales_deadline as string | null) ?? null,
      activation_lock_date: (candidate.matchingInput.activation_lock_date as string | null) ?? null,
      asset_delivery_deadline:
        (candidate.matchingInput.asset_delivery_deadline as string | null) ?? null,
      logistics_cutoff_date:
        (candidate.matchingInput.logistics_cutoff_date as string | null) ?? null,
      is_timeline_feasible:
        (candidate.matchingInput.is_timeline_feasible as boolean | null) ?? null,
      timeline_days_buffer:
        (candidate.matchingInput.timeline_days_buffer as number | null) ?? null,
      has_activation_inventory:
        (candidate.matchingInput.has_activation_inventory as boolean | null) ?? null,
      activation_signal_strength:
        (candidate.matchingInput.activation_signal_strength as number | null) ?? null,
      package_price_min_eur: (candidate.matchingInput.package_price_min_eur as number | null) ?? null,
      package_price_max_eur: (candidate.matchingInput.package_price_max_eur as number | null) ?? null,
      budget_compatibility_ratio:
        (candidate.matchingInput.budget_compatibility_ratio as number | null) ?? null,
      metadata: {
        source: "phase_a_mvp",
      },
    };
  });

  const { error: matchingInputsError } = await supabase
    .from("sponsor_recommendation_item_matching_inputs")
    .upsert(matchingInputsPayload, { onConflict: "recommendation_item_id" });

  if (matchingInputsError) {
    throw new Error(`Could not persist matching inputs: ${matchingInputsError.message}`);
  }

  const derivedScoresPayload = insertedItems.map((item) => {
    const key = `${item.event_id}::${item.selected_package ?? ""}`;
    const candidate = candidateKeyMap.get(key);
    if (!candidate) {
      throw new Error("Could not map derived score candidate to inserted recommendation item.");
    }

    return {
      recommendation_item_id: item.id,
      recommendation_set_id: recommendationSetId,
      score_version: 1,
      market_fit_score: candidate.marketFitScore,
      audience_fit_score: candidate.audienceFitScore,
      sport_fit_score: candidate.sportFitScore,
      budget_fit_score: candidate.budgetFitScore,
      brand_fit_score: candidate.brandFitScore,
      geographic_fit_score: candidate.geographicFitScore,
      activation_fit_score: candidate.activationFitScore,
      timing_feasibility_score: candidate.timingFeasibilityScore,
      composite_fit_score: candidate.fitScore,
      composite_score: candidate.fitScore,
      confidence_score: candidate.confidenceScore,
      scoring_inputs: candidate.scoringInputs,
      scoring_notes: "Generated by Phase A MVP matching pipeline.",
    };
  });

  const { error: derivedScoresError } = await supabase
    .from("sponsor_recommendation_item_derived_scores")
    .upsert(derivedScoresPayload, { onConflict: "recommendation_item_id" });

  if (derivedScoresError) {
    throw new Error(`Could not persist derived scores: ${derivedScoresError.message}`);
  }

  const totalReach = topCandidates.reduce((sum, candidate) => sum + candidate.projectedReach, 0);
  const totalAttendance = topCandidates.reduce(
    (sum, candidate) => sum + candidate.projectedAttendance,
    0
  );
  const totalTouchpoints = topCandidates.reduce(
    (sum, candidate) => sum + candidate.projectedTouchpoints,
    0
  );
  const averageFit =
    topCandidates.length > 0
      ? Number(
          (
            topCandidates.reduce((sum, candidate) => sum + candidate.fitScore, 0) /
            topCandidates.length
          ).toFixed(2)
        )
      : 0;

  await supabase
    .from("sponsor_recommendation_sets")
    .update({
      status: "ready_for_review",
      recommended_budget_eur: midpoint(sponsorBudgetMin, sponsorBudgetMax),
      projected_total_reach: totalReach,
      projected_attendance_exposure: totalAttendance,
      projected_touchpoints: totalTouchpoints,
      markets_covered: sponsorMarkets,
      average_fit_score: averageFit,
      analyst_summary: "Automated recommendation set generated from your sponsorship brief.",
    })
    .eq("id", recommendationSetId);

  await supabase
    .from("sponsor_onboarding_briefs")
    .update({ strategy_status: "ready" })
    .eq("id", brief.id);

  return {
    recommendationSetId,
    generatedItems: insertedItems.length,
  };
}