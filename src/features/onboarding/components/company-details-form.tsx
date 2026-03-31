interface CompanyDetailsFormProps {
  companyName: string;
  websiteUrl: string;
  city: string;
  country: string;
  description: string;
  onChange: (
    field: "companyName" | "websiteUrl" | "city" | "country" | "description",
    value: string
  ) => void;
}

export function CompanyDetailsForm({
  companyName,
  websiteUrl,
  city,
  country,
  description,
  onChange,
}: CompanyDetailsFormProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="companyName" className="text-sm font-medium text-slate-700">
          Company name
        </label>
        <input
          id="companyName"
          name="companyName"
          type="text"
          value={companyName}
          onChange={(event) => onChange("companyName", event.target.value)}
          placeholder="SEventsHub Sports Media"
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="websiteUrl" className="text-sm font-medium text-slate-700">
          Website
        </label>
        <input
          id="websiteUrl"
          name="websiteUrl"
          type="url"
          value={websiteUrl}
          onChange={(event) => onChange("websiteUrl", event.target.value)}
          placeholder="https://yourcompany.com"
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="city" className="text-sm font-medium text-slate-700">
            City
          </label>
          <input
            id="city"
            name="city"
            type="text"
            value={city}
            onChange={(event) => onChange("city", event.target.value)}
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
            name="country"
            type="text"
            value={country}
            onChange={(event) => onChange("country", event.target.value)}
            placeholder="Spain"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium text-slate-700">
          Short description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={description}
          onChange={(event) => onChange("description", event.target.value)}
          placeholder="A short introduction to your company."
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400"
        />
      </div>
    </div>
  );
}