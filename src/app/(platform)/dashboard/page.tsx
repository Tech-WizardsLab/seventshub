import Link from "next/link";
import { getProfile } from "@/lib/auth/get-profile";
import { requireOnboardedUser } from "@/lib/auth/require-onboarded-user";
import { getOnboardingStatus } from "@/features/onboarding/lib/get-onboarding-status";
import { getOrganizerDashboardSummary } from "@/features/inquiries/lib/get-organizer-dashboard-summary";
import { getUpcomingInquiryActions } from "@/features/inquiries/lib/get-upcoming-inquiry-actions";
import { getSponsorDashboardSummary } from "@/features/analytics/lib/get-sponsor-dashboard-summary";
import { getSponsorRecentInquiries } from "@/features/analytics/lib/get-sponsor-recent-inquiries";
import { StatCard } from "@/components/dashboard/stat-card";
import { SectionHeading } from "@/components/dashboard/section-heading";

function formatNumber(value: number | null | undefined) {
  return new Intl.NumberFormat().format(value ?? 0);
}

export default async function DashboardPage() {
  await requireOnboardedUser();

  const profile = await getProfile();
  const onboardingStatus = await getOnboardingStatus();

  if (profile?.platform_role === "sponsor") {
    const [summary, recentInquiries] = await Promise.all([
      getSponsorDashboardSummary(),
      getSponsorRecentInquiries(),
    ]);

    return (
      <div className="space-y-8">
        <SectionHeading
          eyebrow="Sponsor dashboard"
          title="Opportunity pipeline"
          description="Track active sponsorship opportunities, estimated exposure, and recent marketplace activity."
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Tracked events"
            value={formatNumber(summary.totalTrackedEvents)}
            helper="Unique approved events in your pipeline"
          />
          <StatCard
            label="Tracked slots"
            value={formatNumber(summary.totalTrackedSlots)}
            helper="Specific sponsorship opportunities evaluated"
          />
          <StatCard
            label="Potential attendance"
            value={formatNumber(summary.potentialAttendance)}
            helper="Combined expected audience across tracked events"
          />
          <StatCard
            label="Potential digital reach"
            value={formatNumber(summary.potentialDigitalReach)}
            helper="Email reach + social impressions across tracked events"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <SectionHeading
                title="Inquiry pipeline"
                description="Simple view of your current sponsorship evaluation funnel."
              />
              <Link
                href="/inquiries"
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
                title="Recent inquiries"
                description="Latest opportunities your team has shown interest in."
              />
              <Link
                href="/inquiries"
                className="text-sm font-medium text-slate-700 underline"
              >
                Manage inquiries
              </Link>
            </div>

            {recentInquiries.length === 0 ? (
              <p className="mt-6 text-sm text-slate-600">
                No inquiries submitted yet.
              </p>
            ) : (
              <div className="mt-6 space-y-4">
                {recentInquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {inquiry.eventName}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {inquiry.slotTitle} · {inquiry.organizerName}
                        </p>
                      </div>

                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                        {inquiry.status}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-slate-500">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
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