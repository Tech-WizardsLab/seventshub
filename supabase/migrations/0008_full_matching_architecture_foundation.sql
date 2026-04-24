begin;

-- 1) Organizer company standardization
alter table public.organization_profiles
  add column if not exists headquarters_country text,
  add column if not exists secondary_sports text[] not null default '{}',
  add column if not exists notable_sponsors text[] not null default '{}',
  add column if not exists certifications_awards text[] not null default '{}',
  add column if not exists brand_positioning text,
  add column if not exists verification_status text not null default 'unverified';

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'organization_profiles_brand_positioning_check'
  ) then
    alter table public.organization_profiles
      add constraint organization_profiles_brand_positioning_check
      check (brand_positioning is null or brand_positioning in ('premium', 'mass', 'niche'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'organization_profiles_verification_status_check'
  ) then
    alter table public.organization_profiles
      add constraint organization_profiles_verification_status_check
      check (verification_status in ('unverified', 'verified', 'premium'));
  end if;
end
$$;

create index if not exists organization_profiles_verification_status_idx
  on public.organization_profiles (verification_status);

create index if not exists organization_profiles_brand_positioning_idx
  on public.organization_profiles (brand_positioning);

-- 2) Organizer aggregated metrics
alter table public.organization_metrics
  add column if not exists active_events_count integer not null default 0,
  add column if not exists total_attendance_12m integer not null default 0,
  add column if not exists total_reach_12m bigint not null default 0,
  add column if not exists avg_attendance_per_event integer,
  add column if not exists avg_reach_per_event integer,
  add column if not exists sponsors_served_count integer not null default 0,
  add column if not exists repeat_sponsor_ratio numeric(5,2),
  add column if not exists countries_operated_count integer not null default 0,
  add column if not exists last_event_date date,
  add column if not exists next_event_date date;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'organization_metrics_extended_nonnegative_check'
  ) then
    alter table public.organization_metrics
      add constraint organization_metrics_extended_nonnegative_check
      check (
        active_events_count >= 0 and
        total_attendance_12m >= 0 and
        total_reach_12m >= 0 and
        coalesce(avg_attendance_per_event, 0) >= 0 and
        coalesce(avg_reach_per_event, 0) >= 0 and
        sponsors_served_count >= 0 and
        countries_operated_count >= 0
      );
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'organization_metrics_repeat_sponsor_ratio_check'
  ) then
    alter table public.organization_metrics
      add constraint organization_metrics_repeat_sponsor_ratio_check
      check (repeat_sponsor_ratio is null or repeat_sponsor_ratio between 0 and 1);
  end if;
end
$$;

create index if not exists organization_metrics_next_event_date_idx
  on public.organization_metrics (next_event_date);

create index if not exists organization_metrics_last_event_date_idx
  on public.organization_metrics (last_event_date);

