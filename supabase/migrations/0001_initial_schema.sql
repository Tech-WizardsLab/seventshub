-- =========================================================
-- SEventsHub - Initial Scalable MVP Schema
-- =========================================================
-- Principles:
-- 1. Organization-first architecture
-- 2. Multi-user ready, even if MVP uses shared company login
-- 3. Separate company credibility from event credibility
-- 4. Slot-based inquiry workflow
-- 5. Admin approval before marketplace visibility
-- 6. Future-ready for dashboards, analytics, AI matching, and deal workflows
-- =========================================================

begin;

-- ---------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------
create extension if not exists pgcrypto;

-- ---------------------------------------------------------
-- Enums
-- ---------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'platform_role') then
    create type platform_role as enum ('organizer', 'sponsor', 'admin');
  end if;

  if not exists (select 1 from pg_type where typname = 'organization_type') then
    create type organization_type as enum ('event_organizer', 'sponsor', 'agency', 'other');
  end if;

  if not exists (select 1 from pg_type where typname = 'membership_role') then
    create type membership_role as enum ('owner', 'admin', 'member');
  end if;

  if not exists (select 1 from pg_type where typname = 'entity_status') then
    create type entity_status as enum ('draft', 'pending_review', 'approved', 'rejected', 'archived');
  end if;

  if not exists (select 1 from pg_type where typname = 'slot_type') then
    create type slot_type as enum (
      'title_sponsor',
      'main_sponsor',
      'official_partner',
      'category_exclusive',
      'expo_booth',
      'branding',
      'digital',
      'content',
      'speaking',
      'hospitality',
      'sampling',
      'custom'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'slot_visibility') then
    create type slot_visibility as enum ('public', 'private', 'invite_only');
  end if;

  if not exists (select 1 from pg_type where typname = 'inquiry_status') then
    create type inquiry_status as enum (
      'submitted',
      'under_review',
      'contacted',
      'negotiating',
      'won',
      'lost',
      'withdrawn'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'notification_type') then
    create type notification_type as enum (
      'system',
      'event_submitted',
      'event_approved',
      'event_rejected',
      'slot_inquiry_created',
      'slot_inquiry_updated',
      'admin_alert'
    );
  end if;
end
$$;

-- ---------------------------------------------------------
-- Updated-at trigger helper
-- ---------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------
-- Profiles
-- One row per auth user
-- ---------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  avatar_url text,
  job_title text,
  phone text,
  platform_role platform_role not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

-- ---------------------------------------------------------
-- Organizations
-- Company-level entity
-- ---------------------------------------------------------
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  organization_type organization_type not null,
  legal_name text,
  website_url text,
  logo_url text,
  country text,
  city text,
  description text,
  founded_year integer,
  employee_range text,
  is_active boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint organizations_founded_year_check
    check (founded_year is null or founded_year between 1900 and extract(year from now())::int + 1)
);

create index if not exists organizations_type_idx
  on public.organizations (organization_type);

create index if not exists organizations_name_idx
  on public.organizations (name);

create trigger organizations_set_updated_at
before update on public.organizations
for each row
execute function public.set_updated_at();

-- ---------------------------------------------------------
-- Organization members
-- Multi-user ready, even if MVP uses one account per company
-- ---------------------------------------------------------
create table if not exists public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  membership_role membership_role not null default 'member',
  is_primary_contact boolean not null default false,
  joined_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint organization_members_unique unique (organization_id, profile_id)
);

create index if not exists organization_members_org_idx
  on public.organization_members (organization_id);

create index if not exists organization_members_profile_idx
  on public.organization_members (profile_id);

create trigger organization_members_set_updated_at
before update on public.organization_members
for each row
execute function public.set_updated_at();

-- ---------------------------------------------------------
-- Organization profiles
-- Commercial / credibility profile visible in platform
-- ---------------------------------------------------------
create table if not exists public.organization_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations(id) on delete cascade,
  headline text,
  overview text,
  years_operating integer,
  primary_sports text[] not null default '{}',
  operating_regions text[] not null default '{}',
  notable_partners text[] not null default '{}',
  achievements text[] not null default '{}',
  media_kit_url text,
  deck_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint organization_profiles_years_operating_check
    check (years_operating is null or years_operating between 0 and 200)
);

create trigger organization_profiles_set_updated_at
before update on public.organization_profiles
for each row
execute function public.set_updated_at();

