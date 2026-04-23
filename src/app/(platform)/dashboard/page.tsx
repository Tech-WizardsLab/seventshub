import Link from "next/link";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/auth/get-profile";
import { requireOnboardedUser } from "@/lib/auth/require-onboarded-user";
import { getOnboardingStatus } from "@/features/onboarding/lib/get-onboarding-status";
import { getOrganizerDashboardSummary } from "@/features/inquiries/lib/get-organizer-dashboard-summary";
import { getUpcomingInquiryActions } from "@/features/inquiries/lib/get-upcoming-inquiry-actions";
import { getSponsorStrategyStatus } from "@/features/onboarding/lib/get-sponsor-strategy-status";
import { getSponsorRecommendationDashboardData } from "@/features/recommendations/lib/get-sponsor-recommendation-dashboard";
import { StatCard } from "@/components/dashboard/stat-card";
import { SectionHeading } from "@/components/dashboard/section-heading";

function formatNumber(value: number | null | undefined) {
  return new Intl.NumberFormat().format(value ?? 0);
}

function formatCurrency(value: number | null | undefined) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

function formatStatus(status: string) {
  switch (status) {
    case "ready_for_review":
      return "Ready for review";
    case "under_revision":
      return "Under revision";
    case "approved_for_outreach":
      return "Approved for outreach";
    default:
      return "Draft";
  }
}

