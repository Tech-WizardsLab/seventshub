"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import type { PlatformRole } from "@/types/database";
import { CompanyDetailsForm } from "@/features/onboarding/components/company-details-form";
import { RoleSelector } from "@/features/onboarding/components/role-selector";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function OnboardingForm() {
  const router = useRouter();

  const [role, setRole] = useState<PlatformRole | "">("");
  const [companyName, setCompanyName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function handleFieldChange(
    field: "companyName" | "websiteUrl" | "city" | "country" | "description",
    value: string
  ) {
    if (field === "companyName") setCompanyName(value);
    if (field === "websiteUrl") setWebsiteUrl(value);
    if (field === "city") setCity(value);
    if (field === "country") setCountry(value);
    if (field === "description") setDescription(value);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!role || role === "admin") {
      setError("Please choose whether your company is an organizer or a sponsor.");
      return;
    }

    if (!companyName.trim()) {
      setError("Company name is required.");
      return;
    }

    setPending(true);

    try {
      const supabase = createBrowserSupabaseClient();
      const baseSlug = slugify(companyName);
      const orgSlug = `${baseSlug}-${crypto.randomUUID().slice(0, 8)}`;

      const rpcClient = supabase as typeof supabase & {
        rpc: (
          fn: string,
          args?: Record<string, unknown>
        ) => Promise<{ data: unknown; error: { message: string } | null }>;
      };

      const { error: rpcError } = await rpcClient.rpc("complete_onboarding", {
        p_platform_role: role,
        p_company_name: companyName.trim(),
        p_slug: orgSlug,
        p_website_url: websiteUrl.trim() || null,
        p_city: city.trim() || null,
        p_country: country.trim() || null,
        p_description: description.trim() || null,
      });

      if (rpcError) {
        setError(rpcError.message);
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong while creating your company workspace.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <RoleSelector value={role} onChange={setRole} />

      <CompanyDetailsForm
        companyName={companyName}
        websiteUrl={websiteUrl}
        city={city}
        country={country}
        description={description}
        onChange={handleFieldChange}
      />

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
        {pending ? "Creating workspace..." : "Continue"}
      </button>
    </form>
  );
}