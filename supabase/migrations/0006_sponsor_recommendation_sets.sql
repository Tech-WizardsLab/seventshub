begin;

create table if not exists public.sponsor_recommendation_sets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  brief_id uuid references public.sponsor_onboarding_briefs(id) on delete set null,
  title text not null default 'Sponsor recommendation set',
  status text not null default 'ready_for_review',
  recommended_budget_eur numeric(12,2),
  projected_total_reach bigint,
  projected_attendance_exposure bigint,
  projected_touchpoints bigint,
  markets_covered text[] not null default '{}',
  average_fit_score numeric(5,2),
  analyst_summary text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint sponsor_recommendation_sets_status_check check (
    status in ('draft', 'ready_for_review', 'under_revision', 'approved_for_outreach')
  ),
  constraint sponsor_recommendation_sets_budget_check check (
    recommended_budget_eur is null or recommended_budget_eur >= 0
  )
);

create index if not exists sponsor_recommendation_sets_org_idx
  on public.sponsor_recommendation_sets (organization_id, created_at desc);

create table if not exists public.sponsor_recommendation_items (
  id uuid primary key default gen_random_uuid(),
  recommendation_set_id uuid not null references public.sponsor_recommendation_sets(id) on delete cascade,
  event_id uuid references public.events(id) on delete set null,
  selected_package text,
  fit_score numeric(5,2),
  projected_reach integer,
  projected_attendance integer,
  projected_touchpoints integer,
  plan_contribution text,
  recommendation_status text not null default 'recommended',
  why_it_fits text,
  audience_profile text,
  organizer_context text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint sponsor_recommendation_items_status_check check (
    recommendation_status in ('recommended', 'watchlist', 'alternative')
  )
);

create index if not exists sponsor_recommendation_items_set_idx
  on public.sponsor_recommendation_items (recommendation_set_id, created_at desc);

create trigger sponsor_recommendation_sets_set_updated_at
before update on public.sponsor_recommendation_sets
for each row
execute function public.set_updated_at();

create trigger sponsor_recommendation_items_set_updated_at
before update on public.sponsor_recommendation_items
for each row
execute function public.set_updated_at();

alter table public.sponsor_recommendation_sets enable row level security;
alter table public.sponsor_recommendation_items enable row level security;

drop policy if exists "sponsor_recommendation_sets_select_member_or_admin" on public.sponsor_recommendation_sets;
create policy "sponsor_recommendation_sets_select_member_or_admin"
on public.sponsor_recommendation_sets
for select
to authenticated
using (
  public.is_admin()
  or public.is_member_of_org(organization_id)
);

drop policy if exists "sponsor_recommendation_sets_insert_manage_or_admin" on public.sponsor_recommendation_sets;
create policy "sponsor_recommendation_sets_insert_manage_or_admin"
on public.sponsor_recommendation_sets
for insert
to authenticated
with check (
  public.is_admin()
  or public.can_manage_org(organization_id)
);

drop policy if exists "sponsor_recommendation_sets_update_manage_or_admin" on public.sponsor_recommendation_sets;
create policy "sponsor_recommendation_sets_update_manage_or_admin"
on public.sponsor_recommendation_sets
for update
to authenticated
using (
  public.is_admin()
  or public.can_manage_org(organization_id)
)
with check (
  public.is_admin()
  or public.can_manage_org(organization_id)
);

drop policy if exists "sponsor_recommendation_items_select_member_or_admin" on public.sponsor_recommendation_items;
create policy "sponsor_recommendation_items_select_member_or_admin"
on public.sponsor_recommendation_items
for select
to authenticated
using (
  public.is_admin()
  or exists (
    select 1
    from public.sponsor_recommendation_sets srs
    where srs.id = sponsor_recommendation_items.recommendation_set_id
      and public.is_member_of_org(srs.organization_id)
  )
);

drop policy if exists "sponsor_recommendation_items_insert_manage_or_admin" on public.sponsor_recommendation_items;
create policy "sponsor_recommendation_items_insert_manage_or_admin"
on public.sponsor_recommendation_items
for insert
to authenticated
with check (
  public.is_admin()
  or exists (
    select 1
    from public.sponsor_recommendation_sets srs
    where srs.id = sponsor_recommendation_items.recommendation_set_id
      and public.can_manage_org(srs.organization_id)
  )
);

drop policy if exists "sponsor_recommendation_items_update_manage_or_admin" on public.sponsor_recommendation_items;
create policy "sponsor_recommendation_items_update_manage_or_admin"
on public.sponsor_recommendation_items
for update
to authenticated
using (
  public.is_admin()
  or exists (
    select 1
    from public.sponsor_recommendation_sets srs
    where srs.id = sponsor_recommendation_items.recommendation_set_id
      and public.can_manage_org(srs.organization_id)
  )
)
with check (
  public.is_admin()
  or exists (
    select 1
    from public.sponsor_recommendation_sets srs
    where srs.id = sponsor_recommendation_items.recommendation_set_id
      and public.can_manage_org(srs.organization_id)
  )
);

commit;