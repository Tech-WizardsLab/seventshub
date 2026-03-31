import { OnboardingForm } from "@/features/onboarding/components/onboarding-form";

export default function OnboardingPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="max-w-2xl space-y-3">
          <span className="inline-flex rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
            SEventsHub onboarding
          </span>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Tell us about your company
          </h1>

          <p className="text-sm leading-7 text-slate-600">
            First, choose whether your company organizes events or sponsors them.
            Then we’ll create your company workspace inside the marketplace.
          </p>
        </div>

        <div className="mt-8">
          <OnboardingForm />
        </div>
      </div>
    </div>
  );
}