-- ---------------------------------------------------------
-- Organization metrics
-- Key data sponsors care about when judging credibility
-- ---------------------------------------------------------
create table if not exists public.organization_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations(id) on delete cascade,

  total_events_organized integer not null default 0,
  annual_events_count integer not null default 0,
  total_attendance_last_12m integer not null default 0,
  total_social_followers integer not null default 0,
  total_email_subscribers integer not null default 0,
  total_impressions_last_12m bigint not null default 0,
  total_sponsors_served integer not null default 0,
  avg_event_attendance integer,
  avg_event_impressions integer,

  instagram_followers integer not null default 0,
  linkedin_followers integer not null default 0,
  youtube_followers integer not null default 0,
  tiktok_followers integer not null default 0,
  x_followers integer not null default 0,
  facebook_followers integer not null default 0,

  data_confidence_notes text,
  last_verified_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint organization_metrics_nonnegative_check check (
    total_events_organized >= 0 and
    annual_events_count >= 0 and
    total_attendance_last_12m >= 0 and
    total_social_followers >= 0 and
    total_email_subscribers >= 0 and
    total_impressions_last_12m >= 0 and
    total_sponsors_served >= 0 and
    coalesce(avg_event_attendance, 0) >= 0 and
    coalesce(avg_event_impressions, 0) >= 0 and
    instagram_followers >= 0 and
    linkedin_followers >= 0 and
    youtube_followers >= 0 and
    tiktok_followers >= 0 and
    x_followers >= 0 and
    facebook_followers >= 0
  )
);

create trigger organization_metrics_set_updated_at
before update on public.organization_metrics
for each row
execute function public.set_updated_at();

-- ---------------------------------------------------------
-- Sponsor preferences
-- Foundation for discovery + future AI matching
-- ---------------------------------------------------------
create table if not exists public.sponsor_preferences (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations(id) on delete cascade,

  target_sports text[] not null default '{}',
  target_regions text[] not null default '{}',
  target_countries text[] not null default '{}',
  target_audience_tags text[] not null default '{}',
  target_age_ranges text[] not null default '{}',
  preferred_event_sizes text[] not null default '{}',
  preferred_activation_types text[] not null default '{}',

  min_budget_eur numeric(12,2),
  max_budget_eur numeric(12,2),

  is_profile_complete boolean not null default false,
  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint sponsor_preferences_budget_check
    check (
      min_budget_eur is null or min_budget_eur >= 0
    ),
  constraint sponsor_preferences_budget_range_check
    check (
      max_budget_eur is null or max_budget_eur >= 0
    ),
  constraint sponsor_preferences_budget_order_check
    check (
      min_budget_eur is null or
      max_budget_eur is null or
      min_budget_eur <= max_budget_eur
    )
);

create trigger sponsor_preferences_set_updated_at
before update on public.sponsor_preferences
for each row
execute function public.set_updated_at();

-- ---------------------------------------------------------
-- Events
-- Owned by organizer organizations, moderated by admin
-- ---------------------------------------------------------
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,

  name text not null,
  slug text not null unique,
  sport_type text not null,
  category_tags text[] not null default '{}',

  short_description text,
  description text,

  country text,
  city text,
  venue_name text,

  starts_at timestamptz,
  ends_at timestamptz,

  website_url text,
  logo_url text,
  cover_image_url text,

  attendee_capacity integer,
  status entity_status not null default 'draft',
  submitted_at timestamptz,
  approved_at timestamptz,
  approved_by uuid references public.profiles(id) on delete set null,
  rejection_reason text,

  is_featured boolean not null default false,

  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint events_capacity_check
    check (attendee_capacity is null or attendee_capacity >= 0),
  constraint events_date_order_check
    check (
      starts_at is null or
      ends_at is null or
      starts_at <= ends_at
    )
);

create index if not exists events_organization_idx
  on public.events (organization_id);

create index if not exists events_status_idx
  on public.events (status);

create index if not exists events_sport_type_idx
  on public.events (sport_type);

create index if not exists events_starts_at_idx
  on public.events (starts_at);

create trigger events_set_updated_at
before update on public.events
for each row
execute function public.set_updated_at();

-- ---------------------------------------------------------
-- Event metrics
-- Structured data for dashboards and sponsor decision-making
-- ---------------------------------------------------------
create table if not exists public.event_metrics (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null unique references public.events(id) on delete cascade,

  expected_attendance integer not null default 0,
  actual_attendance integer,
  exhibitors_count integer not null default 0,
  speakers_count integer not null default 0,
  participating_brands_count integer not null default 0,

  email_reach integer not null default 0,
  website_visits integer not null default 0,
  app_users integer not null default 0,

  social_impressions bigint not null default 0,
  social_engagements integer not null default 0,
  livestream_views integer not null default 0,
  video_views integer not null default 0,

  press_mentions integer not null default 0,
  media_reach integer not null default 0,

  audience_b2b_percentage numeric(5,2),
  audience_b2c_percentage numeric(5,2),

  audience_tags text[] not null default '{}',
  industry_tags text[] not null default '{}',
  demographic_summary text,
  geographic_summary text,
  past_sponsors text[] not null default '{}',

  notes text,
  last_verified_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint event_metrics_nonnegative_check check (
    expected_attendance >= 0 and
    coalesce(actual_attendance, 0) >= 0 and
    exhibitors_count >= 0 and
    speakers_count >= 0 and
    participating_brands_count >= 0 and
    email_reach >= 0 and
    website_visits >= 0 and
    app_users >= 0 and
    social_impressions >= 0 and
    social_engagements >= 0 and
    livestream_views >= 0 and
    video_views >= 0 and
    press_mentions >= 0 and
    media_reach >= 0
  ),
  constraint event_metrics_audience_b2b_check
    check (audience_b2b_percentage is null or (audience_b2b_percentage >= 0 and audience_b2b_percentage <= 100)),
  constraint event_metrics_audience_b2c_check
    check (audience_b2c_percentage is null or (audience_b2c_percentage >= 0 and audience_b2c_percentage <= 100))
);