-- 3, 9, 10, 15) Event core, timeline, taxonomy, soft archive
alter table public.events
  add column if not exists event_category text,
  add column if not exists region text,
  add column if not exists start_date date,
  add column if not exists end_date date,
  add column if not exists seasonality_tag text,
  add column if not exists event_size_band text,
  add column if not exists event_positioning text,
  add column if not exists sponsorship_sales_deadline timestamptz,
  add column if not exists activation_lock_date timestamptz,
  add column if not exists asset_delivery_deadline timestamptz,
  add column if not exists logistics_cutoff_date timestamptz,
  add column if not exists reporting_delivery_date timestamptz,
  add column if not exists sport_family text,
  add column if not exists event_format text,
  add column if not exists audience_level text,
  add column if not exists price_category text,
  add column if not exists activation_depth text,
  add column if not exists sponsorship_complexity text,
  add column if not exists seasonality text,
  add column if not exists archived_at timestamptz;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'events_extended_date_order_check'
  ) then
    alter table public.events
      add constraint events_extended_date_order_check
      check (
        (start_date is null or end_date is null or start_date <= end_date) and
        (sponsorship_sales_deadline is null or starts_at is null or sponsorship_sales_deadline <= starts_at) and
        (activation_lock_date is null or starts_at is null or activation_lock_date <= starts_at) and
        (asset_delivery_deadline is null or starts_at is null or asset_delivery_deadline <= starts_at) and
        (logistics_cutoff_date is null or starts_at is null or logistics_cutoff_date <= starts_at)
      );
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'events_event_size_band_check'
  ) then
    alter table public.events
      add constraint events_event_size_band_check
      check (event_size_band is null or event_size_band in ('small', 'mid', 'large', 'major'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'events_event_positioning_check'
  ) then
    alter table public.events
      add constraint events_event_positioning_check
      check (event_positioning is null or event_positioning in ('premium', 'mass', 'niche'));
  end if;
end
$$;

create index if not exists events_event_category_idx
  on public.events (event_category);

create index if not exists events_region_idx
  on public.events (region);

create index if not exists events_event_size_band_idx
  on public.events (event_size_band);

create index if not exists events_event_positioning_idx
  on public.events (event_positioning);

create index if not exists events_archived_at_idx
  on public.events (archived_at);

create index if not exists events_start_date_idx
  on public.events (start_date);

create index if not exists events_end_date_idx
  on public.events (end_date);

-- 4, 5) Event audience profile + performance metrics
alter table public.event_metrics
  add column if not exists audience_type text,
  add column if not exists audience_segments text[] not null default '{}',
  add column if not exists avg_income_band text,
  add column if not exists audience_interests text[] not null default '{}',
  add column if not exists geographic_split jsonb not null default '{}'::jsonb,
  add column if not exists international_percentage numeric(5,2),
  add column if not exists local_percentage numeric(5,2),
  add column if not exists national_percentage numeric(5,2);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'event_metrics_audience_type_check'
  ) then
    alter table public.event_metrics
      add constraint event_metrics_audience_type_check
      check (audience_type is null or audience_type in ('b2c', 'b2b', 'mixed'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'event_metrics_international_percentage_check'
  ) then
    alter table public.event_metrics
      add constraint event_metrics_international_percentage_check
      check (international_percentage is null or international_percentage between 0 and 100);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'event_metrics_local_percentage_check'
  ) then
    alter table public.event_metrics
      add constraint event_metrics_local_percentage_check
      check (local_percentage is null or local_percentage between 0 and 100);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'event_metrics_national_percentage_check'
  ) then
    alter table public.event_metrics
      add constraint event_metrics_national_percentage_check
      check (national_percentage is null or national_percentage between 0 and 100);
  end if;
end
$$;

create index if not exists event_metrics_audience_type_idx
  on public.event_metrics (audience_type);

create index if not exists event_metrics_avg_income_band_idx
  on public.event_metrics (avg_income_band);

