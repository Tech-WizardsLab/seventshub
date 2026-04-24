export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type PlatformRole = "organizer" | "sponsor" | "admin";

export type OrganizationType =
  | "event_organizer"
  | "sponsor"
  | "agency"
  | "other";

export type MembershipRole = "owner" | "admin" | "member";

export type EntityStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "rejected"
  | "archived";

export type SlotType =
  | "title_sponsor"
  | "main_sponsor"
  | "official_partner"
  | "category_exclusive"
  | "expo_booth"
  | "branding"
  | "digital"
  | "content"
  | "speaking"
  | "hospitality"
  | "sampling"
  | "custom";

export type SlotVisibility = "public" | "private" | "invite_only";

export type InquiryStatus =
  | "submitted"
  | "under_review"
  | "contacted"
  | "negotiating"
  | "won"
  | "lost"
  | "withdrawn";

export type NotificationType =
  | "system"
  | "event_submitted"
  | "event_approved"
  | "event_rejected"
  | "slot_inquiry_created"
  | "slot_inquiry_updated"
  | "admin_alert";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          job_title: string | null;
          phone: string | null;
          platform_role: PlatformRole;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          job_title?: string | null;
          phone?: string | null;
          platform_role: PlatformRole;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          job_title?: string | null;
          phone?: string | null;
          platform_role?: PlatformRole;
          is_active?: boolean;
          updated_at?: string;
        };
      };

      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          organization_type: OrganizationType;
          legal_name: string | null;
          website_url: string | null;
          logo_url: string | null;
          country: string | null;
          city: string | null;
          description: string | null;
          founded_year: number | null;
          employee_range: string | null;
          is_active: boolean;
          archived_at: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          organization_type: OrganizationType;
          legal_name?: string | null;
          website_url?: string | null;
          logo_url?: string | null;
          country?: string | null;
          city?: string | null;
          description?: string | null;
          founded_year?: number | null;
          employee_range?: string | null;
          is_active?: boolean;
          archived_at?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          organization_type?: OrganizationType;
          legal_name?: string | null;
          website_url?: string | null;
          logo_url?: string | null;
          country?: string | null;
          city?: string | null;
          description?: string | null;
          founded_year?: number | null;
          employee_range?: string | null;
          is_active?: boolean;
          archived_at?: string | null;
          created_by?: string | null;
          updated_at?: string;
        };
      };

      organization_members: {
        Row: {
          id: string;
          organization_id: string;
          profile_id: string;
          membership_role: MembershipRole;
          is_primary_contact: boolean;
          joined_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          profile_id: string;
          membership_role?: MembershipRole;
          is_primary_contact?: boolean;
          joined_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          membership_role?: MembershipRole;
          is_primary_contact?: boolean;
          updated_at?: string;
        };
      };

      organization_profiles: {
        Row: {
          id: string;
          organization_id: string;
          headline: string | null;
          overview: string | null;
          years_operating: number | null;
          headquarters_country: string | null;
          operating_regions: string[];
          primary_sports: string[];
          secondary_sports: string[];
          notable_partners: string[];
          notable_sponsors: string[];
          achievements: string[];
          certifications_awards: string[];
          brand_positioning: string | null;
          verification_status: string;
          media_kit_url: string | null;
          deck_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          headline?: string | null;
          overview?: string | null;
          years_operating?: number | null;
          headquarters_country?: string | null;
          operating_regions?: string[];
          primary_sports?: string[];
          secondary_sports?: string[];
          notable_partners?: string[];
          notable_sponsors?: string[];
          achievements?: string[];
          certifications_awards?: string[];
          brand_positioning?: string | null;
          verification_status?: string;
          media_kit_url?: string | null;
          deck_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          headline?: string | null;
          overview?: string | null;
          years_operating?: number | null;
          headquarters_country?: string | null;
          operating_regions?: string[];
          primary_sports?: string[];
          secondary_sports?: string[];
          notable_partners?: string[];
          notable_sponsors?: string[];
          achievements?: string[];
          certifications_awards?: string[];
          brand_positioning?: string | null;
          verification_status?: string;
          media_kit_url?: string | null;
          deck_url?: string | null;
          updated_at?: string;
        };
      };

      organization_metrics: {
        Row: {
          id: string;
          organization_id: string;
          total_events_organized: number;
          annual_events_count: number;
          total_attendance_last_12m: number;
          total_social_followers: number;
          total_email_subscribers: number;
          total_impressions_last_12m: number;
          total_sponsors_served: number;
          avg_event_attendance: number | null;
          avg_event_impressions: number | null;
          active_events_count: number;
          total_attendance_12m: number;
          total_reach_12m: number;
          avg_attendance_per_event: number | null;
          avg_reach_per_event: number | null;
          sponsors_served_count: number;
          repeat_sponsor_ratio: number | null;
          countries_operated_count: number;
          last_event_date: string | null;
          next_event_date: string | null;
          instagram_followers: number;
          linkedin_followers: number;
          youtube_followers: number;
          tiktok_followers: number;
          x_followers: number;
          facebook_followers: number;
          data_confidence_notes: string | null;
          last_verified_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          total_events_organized?: number;
          annual_events_count?: number;
          total_attendance_last_12m?: number;
          total_social_followers?: number;
          total_email_subscribers?: number;
          total_impressions_last_12m?: number;
          total_sponsors_served?: number;
          avg_event_attendance?: number | null;
          avg_event_impressions?: number | null;
          active_events_count?: number;
          total_attendance_12m?: number;
          total_reach_12m?: number;
          avg_attendance_per_event?: number | null;
          avg_reach_per_event?: number | null;
          sponsors_served_count?: number;
          repeat_sponsor_ratio?: number | null;
          countries_operated_count?: number;
          last_event_date?: string | null;
          next_event_date?: string | null;
          instagram_followers?: number;
          linkedin_followers?: number;
          youtube_followers?: number;
          tiktok_followers?: number;
          x_followers?: number;
          facebook_followers?: number;
          data_confidence_notes?: string | null;
          last_verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          total_events_organized?: number;
          annual_events_count?: number;
          total_attendance_last_12m?: number;
          total_social_followers?: number;
          total_email_subscribers?: number;
          total_impressions_last_12m?: number;
          total_sponsors_served?: number;
          avg_event_attendance?: number | null;
          avg_event_impressions?: number | null;
          active_events_count?: number;
          total_attendance_12m?: number;
          total_reach_12m?: number;
          avg_attendance_per_event?: number | null;
          avg_reach_per_event?: number | null;
          sponsors_served_count?: number;
          repeat_sponsor_ratio?: number | null;
          countries_operated_count?: number;
          last_event_date?: string | null;
          next_event_date?: string | null;
          instagram_followers?: number;
          linkedin_followers?: number;
          youtube_followers?: number;
          tiktok_followers?: number;
          x_followers?: number;
          facebook_followers?: number;
          data_confidence_notes?: string | null;
          last_verified_at?: string | null;
          updated_at?: string;
        };
      };

      sponsor_preferences: {
        Row: {
          id: string;
          organization_id: string;
          target_sports: string[];
          target_regions: string[];
          target_countries: string[];
          target_audience_tags: string[];
          target_audience_types: string[];
          target_age_ranges: string[];
          preferred_event_sizes: string[];
          preferred_activation_types: string[];
          industries: string[];
          kpi_priorities: string[];
          brand_positioning: string | null;
          min_budget_eur: number | null;
          max_budget_eur: number | null;
          is_profile_complete: boolean;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          target_sports?: string[];
          target_regions?: string[];
          target_countries?: string[];
          target_audience_tags?: string[];
          target_audience_types?: string[];
          target_age_ranges?: string[];
          preferred_event_sizes?: string[];
          preferred_activation_types?: string[];
          industries?: string[];
          kpi_priorities?: string[];
          brand_positioning?: string | null;
          min_budget_eur?: number | null;
          max_budget_eur?: number | null;
          is_profile_complete?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          target_sports?: string[];
          target_regions?: string[];
          target_countries?: string[];
          target_audience_tags?: string[];
          target_audience_types?: string[];
          target_age_ranges?: string[];
          preferred_event_sizes?: string[];
          preferred_activation_types?: string[];
          industries?: string[];
          kpi_priorities?: string[];
          brand_positioning?: string | null;
          min_budget_eur?: number | null;
          max_budget_eur?: number | null;
          is_profile_complete?: boolean;
          notes?: string | null;
          updated_at?: string;
        };
      };


      sponsor_recommendation_sets: {
        Row: {
          id: string;
          organization_id: string;
          brief_id: string | null;
          title: string;
          status: string;
          recommended_budget_eur: number | null;
          projected_total_reach: number | null;
          projected_attendance_exposure: number | null;
          projected_touchpoints: number | null;
          markets_covered: string[];
          average_fit_score: number | null;
          analyst_summary: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          brief_id?: string | null;
          title?: string;
          status?: string;
          recommended_budget_eur?: number | null;
          projected_total_reach?: number | null;
          projected_attendance_exposure?: number | null;
          projected_touchpoints?: number | null;
          markets_covered?: string[];
          average_fit_score?: number | null;
          analyst_summary?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          brief_id?: string | null;
          title?: string;
          status?: string;
          recommended_budget_eur?: number | null;
          projected_total_reach?: number | null;
          projected_attendance_exposure?: number | null;
          projected_touchpoints?: number | null;
          markets_covered?: string[];
          average_fit_score?: number | null;
          analyst_summary?: string | null;
          created_by?: string | null;
          updated_at?: string;
        };
      };

      sponsor_recommendation_items: {
        Row: {
          id: string;
          recommendation_set_id: string;
          event_id: string | null;
          selected_package: string | null;
          fit_score: number | null;
          projected_reach: number | null;
          projected_attendance: number | null;
          projected_touchpoints: number | null;
          plan_contribution: string | null;
          recommendation_status: string;
          why_it_fits: string | null;
          audience_profile: string | null;
          organizer_context: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          recommendation_set_id: string;
          event_id?: string | null;
          selected_package?: string | null;
          fit_score?: number | null;
          projected_reach?: number | null;
          projected_attendance?: number | null;
          projected_touchpoints?: number | null;
          plan_contribution?: string | null;
          recommendation_status?: string;
          why_it_fits?: string | null;
          audience_profile?: string | null;
          organizer_context?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          event_id?: string | null;
          selected_package?: string | null;
          fit_score?: number | null;
          projected_reach?: number | null;
          projected_attendance?: number | null;
          projected_touchpoints?: number | null;
          plan_contribution?: string | null;
          recommendation_status?: string;
          why_it_fits?: string | null;
          audience_profile?: string | null;
          organizer_context?: string | null;
          updated_at?: string;
        };
      };

      sponsor_recommendation_item_matching_inputs: {
        Row: {
          id: string;
          recommendation_item_id: string;
          source_recommendation_set_id: string;
          sponsor_organization_id: string;
          source_brief_id: string | null;
          sponsor_markets: string[];
          sponsor_target_sports: string[];
          sponsor_audience_tags: string[];
          sponsor_activation_preferences: string[];
          sponsor_budget_min_eur: number | null;
          sponsor_budget_max_eur: number | null;
          sponsor_budget_mid_eur: number | null;
          event_market_country: string | null;
          event_market_city: string | null;
          event_sport_type: string | null;
          event_category_tags: string[];
          event_expected_attendance: number | null;
          event_social_impressions: number | null;
          event_demographic_summary: string | null;
          event_geographic_summary: string | null;
          event_start_date: string | null;
          sponsorship_sales_deadline: string | null;
          activation_lock_date: string | null;
          asset_delivery_deadline: string | null;
          logistics_cutoff_date: string | null;
          is_timeline_feasible: boolean | null;
          timeline_days_buffer: number | null;
          has_activation_inventory: boolean | null;
          activation_signal_strength: number | null;
          package_price_min_eur: number | null;
          package_price_max_eur: number | null;
          budget_compatibility_ratio: number | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          recommendation_item_id: string;
          source_recommendation_set_id: string;
          sponsor_organization_id: string;
          source_brief_id?: string | null;
          sponsor_markets?: string[];
          sponsor_target_sports?: string[];
          sponsor_audience_tags?: string[];
          sponsor_activation_preferences?: string[];
          sponsor_budget_min_eur?: number | null;
          sponsor_budget_max_eur?: number | null;
          sponsor_budget_mid_eur?: number | null;
          event_market_country?: string | null;
          event_market_city?: string | null;
          event_sport_type?: string | null;
          event_category_tags?: string[];
          event_expected_attendance?: number | null;
          event_social_impressions?: number | null;
          event_demographic_summary?: string | null;
          event_geographic_summary?: string | null;
          event_start_date?: string | null;
          sponsorship_sales_deadline?: string | null;
          activation_lock_date?: string | null;
          asset_delivery_deadline?: string | null;
          logistics_cutoff_date?: string | null;
          is_timeline_feasible?: boolean | null;
          timeline_days_buffer?: number | null;
          has_activation_inventory?: boolean | null;
          activation_signal_strength?: number | null;
          package_price_min_eur?: number | null;
          package_price_max_eur?: number | null;
          budget_compatibility_ratio?: number | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          recommendation_item_id?: string;
          source_recommendation_set_id?: string;
          sponsor_organization_id?: string;
          source_brief_id?: string | null;
          sponsor_markets?: string[];
          sponsor_target_sports?: string[];
          sponsor_audience_tags?: string[];
          sponsor_activation_preferences?: string[];
          sponsor_budget_min_eur?: number | null;
          sponsor_budget_max_eur?: number | null;
          sponsor_budget_mid_eur?: number | null;
          event_market_country?: string | null;
          event_market_city?: string | null;
          event_sport_type?: string | null;
          event_category_tags?: string[];
          event_expected_attendance?: number | null;
          event_social_impressions?: number | null;
          event_demographic_summary?: string | null;
          event_geographic_summary?: string | null;
          event_start_date?: string | null;
          sponsorship_sales_deadline?: string | null;
          activation_lock_date?: string | null;
          asset_delivery_deadline?: string | null;
          logistics_cutoff_date?: string | null;
          is_timeline_feasible?: boolean | null;
          timeline_days_buffer?: number | null;
          has_activation_inventory?: boolean | null;
          activation_signal_strength?: number | null;
          package_price_min_eur?: number | null;
          package_price_max_eur?: number | null;
          budget_compatibility_ratio?: number | null;
          metadata?: Json;
          updated_at?: string;
        };
      };

      sponsor_recommendation_item_derived_scores: {
        Row: {
          id: string;
          recommendation_item_id: string;
          recommendation_set_id: string;
          score_version: number;
          market_fit_score: number | null;
          audience_fit_score: number | null;
          sport_fit_score: number | null;
          budget_fit_score: number | null;
          brand_safety_score: number | null;
          inventory_quality_score: number | null;
          brand_fit_score: number | null;
          geographic_fit_score: number | null;
          activation_fit_score: number | null;
          timing_feasibility_score: number | null;
          composite_fit_score: number | null;
          composite_score: number | null;
          confidence_score: number | null;
          scoring_inputs: Json;
          scoring_notes: string | null;
          computed_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          recommendation_item_id: string;
          recommendation_set_id: string;
          score_version?: number;
          market_fit_score?: number | null;
          audience_fit_score?: number | null;
          sport_fit_score?: number | null;
          budget_fit_score?: number | null;
          brand_safety_score?: number | null;
          inventory_quality_score?: number | null;
          brand_fit_score?: number | null;
          geographic_fit_score?: number | null;
          activation_fit_score?: number | null;
          timing_feasibility_score?: number | null;
          composite_fit_score?: number | null;
          composite_score?: number | null;
          confidence_score?: number | null;
          scoring_inputs?: Json;
          scoring_notes?: string | null;
          computed_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          recommendation_item_id?: string;
          recommendation_set_id?: string;
          score_version?: number;
          market_fit_score?: number | null;
          audience_fit_score?: number | null;
          sport_fit_score?: number | null;
          budget_fit_score?: number | null;
          brand_safety_score?: number | null;
          inventory_quality_score?: number | null;
          brand_fit_score?: number | null;
          geographic_fit_score?: number | null;
          activation_fit_score?: number | null;
          timing_feasibility_score?: number | null;
          composite_fit_score?: number | null;
          composite_score?: number | null;
          confidence_score?: number | null;
          scoring_inputs?: Json;
          scoring_notes?: string | null;
          computed_at?: string;
          updated_at?: string;
        };
      };

      sponsor_onboarding_briefs: {
        Row: {
          id: string;
          organization_id: string;
          submitted_by: string;
          version: number;
          strategy_status: string;
          submitted_at: string;
          briefing_snapshot: Json;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          submitted_by: string;
          version?: number;
          strategy_status?: string;
          submitted_at?: string;
          briefing_snapshot: Json;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          submitted_by?: string;
          version?: number;
          strategy_status?: string;
          submitted_at?: string;
          briefing_snapshot?: Json;
          notes?: string | null;
          updated_at?: string;
        };
      };

      events: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          slug: string;
          sport_type: string;
          event_category: string | null;
          category_tags: string[];
          short_description: string | null;
          description: string | null;
          country: string | null;
          city: string | null;
          region: string | null;
          venue_name: string | null;
          starts_at: string | null;
          ends_at: string | null;
          start_date: string | null;
          end_date: string | null;
          seasonality_tag: string | null;
          event_size_band: string | null;
          event_positioning: string | null;
          sponsorship_sales_deadline: string | null;
          activation_lock_date: string | null;
          asset_delivery_deadline: string | null;
          logistics_cutoff_date: string | null;
          reporting_delivery_date: string | null;
          sport_family: string | null;
          event_format: string | null;
          audience_level: string | null;
          price_category: string | null;
          activation_depth: string | null;
          sponsorship_complexity: string | null;
          seasonality: string | null;
          website_url: string | null;
          logo_url: string | null;
          cover_image_url: string | null;
          attendee_capacity: number | null;
          status: EntityStatus;
          submitted_at: string | null;
          approved_at: string | null;
          approved_by: string | null;
          rejection_reason: string | null;
          is_featured: boolean;
          archived_at: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          slug: string;
          sport_type: string;
          event_category?: string | null;
          category_tags?: string[];
          short_description?: string | null;
          description?: string | null;
          country?: string | null;
          city?: string | null;
          region?: string | null;
          venue_name?: string | null;
          starts_at?: string | null;
          ends_at?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          seasonality_tag?: string | null;
          event_size_band?: string | null;
          event_positioning?: string | null;
          sponsorship_sales_deadline?: string | null;
          activation_lock_date?: string | null;
          asset_delivery_deadline?: string | null;
          logistics_cutoff_date?: string | null;
          reporting_delivery_date?: string | null;
          sport_family?: string | null;
          event_format?: string | null;
          audience_level?: string | null;
          price_category?: string | null;
          activation_depth?: string | null;
          sponsorship_complexity?: string | null;
          seasonality?: string | null;
          website_url?: string | null;
          logo_url?: string | null;
          cover_image_url?: string | null;
          attendee_capacity?: number | null;
          status?: EntityStatus;
          submitted_at?: string | null;
          approved_at?: string | null;
          approved_by?: string | null;
          rejection_reason?: string | null;
          is_featured?: boolean;
          archived_at?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          organization_id?: string;
          name?: string;
          slug?: string;
          sport_type?: string;
          event_category?: string | null;
          category_tags?: string[];
          short_description?: string | null;
          description?: string | null;
          country?: string | null;
          city?: string | null;
          region?: string | null;
          venue_name?: string | null;
          starts_at?: string | null;
          ends_at?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          seasonality_tag?: string | null;
          event_size_band?: string | null;
          event_positioning?: string | null;
          sponsorship_sales_deadline?: string | null;
          activation_lock_date?: string | null;
          asset_delivery_deadline?: string | null;
          logistics_cutoff_date?: string | null;
          reporting_delivery_date?: string | null;
          sport_family?: string | null;
          event_format?: string | null;
          audience_level?: string | null;
          price_category?: string | null;
          activation_depth?: string | null;
          sponsorship_complexity?: string | null;
          seasonality?: string | null;
          website_url?: string | null;
          logo_url?: string | null;
          cover_image_url?: string | null;
          attendee_capacity?: number | null;
          status?: EntityStatus;
          submitted_at?: string | null;
          approved_at?: string | null;
          approved_by?: string | null;
          rejection_reason?: string | null;
          is_featured?: boolean;
          archived_at?: string | null;
          created_by?: string | null;
          updated_at?: string;
        };
      };

      event_metrics: {
        Row: {
          id: string;
          event_id: string;
          expected_attendance: number;
          actual_attendance: number | null;
          exhibitors_count: number;
          speakers_count: number;
          participating_brands_count: number;
          email_reach: number;
          website_visits: number;
          app_users: number;
          social_impressions: number;
          social_engagements: number;
          livestream_views: number;
          video_views: number;
          press_mentions: number;
          media_reach: number;
          audience_type: string | null;
          audience_segments: string[];
          audience_b2b_percentage: number | null;
          audience_b2c_percentage: number | null;
          avg_income_band: string | null;
          audience_interests: string[];
          geographic_split: Json;
          international_percentage: number | null;
          local_percentage: number | null;
          national_percentage: number | null;
          audience_tags: string[];
          industry_tags: string[];
          demographic_summary: string | null;
          geographic_summary: string | null;
          past_sponsors: string[];
          notes: string | null;
          last_verified_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          expected_attendance?: number;
          actual_attendance?: number | null;
          exhibitors_count?: number;
          speakers_count?: number;
          participating_brands_count?: number;
          email_reach?: number;
          website_visits?: number;
          app_users?: number;
          social_impressions?: number;
          social_engagements?: number;
          livestream_views?: number;
          video_views?: number;
          press_mentions?: number;
          media_reach?: number;
          audience_type?: string | null;
          audience_segments?: string[];
          audience_b2b_percentage?: number | null;
          audience_b2c_percentage?: number | null;
          avg_income_band?: string | null;
          audience_interests?: string[];
          geographic_split?: Json;
          international_percentage?: number | null;
          local_percentage?: number | null;
          national_percentage?: number | null;
          audience_tags?: string[];
          industry_tags?: string[];
          demographic_summary?: string | null;
          geographic_summary?: string | null;
          past_sponsors?: string[];
          notes?: string | null;
          last_verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          expected_attendance?: number;
          actual_attendance?: number | null;
          exhibitors_count?: number;
          speakers_count?: number;
          participating_brands_count?: number;
          email_reach?: number;
          website_visits?: number;
          app_users?: number;
          social_impressions?: number;
          social_engagements?: number;
          livestream_views?: number;
          video_views?: number;
          press_mentions?: number;
          media_reach?: number;
          audience_type?: string | null;
          audience_segments?: string[];
          audience_b2b_percentage?: number | null;
          audience_b2c_percentage?: number | null;
          avg_income_band?: string | null;
          audience_interests?: string[];
          geographic_split?: Json;
          international_percentage?: number | null;
          local_percentage?: number | null;
          national_percentage?: number | null;
          audience_tags?: string[];
          industry_tags?: string[];
          demographic_summary?: string | null;
          geographic_summary?: string | null;
          past_sponsors?: string[];
          notes?: string | null;
          last_verified_at?: string | null;
          updated_at?: string;
        };
      };

      sponsorship_slots: {
        Row: {
          id: string;
          event_id: string;
          title: string;
          slug: string;
          slot_type: SlotType;
          tier_name: string | null;
          tier: string | null;
          package_type: string | null;
          description: string | null;
          benefits: string[];
          inventory_count: number;
          remaining_inventory: number;
          list_price_eur: number | null;
          minimum_price_eur: number | null;
          price_range_min: number | null;
          price_range_max: number | null;
          currency: string;
          exclusivity: boolean;
          is_featured: boolean;
          visibility: SlotVisibility;
          is_active: boolean;
          logo_visibility: boolean;
          booth_presence: boolean;
          sampling_rights: boolean;
          speaking_slot: boolean;
          hospitality_access: boolean;
          networking_access: boolean;
          content_creation: boolean;
          social_media_integration: boolean;
          digital_ads_inclusion: boolean;
          lead_capture_enabled: boolean;
          qr_tracking_enabled: boolean;
          category_exclusivity: boolean;
          custom_activation_possible: boolean;
          estimated_reach: number | null;
          estimated_impressions: number | null;
          estimated_engagements: number | null;
          estimated_leads: number | null;
          estimated_product_trials: number | null;
          estimated_content_views: number | null;
          estimated_meetings: number | null;
          deliverables_summary: string | null;
          activation_summary: string | null;
          audience_fit_tags: string[];
          archived_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          title: string;
          slug: string;
          slot_type?: SlotType;
          tier_name?: string | null;
          tier?: string | null;
          package_type?: string | null;
          description?: string | null;
          benefits?: string[];
          inventory_count?: number;
          remaining_inventory?: number;
          list_price_eur?: number | null;
          minimum_price_eur?: number | null;
          price_range_min?: number | null;
          price_range_max?: number | null;
          currency?: string;
          exclusivity?: boolean;
          is_featured?: boolean;
          visibility?: SlotVisibility;
          is_active?: boolean;
          logo_visibility?: boolean;
          booth_presence?: boolean;
          sampling_rights?: boolean;
          speaking_slot?: boolean;
          hospitality_access?: boolean;
          networking_access?: boolean;
          content_creation?: boolean;
          social_media_integration?: boolean;
          digital_ads_inclusion?: boolean;
          lead_capture_enabled?: boolean;
          qr_tracking_enabled?: boolean;
          category_exclusivity?: boolean;
          custom_activation_possible?: boolean;
          estimated_reach?: number | null;
          estimated_impressions?: number | null;
          estimated_engagements?: number | null;
          estimated_leads?: number | null;
          estimated_product_trials?: number | null;
          estimated_content_views?: number | null;
          estimated_meetings?: number | null;
          deliverables_summary?: string | null;
          activation_summary?: string | null;
          audience_fit_tags?: string[];
          archived_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          slug?: string;
          slot_type?: SlotType;
          tier_name?: string | null;
          tier?: string | null;
          package_type?: string | null;
          description?: string | null;
          benefits?: string[];
          inventory_count?: number;
          remaining_inventory?: number;
          list_price_eur?: number | null;
          minimum_price_eur?: number | null;
          price_range_min?: number | null;
          price_range_max?: number | null;
          currency?: string;
          exclusivity?: boolean;
          is_featured?: boolean;
          visibility?: SlotVisibility;
          is_active?: boolean;
          logo_visibility?: boolean;
          booth_presence?: boolean;
          sampling_rights?: boolean;
          speaking_slot?: boolean;
          hospitality_access?: boolean;
          networking_access?: boolean;
          content_creation?: boolean;
          social_media_integration?: boolean;
          digital_ads_inclusion?: boolean;
          lead_capture_enabled?: boolean;
          qr_tracking_enabled?: boolean;
          category_exclusivity?: boolean;
          custom_activation_possible?: boolean;
          estimated_reach?: number | null;
          estimated_impressions?: number | null;
          estimated_engagements?: number | null;
          estimated_leads?: number | null;
          estimated_product_trials?: number | null;
          estimated_content_views?: number | null;
          estimated_meetings?: number | null;
          deliverables_summary?: string | null;
          activation_summary?: string | null;
          audience_fit_tags?: string[];
          archived_at?: string | null;
          updated_at?: string;
        };
      };

      saved_events: {
        Row: {
          id: string;
          organization_id: string;
          event_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          event_id: string;
          created_at?: string;
        };
        Update: never;
      };

      slot_inquiries: {
        Row: {
          id: string;
          sponsor_organization_id: string;
          event_id: string;
          sponsorship_slot_id: string;
          submitted_by: string | null;
          status: InquiryStatus;
          message: string | null;
          proposed_budget_eur: number | null;
          sponsor_goals: string[];
          internal_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          sponsor_organization_id: string;
          event_id: string;
          sponsorship_slot_id: string;
          submitted_by?: string | null;
          status?: InquiryStatus;
          message?: string | null;
          proposed_budget_eur?: number | null;
          sponsor_goals?: string[];
          internal_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: InquiryStatus;
          message?: string | null;
          proposed_budget_eur?: number | null;
          sponsor_goals?: string[];
          internal_notes?: string | null;
          updated_at?: string;
        };
      };

      notifications: {
        Row: {
          id: string;
          profile_id: string;
          type: NotificationType;
          title: string;
          body: string | null;
          link_url: string | null;
          is_read: boolean;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          type: NotificationType;
          title: string;
          body?: string | null;
          link_url?: string | null;
          is_read?: boolean;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          is_read?: boolean;
          title?: string;
          body?: string | null;
          link_url?: string | null;
          metadata?: Json;
        };
      };

      audit_logs: {
        Row: {
          id: string;
          actor_profile_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_profile_id?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: never;
      };
    };
  };
}