export default async function DashboardPage() {
  await requireOnboardedUser();

  const profile = await getProfile();
  const onboardingStatus = await getOnboardingStatus();

  if (profile?.platform_role === "sponsor") {
    const strategyStatus = await getSponsorStrategyStatus();

    if (!strategyStatus.hasBrief) {
      redirect("/onboarding");
    }

    if (strategyStatus.status !== "ready") {
      redirect("/strategy-preparation");
    }

    const dashboardData = await getSponsorRecommendationDashboardData();

    if (!dashboardData) {
      redirect("/onboarding");
    }

    const recommendationStatusLabel = formatStatus(dashboardData.recommendationSet.status);

    return (
      <div className="space-y-8">
        <SectionHeading
          eyebrow="Sponsor strategy workspace"
          title="Your curated sponsorship plan"
          description="A data-led recommendation set designed around your brief, markets, and investment priorities."
        />

        <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_70px_-30px_rgba(15,23,42,0.35)] sm:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.14),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.1),transparent_30%)]" />

          <div className="relative space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Portfolio summary
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  {dashboardData.recommendationSet.title}
                </h2>
              </div>

              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700">
                {recommendationStatusLabel}
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <StatCard
                label="Recommended budget"
                value={formatCurrency(dashboardData.summary.recommendedBudget)}
                helper="Portfolio-level planning allocation"
              />
              <StatCard
                label="Projected total reach"
                value={formatNumber(dashboardData.summary.projectedTotalReach)}
                helper="Estimated social + digital opportunity"
              />
              <StatCard
                label="Attendance exposure"
                value={formatNumber(dashboardData.summary.projectedAttendanceExposure)}
                helper="Estimated in-person visibility"
              />
              <StatCard
                label="Projected touchpoints"
                value={formatNumber(dashboardData.summary.projectedTouchpoints)}
                helper="Estimated activations / interactions"
              />
              <StatCard
                label="Markets covered"
                value={dashboardData.summary.marketsCovered.length || "—"}
                helper={
                  dashboardData.summary.marketsCovered.length
                    ? dashboardData.summary.marketsCovered.join(", ")
                    : "No markets specified"
                }
              />
              <StatCard
                label="Average fit score"
                value={`${dashboardData.summary.averageFitScore.toFixed(1)} / 100`}
                helper="Alignment vs sponsor brief"
              />
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeading
              title="Sponsor brief summary"
              description="Inputs used by the strategy team to shape this recommendation set."
            />

            <div className="mt-5 space-y-5 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Category
                </p>
                <p className="mt-1 font-medium text-slate-900">{dashboardData.briefSummary.category}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Geography
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {dashboardData.briefSummary.geography.length ? (
                    dashboardData.briefSummary.geography.map((market) => (
                      <span
                        key={market}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
                      >
                        {market}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500">Not specified</span>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Annual budget
                  </p>
                  <p className="mt-1 font-medium text-slate-900">
                    {dashboardData.briefSummary.annualBudget}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Per-event budget
                  </p>
                  <p className="mt-1 font-medium text-slate-900">
                    {dashboardData.briefSummary.perEventBudget}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Campaign goals
                </p>
                <p className="mt-1 text-slate-700">
                  {dashboardData.briefSummary.goals.length
                    ? dashboardData.briefSummary.goals.join(" • ")
                    : "Not specified"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Preferred sports
                </p>
                <p className="mt-1 text-slate-700">
                  {dashboardData.briefSummary.preferredSports.length
                    ? dashboardData.briefSummary.preferredSports.join(" • ")
                    : "Not specified"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  KPI priorities
                </p>
                <p className="mt-1 text-slate-700">
                  {dashboardData.briefSummary.kpiPriorities.length
                    ? dashboardData.briefSummary.kpiPriorities.join(" • ")
                    : "Not specified"}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeading
              title="Recommendation status"
              description="Current proposal stage and next collaborative action."
            />

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Current proposal state
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{recommendationStatusLabel}</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {dashboardData.recommendationSet.analystSummary}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Request changes
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
                >
                  Ask for another mix
                </button>
                <Link
                  href="/onboarding"
                  className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                >
                  Update priorities
                </Link>
              </div>
            </div>
          </section>
        </div>

        <section className="space-y-4">
          <SectionHeading
            title="Recommended opportunities"
            description="Curated event opportunities aligned with your sponsorship strategy brief."
          />

          {dashboardData.opportunities.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
              No curated opportunities are available yet. Your strategy team is preparing the first mix.
            </div>
          ) : (
            <div className="space-y-4">
              {dashboardData.opportunities.map((item) => (
                <details
                  key={item.id}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm open:border-slate-300"
                >
                  <summary className="cursor-pointer list-none">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-base font-semibold text-slate-900">{item.eventName}</p>
                        <p className="mt-1 text-sm text-slate-600">
                          {item.location} · {item.organizerName}
                        </p>
                        <p className="mt-2 text-sm text-slate-700">{item.selectedPackage}</p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900">Fit {item.fitScore.toFixed(0)} / 100</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">
                          {item.status}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-4">
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                        <p className="text-xs text-slate-500">Reach</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {formatNumber(item.projectedReach)}
                        </p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                        <p className="text-xs text-slate-500">Attendance</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {formatNumber(item.projectedAttendance)}
                        </p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                        <p className="text-xs text-slate-500">Touchpoints</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {formatNumber(item.projectedTouchpoints)}
                        </p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                        <p className="text-xs text-slate-500">Plan role</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">{item.contribution}</p>
                      </div>
                    </div>
                  </summary>

                  <div className="mt-5 grid gap-5 border-t border-slate-200 pt-5 text-sm text-slate-700 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Why it fits
                      </p>
                      <p className="mt-2 leading-7">{item.whyItFits}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Event overview
                      </p>
                      <p className="mt-2 leading-7">{item.eventOverview}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Audience profile
                      </p>
                      <p className="mt-2 leading-7">{item.audienceProfile}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Organizer context
                      </p>
                      <p className="mt-2 leading-7">{item.organizerContext}</p>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          )}
        </section>
      </div>
    );
  }

  const [summary, upcomingActions] = await Promise.all([
    getOrganizerDashboardSummary(),
    getUpcomingInquiryActions(),
  ]);

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Organizer dashboard"
        title="Commercial overview"
        description="Track sponsorship demand, pipeline movement, and the next actions your team should take."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Role"
          value={profile?.platform_role ?? "—"}
          helper="Current workspace role"
        />
        <StatCard
          label="Total events"
          value={formatNumber(summary.totalEvents)}
          helper="Events created by your organization"
        />
        <StatCard
          label="Incoming inquiries"
          value={formatNumber(summary.totalInquiries)}
          helper="Total sponsor interest received"
        />
        <StatCard
          label="Organization linked"
          value={onboardingStatus.hasOrganizationMembership ? "Yes" : "No"}
          helper="Workspace onboarding status"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <SectionHeading
              title="Inquiry pipeline"
              description="Quick view of sponsor demand moving through your workflow."
            />
            <Link
              href="/organizer/inquiries"
              className="text-sm font-medium text-slate-700 underline"
            >
              View all
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <StatCard label="Submitted" value={summary.inquiriesByStatus.submitted} />
            <StatCard label="Under review" value={summary.inquiriesByStatus.under_review} />
            <StatCard label="Contacted" value={summary.inquiriesByStatus.contacted} />
            <StatCard label="Negotiating" value={summary.inquiriesByStatus.negotiating} />
            <StatCard label="Won" value={summary.inquiriesByStatus.won} />
            <StatCard label="Lost" value={summary.inquiriesByStatus.lost} />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <SectionHeading
              title="Next actions"
              description="Follow-up actions due soon or overdue in your sponsorship pipeline."
            />
            <Link
              href="/organizer/inquiries"
              className="text-sm font-medium text-slate-700 underline"
            >
              Manage pipeline
            </Link>
          </div>

          {upcomingActions.length === 0 ? (
            <p className="mt-6 text-sm text-slate-600">
              No next actions scheduled yet.
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {upcomingActions.map((action) => (
                <div
                  key={action.id}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {action.sponsor_organization_name}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {action.event_name} · {action.slot_title}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        action.isOverdue
                          ? "border border-red-200 bg-red-50 text-red-700"
                          : "border border-slate-200 bg-slate-50 text-slate-700"
                      }`}
                    >
                      {action.isOverdue ? "Overdue" : action.status}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-slate-700">
                    {action.next_action || "No next action set"}
                  </p>

                  <p className="mt-2 text-xs text-slate-500">
                    Due:{" "}
                    {action.next_action_due_at
                      ? new Date(action.next_action_due_at).toLocaleString()
                      : "Not set"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}