import { SponsorOnboardingWizard } from "@/features/onboarding/components/sponsor-onboarding-wizard";

export default function OnboardingPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="max-w-3xl space-y-3">
        <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
          Sponsor intake
        </span>

        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Build your sponsorship strategy brief
        </h1>

        <p className="text-sm leading-7 text-slate-600 sm:text-base">
          This guided intake captures your company priorities, budget profile, and
          sponsorship goals so we can prepare your first recommendation set.
        </p>
      </div>

      <SponsorOnboardingWizard />
    </div>
  );
}