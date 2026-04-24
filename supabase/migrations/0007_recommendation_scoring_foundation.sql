begin;

create unique index if not exists sponsor_recommendation_items_id_set_uidx
  on public.sponsor_recommendation_items (id, recommendation_set_id);

create table if not exists public.sponsor_recommendation_item_matching_inputs (
  id uuid primary key default gen_random_uuid(),
  recommendation_item_id uuid not null unique,
  source_recommendation_set_id uuid not null references public.sponsor_recommendation_sets(id) on delete cascade,
  sponsor_organization_id uuid not null references public.organizations(id) on delete cascade,
  source_brief_id uuid references public.sponsor_onboarding_briefs(id) on delete set null,
  sponsor_markets text[] not null default '{}',
  sponsor_target_sports text[] not null default '{}',
  sponsor_audience_tags text[] not null default '{}',
  sponsor_activation_preferences text[] not null default '{}',
  sponsor_budget_min_eur numeric(12,2),
  sponsor_budget_max_eur numeric(12,2),
  event_market_country text,
  event_market_city text,
  event_sport_type text,
  event_category_tags text[] not null default '{}',
  event_expected_attendance integer,
  event_social_impressions integer,
  event_demographic_summary text,
  event_geographic_summary text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint sponsor_recommendation_item_matching_inputs_item_set_fk
    foreign key (recommendation_item_id, source_recommendation_set_id)
    references public.sponsor_recommendation_items (id, recommendation_set_id)
    on delete cascade,
  constraint sponsor_recommendation_item_matching_inputs_budget_check check (
    sponsor_budget_min_eur is null
    or sponsor_budget_max_eur is null
    or sponsor_budget_min_eur <= sponsor_budget_max_eur
  ),
  constraint sponsor_recommendation_item_matching_inputs_min_budget_non_negative check (
    sponsor_budget_min_eur is null or sponsor_budget_min_eur >= 0
  ),
  constraint sponsor_recommendation_item_matching_inputs_max_budget_non_negative check (
    sponsor_budget_max_eur is null or sponsor_budget_max_eur >= 0
  )
);

create index if not exists sponsor_recommendation_item_matching_inputs_set_idx
  on public.sponsor_recommendation_item_matching_inputs (source_recommendation_set_id, created_at desc);

create index if not exists sponsor_recommendation_item_matching_inputs_org_idx
  on public.sponsor_recommendation_item_matching_inputs (sponsor_organization_id, created_at desc);

create table if not exists public.sponsor_recommendation_item_derived_scores (
  id uuid primary key default gen_random_uuid(),
  recommendation_item_id uuid not null unique,
  recommendation_set_id uuid not null references public.sponsor_recommendation_sets(id) on delete cascade,
  score_version integer not null default 1,
  market_fit_score numeric(5,2),
  audience_fit_score numeric(5,2),
  sport_fit_score numeric(5,2),
  budget_fit_score numeric(5,2),
  brand_safety_score numeric(5,2),
  inventory_quality_score numeric(5,2),
  composite_fit_score numeric(5,2),
  confidence_score numeric(5,2),
  scoring_inputs jsonb not null default '{}'::jsonb,
  scoring_notes text,
  computed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint sponsor_recommendation_item_derived_scores_item_set_fk
    foreign key (recommendation_item_id, recommendation_set_id)
    references public.sponsor_recommendation_items (id, recommendation_set_id)
    on delete cascade,
  constraint sponsor_recommendation_item_derived_scores_version_check check (score_version >= 1),
  constraint sponsor_recommendation_item_derived_scores_market_fit_range check (market_fit_score is null or market_fit_score between 0 and 100),
  constraint sponsor_recommendation_item_derived_scores_audience_fit_range check (audience_fit_score is null or audience_fit_score between 0 and 100),
  constraint sponsor_recommendation_item_derived_scores_sport_fit_range check (sport_fit_score is null or sport_fit_score between 0 and 100),
  constraint sponsor_recommendation_item_derived_scores_budget_fit_range check (budget_fit_score is null or budget_fit_score between 0 and 100),
  constraint sponsor_recommendation_item_derived_scores_brand_safety_range check (brand_safety_score is null or brand_safety_score between 0 and 100),
  constraint sponsor_recommendation_item_derived_scores_inventory_quality_range check (inventory_quality_score is null or inventory_quality_score between 0 and 100),
  constraint sponsor_recommendation_item_derived_scores_composite_range check (composite_fit_score is null or composite_fit_score between 0 and 100),
  constraint sponsor_recommendation_item_derived_scores_confidence_range check (confidence_score is null or confidence_score between 0 and 100)
);

create index if not exists sponsor_recommendation_item_derived_scores_set_idx
  on public.sponsor_recommendation_item_derived_scores (recommendation_set_id, computed_at desc);

create trigger sponsor_recommendation_item_matching_inputs_set_updated_at
before update on public.sponsor_recommendation_item_matching_inputs
for each row
execute function public.set_updated_at();

create trigger sponsor_recommendation_item_derived_scores_set_updated_at
before update on public.sponsor_recommendation_item_derived_scores
for each row
execute function public.set_updated_at();

