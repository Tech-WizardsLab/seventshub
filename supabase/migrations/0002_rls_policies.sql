-- =========================================================
-- SEventsHub - RLS Policies and Access Helpers
-- =========================================================
-- Goals:
-- 1. Keep access rules centralized and readable
-- 2. Let admins access everything
-- 3. Let users manage only their own profile
-- 4. Let organization members manage their own org data
-- 5. Let authenticated users browse approved marketplace data
-- 6. Let sponsors manage only their own saved items and inquiries
-- =========================================================

begin;

-- ---------------------------------------------------------
-- Helper functions
-- ---------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.platform_role = 'admin'
      and p.is_active = true
  );
$$;

create or replace function public.is_member_of_org(org_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.organization_members om
    join public.profiles p on p.id = om.profile_id
    where om.organization_id = org_id
      and om.profile_id = auth.uid()
      and p.is_active = true
  );
$$;

create or replace function public.can_manage_org(org_id uuid)
returns boolean
language sql
stable
as $$
  select
    public.is_admin()
    or exists (
      select 1
      from public.organization_members om
      join public.profiles p on p.id = om.profile_id
      where om.organization_id = org_id
        and om.profile_id = auth.uid()
        and om.membership_role in ('owner', 'admin')
        and p.is_active = true
    );
$$;

create or replace function public.org_id_for_event(event_row_id uuid)
returns uuid
language sql
stable
as $$
  select e.organization_id
  from public.events e
  where e.id = event_row_id;
$$;

create or replace function public.is_approved_event(event_row_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.events e
    where e.id = event_row_id
      and e.status = 'approved'
  );
$$;

create or replace function public.current_user_org_ids()
returns setof uuid
language sql
stable
as $$
  select om.organization_id
  from public.organization_members om
  join public.profiles p on p.id = om.profile_id
  where om.profile_id = auth.uid()
    and p.is_active = true;
$$;

-- ---------------------------------------------------------
-- Profiles
-- ---------------------------------------------------------

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles
for select
to authenticated
using (
  id = auth.uid()
  or public.is_admin()
);

drop policy if exists "profiles_insert_own_or_admin" on public.profiles;
create policy "profiles_insert_own_or_admin"
on public.profiles
for insert
to authenticated
with check (
  id = auth.uid()
  or public.is_admin()
);

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin"
on public.profiles
for update
to authenticated
using (
  id = auth.uid()
  or public.is_admin()
)
with check (
  id = auth.uid()
  or public.is_admin()
);

-- ---------------------------------------------------------
-- Organizations
-- ---------------------------------------------------------

drop policy if exists "organizations_select_member_approved_or_admin" on public.organizations;
create policy "organizations_select_member_approved_or_admin"
on public.organizations
for select
to authenticated
using (
  public.is_admin()
  or public.is_member_of_org(id)
  or exists (
    select 1
    from public.events e
    where e.organization_id = organizations.id
      and e.status = 'approved'
  )
);

drop policy if exists "organizations_insert_authenticated" on public.organizations;
create policy "organizations_insert_authenticated"
on public.organizations
for insert
to authenticated
with check (
  auth.uid() is not null
);

drop policy if exists "organizations_update_manage_or_admin" on public.organizations;
create policy "organizations_update_manage_or_admin"
on public.organizations
for update
to authenticated
using (
  public.can_manage_org(id)
)
with check (
  public.can_manage_org(id)
);

-- ---------------------------------------------------------
-- Organization members
-- ---------------------------------------------------------

drop policy if exists "organization_members_select_member_or_admin" on public.organization_members;
create policy "organization_members_select_member_or_admin"
on public.organization_members
for select
to authenticated
using (
  public.is_admin()
  or profile_id = auth.uid()
  or public.is_member_of_org(organization_id)
);

drop policy if exists "organization_members_insert_manage_or_admin" on public.organization_members;
create policy "organization_members_insert_manage_or_admin"
on public.organization_members
for insert
to authenticated
with check (
  public.can_manage_org(organization_id)
);

drop policy if exists "organization_members_update_manage_or_admin" on public.organization_members;
create policy "organization_members_update_manage_or_admin"
on public.organization_members
for update
to authenticated
using (
  public.can_manage_org(organization_id)
)
with check (
  public.can_manage_org(organization_id)
);

drop policy if exists "organization_members_delete_manage_or_admin" on public.organization_members;
create policy "organization_members_delete_manage_or_admin"
on public.organization_members
for delete
to authenticated
using (
  public.can_manage_org(organization_id)
);

-- ---------------------------------------------------------
-- Organization profiles
-- ---------------------------------------------------------

drop policy if exists "organization_profiles_select_marketplace_or_member_or_admin" on public.organization_profiles;
create policy "organization_profiles_select_marketplace_or_member_or_admin"
on public.organization_profiles
for select
to authenticated
using (
  public.is_admin()
  or public.is_member_of_org(organization_id)
  or exists (
    select 1
    from public.events e
    where e.organization_id = organization_profiles.organization_id
      and e.status = 'approved'
  )
);

