"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/["']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function splitCsv(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseBudget(value: string) {
  const parsed = Number.parseFloat(value.replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function ToggleCard({
  selected,
  label,
  onClick,
}: {
  selected: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
        selected
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
      }`}
    >
      {label}
    </button>
  );
}

export function SponsorOnboardingWizard() {
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [companyName, setCompanyName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [targetMarkets, setTargetMarkets] = useState("");
  const [cityFocus, setCityFocus] = useState("");

  const [audienceType, setAudienceType] = useState<"B2B" | "B2C" | "Mixed" | "">("");
  const [audienceSegments, setAudienceSegments] = useState("");

  const [sportsInterests, setSportsInterests] = useState("");
  const [sportsExclusions, setSportsExclusions] = useState("");

  const [annualBudget, setAnnualBudget] = useState("");
  const [perEventBudget, setPerEventBudget] = useState("");
  const [budgetNotes, setBudgetNotes] = useState("");

  const [campaignObjectives, setCampaignObjectives] = useState<string[]>([]);
  const [activationPreferences, setActivationPreferences] = useState<string[]>([]);
  const [kpiPriorities, setKpiPriorities] = useState<string[]>([]);

  const [regionsToAvoid, setRegionsToAvoid] = useState("");
  const [eventTypesToAvoid, setEventTypesToAvoid] = useState("");
  const [minimumQuality, setMinimumQuality] = useState("");
  const [requiredConditions, setRequiredConditions] = useState("");

  const steps = useMemo(
    () => [
      "Company",
      "Geography",
      "Audience",
      "Sports",
      "Budget",
      "Objectives",
      "Activation",
      "KPIs",
      "Constraints",
    ],
    []
  );

  function toggleInList(list: string[], setList: (next: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  }

  function validateCurrentStep() {
    if (step === 0) {
      if (!companyName.trim()) return "Company name is required.";
      if (!category.trim()) return "Company category / industry is required.";
      if (!description.trim()) return "A short company description is required.";
    }

    if (step === 1 && splitCsv(targetMarkets).length === 0) {
      return "Add at least one target country or region.";
    }

    if (step === 2) {
      if (!audienceType) return "Select B2B, B2C, or Mixed.";
      if (splitCsv(audienceSegments).length === 0) {
        return "Add at least one audience segment.";
      }
    }

    if (step === 3 && splitCsv(sportsInterests).length === 0) {
      return "Add at least one preferred sport or event category.";
    }

    if (step === 4) {
      if (!annualBudget.trim()) return "Annual sponsorship budget is required.";
      if (!perEventBudget.trim()) return "Preferred budget per event is required.";
    }

    if (step === 5 && campaignObjectives.length === 0) {
      return "Select at least one campaign objective.";
    }

    if (step === 6 && activationPreferences.length === 0) {
      return "Select at least one activation preference.";
    }

    if (step === 7 && kpiPriorities.length === 0) {
      return "Select at least one KPI priority.";
    }

    return null;
  }

  async function handleSubmit() {
    setError(null);
    const validationError = validateCurrentStep();

    if (validationError) {
      setError(validationError);
      return;
    }

    setPending(true);

    try {
      const supabase = createBrowserSupabaseClient();

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("You must be logged in to continue.");
      }

      const { data: membership } = await supabase
        .from("organization_members")
        .select("organization_id")
        .eq("profile_id", user.id)
        .limit(1)
        .maybeSingle();

      let organizationId = membership?.organization_id ?? null;

      if (!organizationId) {
        const baseSlug = slugify(companyName);
        const orgSlug = `${baseSlug}-${crypto.randomUUID().slice(0, 8)}`;

        const rpcClient = supabase as typeof supabase & {
          rpc: (
            fn: string,
            args?: Record<string, unknown>
          ) => Promise<{ data: unknown; error: { message: string } | null }>;
        };

        const { error: rpcError } = await rpcClient.rpc("complete_onboarding", {
          p_platform_role: "sponsor",
          p_company_name: companyName.trim(),
          p_slug: orgSlug,
          p_website_url: websiteUrl.trim() || null,
          p_city: cityFocus.trim() || null,
          p_country: splitCsv(targetMarkets)[0] ?? null,
          p_description: description.trim() || null,
        });

        if (rpcError) {
          throw new Error(rpcError.message);
        }

        const { data: refreshedMembership } = await supabase
          .from("organization_members")
          .select("organization_id")
          .eq("profile_id", user.id)
          .limit(1)
          .maybeSingle();

        organizationId = refreshedMembership?.organization_id ?? null;
      }

      if (!organizationId) {
        throw new Error("Could not resolve sponsor organization.");
      }

      const markets = splitCsv(targetMarkets);
      const audience = splitCsv(audienceSegments);
      const sports = splitCsv(sportsInterests);

      await supabase.from("organizations").update({
        name: companyName.trim(),
        website_url: websiteUrl.trim() || null,
        description: description.trim() || null,
        city: cityFocus.trim() || null,
        country: markets[0] ?? null,
      }).eq("id", organizationId);

      await supabase.from("organization_profiles").upsert(
        {
          organization_id: organizationId,
          headline: category.trim() ? `${category.trim()} sponsor` : null,
          overview: description.trim() || null,
          operating_regions: markets,
        },
        { onConflict: "organization_id" }
      );

      const sponsorNotes = [
        `Audience type: ${audienceType}`,
        campaignObjectives.length ? `Objectives: ${campaignObjectives.join(", ")}` : null,
        splitCsv(sportsExclusions).length
          ? `Sports exclusions: ${splitCsv(sportsExclusions).join(", ")}`
          : null,
        budgetNotes.trim() ? `Budget notes: ${budgetNotes.trim()}` : null,
      ]
        .filter(Boolean)
        .join("\n");

      const { error: sponsorPreferencesError } = await supabase
        .from("sponsor_preferences")
        .upsert(
          {
            organization_id: organizationId,
            target_sports: sports,
            target_regions: markets,
            target_countries: markets,
            target_audience_tags: [audienceType, ...audience],
            preferred_activation_types: activationPreferences,
            min_budget_eur: parseBudget(perEventBudget),
            max_budget_eur: parseBudget(annualBudget),
            is_profile_complete: true,
            notes: sponsorNotes || null,
          },
          { onConflict: "organization_id" }
        );

      if (sponsorPreferencesError) {
        throw new Error(sponsorPreferencesError.message);
      }

      const { data: latestBrief } = await supabase
        .from("sponsor_onboarding_briefs")
        .select("version")
        .eq("organization_id", organizationId)
        .order("version", { ascending: false })
        .limit(1)
        .maybeSingle();

      const nextVersion = (latestBrief?.version ?? 0) + 1;

      const snapshot = {
        company: {
          name: companyName.trim(),
          website: websiteUrl.trim() || null,
          category: category.trim(),
          description: description.trim(),
        },
        geography: {
          target_markets: markets,
          city_focus: cityFocus.trim() || null,
        },
        audience: {
          type: audienceType,
          segments: audience,
        },
        sports: {
          interests: sports,
          exclusions: splitCsv(sportsExclusions),
        },
        budget: {
          annual_budget_input: annualBudget.trim(),
          per_event_budget_input: perEventBudget.trim(),
          annual_budget_value: parseBudget(annualBudget),
          per_event_budget_value: parseBudget(perEventBudget),
          budget_notes: budgetNotes.trim() || null,
        },
        objectives: campaignObjectives,
        activation_preferences: activationPreferences,
        kpi_priorities: kpiPriorities,
        constraints: {
          regions_to_avoid: splitCsv(regionsToAvoid),
          event_types_to_avoid: splitCsv(eventTypesToAvoid),
          minimum_quality: minimumQuality.trim() || null,
          required_conditions: requiredConditions.trim() || null,
        },
      };

      const { error: briefError } = await supabase.from("sponsor_onboarding_briefs").insert({
        organization_id: organizationId,
        submitted_by: user.id,
        version: nextVersion,
        strategy_status: "preparing",
        briefing_snapshot: snapshot,
      });

      if (briefError) {
        throw new Error(briefError.message);
      }

      router.replace("/strategy-preparation");
      router.refresh();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Could not save your sponsor brief."
      );
    } finally {
      setPending(false);
    }
  }

  function handleNext() {
    setError(null);
    const validationError = validateCurrentStep();

    if (validationError) {
      setError(validationError);
      return;
    }

    setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  function handleBack() {
    setError(null);
    setStep((current) => Math.max(current - 1, 0));
  }

  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-[0_25px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur sm:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.1),transparent_30%)]" />

      <div className="relative space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            <span>Strategic intake</span>
            <span>
              Step {step + 1} of {steps.length}
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-slate-900 via-blue-700 to-cyan-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-sm text-slate-600">
            We use this sponsor brief to prepare your strategy recommendations and execution plan.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6">
          {step === 0 ? (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-900">Company basics</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Company name</label>
                  <input
                    value={companyName}
                    onChange={(event) => setCompanyName(event.target.value)}
                    placeholder="Acme Nutrition"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Website</label>
                  <input
                    value={websiteUrl}
                    onChange={(event) => setWebsiteUrl(event.target.value)}
                    placeholder="https://acme.com"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Category / industry</label>
                  <input
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    placeholder="Sports nutrition"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-500"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Short description</label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="What your company does and what matters most for sponsorship outcomes."
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-500"
                  />
                </div>
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-900">Target geography</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Countries / regions / key markets (comma separated)
                </label>
                <input
                  value={targetMarkets}
                  onChange={(event) => setTargetMarkets(event.target.value)}
                  placeholder="Spain, Portugal, France"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">City focus (optional)</label>
                <input
                  value={cityFocus}
                  onChange={(event) => setCityFocus(event.target.value)}
                  placeholder="Madrid, Barcelona"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-500"
                />
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-900">Target audience</h3>
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">Audience model</p>
                <div className="flex flex-wrap gap-2">
                  {(["B2B", "B2C", "Mixed"] as const).map((value) => (
                    <ToggleCard
                      key={value}
                      label={value}
                      selected={audienceType === value}
                      onClick={() => setAudienceType(value)}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Audience segments / profile focus (comma separated)
                </label>
                <input
                  value={audienceSegments}
                  onChange={(event) => setAudienceSegments(event.target.value)}
                  placeholder="Runners 25-40, Gym-goers, Retail decision makers"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-500"
                />
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-900">Sports & event interests</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Preferred sports or event categories (comma separated)
                </label>
                <input
                  value={sportsInterests}
                  onChange={(event) => setSportsInterests(event.target.value)}
                  placeholder="Running, Triathlon, Cycling"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Exclusions (optional)</label>
                <input
                  value={sportsExclusions}
                  onChange={(event) => setSportsExclusions(event.target.value)}
                  placeholder="Combat sports, Winter events"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-500"
                />
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-900">Budget profile</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Annual sponsorship budget</label>
                  <input
                    value={annualBudget}
                    onChange={(event) => setAnnualBudget(event.target.value)}
                    placeholder="€250000"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Preferred budget per event</label>
                  <input
                    value={perEventBudget}
                    onChange={(event) => setPerEventBudget(event.target.value)}
                    placeholder="€15000"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Budget logic (optional)</label>
                <textarea
                  rows={3}
                  value={budgetNotes}
                  onChange={(event) => setBudgetNotes(event.target.value)}
                  placeholder="Flagship vs test allocations, channel priorities, phased plans..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-500"
                />
              </div>
            </div>
          ) : null}

          {step === 5 ? (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-900">Campaign objectives</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Brand awareness",
                  "Leads",
                  "Product trial",
                  "Premium positioning",
                  "Category ownership",
                  "Community growth",
                ].map((item) => (
                  <ToggleCard
                    key={item}
                    label={item}
                    selected={campaignObjectives.includes(item)}
                    onClick={() => toggleInList(campaignObjectives, setCampaignObjectives, item)}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {step === 6 ? (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-900">Activation preferences</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Title sponsor",
                  "Expo",
                  "Product sampling",
                  "Digital / social",
                  "Hospitality",
                  "Content / speaking",
                  "Networking",
                ].map((item) => (
                  <ToggleCard
                    key={item}
                    label={item}
                    selected={activationPreferences.includes(item)}
                    onClick={() =>
                      toggleInList(activationPreferences, setActivationPreferences, item)
                    }
                  />
                ))}
              </div>
            </div>
          ) : null}

          {step === 7 ? (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-900">KPI priorities</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Reach",
                  "Impressions",
                  "Product trials",
                  "Leads",
                  "Footfall",
                  "QR scans",
                  "Content engagement",
                  "App downloads",
                ].map((item) => (
                  <ToggleCard
                    key={item}
                    label={item}
                    selected={kpiPriorities.includes(item)}
                    onClick={() => toggleInList(kpiPriorities, setKpiPriorities, item)}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {step === 8 ? (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-900">Constraints & exclusions</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Regions to avoid (optional)
                  </label>
                  <input
                    value={regionsToAvoid}
                    onChange={(event) => setRegionsToAvoid(event.target.value)}
                    placeholder="North America"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Event types to avoid (optional)
                  </label>
                  <input
                    value={eventTypesToAvoid}
                    onChange={(event) => setEventTypesToAvoid(event.target.value)}
                    placeholder="Indoor expos"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Minimum acceptable event quality / size (optional)
                </label>
                <input
                  value={minimumQuality}
                  onChange={(event) => setMinimumQuality(event.target.value)}
                  placeholder="Minimum 3,000 attendees and audited audience data"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Required conditions (optional)</label>
                <textarea
                  rows={3}
                  value={requiredConditions}
                  onChange={(event) => setRequiredConditions(event.target.value)}
                  placeholder="Brand-safe environment, post-event reporting, exclusivity by category..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-500"
                />
              </div>
            </div>
          ) : null}
        </div>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 0 || pending}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Back
          </button>

          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={pending}
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={pending}
              className="rounded-xl bg-gradient-to-r from-slate-900 via-blue-800 to-cyan-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "Submitting brief..." : "Submit sponsor brief"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}