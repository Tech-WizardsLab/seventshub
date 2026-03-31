"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEvent } from "@/features/events/lib/create-event";

const SPORT_OPTIONS = [
  "Trail Running",
  "Cycling",
  "Triathlon",
  "Football",
  "Wellness",
  "Running",
  "Outdoor",
  "Other",
];

export function NewEventForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [sportType, setSportType] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [venueName, setVenueName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [attendeeCapacity, setAttendeeCapacity] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    if (!name.trim()) {
      setError("Event name is required.");
      setPending(false);
      return;
    }

    if (!sportType.trim()) {
      setError("Sport type is required.");
      setPending(false);
      return;
    }

    const result = await createEvent({
      name,
      sportType,
      city,
      country,
      venueName,
      websiteUrl,
      shortDescription,
      description,
      startsAt,
      endsAt,
      attendeeCapacity,
    });

    if (result.error) {
      setError(result.error);
      setPending(false);
      return;
    }

    router.push("/organizer/events");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="name" className="text-sm font-medium text-slate-700">
            Event name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Madrid Trail Summit"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="sportType" className="text-sm font-medium text-slate-700">
            Sport type
          </label>
          <select
            id="sportType"
            value={sportType}
            onChange={(event) => setSportType(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
            required
          >
            <option value="">Select sport type</option>
            {SPORT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="attendeeCapacity" className="text-sm font-medium text-slate-700">
            Expected attendance
          </label>
          <input
            id="attendeeCapacity"
            type="number"
            min="0"
            value={attendeeCapacity}
            onChange={(event) => setAttendeeCapacity(event.target.value)}
            placeholder="2500"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="city" className="text-sm font-medium text-slate-700">
            City
          </label>
          <input
            id="city"
            type="text"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder="Madrid"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="country" className="text-sm font-medium text-slate-700">
            Country
          </label>
          <input
            id="country"
            type="text"
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            placeholder="Spain"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="venueName" className="text-sm font-medium text-slate-700">
            Venue name
          </label>
          <input
            id="venueName"
            type="text"
            value={venueName}
            onChange={(event) => setVenueName(event.target.value)}
            placeholder="Casa de Campo"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="startsAt" className="text-sm font-medium text-slate-700">
            Start date
          </label>
          <input
            id="startsAt"
            type="datetime-local"
            value={startsAt}
            onChange={(event) => setStartsAt(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="endsAt" className="text-sm font-medium text-slate-700">
            End date
          </label>
          <input
            id="endsAt"
            type="datetime-local"
            value={endsAt}
            onChange={(event) => setEndsAt(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="websiteUrl" className="text-sm font-medium text-slate-700">
            Event website
          </label>
          <input
            id="websiteUrl"
            type="url"
            value={websiteUrl}
            onChange={(event) => setWebsiteUrl(event.target.value)}
            placeholder="https://yourevent.com"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="shortDescription" className="text-sm font-medium text-slate-700">
            Short description
          </label>
          <textarea
            id="shortDescription"
            rows={3}
            value={shortDescription}
            onChange={(event) => setShortDescription(event.target.value)}
            placeholder="A short sponsor-facing summary of the event."
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="description" className="text-sm font-medium text-slate-700">
            Full description
          </label>
          <textarea
            id="description"
            rows={6}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe the event, audience, positioning, and what makes it attractive for sponsors."
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400"
          />
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Creating event..." : "Create event"}
        </button>

        <p className="text-sm text-slate-500">
          The event will start as a draft until you complete the rest of the details.
        </p>
      </div>
    </form>
  );
}