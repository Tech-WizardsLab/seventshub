import { requireOnboardedUser } from "@/lib/auth/require-onboarded-user";

export default async function MarketplacePage() {
  await requireOnboardedUser();

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold text-slate-900">Marketplace</h1>
      <p className="text-slate-600">
        This page will show searchable event opportunities for sponsors and
        visibility for organizers.
      </p>
    </div>
  );
}