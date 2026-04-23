import Link from "next/link";
import { redirect } from "next/navigation";
import { requireOnboardedUser } from "@/lib/auth/require-onboarded-user";
import { getProfile } from "@/lib/auth/get-profile";
import { getSponsorStrategyStatus } from "@/features/onboarding/lib/get-sponsor-strategy-status";

export default async function StrategyPreparationPage() {
  await requireOnboardedUser();

  const profile = await getProfile();
  if (profile?.platform_role !== "sponsor") {
    redirect("/dashboard");
  }

  const strategyStatus = await getSponsorStrategyStatus();

  if (strategyStatus.status === "ready") {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_30px_90px_-30px_rgba(15,23,42,0.35)] sm:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.16),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.12),transparent_30%)]" />

        <div className="relative space-y-6">
          <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
            Strategy in preparation
          </span>

          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Your sponsorship brief has been received
            </h1>
            <p className="text-base leading-8 text-slate-600">
              Our sponsorship team and AI consultant are preparing your first recommendation
              set. We are structuring your priorities, budget logic, and target markets into
              an execution-ready proposal.
            </p>
          </div>

          <div className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Current status
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">Preparing recommendations</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Delivery
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                You will receive an email when your proposal is ready
              </p>
            </div>
          </div>

          <p className="text-sm leading-7 text-slate-600">
            You can return at any time. Once your recommendation set is prepared, your sponsor
            dashboard will unlock automatically.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Check dashboard
            </Link>
            <Link
              href="/profile"
              className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
            >
              Update profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}