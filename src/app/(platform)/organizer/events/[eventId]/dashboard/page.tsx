import Link from "next/link";
import { requireOnboardedUser } from "@/lib/auth/require-onboarded-user";
import { getEventDashboard } from "@/features/events/lib/get-event-dashboard";
import { StatCard } from "@/components/dashboard/stat-card";
import { MetricBar } from "@/components/dashboard/metric-bar";
import { SectionHeading } from "@/components/dashboard/section-heading";

function formatNumber(value: number | null | undefined) {
  return new Intl.NumberFormat().format(value ?? 0);
}

export default async function EventDashboardPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  await requireOnboardedUser();

  const { eventId } = await params;
  const event = await getEventDashboard(eventId);

  if (!event) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-slate-900">Event Dashboard</h1>
        <p className="text-slate-600">Event not found.</p>
      </div>
    );
  }

  const audienceMax = Math.max(
    event.metrics?.audience_b2b_percentage ?? 0,
    event.metrics?.audience_b2c_percentage ?? 0,
    100
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <SectionHeading
            eyebrow="Event dashboard"
            title={event.name}
            description={event.short_description || event.description || "No event summary yet."}
          />
          <p className="mt-3 text-slate-600">
            {[event.city, event.country].filter(Boolean).join(", ") || "Location not set"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={`/organizer/events/${event.id}/metrics`}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Metrics
          </Link>
          <Link
            href={`/organizer/events/${event.id}/slots`}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Slots
          </Link>
          <Link
            href="/organizer/events"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back to events
          </Link>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Expected attendance"
          value={formatNumber(event.metrics?.expected_attendance)}
        />
        <StatCard
          label="Email reach"
          value={formatNumber(event.metrics?.email_reach)}
        />
        <StatCard
          label="Social impressions"
          value={formatNumber(event.metrics?.social_impressions)}
        />
        <StatCard
          label="Media reach"
          value={formatNumber(event.metrics?.media_reach)}
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeading
            title="Audience and commercial profile"
            description="Core event performance signals that matter most to sponsors."
          />

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <StatCard
              label="Participating brands"
              value={formatNumber(event.metrics?.participating_brands_count)}
            />
            <StatCard
              label="Exhibitors"
              value={formatNumber(event.metrics?.exhibitors_count)}
            />
            <StatCard
              label="Speakers"
              value={formatNumber(event.metrics?.speakers_count)}
            />
            <StatCard
              label="Website visits"
              value={formatNumber(event.metrics?.website_visits)}
            />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="space-y-5">
              <MetricBar
                label="B2B audience %"
                value={event.metrics?.audience_b2b_percentage ?? 0}
                max={audienceMax}
              />
              <MetricBar
                label="B2C audience %"
                value={event.metrics?.audience_b2c_percentage ?? 0}
                max={audienceMax}
              />
            </div>

            <div className="space-y-4 text-sm text-slate-600">
              <div>
                <p className="font-medium text-slate-900">Audience tags</p>
                <p className="mt-1">
                  {event.metrics?.audience_tags?.length
                    ? event.metrics.audience_tags.join(", ")
                    : "Not set"}
                </p>
              </div>

              <div>
                <p className="font-medium text-slate-900">Industry tags</p>
                <p className="mt-1">
                  {event.metrics?.industry_tags?.length
                    ? event.metrics.industry_tags.join(", ")
                    : "Not set"}
                </p>
              </div>

              <div>
                <p className="font-medium text-slate-900">Demographic summary</p>
                <p className="mt-1">
                  {event.metrics?.demographic_summary || "Not set"}
                </p>
              </div>

              <div>
                <p className="font-medium text-slate-900">Geographic summary</p>
                <p className="mt-1">
                  {event.metrics?.geographic_summary || "Not set"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeading
              title="Sponsor proof"
              description="Signals that help validate sponsor attractiveness."
            />

            <div className="mt-6 space-y-4">
              <StatCard
                label="Press mentions"
                value={formatNumber(event.metrics?.press_mentions)}
              />
              <StatCard
                label="Video views"
                value={formatNumber(event.metrics?.video_views)}
              />

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Past sponsors</p>
                <p className="mt-2 text-sm text-slate-900">
                  {event.metrics?.past_sponsors?.length
                    ? event.metrics.past_sponsors.join(", ")
                    : "Not set"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeading
              title="Sponsorship inventory"
              description="How much sellable sponsorship inventory is available."
            />

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <StatCard label="Total slots" value={event.slots.length} />
              <StatCard
                label="Active slots"
                value={event.slots.filter((slot) => slot.is_active).length}
              />
            </div>

            <div className="mt-6 space-y-3">
              {event.slots.length === 0 ? (
                <p className="text-sm text-slate-600">No slots created yet.</p>
              ) : (
                event.slots.slice(0, 5).map((slot) => (
                  <div
                    key={slot.id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {slot.title}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {slot.slot_type}
                          {slot.tier_name ? ` · ${slot.tier_name}` : ""}
                        </p>
                      </div>

                      <p className="text-sm font-semibold text-slate-900">
                        {slot.list_price_eur ?? "—"} €
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}