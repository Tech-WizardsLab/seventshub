import Link from "next/link";
import { getProfile } from "@/lib/auth/get-profile";
import { getOnboardingStatus } from "@/features/onboarding/lib/get-onboarding-status";
import { requireOnboardedUser } from "@/lib/auth/require-onboarded-user";

export default async function DashboardPage() {
  await requireOnboardedUser();

  const profile = await getProfile();
  const onboardingStatus = await getOnboardingStatus();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-slate-600">
          This will become the shared entry point for authenticated users.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Profile status</h2>
          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <p>
              <span className="font-medium text-slate-900">Name:</span>{" "}
              {profile?.full_name ?? "Not set"}
            </p>
            <p>
              <span className="font-medium text-slate-900">Email:</span>{" "}
              {profile?.email ?? "Not set"}
            </p>
            <p>
              <span className="font-medium text-slate-900">Role:</span>{" "}
              {profile?.platform_role ?? "Not set"}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Workspace status</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p>
              <span className="font-medium text-slate-900">Profile created:</span>{" "}
              {onboardingStatus.hasProfile ? "Yes" : "No"}
            </p>
            <p>
              <span className="font-medium text-slate-900">Organization linked:</span>{" "}
              {onboardingStatus.hasOrganizationMembership ? "Yes" : "No"}
            </p>

            {!onboardingStatus.hasOrganizationMembership ? (
              <Link
                href="/onboarding"
                className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Complete onboarding
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}