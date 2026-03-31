import { requireOnboardedUser } from "@/lib/auth/require-onboarded-user";
import { NewEventForm } from "@/features/events/components/new-event-form";

export default async function NewEventPage() {
  await requireOnboardedUser();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Create New Event</h1>
        <p className="mt-2 text-slate-600">
          Start your event record with the core details. Later we’ll add sponsor-facing
          metrics, dashboards, and sponsorship slots.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <NewEventForm />
      </div>
    </div>
  );
}