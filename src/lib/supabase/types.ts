export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      admins: {
        Row: {
          added_by: string | null
          created_at: string
          email: string
          id: string
          name: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          added_by?: string | null
          created_at?: string
          email: string
          id?: string
          name?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          added_by?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      applications: {
        Row: {
          answer_balance: string
          answer_health_gap: string
          answer_motivation: string
          answer_skills: string
          cgpa: number | null
          cohort: string
          committed: boolean
          consent_at: string
          created_at: string
          current_region: Database["public"]["Enums"]["region"]
          cwa: number | null
          date_of_birth: string
          email: string
          full_name: string
          gender: Database["public"]["Enums"]["gender"] | null
          heard_about: string
          heard_about_other: string | null
          home_region: Database["public"]["Enums"]["region"]
          hours_per_month: number
          id: string
          institution: string
          institution_other: string | null
          interests: string[]
          ip_hash: string | null
          language_other: string | null
          languages: Json
          leadership_interest: string | null
          level: number
          notes: string | null
          phone: string
          programme: Database["public"]["Enums"]["programme"]
          programme_other: string | null
          reference: string
          skills: string[]
          status: Database["public"]["Enums"]["application_status"]
          status_changed_at: string | null
          status_changed_by: string | null
          student_id: string
          updated_at: string
          whatsapp: string
        }
        Insert: {
          answer_balance: string
          answer_health_gap: string
          answer_motivation: string
          answer_skills: string
          cgpa?: number | null
          cohort: string
          committed: boolean
          consent_at: string
          created_at?: string
          current_region: Database["public"]["Enums"]["region"]
          cwa?: number | null
          date_of_birth: string
          email: string
          full_name: string
          gender?: Database["public"]["Enums"]["gender"] | null
          heard_about: string
          heard_about_other?: string | null
          home_region: Database["public"]["Enums"]["region"]
          hours_per_month: number
          id?: string
          institution: string
          institution_other?: string | null
          interests?: string[]
          ip_hash?: string | null
          language_other?: string | null
          languages: Json
          leadership_interest?: string | null
          level: number
          notes?: string | null
          phone: string
          programme: Database["public"]["Enums"]["programme"]
          programme_other?: string | null
          reference?: string
          skills?: string[]
          status?: Database["public"]["Enums"]["application_status"]
          status_changed_at?: string | null
          status_changed_by?: string | null
          student_id: string
          updated_at?: string
          whatsapp: string
        }
        Update: {
          answer_balance?: string
          answer_health_gap?: string
          answer_motivation?: string
          answer_skills?: string
          cgpa?: number | null
          cohort?: string
          committed?: boolean
          consent_at?: string
          created_at?: string
          current_region?: Database["public"]["Enums"]["region"]
          cwa?: number | null
          date_of_birth?: string
          email?: string
          full_name?: string
          gender?: Database["public"]["Enums"]["gender"] | null
          heard_about?: string
          heard_about_other?: string | null
          home_region?: Database["public"]["Enums"]["region"]
          hours_per_month?: number
          id?: string
          institution?: string
          institution_other?: string | null
          interests?: string[]
          ip_hash?: string | null
          language_other?: string | null
          languages?: Json
          leadership_interest?: string | null
          level?: number
          notes?: string | null
          phone?: string
          programme?: Database["public"]["Enums"]["programme"]
          programme_other?: string | null
          reference?: string
          skills?: string[]
          status?: Database["public"]["Enums"]["application_status"]
          status_changed_at?: string | null
          status_changed_by?: string | null
          student_id?: string
          updated_at?: string
          whatsapp?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          category: Database["public"]["Enums"]["faq_category"]
          created_at: string
          id: string
          on_homepage: boolean
          published: boolean
          question: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          answer: string
          category?: Database["public"]["Enums"]["faq_category"]
          created_at?: string
          id?: string
          on_homepage?: boolean
          published?: boolean
          question: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: Database["public"]["Enums"]["faq_category"]
          created_at?: string
          id?: string
          on_homepage?: boolean
          published?: boolean
          question?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_log: {
        Row: {
          application_id: string | null
          error: string | null
          id: string
          ok: boolean
          sent_at: string
          sent_by: string | null
          template: string
          to_email: string
        }
        Insert: {
          application_id?: string | null
          error?: string | null
          id?: string
          ok: boolean
          sent_at?: string
          sent_by?: string | null
          template: string
          to_email: string
        }
        Update: {
          application_id?: string | null
          error?: string | null
          id?: string
          ok?: boolean
          sent_at?: string
          sent_by?: string | null
          template?: string
          to_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_log_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      inquiries: {
        Row: {
          created_at: string
          email: string
          id: string
          interest: Database["public"]["Enums"]["inquiry_interest"]
          message: string
          name: string
          organisation: string | null
          status: Database["public"]["Enums"]["inquiry_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          interest: Database["public"]["Enums"]["inquiry_interest"]
          message: string
          name: string
          organisation?: string | null
          status?: Database["public"]["Enums"]["inquiry_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          interest?: Database["public"]["Enums"]["inquiry_interest"]
          message?: string
          name?: string
          organisation?: string | null
          status?: Database["public"]["Enums"]["inquiry_status"]
          updated_at?: string
        }
        Relationships: []
      }
      partners: {
        Row: {
          created_at: string
          id: string
          logo_path: string | null
          name: string
          published: boolean
          sort_order: number
          updated_at: string
          url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          logo_path?: string | null
          name: string
          published?: boolean
          sort_order?: number
          updated_at?: string
          url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          logo_path?: string | null
          name?: string
          published?: boolean
          sort_order?: number
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      people: {
        Row: {
          bio: string | null
          created_at: string
          id: string
          name: string
          photo_path: string | null
          published: boolean
          role: string
          socials: Json
          sort_order: number
          type: Database["public"]["Enums"]["person_type"]
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          id?: string
          name: string
          photo_path?: string | null
          published?: boolean
          role: string
          socials?: Json
          sort_order?: number
          type: Database["public"]["Enums"]["person_type"]
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          id?: string
          name?: string
          photo_path?: string | null
          published?: boolean
          role?: string
          socials?: Json
          sort_order?: number
          type?: Database["public"]["Enums"]["person_type"]
          updated_at?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          author_name: string | null
          body: Json
          cover_alt: string | null
          cover_path: string | null
          created_at: string
          excerpt: string | null
          gallery: Json
          id: string
          kind: Database["public"]["Enums"]["post_kind"]
          published_at: string | null
          slug: string
          status: Database["public"]["Enums"]["post_status"]
          title: string
          updated_at: string
        }
        Insert: {
          author_name?: string | null
          body?: Json
          cover_alt?: string | null
          cover_path?: string | null
          created_at?: string
          excerpt?: string | null
          gallery?: Json
          id?: string
          kind?: Database["public"]["Enums"]["post_kind"]
          published_at?: string | null
          slug: string
          status?: Database["public"]["Enums"]["post_status"]
          title: string
          updated_at?: string
        }
        Update: {
          author_name?: string | null
          body?: Json
          cover_alt?: string | null
          cover_path?: string | null
          created_at?: string
          excerpt?: string | null
          gallery?: Json
          id?: string
          kind?: Database["public"]["Enums"]["post_kind"]
          published_at?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["post_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      rate_limit_events: {
        Row: {
          action: string
          created_at: string
          id: number
          key: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: never
          key: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: never
          key?: string
        }
        Relationships: []
      }
      reference_counters: {
        Row: {
          last_number: number
          year: number
        }
        Insert: {
          last_number?: number
          year: number
        }
        Update: {
          last_number?: number
          year?: number
        }
        Relationships: []
      }
      regions: {
        Row: {
          active: boolean
          created_at: string
          head_institution: string | null
          head_name: string | null
          head_photo_path: string | null
          head_published: boolean
          region: Database["public"]["Enums"]["region"]
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          head_institution?: string | null
          head_name?: string | null
          head_photo_path?: string | null
          head_published?: boolean
          region: Database["public"]["Enums"]["region"]
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          head_institution?: string | null
          head_name?: string | null
          head_photo_path?: string | null
          head_published?: boolean
          region?: Database["public"]["Enums"]["region"]
          updated_at?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          application_deadline: string | null
          applications_open: boolean
          banner_link: string | null
          banner_on: boolean
          banner_text: string | null
          contact_email: string | null
          created_at: string
          current_cohort: string
          id: number
          phones: Json
          socials: Json
          updated_at: string
          whatsapp: Json
        }
        Insert: {
          application_deadline?: string | null
          applications_open?: boolean
          banner_link?: string | null
          banner_on?: boolean
          banner_text?: string | null
          contact_email?: string | null
          created_at?: string
          current_cohort?: string
          id?: number
          phones?: Json
          socials?: Json
          updated_at?: string
          whatsapp?: Json
        }
        Update: {
          application_deadline?: string | null
          applications_open?: boolean
          banner_link?: string | null
          banner_on?: boolean
          banner_text?: string | null
          contact_email?: string | null
          created_at?: string
          current_cohort?: string
          id?: number
          phones?: Json
          socials?: Json
          updated_at?: string
          whatsapp?: Json
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          cohort: string
          created_at: string
          email: string
          id: string
          notified_at: string | null
          updated_at: string
        }
        Insert: {
          cohort: string
          created_at?: string
          email: string
          id?: string
          notified_at?: string | null
          updated_at?: string
        }
        Update: {
          cohort?: string
          created_at?: string
          email?: string
          id?: string
          notified_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
      next_reference: { Args: { p_year: number }; Returns: string }
    }
    Enums: {
      application_status:
        | "submitted"
        | "under_review"
        | "shortlisted"
        | "interview"
        | "accepted"
        | "rejected"
        | "waitlisted"
      faq_category: "membership" | "club"
      gender: "male" | "female" | "prefer_not_to_say"
      inquiry_interest:
        | "adviser"
        | "partner"
        | "professional"
        | "alumni"
        | "member"
        | "other"
      inquiry_status: "new" | "handled"
      person_type: "executive" | "adviser"
      post_kind:
        | "announcement"
        | "training"
        | "outreach"
        | "event"
        | "news"
        | "article"
      post_status: "draft" | "published"
      programme:
        | "Medicine"
        | "Nursing"
        | "Midwifery"
        | "Pharmacy"
        | "Physician Assistantship"
        | "Medical Laboratory Science"
        | "Public Health"
        | "Nutrition and Dietetics"
        | "Physiotherapy"
        | "Radiography and Medical Imaging"
        | "Dentistry"
        | "Optometry"
        | "Biomedical Science"
        | "Clinical Psychology"
        | "Other health-related"
      region:
        | "Ahafo"
        | "Ashanti"
        | "Bono"
        | "Bono East"
        | "Central"
        | "Eastern"
        | "Greater Accra"
        | "North East"
        | "Northern"
        | "Oti"
        | "Savannah"
        | "Upper East"
        | "Upper West"
        | "Volta"
        | "Western"
        | "Western North"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      application_status: [
        "submitted",
        "under_review",
        "shortlisted",
        "interview",
        "accepted",
        "rejected",
        "waitlisted",
      ],
      faq_category: ["membership", "club"],
      gender: ["male", "female", "prefer_not_to_say"],
      inquiry_interest: [
        "adviser",
        "partner",
        "professional",
        "alumni",
        "member",
        "other",
      ],
      inquiry_status: ["new", "handled"],
      person_type: ["executive", "adviser"],
      post_kind: ["announcement", "training", "outreach", "event", "news", "article"],
      post_status: ["draft", "published"],
      programme: [
        "Medicine",
        "Nursing",
        "Midwifery",
        "Pharmacy",
        "Physician Assistantship",
        "Medical Laboratory Science",
        "Public Health",
        "Nutrition and Dietetics",
        "Physiotherapy",
        "Radiography and Medical Imaging",
        "Dentistry",
        "Optometry",
        "Biomedical Science",
        "Clinical Psychology",
        "Other health-related",
      ],
      region: [
        "Ahafo",
        "Ashanti",
        "Bono",
        "Bono East",
        "Central",
        "Eastern",
        "Greater Accra",
        "North East",
        "Northern",
        "Oti",
        "Savannah",
        "Upper East",
        "Upper West",
        "Volta",
        "Western",
        "Western North",
      ],
    },
  },
} as const