insert into public.sponsor_recommendation_item_matching_inputs (
  recommendation_item_id,
  source_recommendation_set_id,
  sponsor_organization_id,
  source_brief_id
)
select
  sri.id,
  srs.id,
  srs.organization_id,
  srs.brief_id
from public.sponsor_recommendation_items sri
join public.sponsor_recommendation_sets srs
  on srs.id = sri.recommendation_set_id
on conflict (recommendation_item_id) do nothing;

insert into public.sponsor_recommendation_item_derived_scores (
  recommendation_item_id,
  recommendation_set_id,
  composite_fit_score,
  confidence_score,
  scoring_inputs,
  scoring_notes
)
select
  sri.id,
  sri.recommendation_set_id,
  sri.fit_score,
  null,
  jsonb_build_object('legacy_fit_score', sri.fit_score),
  'Backfilled from sponsor_recommendation_items.fit_score (confidence pending recalculation)'
from public.sponsor_recommendation_items sri
on conflict (recommendation_item_id) do nothing;

alter table public.sponsor_recommendation_item_matching_inputs enable row level security;
alter table public.sponsor_recommendation_item_derived_scores enable row level security;

drop policy if exists "sponsor_recommendation_item_matching_inputs_select_member_or_admin" on public.sponsor_recommendation_item_matching_inputs;
create policy "sponsor_recommendation_item_matching_inputs_select_member_or_admin"
on public.sponsor_recommendation_item_matching_inputs
for select
to authenticated
using (
  public.is_admin()
  or exists (
    select 1
    from public.sponsor_recommendation_sets srs
    where srs.id = sponsor_recommendation_item_matching_inputs.source_recommendation_set_id
      and public.is_member_of_org(srs.organization_id)
  )
);

drop policy if exists "sponsor_recommendation_item_matching_inputs_insert_manage_or_admin" on public.sponsor_recommendation_item_matching_inputs;
create policy "sponsor_recommendation_item_matching_inputs_insert_manage_or_admin"
on public.sponsor_recommendation_item_matching_inputs
for insert
to authenticated
with check (
  public.is_admin()
  or exists (
    select 1
    from public.sponsor_recommendation_sets srs
    where srs.id = sponsor_recommendation_item_matching_inputs.source_recommendation_set_id
      and public.can_manage_org(srs.organization_id)
  )
);

drop policy if exists "sponsor_recommendation_item_matching_inputs_update_manage_or_admin" on public.sponsor_recommendation_item_matching_inputs;
create policy "sponsor_recommendation_item_matching_inputs_update_manage_or_admin"
on public.sponsor_recommendation_item_matching_inputs
for update
to authenticated
using (
  public.is_admin()
  or exists (
    select 1
    from public.sponsor_recommendation_sets srs
    where srs.id = sponsor_recommendation_item_matching_inputs.source_recommendation_set_id
      and public.can_manage_org(srs.organization_id)
  )
)
with check (
  public.is_admin()
  or exists (
    select 1
    from public.sponsor_recommendation_sets srs
    where srs.id = sponsor_recommendation_item_matching_inputs.source_recommendation_set_id
      and public.can_manage_org(srs.organization_id)
  )
);

drop policy if exists "sponsor_recommendation_item_derived_scores_select_member_or_admin" on public.sponsor_recommendation_item_derived_scores;
create policy "sponsor_recommendation_item_derived_scores_select_member_or_admin"
on public.sponsor_recommendation_item_derived_scores
for select
to authenticated
using (
  public.is_admin()
  or exists (
    select 1
    from public.sponsor_recommendation_sets srs
    where srs.id = sponsor_recommendation_item_derived_scores.recommendation_set_id
      and public.is_member_of_org(srs.organization_id)
  )
);

drop policy if exists "sponsor_recommendation_item_derived_scores_insert_manage_or_admin" on public.sponsor_recommendation_item_derived_scores;
create policy "sponsor_recommendation_item_derived_scores_insert_manage_or_admin"
on public.sponsor_recommendation_item_derived_scores
for insert
to authenticated
with check (
  public.is_admin()
  or exists (
    select 1
    from public.sponsor_recommendation_sets srs
    where srs.id = sponsor_recommendation_item_derived_scores.recommendation_set_id
      and public.can_manage_org(srs.organization_id)
  )
);

drop policy if exists "sponsor_recommendation_item_derived_scores_update_manage_or_admin" on public.sponsor_recommendation_item_derived_scores;
create policy "sponsor_recommendation_item_derived_scores_update_manage_or_admin"
on public.sponsor_recommendation_item_derived_scores
for update
to authenticated
using (
  public.is_admin()
  or exists (
    select 1
    from public.sponsor_recommendation_sets srs
    where srs.id = sponsor_recommendation_item_derived_scores.recommendation_set_id
      and public.can_manage_org(srs.organization_id)
  )
)
with check (
  public.is_admin()
  or exists (
    select 1
    from public.sponsor_recommendation_sets srs
    where srs.id = sponsor_recommendation_item_derived_scores.recommendation_set_id
      and public.can_manage_org(srs.organization_id)
  )
);

commit;