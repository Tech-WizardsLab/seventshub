import Link from "next/link";
import { requireOnboardedUser } from "@/lib/auth/require-onboarded-user";
import { getMarketplaceOrganizationDetail } from "@/features/marketplace/lib/get-marketplace-organization-detail";

function formatNumber(value: number | null | undefined) {
  return new Intl.NumberFormat().format(value ?? 0);
}

export default async function MarketplaceOrganizerDetailPage({
  params,
}: {
  params: Promise<{ organizationId: string }>;
}) {
  await requireOnboardedUser();

  const { organizationId } = await params;
  const organization = await getMarketplaceOrganizationDetail(organizationId);

  if (!organization) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-slate-900">Organizer not found</h1>
        <p className="text-slate-600">
          This organizer is not available or could not be loaded.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-semibold text-slate-900">
            {organization.name}
          </h1>
          <p className="mt-2 text-slate-600">
            {[organization.city, organization.country].filter(Boolean).join(", ") || "Location not set"}
          </p>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
            {organization.profile?.overview ||
              organization.description ||
              "No company overview available yet."}
          </p>
        </div>

        <Link
          href="/marketplace"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Back to marketplace
        </Link>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Years operating</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {organization.profile?.years_operating ?? "—"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Events organized</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {formatNumber(organization.metrics?.total_events_organized)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Attendance last 12m</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {formatNumber(organization.metrics?.total_attendance_last_12m)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Sponsors served</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {formatNumber(organization.metrics?.total_sponsors_served)}
          </p>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Company credibility
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Annual events</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">
                {formatNumber(organization.metrics?.annual_events_count)}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Email subscribers</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">
                {formatNumber(organization.metrics?.total_email_subscribers)}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Social followers</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">
                {formatNumber(organization.metrics?.total_social_followers)}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Impressions last 12m</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">
                {formatNumber(organization.metrics?.total_impressions_last_12m)}
              </p>
            </div>
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
          <h2 className="text-xl font-semibold text-slate-900">
            Approved events
          </h2>

          {organization.approvedEvents.length === 0 ? (
            <p className="mt-6 text-sm text-slate-600">
              No approved events available yet.
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {organization.approvedEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {event.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {event.sport_type} · {[event.city, event.country].filter(Boolean).join(", ") || "—"}
                      </p>
                    </div>

                    <Link
                      href={`/marketplace/${event.id}`}
                      className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      View event
                    </Link>
                  </div>

                  <p className="mt-3 text-sm text-slate-600">
                    {event.short_description || "No event summary yet."}
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