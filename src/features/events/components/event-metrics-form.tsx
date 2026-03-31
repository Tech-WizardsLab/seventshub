"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { OrganizerEventDetail } from "@/features/events/lib/get-event-by-id";
import { upsertEventMetrics } from "@/features/events/lib/upsert-event-metrics";

interface EventMetricsFormProps {
  event: OrganizerEventDetail;
}

export function EventMetricsForm({ event }: EventMetricsFormProps) {
  const router = useRouter();
  const metrics = event.metrics;

  const [expectedAttendance, setExpectedAttendance] = useState(
    String(metrics?.expected_attendance ?? 0)
  );
  const [actualAttendance, setActualAttendance] = useState(
    metrics?.actual_attendance?.toString() ?? ""
  );
  const [exhibitorsCount, setExhibitorsCount] = useState(
    String(metrics?.exhibitors_count ?? 0)
  );
  const [speakersCount, setSpeakersCount] = useState(
    String(metrics?.speakers_count ?? 0)
  );
  const [participatingBrandsCount, setParticipatingBrandsCount] = useState(
    String(metrics?.participating_brands_count ?? 0)
  );
  const [emailReach, setEmailReach] = useState(String(metrics?.email_reach ?? 0));
  const [websiteVisits, setWebsiteVisits] = useState(
    String(metrics?.website_visits ?? 0)
  );
  const [appUsers, setAppUsers] = useState(String(metrics?.app_users ?? 0));
  const [socialImpressions, setSocialImpressions] = useState(
    String(metrics?.social_impressions ?? 0)
  );
  const [socialEngagements, setSocialEngagements] = useState(
    String(metrics?.social_engagements ?? 0)
  );
  const [livestreamViews, setLivestreamViews] = useState(
    String(metrics?.livestream_views ?? 0)
  );
  const [videoViews, setVideoViews] = useState(String(metrics?.video_views ?? 0));
  const [pressMentions, setPressMentions] = useState(
    String(metrics?.press_mentions ?? 0)
  );
  const [mediaReach, setMediaReach] = useState(String(metrics?.media_reach ?? 0));
  const [audienceB2BPercentage, setAudienceB2BPercentage] = useState(
    metrics?.audience_b2b_percentage?.toString() ?? ""
  );
  const [audienceB2CPercentage, setAudienceB2CPercentage] = useState(
    metrics?.audience_b2c_percentage?.toString() ?? ""
  );
  const [audienceTags, setAudienceTags] = useState(
    metrics?.audience_tags.join(", ") ?? ""
  );
  const [industryTags, setIndustryTags] = useState(
    metrics?.industry_tags.join(", ") ?? ""
  );
  const [demographicSummary, setDemographicSummary] = useState(
    metrics?.demographic_summary ?? ""
  );
  const [geographicSummary, setGeographicSummary] = useState(
    metrics?.geographic_summary ?? ""
  );
  const [pastSponsors, setPastSponsors] = useState(
    metrics?.past_sponsors.join(", ") ?? ""
  );
  const [notes, setNotes] = useState(metrics?.notes ?? "");

  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(eventForm: React.FormEvent<HTMLFormElement>) {
    eventForm.preventDefault();
    setError(null);
    setPending(true);

    const result = await upsertEventMetrics({
      eventId: event.id,
      expectedAttendance,
      actualAttendance,
      exhibitorsCount,
      speakersCount,
      participatingBrandsCount,
      emailReach,
      websiteVisits,
      appUsers,
      socialImpressions,
      socialEngagements,
      livestreamViews,
      videoViews,
      pressMentions,
      mediaReach,
      audienceB2BPercentage,
      audienceB2CPercentage,
      audienceTags,
      industryTags,
      demographicSummary,
      geographicSummary,
      pastSponsors,
      notes,
    });

    if (result.error) {
      setError(result.error);
      setPending(false);
      return;
    }

    router.refresh();
    setPending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {[
          ["Expected attendance", expectedAttendance, setExpectedAttendance],
          ["Actual attendance", actualAttendance, setActualAttendance],
          ["Exhibitors", exhibitorsCount, setExhibitorsCount],
          ["Speakers", speakersCount, setSpeakersCount],
          ["Participating brands", participatingBrandsCount, setParticipatingBrandsCount],
          ["Email reach", emailReach, setEmailReach],
          ["Website visits", websiteVisits, setWebsiteVisits],
          ["App users", appUsers, setAppUsers],
          ["Social impressions", socialImpressions, setSocialImpressions],
          ["Social engagements", socialEngagements, setSocialEngagements],
          ["Livestream views", livestreamViews, setLivestreamViews],
          ["Video views", videoViews, setVideoViews],
          ["Press mentions", pressMentions, setPressMentions],
          ["Media reach", mediaReach, setMediaReach],
          ["Audience B2B %", audienceB2BPercentage, setAudienceB2BPercentage],
          ["Audience B2C %", audienceB2CPercentage, setAudienceB2CPercentage],
        ].map(([label, value, setter]) => (
          <div key={label} className="space-y-2">
            <label className="text-sm font-medium text-slate-700">{label}</label>
            <input
              type="number"
              min="0"
              value={value}
              onChange={(e) => setter(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
            />
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Audience tags
          </label>
          <input
            type="text"
            value={audienceTags}
            onChange={(e) => setAudienceTags(e.target.value)}
            placeholder="trail runners, amateur athletes, outdoor enthusiasts"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Industry tags
          </label>
          <input
            type="text"
            value={industryTags}
            onChange={(e) => setIndustryTags(e.target.value)}
            placeholder="nutrition, wearables, cycling, insurance"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">
            Demographic summary
          </label>
          <textarea
            rows={4}
            value={demographicSummary}
            onChange={(e) => setDemographicSummary(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">
            Geographic summary
          </label>
          <textarea
            rows={4}
            value={geographicSummary}
            onChange={(e) => setGeographicSummary(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">
            Past sponsors
          </label>
          <input
            type="text"
            value={pastSponsors}
            onChange={(e) => setPastSponsors(e.target.value)}
            placeholder="Nike, Garmin, Red Bull"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Notes</label>
          <textarea
            rows={5}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any extra context for sponsors or internal admin review."
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
          />
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Saving metrics..." : "Save metrics"}
      </button>
    </form>
  );
}