-- 6, 7, 8, 15) Sponsorship package structure + features + estimated metrics + soft archive
alter table public.sponsorship_slots
  add column if not exists tier text,
  add column if not exists package_type text,
  add column if not exists price_range_min numeric(12,2),
  add column if not exists price_range_max numeric(12,2),
  add column if not exists currency text not null default 'EUR',
  add column if not exists exclusivity boolean not null default false,
  add column if not exists is_featured boolean not null default false,
  add column if not exists logo_visibility boolean not null default false,
  add column if not exists booth_presence boolean not null default false,
  add column if not exists sampling_rights boolean not null default false,
  add column if not exists speaking_slot boolean not null default false,
  add column if not exists hospitality_access boolean not null default false,
  add column if not exists networking_access boolean not null default false,
  add column if not exists content_creation boolean not null default false,
  add column if not exists social_media_integration boolean not null default false,
  add column if not exists digital_ads_inclusion boolean not null default false,
  add column if not exists lead_capture_enabled boolean not null default false,
  add column if not exists qr_tracking_enabled boolean not null default false,
  add column if not exists category_exclusivity boolean not null default false,
  add column if not exists custom_activation_possible boolean not null default false,
  add column if not exists estimated_reach integer,
  add column if not exists estimated_impressions integer,
  add column if not exists estimated_engagements integer,
  add column if not exists estimated_leads integer,
  add column if not exists estimated_product_trials integer,
  add column if not exists estimated_content_views integer,
  add column if not exists estimated_meetings integer,
  add column if not exists archived_at timestamptz;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'sponsorship_slots_package_type_check'
  ) then
    alter table public.sponsorship_slots
      add constraint sponsorship_slots_package_type_check
      check (package_type is null or package_type in ('branding', 'activation', 'hybrid'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'sponsorship_slots_tier_check'
  ) then
    alter table public.sponsorship_slots
      add constraint sponsorship_slots_tier_check
      check (tier is null or tier in ('bronze', 'silver', 'gold', 'title', 'platinum', 'custom'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'sponsorship_slots_price_range_check'
  ) then
    alter table public.sponsorship_slots
      add constraint sponsorship_slots_price_range_check
      check (
        (price_range_min is null or price_range_min >= 0) and
        (price_range_max is null or price_range_max >= 0) and
        (price_range_min is null or price_range_max is null or price_range_min <= price_range_max)
      );
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'sponsorship_slots_estimates_nonnegative_check'
  ) then
    alter table public.sponsorship_slots
      add constraint sponsorship_slots_estimates_nonnegative_check
      check (
        coalesce(estimated_reach, 0) >= 0 and
        coalesce(estimated_impressions, 0) >= 0 and
        coalesce(estimated_engagements, 0) >= 0 and
        coalesce(estimated_leads, 0) >= 0 and
        coalesce(estimated_product_trials, 0) >= 0 and
        coalesce(estimated_content_views, 0) >= 0 and
        coalesce(estimated_meetings, 0) >= 0
      );
  end if;
end
$$;

create index if not exists sponsorship_slots_tier_idx
  on public.sponsorship_slots (tier);

create index if not exists sponsorship_slots_package_type_idx
  on public.sponsorship_slots (package_type);

create index if not exists sponsorship_slots_archived_at_idx
  on public.sponsorship_slots (archived_at);

create index if not exists sponsorship_slots_is_featured_idx
  on public.sponsorship_slots (is_featured);

create index if not exists sponsorship_slots_exclusivity_idx
  on public.sponsorship_slots (exclusivity);

-- 11) Sponsor profile extension
alter table public.sponsor_preferences
  add column if not exists industries text[] not null default '{}',
  add column if not exists target_audience_types text[] not null default '{}',
  add column if not exists kpi_priorities text[] not null default '{}',
  add column if not exists brand_positioning text;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'sponsor_preferences_brand_positioning_check'
  ) then
    alter table public.sponsor_preferences
      add constraint sponsor_preferences_brand_positioning_check
      check (brand_positioning is null or brand_positioning in ('premium', 'mass', 'niche'));
  end if;
end
$$;

create index if not exists sponsor_preferences_brand_positioning_idx
  on public.sponsor_preferences (brand_positioning);

