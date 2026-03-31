import { requireOnboardedUser } from "@/lib/auth/require-onboarded-user";
import { getCurrentOrganization } from "@/features/organizations/lib/get-current-organization";

export default async function OrganizerOrganizationPage() {
  await requireOnboardedUser();

  const organization = await getCurrentOrganization();

  if (!organization) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-slate-900">My Organization</h1>
        <p className="text-slate-600">No organization data found yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">My Organization</h1>
        <p className="mt-2 text-slate-600">
          This is the company profile sponsors will evaluate alongside your events.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-slate-900">{organization.name}</h2>
          <p className="text-sm text-slate-500">
            {organization.city ?? "—"}, {organization.country ?? "—"}
          </p>
          <p className="text-sm text-slate-600">
            {organization.description ?? "No company description yet."}
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Total events organized</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {organization.metrics?.total_events_organized ?? 0}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Annual events</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {organization.metrics?.annual_events_count ?? 0}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Attendance last 12 months</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {organization.metrics?.total_attendance_last_12m ?? 0}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Social followers</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {organization.metrics?.total_social_followers ?? 0}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Company profile</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p>
              <span className="font-medium text-slate-900">Headline:</span>{" "}
              {organization.profile?.headline ?? "Not set"}
            </p>
            <p>
              <span className="font-medium text-slate-900">Overview:</span>{" "}
              {organization.profile?.overview ?? "Not set"}
            </p>
            <p>
              <span className="font-medium text-slate-900">Years operating:</span>{" "}
              {organization.profile?.years_operating ?? "Not set"}
            </p>
            <p>
              <span className="font-medium text-slate-900">Primary sports:</span>{" "}
              {organization.profile?.primary_sports?.length
                ? organization.profile.primary_sports.join(", ")
                : "Not set"}
            </p>
            <p>
              <span className="font-medium text-slate-900">Operating regions:</span>{" "}
              {organization.profile?.operating_regions?.length
                ? organization.profile.operating_regions.join(", ")
                : "Not set"}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Commercial credibility</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p>
              <span className="font-medium text-slate-900">Notable partners:</span>{" "}
              {organization.profile?.notable_partners?.length
                ? organization.profile.notable_partners.join(", ")
                : "Not set"}
            </p>
            <p>
              <span className="font-medium text-slate-900">Achievements:</span>{" "}
              {organization.profile?.achievements?.length
                ? organization.profile.achievements.join(", ")
                : "Not set"}
            </p>
            <p>
              <span className="font-medium text-slate-900">Email subscribers:</span>{" "}
              {organization.metrics?.total_email_subscribers ?? 0}
            </p>
            <p>
              <span className="font-medium text-slate-900">Impressions last 12m:</span>{" "}
              {organization.metrics?.total_impressions_last_12m ?? 0}
            </p>
            <p>
              <span className="font-medium text-slate-900">Sponsors served:</span>{" "}
              {organization.metrics?.total_sponsors_served ?? 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}