create trigger event_metrics_set_updated_at
before update on public.event_metrics
for each row
execute function public.set_updated_at();

-- ---------------------------------------------------------
-- Sponsorship slots
-- Direct object of sponsor inquiry
-- ---------------------------------------------------------
create table if not exists public.sponsorship_slots (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,

  title text not null,
  slug text not null,
  slot_type slot_type not null default 'custom',
  tier_name text,
  description text,
  benefits text[] not null default '{}',

  inventory_count integer not null default 1,
  remaining_inventory integer not null default 1,

  list_price_eur numeric(12,2),
  minimum_price_eur numeric(12,2),

  visibility slot_visibility not null default 'public',
  is_active boolean not null default true,

  deliverables_summary text,
  activation_summary text,
  audience_fit_tags text[] not null default '{}',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint sponsorship_slots_event_slug_unique unique (event_id, slug),
  constraint sponsorship_slots_inventory_check check (
    inventory_count >= 0 and
    remaining_inventory >= 0 and
    remaining_inventory <= inventory_count
  ),
  constraint sponsorship_slots_price_check check (
    list_price_eur is null or list_price_eur >= 0
  ),
  constraint sponsorship_slots_minimum_price_check check (
    minimum_price_eur is null or minimum_price_eur >= 0
  ),
  constraint sponsorship_slots_price_order_check check (
    minimum_price_eur is null or
    list_price_eur is null or
    minimum_price_eur <= list_price_eur
  )
);

create index if not exists sponsorship_slots_event_idx
  on public.sponsorship_slots (event_id);

create index if not exists sponsorship_slots_type_idx
  on public.sponsorship_slots (slot_type);

create index if not exists sponsorship_slots_visibility_idx
  on public.sponsorship_slots (visibility);

create trigger sponsorship_slots_set_updated_at
before update on public.sponsorship_slots
for each row
execute function public.set_updated_at();

-- ---------------------------------------------------------
-- Saved events
-- Useful for sponsor-side discovery and shortlist workflow
-- ---------------------------------------------------------
create table if not exists public.saved_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  created_at timestamptz not null default now(),

  constraint saved_events_unique unique (organization_id, event_id)
);

create index if not exists saved_events_org_idx
  on public.saved_events (organization_id);

create index if not exists saved_events_event_idx
  on public.saved_events (event_id);

-- ---------------------------------------------------------
-- Slot inquiries
-- Sponsor expresses interest in a specific sponsorship slot
-- ---------------------------------------------------------
create table if not exists public.slot_inquiries (
  id uuid primary key default gen_random_uuid(),

  sponsor_organization_id uuid not null references public.organizations(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  sponsorship_slot_id uuid not null references public.sponsorship_slots(id) on delete cascade,

  submitted_by uuid references public.profiles(id) on delete set null,

  status inquiry_status not null default 'submitted',
  message text,
  proposed_budget_eur numeric(12,2),
  sponsor_goals text[] not null default '{}',
  internal_notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint slot_inquiries_budget_check
    check (proposed_budget_eur is null or proposed_budget_eur >= 0)
);

create index if not exists slot_inquiries_sponsor_org_idx
  on public.slot_inquiries (sponsor_organization_id);

create index if not exists slot_inquiries_event_idx
  on public.slot_inquiries (event_id);

create index if not exists slot_inquiries_slot_idx
  on public.slot_inquiries (sponsorship_slot_id);

create index if not exists slot_inquiries_status_idx
  on public.slot_inquiries (status);

create trigger slot_inquiries_set_updated_at
before update on public.slot_inquiries
for each row
execute function public.set_updated_at();

-- ---------------------------------------------------------
-- Notifications
-- ---------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  type notification_type not null,
  title text not null,
  body text,
  link_url text,
  is_read boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists notifications_profile_idx
  on public.notifications (profile_id);

create index if not exists notifications_is_read_idx
  on public.notifications (is_read);

-- ---------------------------------------------------------
-- Audit logs
-- Useful for admin visibility and future compliance/workflows
-- ---------------------------------------------------------
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_profile_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_actor_idx
  on public.audit_logs (actor_profile_id);

create index if not exists audit_logs_entity_idx
  on public.audit_logs (entity_type, entity_id);

-- ---------------------------------------------------------
-- Row Level Security
-- Enabled now; policies come in next migration
-- ---------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.organization_profiles enable row level security;
alter table public.organization_metrics enable row level security;
alter table public.sponsor_preferences enable row level security;
alter table public.events enable row level security;
alter table public.event_metrics enable row level security;
alter table public.sponsorship_slots enable row level security;
alter table public.saved_events enable row level security;
alter table public.slot_inquiries enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;

commit;