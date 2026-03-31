"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSponsorshipSlot } from "@/features/events/lib/create-sponsorship-slot";
import { SLOT_TYPES, SLOT_VISIBILITIES } from "@/lib/constants/slots";
import type { SlotType, SlotVisibility } from "@/types/database";

interface SponsorshipSlotFormProps {
  eventId: string;
}

export function SponsorshipSlotForm({ eventId }: SponsorshipSlotFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slotType, setSlotType] = useState<SlotType>("custom");
  const [tierName, setTierName] = useState("");
  const [description, setDescription] = useState("");
  const [benefits, setBenefits] = useState("");
  const [inventoryCount, setInventoryCount] = useState("1");
  const [listPriceEur, setListPriceEur] = useState("");
  const [minimumPriceEur, setMinimumPriceEur] = useState("");
  const [visibility, setVisibility] = useState<SlotVisibility>("public");
  const [deliverablesSummary, setDeliverablesSummary] = useState("");
  const [activationSummary, setActivationSummary] = useState("");
  const [audienceFitTags, setAudienceFitTags] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    if (!title.trim()) {
      setError("Slot title is required.");
      setPending(false);
      return;
    }

    const result = await createSponsorshipSlot({
      eventId,
      title,
      slotType,
      tierName,
      description,
      benefits,
      inventoryCount,
      listPriceEur,
      minimumPriceEur,
      visibility,
      deliverablesSummary,
      activationSummary,
      audienceFitTags,
    });

    if (result.error) {
      setError(result.error);
      setPending(false);
      return;
    }

    router.refresh();

    setTitle("");
    setSlotType("custom");
    setTierName("");
    setDescription("");
    setBenefits("");
    setInventoryCount("1");
    setListPriceEur("");
    setMinimumPriceEur("");
    setVisibility("public");
    setDeliverablesSummary("");
    setActivationSummary("");
    setAudienceFitTags("");
    setPending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="title" className="text-sm font-medium text-slate-700">
            Slot title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Official Nutrition Partner"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="slotType" className="text-sm font-medium text-slate-700">
            Slot type
          </label>
          <select
            id="slotType"
            value={slotType}
            onChange={(event) => setSlotType(event.target.value as SlotType)}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
          >
            {SLOT_TYPES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="tierName" className="text-sm font-medium text-slate-700">
            Tier name
          </label>
          <input
            id="tierName"
            type="text"
            value={tierName}
            onChange={(event) => setTierName(event.target.value)}
            placeholder="Gold"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="description" className="text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What does this sponsorship slot include?"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="benefits" className="text-sm font-medium text-slate-700">
            Benefits
          </label>
          <input
            id="benefits"
            type="text"
            value={benefits}
            onChange={(event) => setBenefits(event.target.value)}
            placeholder="logo on bibs, stage branding, social media mentions"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="inventoryCount" className="text-sm font-medium text-slate-700">
            Inventory count
          </label>
          <input
            id="inventoryCount"
            type="number"
            min="1"
            value={inventoryCount}
            onChange={(event) => setInventoryCount(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="visibility" className="text-sm font-medium text-slate-700">
            Visibility
          </label>
          <select
            id="visibility"
            value={visibility}
            onChange={(event) => setVisibility(event.target.value as SlotVisibility)}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
          >
            {SLOT_VISIBILITIES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="listPriceEur" className="text-sm font-medium text-slate-700">
            List price (€)
          </label>
          <input
            id="listPriceEur"
            type="number"
            min="0"
            step="0.01"
            value={listPriceEur}
            onChange={(event) => setListPriceEur(event.target.value)}
            placeholder="12000"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="minimumPriceEur" className="text-sm font-medium text-slate-700">
            Minimum price (€)
          </label>
          <input
            id="minimumPriceEur"
            type="number"
            min="0"
            step="0.01"
            value={minimumPriceEur}
            onChange={(event) => setMinimumPriceEur(event.target.value)}
            placeholder="9000"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label
            htmlFor="deliverablesSummary"
            className="text-sm font-medium text-slate-700"
          >
            Deliverables summary
          </label>
          <textarea
            id="deliverablesSummary"
            rows={3}
            value={deliverablesSummary}
            onChange={(event) => setDeliverablesSummary(event.target.value)}
            placeholder="What exactly will the sponsor receive?"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label
            htmlFor="activationSummary"
            className="text-sm font-medium text-slate-700"
          >
            Activation summary
          </label>
          <textarea
            id="activationSummary"
            rows={3}
            value={activationSummary}
            onChange={(event) => setActivationSummary(event.target.value)}
            placeholder="How can the sponsor activate on-site or digitally?"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label
            htmlFor="audienceFitTags"
            className="text-sm font-medium text-slate-700"
          >
            Audience fit tags
          </label>
          <input
            id="audienceFitTags"
            type="text"
            value={audienceFitTags}
            onChange={(event) => setAudienceFitTags(event.target.value)}
            placeholder="endurance athletes, trail runners, health-conscious consumers"
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
        {pending ? "Creating slot..." : "Create sponsorship slot"}
      </button>
    </form>
  );
}