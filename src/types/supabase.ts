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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      activity_deck: {
        Row: {
          completed_at: string | null
          cost_level: number | null
          couple_id: string | null
          created_at: string | null
          description: string | null
          duration: number | null
          id: string
          is_completed: boolean | null
          title: string
          vibe: Database["public"]["Enums"]["activity_vibe"] | null
          image_url: string | null
        }
        Insert: {
          completed_at?: string | null
          cost_level?: number | null
          couple_id?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          is_completed?: boolean | null
          title: string
          vibe?: Database["public"]["Enums"]["activity_vibe"] | null
          image_url?: string | null
        }
        Update: {
          completed_at?: string | null
          cost_level?: number | null
          couple_id?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          is_completed?: boolean | null
          title?: string
          vibe?: Database["public"]["Enums"]["activity_vibe"] | null
          image_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_deck_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
        ]
      }
      bucket_list: {
        Row: {
          activity_category: string | null
          budget_level: number | null
          couple_id: string
          created_at: string | null
          created_by: string | null
          description: string | null
          estimated_date: string | null
          id: string
          image_url: string | null
          is_completed: boolean
          links: string[] | null
          owner_type: Database["public"]["Enums"]["dream_category"]
          title: string
          vibe: string | null
        }
        Insert: {
          activity_category?: string | null
          budget_level?: number | null
          couple_id: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          estimated_date?: string | null
          id?: string
          image_url?: string | null
          is_completed?: boolean
          links?: string[] | null
          owner_type?: Database["public"]["Enums"]["dream_category"]
          title: string
          vibe?: string | null
        }
        Update: {
          activity_category?: string | null
          budget_level?: number | null
          couple_id?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          estimated_date?: string | null
          id?: string
          image_url?: string | null
          is_completed?: boolean
          links?: string[] | null
          owner_type?: Database["public"]["Enums"]["dream_category"]
          title?: string
          vibe?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bucket_list_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
        ]
      }
      bucket_list_comments: {
        Row: {
          author_id: string
          bucket_list_id: string
          content: string
          created_at: string
          id: string
        }
        Insert: {
          author_id: string
          bucket_list_id: string
          content: string
          created_at?: string
          id?: string
        }
        Update: {
          author_id?: string
          bucket_list_id?: string
          content?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bucket_list_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bucket_list_comments_bucket_list_id_fkey"
            columns: ["bucket_list_id"]
            isOneToOne: false
            referencedRelation: "bucket_list"
            referencedColumns: ["id"]
          },
        ]
      }
      couples: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          pairing_code: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          pairing_code: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          pairing_code?: string
        }
        Relationships: []
      }
      daily_metrics: {
        Row: {
          closeness: number | null
          communication: number | null
          couple_id: string
          created_at: string
          id: string
          intimacy: number | null
          note: string | null
          support: number | null
          time_together: number | null
          user_id: string
        }
        Insert: {
          closeness?: number | null
          communication?: number | null
          couple_id: string
          created_at?: string
          id?: string
          intimacy?: number | null
          note?: string | null
          support?: number | null
          time_together?: number | null
          user_id: string
        }
        Update: {
          closeness?: number | null
          communication?: number | null
          couple_id?: string
          created_at?: string
          id?: string
          intimacy?: number | null
          note?: string | null
          support?: number | null
          time_together?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_metrics_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_metrics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      diary_entries: {
        Row: {
          content: Json | null
          couple_id: string
          created_at: string | null
          created_by: string | null
          event_date: string | null
          id: string
          image_path: string | null
          template_type: string | null
          title: string
        }
        Insert: {
          content?: Json | null
          couple_id: string
          created_at?: string | null
          created_by?: string | null
          event_date?: string | null
          id?: string
          image_path?: string | null
          template_type?: string | null
          title: string
        }
        Update: {
          content?: Json | null
          couple_id?: string
          created_at?: string | null
          created_by?: string | null
          event_date?: string | null
          id?: string
          image_path?: string | null
          template_type?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "diary_entries_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
        ]
      }
      habit_logs: {
        Row: {
          completed_at_date: string
          created_at: string | null
          habit_id: string
          id: string
          user_id: string
        }
        Insert: {
          completed_at_date?: string
          created_at?: string | null
          habit_id: string
          id?: string
          user_id: string
        }
        Update: {
          completed_at_date?: string
          created_at?: string | null
          habit_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habit_logs_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          couple_id: string
          created_at: string | null
          created_by: string | null
          id: string
          title: string
        }
        Insert: {
          couple_id: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          title: string
        }
        Update: {
          couple_id?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "habits_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
        ]
      }
      issue_comments: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          id: string
          issue_id: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          id?: string
          issue_id: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          id?: string
          issue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "issue_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issue_comments_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
        ]
      }
      issues: {
        Row: {
          author_id: string
          color_category: string | null
          content: Json
          couple_id: string
          created_at: string
          id: string
          needs_quiet_space: boolean | null
          overload_author_id: string | null
          overloaded_until: string | null
          priority: Database["public"]["Enums"]["issue_priority"] | null
          proposals: Json | null
          scheduled_at: string | null
          signed_by_author: boolean | null
          signed_by_recipient: boolean | null
          solution_draft: string | null
          status: Database["public"]["Enums"]["issue_status"]
          type: Database["public"]["Enums"]["issue_type"]
          updated_at: string
        }
        Insert: {
          author_id: string
          color_category?: string | null
          content?: Json
          couple_id: string
          created_at?: string
          id?: string
          needs_quiet_space?: boolean | null
          overload_author_id?: string | null
          overloaded_until?: string | null
          priority?: Database["public"]["Enums"]["issue_priority"] | null
          proposals?: Json | null
          scheduled_at?: string | null
          signed_by_author?: boolean | null
          signed_by_recipient?: boolean | null
          solution_draft?: string | null
          status?: Database["public"]["Enums"]["issue_status"]
          type: Database["public"]["Enums"]["issue_type"]
          updated_at?: string
        }
        Update: {
          author_id?: string
          color_category?: string | null
          content?: Json
          couple_id?: string
          created_at?: string
          id?: string
          needs_quiet_space?: boolean | null
          overload_author_id?: string | null
          overloaded_until?: string | null
          priority?: Database["public"]["Enums"]["issue_priority"] | null
          proposals?: Json | null
          scheduled_at?: string | null
          signed_by_author?: boolean | null
          signed_by_recipient?: boolean | null
          solution_draft?: string | null
          status?: Database["public"]["Enums"]["issue_status"]
          type?: Database["public"]["Enums"]["issue_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "issues_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issues_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issues_overload_author_id_fkey"
            columns: ["overload_author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          content: string | null
          couple_id: string
          created_at: string | null
          id: string
          is_read: boolean | null
          link: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          content?: string | null
          couple_id: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          content?: string | null
          couple_id?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          couple_id: string | null
          display_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          couple_id?: string | null
          display_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          couple_id?: string | null
          display_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          options: Json
          question_text: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          options: Json
          question_text: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          options?: Json
          question_text?: string
        }
        Relationships: []
      }
      quiz_answers: {
        Row: {
          couple_id: string
          created_at: string | null
          id: string
          is_match: boolean | null
          question_id: string
          updated_at: string | null
          user_a_answer: string | null
          user_a_id: string
          user_b_answer: string | null
          user_b_id: string | null
        }
        Insert: {
          couple_id: string
          created_at?: string | null
          id?: string
          is_match?: boolean | null
          question_id: string
          updated_at?: string | null
          user_a_answer?: string | null
          user_a_id: string
          user_b_answer?: string | null
          user_b_id?: string | null
        }
        Update: {
          couple_id?: string
          created_at?: string | null
          id?: string
          is_match?: boolean | null
          question_id?: string
          updated_at?: string | null
          user_a_answer?: string | null
          user_a_id?: string
          user_b_answer?: string | null
          user_b_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_answers_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      vouchers: {
        Row: {
          buyer_id: string | null
          cost_vp: number
          couple_id: string
          created_at: string | null
          creator_id: string
          description: string | null
          id: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          buyer_id?: string | null
          cost_vp?: number
          couple_id: string
          created_at?: string | null
          creator_id: string
          description?: string | null
          id?: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          buyer_id?: string | null
          cost_vp?: number
          couple_id?: string
          created_at?: string | null
          creator_id?: string
          description?: string | null
          id?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vouchers_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
        ]
      }
      vp_wallets: {
        Row: {
          balance: number
          couple_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance?: number
          couple_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance?: number
          couple_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vp_wallets_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlists: {
        Row: {
          category: string | null
          couple_id: string | null
          created_at: string | null
          description: string | null
          id: string
          is_secret: boolean | null
          link: string | null
          status: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          category?: string | null
          couple_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_secret?: boolean | null
          link?: string | null
          status?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          category?: string | null
          couple_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_secret?: boolean | null
          link?: string | null
          status?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      buy_voucher: { Args: { b_id: string; v_id: string }; Returns: Json }
      get_my_couple_id: { Args: never; Returns: string }
      get_partner_id: { Args: { c_id: string; u_id: string }; Returns: string }
      is_member_of_couple: { Args: { c_id: string }; Returns: boolean }
    }
    Enums: {
      activity_vibe: "relax" | "adrenaline" | "romance"
      dream_category: "jej" | "jego" | "wspólne"
      issue_priority: "red" | "yellow" | "green"
      issue_status: "new" | "read" | "discussed" | "resolved"
      issue_type: "heavy" | "talk"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      activity_vibe: ["relax", "adrenaline", "romance"],
      dream_category: ["jej", "jego", "wspólne"],
      issue_priority: ["red", "yellow", "green"],
      issue_status: ["new", "read", "discussed", "resolved"],
      issue_type: ["heavy", "talk"],
    },
  },
} as const
