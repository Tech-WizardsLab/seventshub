import { requireOnboardedUser } from "@/lib/auth/require-onboarded-user";
import { getOrganizationDashboard } from "@/features/organizations/lib/get-organization-dashboard";
import { StatCard } from "@/components/dashboard/stat-card";
import { MetricBar } from "@/components/dashboard/metric-bar";
import { SectionHeading } from "@/components/dashboard/section-heading";

function formatNumber(value: number | null | undefined) {
  return new Intl.NumberFormat().format(value ?? 0);
}

export default async function OrganizerOrganizationPage() {
  await requireOnboardedUser();

  const organization = await getOrganizationDashboard();

  if (!organization) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-slate-900">Organizer Company Dashboard</h1>
        <p className="text-slate-600">No organization data found yet.</p>
      </div>
    );
  }

  const socialMax =
    Math.max(
      organization.metrics?.instagram_followers ?? 0,
      organization.metrics?.linkedin_followers ?? 0,
      organization.metrics?.youtube_followers ?? 0,
      organization.metrics?.tiktok_followers ?? 0,
      organization.metrics?.x_followers ?? 0,
      organization.metrics?.facebook_followers ?? 0,
      1
    ) || 1;

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Organizer company dashboard"
        title={organization.name}
        description="Your company trust layer — the profile and credibility signals sponsors use to assess your organization."
      />

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-sm text-slate-500">
              {[organization.city, organization.country].filter(Boolean).join(", ") || "—"}
            </p>
            <p className="mt-4 text-base leading-8 text-slate-600">
              {organization.profile?.overview ||
                organization.description ||
                "No company overview added yet."}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Years operating
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {organization.profile?.years_operating ?? "—"}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total events organized"
          value={formatNumber(organization.metrics?.total_events_organized)}
          helper="Historical company event output"
        />
        <StatCard
          label="Attendance last 12 months"
          value={formatNumber(organization.metrics?.total_attendance_last_12m)}
          helper="Cumulative audience delivered"
        />
        <StatCard
          label="Total social followers"
          value={formatNumber(organization.metrics?.total_social_followers)}
          helper="Combined social community size"
        />
        <StatCard
          label="Sponsors served"
          value={formatNumber(organization.metrics?.total_sponsors_served)}
          helper="Commercial sponsor relationships delivered"
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeading
            title="Commercial credibility"
            description="Core proof points sponsors typically use to assess organizer quality."
          />

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <StatCard
              label="Annual events"
              value={formatNumber(organization.metrics?.annual_events_count)}
            />
            <StatCard
              label="Email subscribers"
              value={formatNumber(organization.metrics?.total_email_subscribers)}
            />
            <StatCard
              label="Impressions last 12m"
              value={formatNumber(organization.metrics?.total_impressions_last_12m)}
            />
            <StatCard
              label="Avg event attendance"
              value={formatNumber(organization.metrics?.avg_event_attendance)}
            />
          </div>

          <div className="mt-6 space-y-4 text-sm text-slate-600">
            <div>
              <p className="font-medium text-slate-900">Primary sports</p>
              <p className="mt-1">
                {organization.profile?.primary_sports?.length
                  ? organization.profile.primary_sports.join(", ")
                  : "Not set"}
              </p>
            </div>

            <div>
              <p className="font-medium text-slate-900">Operating regions</p>
              <p className="mt-1">
                {organization.profile?.operating_regions?.length
                  ? organization.profile.operating_regions.join(", ")
                  : "Not set"}
              </p>
            </div>

            <div>
              <p className="font-medium text-slate-900">Notable partners</p>
              <p className="mt-1">
                {organization.profile?.notable_partners?.length
                  ? organization.profile.notable_partners.join(", ")
                  : "Not set"}
              </p>
            </div>

            <div>
              <p className="font-medium text-slate-900">Achievements</p>
              <p className="mt-1">
                {organization.profile?.achievements?.length
                  ? organization.profile.achievements.join(", ")
                  : "Not set"}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeading
            title="Social footprint"
            description="Channel-by-channel audience distribution."
          />

          <div className="mt-6 space-y-5">
            <MetricBar
              label="Instagram"
              value={organization.metrics?.instagram_followers ?? 0}
              max={socialMax}
            />
            <MetricBar
              label="LinkedIn"
              value={organization.metrics?.linkedin_followers ?? 0}
              max={socialMax}
            />
            <MetricBar
              label="YouTube"
              value={organization.metrics?.youtube_followers ?? 0}
              max={socialMax}
            />
            <MetricBar
              label="TikTok"
              value={organization.metrics?.tiktok_followers ?? 0}
              max={socialMax}
            />
            <MetricBar
              label="X"
              value={organization.metrics?.x_followers ?? 0}
              max={socialMax}
            />
            <MetricBar
              label="Facebook"
              value={organization.metrics?.facebook_followers ?? 0}
              max={socialMax}
            />
          </div>
        </section>
      </div>
    </div>
  );
}