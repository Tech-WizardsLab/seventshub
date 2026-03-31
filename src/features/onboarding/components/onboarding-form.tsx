"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import type { OrganizationType, PlatformRole } from "@/types/database";
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

function mapRoleToOrganizationType(role: PlatformRole): OrganizationType {
  if (role === "organizer") {
    return "event_organizer";
  }

  if (role === "sponsor") {
    return "sponsor";
  }

  return "other";
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

    const supabase = createBrowserSupabaseClient();
    setPending(true);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setError("You must be logged in to complete onboarding.");
        return;
      }

      const organizationType = mapRoleToOrganizationType(role);
      const baseSlug = slugify(companyName);
      const orgSlug = `${baseSlug}-${crypto.randomUUID().slice(0, 8)}`;

      const { data: organization, error: organizationError } = await supabase
        .from("organizations")
        .insert({
          name: companyName.trim(),
          slug: orgSlug,
          organization_type: organizationType,
          website_url: websiteUrl.trim() || null,
          city: city.trim() || null,
          country: country.trim() || null,
          description: description.trim() || null,
          created_by: user.id,
        })
        .select("id")
        .single();

      if (organizationError || !organization) {
        setError(organizationError?.message ?? "Could not create organization.");
        return;
      }

      const { error: membershipError } = await supabase
        .from("organization_members")
        .insert({
          organization_id: organization.id,
          profile_id: user.id,
          membership_role: "owner",
          is_primary_contact: true,
        });

      if (membershipError) {
        setError(membershipError.message);
        return;
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          platform_role: role,
        })
        .eq("id", user.id);

      if (profileError) {
        setError(profileError.message);
        return;
      }

      const { error: orgProfileError } = await supabase
        .from("organization_profiles")
        .insert({
          organization_id: organization.id,
          overview: description.trim() || null,
          years_operating: null,
          primary_sports: [],
          operating_regions: [],
          notable_partners: [],
          achievements: [],
        });

      if (orgProfileError) {
        setError(orgProfileError.message);
        return;
      }

      const { error: orgMetricsError } = await supabase
        .from("organization_metrics")
        .insert({
          organization_id: organization.id,
        });

      if (orgMetricsError) {
        setError(orgMetricsError.message);
        return;
      }

      if (role === "sponsor") {
        const { error: sponsorPrefsError } = await supabase
          .from("sponsor_preferences")
          .insert({
            organization_id: organization.id,
          });

        if (sponsorPrefsError) {
          setError(sponsorPrefsError.message);
          return;
        }
      }

      router.push("/dashboard");
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