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
          primary_sports: string[];
          operating_regions: string[];
          notable_partners: string[];
          achievements: string[];
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
          primary_sports?: string[];
          operating_regions?: string[];
          notable_partners?: string[];
          achievements?: string[];
          media_kit_url?: string | null;
          deck_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          headline?: string | null;
          overview?: string | null;
          years_operating?: number | null;
          primary_sports?: string[];
          operating_regions?: string[];
          notable_partners?: string[];
          achievements?: string[];
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
          target_age_ranges: string[];
          preferred_event_sizes: string[];
          preferred_activation_types: string[];
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
          target_age_ranges?: string[];
          preferred_event_sizes?: string[];
          preferred_activation_types?: string[];
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
          target_age_ranges?: string[];
          preferred_event_sizes?: string[];
          preferred_activation_types?: string[];
          min_budget_eur?: number | null;
          max_budget_eur?: number | null;
          is_profile_complete?: boolean;
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
          category_tags: string[];
          short_description: string | null;
          description: string | null;
          country: string | null;
          city: string | null;
          venue_name: string | null;
          starts_at: string | null;
          ends_at: string | null;
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
          category_tags?: string[];
          short_description?: string | null;
          description?: string | null;
          country?: string | null;
          city?: string | null;
          venue_name?: string | null;
          starts_at?: string | null;
          ends_at?: string | null;
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
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          organization_id?: string;
          name?: string;
          slug?: string;
          sport_type?: string;
          category_tags?: string[];
          short_description?: string | null;
          description?: string | null;
          country?: string | null;
          city?: string | null;
          venue_name?: string | null;
          starts_at?: string | null;
          ends_at?: string | null;
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
          audience_b2b_percentage: number | null;
          audience_b2c_percentage: number | null;
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
          audience_b2b_percentage?: number | null;
          audience_b2c_percentage?: number | null;
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
          audience_b2b_percentage?: number | null;
          audience_b2c_percentage?: number | null;
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
          description: string | null;
          benefits: string[];
          inventory_count: number;
          remaining_inventory: number;
          list_price_eur: number | null;
          minimum_price_eur: number | null;
          visibility: SlotVisibility;
          is_active: boolean;
          deliverables_summary: string | null;
          activation_summary: string | null;
          audience_fit_tags: string[];
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
          description?: string | null;
          benefits?: string[];
          inventory_count?: number;
          remaining_inventory?: number;
          list_price_eur?: number | null;
          minimum_price_eur?: number | null;
          visibility?: SlotVisibility;
          is_active?: boolean;
          deliverables_summary?: string | null;
          activation_summary?: string | null;
          audience_fit_tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          slug?: string;
          slot_type?: SlotType;
          tier_name?: string | null;
          description?: string | null;
          benefits?: string[];
          inventory_count?: number;
          remaining_inventory?: number;
          list_price_eur?: number | null;
          minimum_price_eur?: number | null;
          visibility?: SlotVisibility;
          is_active?: boolean;
          deliverables_summary?: string | null;
          activation_summary?: string | null;
          audience_fit_tags?: string[];
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