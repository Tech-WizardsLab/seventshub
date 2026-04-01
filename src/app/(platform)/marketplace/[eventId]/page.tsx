import Link from "next/link";
import { requireOnboardedUser } from "@/lib/auth/require-onboarded-user";
import { getMarketplaceEventDetail } from "@/features/marketplace/lib/get-marketplace-event-detail";
import { SlotInquiryButton } from "@/features/marketplace/components/slot-inquiry-button";

export default async function MarketplaceEventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  await requireOnboardedUser();

  const { eventId } = await params;
  const event = await getMarketplaceEventDetail(eventId);

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

        <Link
          href="/marketplace"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Back to marketplace
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Expected attendance</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {event.metrics?.expected_attendance ?? 0}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Social impressions</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {event.metrics?.social_impressions ?? 0}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Email reach</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {event.metrics?.email_reach ?? 0}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Past sponsors</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {event.metrics?.past_sponsors?.length ?? 0}
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Event overview</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p>
                <span className="font-medium text-slate-900">Venue:</span>{" "}
                {event.venue_name || "Not set"}
              </p>
              <p>
                <span className="font-medium text-slate-900">Website:</span>{" "}
                {event.website_url ? (
                  <a
                    href={event.website_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-900 underline"
                  >
                    Visit site
                  </a>
                ) : (
                  "Not set"
                )}
              </p>
              <p>
                <span className="font-medium text-slate-900">Audience tags:</span>{" "}
                {event.metrics?.audience_tags?.length
                  ? event.metrics.audience_tags.join(", ")
                  : "Not set"}
              </p>
              <p>
                <span className="font-medium text-slate-900">Industry tags:</span>{" "}
                {event.metrics?.industry_tags?.length
                  ? event.metrics.industry_tags.join(", ")
                  : "Not set"}
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Organizer profile</h2>
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
                {event.organization.metrics?.total_events_organized ?? 0}
              </p>
              <p>
                <span className="font-medium text-slate-900">Social followers:</span>{" "}
                {event.organization.metrics?.total_social_followers ?? 0}
              </p>
              <p>
                <span className="font-medium text-slate-900">Sponsors served:</span>{" "}
                {event.organization.metrics?.total_sponsors_served ?? 0}
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