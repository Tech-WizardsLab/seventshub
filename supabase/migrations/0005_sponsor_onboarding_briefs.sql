begin;

create table if not exists public.sponsor_onboarding_briefs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  submitted_by uuid not null references public.profiles(id) on delete cascade,
  version integer not null default 1,
  strategy_status text not null default 'preparing',
  submitted_at timestamptz not null default now(),
  briefing_snapshot jsonb not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint sponsor_onboarding_briefs_version_check check (version >= 1),
  constraint sponsor_onboarding_briefs_status_check check (
    strategy_status in ('preparing', 'ready', 'archived')
  )
);

create unique index if not exists sponsor_onboarding_briefs_org_version_idx
  on public.sponsor_onboarding_briefs (organization_id, version);

create index if not exists sponsor_onboarding_briefs_org_submitted_idx
  on public.sponsor_onboarding_briefs (organization_id, submitted_at desc);

create trigger sponsor_onboarding_briefs_set_updated_at
before update on public.sponsor_onboarding_briefs
for each row
execute function public.set_updated_at();

alter table public.sponsor_onboarding_briefs enable row level security;

drop policy if exists "sponsor_onboarding_briefs_select_member_or_admin" on public.sponsor_onboarding_briefs;
create policy "sponsor_onboarding_briefs_select_member_or_admin"
on public.sponsor_onboarding_briefs
for select
to authenticated
using (
  public.is_admin()
  or public.is_member_of_org(organization_id)
);

drop policy if exists "sponsor_onboarding_briefs_insert_manage_or_admin" on public.sponsor_onboarding_briefs;
create policy "sponsor_onboarding_briefs_insert_manage_or_admin"
on public.sponsor_onboarding_briefs
for insert
to authenticated
with check (
  public.is_admin()
  or (
    public.can_manage_org(organization_id)
    and submitted_by = auth.uid()
  )
);

drop policy if exists "sponsor_onboarding_briefs_update_admin_only" on public.sponsor_onboarding_briefs;
create policy "sponsor_onboarding_briefs_update_admin_only"
on public.sponsor_onboarding_briefs
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

commit;