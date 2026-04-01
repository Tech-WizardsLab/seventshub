interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="space-y-2">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          {eyebrow}
        </p>
      ) : null}

      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>

      {description ? <p className="text-sm text-slate-600">{description}</p> : null}
    </div>
  );
}