-- 12) Extend matching input structure
alter table public.sponsor_recommendation_item_matching_inputs
  add column if not exists event_start_date date,
  add column if not exists sponsorship_sales_deadline date,
  add column if not exists activation_lock_date date,
  add column if not exists asset_delivery_deadline date,
  add column if not exists logistics_cutoff_date date,
  add column if not exists is_timeline_feasible boolean,
  add column if not exists timeline_days_buffer integer,
  add column if not exists has_activation_inventory boolean,
  add column if not exists activation_signal_strength numeric(5,2),
  add column if not exists sponsor_budget_mid_eur numeric(12,2),
  add column if not exists package_price_min_eur numeric(12,2),
  add column if not exists package_price_max_eur numeric(12,2),
  add column if not exists budget_compatibility_ratio numeric(6,4);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'sponsor_recommendation_item_matching_inputs_buffer_check'
  ) then
    alter table public.sponsor_recommendation_item_matching_inputs
      add constraint sponsor_recommendation_item_matching_inputs_buffer_check
      check (timeline_days_buffer is null or timeline_days_buffer between -3650 and 3650);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'sponsor_recommendation_item_matching_inputs_activation_signal_strength_check'
  ) then
    alter table public.sponsor_recommendation_item_matching_inputs
      add constraint sponsor_recommendation_item_matching_inputs_activation_signal_strength_check
      check (activation_signal_strength is null or activation_signal_strength between 0 and 100);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'sponsor_recommendation_item_matching_inputs_budget_compatibility_ratio_check'
  ) then
    alter table public.sponsor_recommendation_item_matching_inputs
      add constraint sponsor_recommendation_item_matching_inputs_budget_compatibility_ratio_check
      check (budget_compatibility_ratio is null or budget_compatibility_ratio between 0 and 1);
  end if;
end
$$;

create index if not exists sponsor_recommendation_item_matching_inputs_timeline_feasible_idx
  on public.sponsor_recommendation_item_matching_inputs (is_timeline_feasible);

create index if not exists sponsor_recommendation_item_matching_inputs_budget_ratio_idx
  on public.sponsor_recommendation_item_matching_inputs (budget_compatibility_ratio);

-- 13) Extend derived scores
alter table public.sponsor_recommendation_item_derived_scores
  add column if not exists brand_fit_score numeric(5,2),
  add column if not exists geographic_fit_score numeric(5,2),
  add column if not exists activation_fit_score numeric(5,2),
  add column if not exists timing_feasibility_score numeric(5,2),
  add column if not exists composite_score numeric(5,2);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'sponsor_recommendation_item_derived_scores_brand_fit_range'
  ) then
    alter table public.sponsor_recommendation_item_derived_scores
      add constraint sponsor_recommendation_item_derived_scores_brand_fit_range
      check (brand_fit_score is null or brand_fit_score between 0 and 100);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'sponsor_recommendation_item_derived_scores_geographic_fit_range'
  ) then
    alter table public.sponsor_recommendation_item_derived_scores
      add constraint sponsor_recommendation_item_derived_scores_geographic_fit_range
      check (geographic_fit_score is null or geographic_fit_score between 0 and 100);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'sponsor_recommendation_item_derived_scores_activation_fit_range'
  ) then
    alter table public.sponsor_recommendation_item_derived_scores
      add constraint sponsor_recommendation_item_derived_scores_activation_fit_range
      check (activation_fit_score is null or activation_fit_score between 0 and 100);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'sponsor_recommendation_item_derived_scores_timing_feasibility_range'
  ) then
    alter table public.sponsor_recommendation_item_derived_scores
      add constraint sponsor_recommendation_item_derived_scores_timing_feasibility_range
      check (timing_feasibility_score is null or timing_feasibility_score between 0 and 100);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'sponsor_recommendation_item_derived_scores_composite_score_range'
  ) then
    alter table public.sponsor_recommendation_item_derived_scores
      add constraint sponsor_recommendation_item_derived_scores_composite_score_range
      check (composite_score is null or composite_score between 0 and 100);
  end if;
end
$$;

create index if not exists sponsor_recommendation_item_derived_scores_composite_score_idx
  on public.sponsor_recommendation_item_derived_scores (composite_score desc, computed_at desc);

create index if not exists sponsor_recommendation_item_derived_scores_timing_fit_idx
  on public.sponsor_recommendation_item_derived_scores (timing_feasibility_score desc);

-- 15) soft archive on organizations
alter table public.organizations
  add column if not exists archived_at timestamptz;

create index if not exists organizations_archived_at_idx
  on public.organizations (archived_at);

commit;