drop policy if exists "organization_profiles_insert_manage_or_admin" on public.organization_profiles;
create policy "organization_profiles_insert_manage_or_admin"
on public.organization_profiles
for insert
to authenticated
with check (
  public.can_manage_org(organization_id)
);

drop policy if exists "organization_profiles_update_manage_or_admin" on public.organization_profiles;
create policy "organization_profiles_update_manage_or_admin"
on public.organization_profiles
for update
to authenticated
using (
  public.can_manage_org(organization_id)
)
with check (
  public.can_manage_org(organization_id)
);

-- ---------------------------------------------------------
-- Organization metrics
-- ---------------------------------------------------------

drop policy if exists "organization_metrics_select_marketplace_or_member_or_admin" on public.organization_metrics;
create policy "organization_metrics_select_marketplace_or_member_or_admin"
on public.organization_metrics
for select
to authenticated
using (
  public.is_admin()
  or public.is_member_of_org(organization_id)
  or exists (
    select 1
    from public.events e
    where e.organization_id = organization_metrics.organization_id
      and e.status = 'approved'
  )
);

drop policy if exists "organization_metrics_insert_manage_or_admin" on public.organization_metrics;
create policy "organization_metrics_insert_manage_or_admin"
on public.organization_metrics
for insert
to authenticated
with check (
  public.can_manage_org(organization_id)
);

drop policy if exists "organization_metrics_update_manage_or_admin" on public.organization_metrics;
create policy "organization_metrics_update_manage_or_admin"
on public.organization_metrics
for update
to authenticated
using (
  public.can_manage_org(organization_id)
)
with check (
  public.can_manage_org(organization_id)
);

-- ---------------------------------------------------------
-- Sponsor preferences
-- Only sponsor org members and admins should access these
-- ---------------------------------------------------------

drop policy if exists "sponsor_preferences_select_member_or_admin" on public.sponsor_preferences;
create policy "sponsor_preferences_select_member_or_admin"
on public.sponsor_preferences
for select
to authenticated
using (
  public.is_admin()
  or public.is_member_of_org(organization_id)
);

drop policy if exists "sponsor_preferences_insert_manage_or_admin" on public.sponsor_preferences;
create policy "sponsor_preferences_insert_manage_or_admin"
on public.sponsor_preferences
for insert
to authenticated
with check (
  public.can_manage_org(organization_id)
);

drop policy if exists "sponsor_preferences_update_manage_or_admin" on public.sponsor_preferences;
create policy "sponsor_preferences_update_manage_or_admin"
on public.sponsor_preferences
for update
to authenticated
using (
  public.can_manage_org(organization_id)
)
with check (
  public.can_manage_org(organization_id)
);

-- ---------------------------------------------------------
-- Events
-- Approved events are visible to authenticated users
-- Draft/pending only visible to org members/admins
-- ---------------------------------------------------------

drop policy if exists "events_select_approved_or_member_or_admin" on public.events;
create policy "events_select_approved_or_member_or_admin"
on public.events
for select
to authenticated
using (
  public.is_admin()
  or public.is_member_of_org(organization_id)
  or status = 'approved'
);

drop policy if exists "events_insert_manage_or_admin" on public.events;
create policy "events_insert_manage_or_admin"
on public.events
for insert
to authenticated
with check (
  public.can_manage_org(organization_id)
);

drop policy if exists "events_update_manage_or_admin" on public.events;
create policy "events_update_manage_or_admin"
on public.events
for update
to authenticated
using (
  public.can_manage_org(organization_id)
  or public.is_admin()
)
with check (
  public.can_manage_org(organization_id)
  or public.is_admin()
);

-- ---------------------------------------------------------
-- Event metrics
-- ---------------------------------------------------------

drop policy if exists "event_metrics_select_approved_or_member_or_admin" on public.event_metrics;
create policy "event_metrics_select_approved_or_member_or_admin"
on public.event_metrics
for select
to authenticated
using (
  public.is_admin()
  or public.is_member_of_org(public.org_id_for_event(event_id))
  or public.is_approved_event(event_id)
);

drop policy if exists "event_metrics_insert_manage_or_admin" on public.event_metrics;
create policy "event_metrics_insert_manage_or_admin"
on public.event_metrics
for insert
to authenticated
with check (
  public.can_manage_org(public.org_id_for_event(event_id))
);

drop policy if exists "event_metrics_update_manage_or_admin" on public.event_metrics;
create policy "event_metrics_update_manage_or_admin"
on public.event_metrics
for update
to authenticated
using (
  public.can_manage_org(public.org_id_for_event(event_id))
  or public.is_admin()
)
with check (
  public.can_manage_org(public.org_id_for_event(event_id))
  or public.is_admin()
);

