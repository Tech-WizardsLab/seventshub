import Link from "next/link";
import { requireOnboardedUser } from "@/lib/auth/require-onboarded-user";
import { getProfile } from "@/lib/auth/get-profile";
import { getMarketplaceEventDetail } from "@/features/marketplace/lib/get-marketplace-event-detail";
import { SlotInquiryButton } from "@/features/marketplace/components/slot-inquiry-button";
import { ShortlistToggleButton } from "@/features/shortlist/components/shortlist-toggle-button";

function formatNumber(value: number | null | undefined) {
  return new Intl.NumberFormat().format(value ?? 0);
}

export default async function MarketplaceEventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  await requireOnboardedUser();

  const { eventId } = await params;
  const [event, profile] = await Promise.all([
    getMarketplaceEventDetail(eventId),
    getProfile(),
  ]);

  if (!event) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-slate-900">Event not found</h1>
        <p className="text-slate-600">
          This event is not available or could not be loaded.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold text-slate-900">{event.name}</h1>
            <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
              {event.sport_type}
            </span>
          </div>

          <p className="mt-3 text-slate-600">
            {[event.city, event.country].filter(Boolean).join(", ") || "Location not set"}
          </p>

          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
            {event.short_description || event.description || "No event summary yet."}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {profile?.platform_role === "sponsor" ? (
            <ShortlistToggleButton eventId={event.id} />
          ) : null}

          <Link
            href="/marketplace"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back to marketplace
          </Link>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Expected attendance</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {formatNumber(event.metrics?.expected_attendance)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Email reach</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {formatNumber(event.metrics?.email_reach)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Social impressions</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {formatNumber(event.metrics?.social_impressions)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Past sponsors</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {event.metrics?.past_sponsors?.length ?? 0}
          </p>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Event performance
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Participating brands</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">
                  {formatNumber(event.metrics?.participating_brands_count)}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Media reach</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">
                  {formatNumber(event.metrics?.media_reach)}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs text-slate-500">B2B audience %</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">
                  {event.metrics?.audience_b2b_percentage ?? 0}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs text-slate-500">B2C audience %</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">
                  {event.metrics?.audience_b2c_percentage ?? 0}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4 text-sm text-slate-600">
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

              <div>
                <p className="font-medium text-slate-900">Past sponsors</p>
                <p className="mt-1">
                  {event.metrics?.past_sponsors?.length
                    ? event.metrics.past_sponsors.join(", ")
                    : "Not set"}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-slate-900">
                Organizer credibility
              </h2>

              <Link
                href={`/marketplace/organizers/${event.organization.id}`}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
              >
                View company profile
              </Link>
            </div>

            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p>
                <span className="font-medium text-slate-900">Company:</span>{" "}
                {event.organization.name}
              </p>
              <p>
                <span className="font-medium text-slate-900">Overview:</span>{" "}
                {event.organization.profile?.overview ||
                  event.organization.description ||
                  "Not set"}
              </p>
              <p>
                <span className="font-medium text-slate-900">Years operating:</span>{" "}
                {event.organization.profile?.years_operating ?? "Not set"}
              </p>
              <p>
                <span className="font-medium text-slate-900">Events organized:</span>{" "}
                {formatNumber(event.organization.metrics?.total_events_organized)}
              </p>
              <p>
                <span className="font-medium text-slate-900">Attendance last 12 months:</span>{" "}
                {formatNumber(event.organization.metrics?.total_attendance_last_12m)}
              </p>
              <p>
                <span className="font-medium text-slate-900">Social followers:</span>{" "}
                {formatNumber(event.organization.metrics?.total_social_followers)}
              </p>
              <p>
                <span className="font-medium text-slate-900">Sponsors served:</span>{" "}
                {formatNumber(event.organization.metrics?.total_sponsors_served)}
              </p>
            </div>
          </section>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Sponsorship slots</h2>

          {event.slots.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">No sponsorship slots published yet.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {event.slots.map((slot) => (
                <div
                  key={slot.id}
                  className="rounded-2xl border border-slate-200 p-5"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {slot.title}
                    </h3>
                    <span className="rounded-full border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600">
                      {slot.slot_type}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {slot.description || "No slot description yet."}
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">List price</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">
                        {slot.list_price_eur ?? "—"} €
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">Inventory</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">
                        {slot.remaining_inventory}/{slot.inventory_count}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-medium text-slate-900">Benefits</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {slot.benefits.length ? slot.benefits.join(", ") : "Not set"}
                    </p>
                  </div>

                  <SlotInquiryButton
                    eventId={event.id}
                    sponsorshipSlotId={slot.id}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}