-- ---------------------------------------------------------
-- Sponsorship slots
-- Public within authenticated marketplace if parent event approved
-- ---------------------------------------------------------

drop policy if exists "sponsorship_slots_select_approved_or_member_or_admin" on public.sponsorship_slots;
create policy "sponsorship_slots_select_approved_or_member_or_admin"
on public.sponsorship_slots
for select
to authenticated
using (
  public.is_admin()
  or public.is_member_of_org(public.org_id_for_event(event_id))
  or public.is_approved_event(event_id)
);

drop policy if exists "sponsorship_slots_insert_manage_or_admin" on public.sponsorship_slots;
create policy "sponsorship_slots_insert_manage_or_admin"
on public.sponsorship_slots
for insert
to authenticated
with check (
  public.can_manage_org(public.org_id_for_event(event_id))
);

drop policy if exists "sponsorship_slots_update_manage_or_admin" on public.sponsorship_slots;
create policy "sponsorship_slots_update_manage_or_admin"
on public.sponsorship_slots
for update
to authenticated
using (
  public.can_manage_org(public.org_id_for_event(event_id))
  or public.is_admin()
)
with check (
  public.can_manage_org(public.org_id_for_event(event_id))
  or public.is_admin()
);

-- ---------------------------------------------------------
-- Saved events
-- Sponsor org can manage only its own saved events
-- ---------------------------------------------------------

drop policy if exists "saved_events_select_own_org_or_admin" on public.saved_events;
create policy "saved_events_select_own_org_or_admin"
on public.saved_events
for select
to authenticated
using (
  public.is_admin()
  or public.is_member_of_org(organization_id)
);

drop policy if exists "saved_events_insert_own_org_or_admin" on public.saved_events;
create policy "saved_events_insert_own_org_or_admin"
on public.saved_events
for insert
to authenticated
with check (
  public.is_admin()
  or public.is_member_of_org(organization_id)
);

drop policy if exists "saved_events_delete_own_org_or_admin" on public.saved_events;
create policy "saved_events_delete_own_org_or_admin"
on public.saved_events
for delete
to authenticated
using (
  public.is_admin()
  or public.is_member_of_org(organization_id)
);

-- ---------------------------------------------------------
-- Slot inquiries
-- Sponsor org sees own inquiries
-- Organizer org sees inquiries for slots on their events
-- Admin sees all
-- ---------------------------------------------------------

drop policy if exists "slot_inquiries_select_related_or_admin" on public.slot_inquiries;
create policy "slot_inquiries_select_related_or_admin"
on public.slot_inquiries
for select
to authenticated
using (
  public.is_admin()
  or public.is_member_of_org(sponsor_organization_id)
  or public.is_member_of_org(public.org_id_for_event(event_id))
);

drop policy if exists "slot_inquiries_insert_sponsor_org_or_admin" on public.slot_inquiries;
create policy "slot_inquiries_insert_sponsor_org_or_admin"
on public.slot_inquiries
for insert
to authenticated
with check (
  public.is_admin()
  or public.is_member_of_org(sponsor_organization_id)
);

drop policy if exists "slot_inquiries_update_related_or_admin" on public.slot_inquiries;
create policy "slot_inquiries_update_related_or_admin"
on public.slot_inquiries
for update
to authenticated
using (
  public.is_admin()
  or public.is_member_of_org(sponsor_organization_id)
  or public.is_member_of_org(public.org_id_for_event(event_id))
)
with check (
  public.is_admin()
  or public.is_member_of_org(sponsor_organization_id)
  or public.is_member_of_org(public.org_id_for_event(event_id))
);

-- ---------------------------------------------------------
-- Notifications
-- Only recipient or admin
-- ---------------------------------------------------------

drop policy if exists "notifications_select_own_or_admin" on public.notifications;
create policy "notifications_select_own_or_admin"
on public.notifications
for select
to authenticated
using (
  public.is_admin()
  or profile_id = auth.uid()
);

drop policy if exists "notifications_update_own_or_admin" on public.notifications;
create policy "notifications_update_own_or_admin"
on public.notifications
for update
to authenticated
using (
  public.is_admin()
  or profile_id = auth.uid()
)
with check (
  public.is_admin()
  or profile_id = auth.uid()
);

drop policy if exists "notifications_insert_admin_only" on public.notifications;
create policy "notifications_insert_admin_only"
on public.notifications
for insert
to authenticated
with check (
  public.is_admin()
);

-- ---------------------------------------------------------
-- Audit logs
-- Admin only
-- ---------------------------------------------------------

drop policy if exists "audit_logs_select_admin_only" on public.audit_logs;
create policy "audit_logs_select_admin_only"
on public.audit_logs
for select
to authenticated
using (
  public.is_admin()
);

drop policy if exists "audit_logs_insert_admin_only" on public.audit_logs;
create policy "audit_logs_insert_admin_only"
on public.audit_logs
for insert
to authenticated
with check (
  public.is_admin()
);

commit;