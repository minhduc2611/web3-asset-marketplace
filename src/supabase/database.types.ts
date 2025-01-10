export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      brain_log_types: {
        Row: {
          author_id: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          author_id?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Update: {
          author_id?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      brain_logs: {
        Row: {
          author_id: string | null
          brain_log_type_id: string
          content: string
          created_at: string
          id: string
        }
        Insert: {
          author_id?: string | null
          brain_log_type_id: string
          content?: string
          created_at?: string
          id?: string
        }
        Update: {
          author_id?: string | null
          brain_log_type_id?: string
          content?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_brain-log_brain_log_type_id_fkey"
            columns: ["brain_log_type_id"]
            isOneToOne: false
            referencedRelation: "brain_log_types"
            referencedColumns: ["id"]
          },
        ]
      }
      cards: {
        Row: {
          audio_url: string | null
          author_id: string | null
          collection_id: number | null
          created_at: string
          definition: string | null
          deleted_at: string | null
          id: number
          interval: number | null
          media_url: string | null
          next_review_time: string | null
          short_answer: string | null
          single_answer: string | null
          term: string | null
        }
        Insert: {
          audio_url?: string | null
          author_id?: string | null
          collection_id?: number | null
          created_at?: string
          definition?: string | null
          deleted_at?: string | null
          id?: number
          interval?: number | null
          media_url?: string | null
          next_review_time?: string | null
          short_answer?: string | null
          single_answer?: string | null
          term?: string | null
        }
        Update: {
          audio_url?: string | null
          author_id?: string | null
          collection_id?: number | null
          created_at?: string
          definition?: string | null
          deleted_at?: string | null
          id?: number
          interval?: number | null
          media_url?: string | null
          next_review_time?: string | null
          short_answer?: string | null
          single_answer?: string | null
          term?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cards_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          author_id: string | null
          created_at: string
          deleted_at: string | null
          description: string | null
          id: number
          name: string | null
          shared_author_ids: string[] | null
        }
        Insert: {
          author_id?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: number
          name?: string | null
          shared_author_ids?: string[] | null
        }
        Update: {
          author_id?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: number
          name?: string | null
          shared_author_ids?: string[] | null
        }
        Relationships: []
      }
      expense_types: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          author_id: string | null
          created_at: string
          expense_amount: number | null
          expense_name: string | null
          expense_type_id: string | null
          id: string
        }
        Insert: {
          author_id?: string | null
          created_at?: string
          expense_amount?: number | null
          expense_name?: string | null
          expense_type_id?: string | null
          id?: string
        }
        Update: {
          author_id?: string | null
          created_at?: string
          expense_amount?: number | null
          expense_name?: string | null
          expense_type_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_expense_type_fkey"
            columns: ["expense_type_id"]
            isOneToOne: false
            referencedRelation: "expense_types"
            referencedColumns: ["id"]
          },
        ]
      }
      public_users: {
        Row: {
          cards_goal: number
          created_at: string
          email: string | null
          flash_card_streak: number
          id: string
          raw_user_meta_data: Json | null
          total_new_card_learnt: number
          user_settings: Json
        }
        Insert: {
          cards_goal?: number
          created_at?: string
          email?: string | null
          flash_card_streak?: number
          id: string
          raw_user_meta_data?: Json | null
          total_new_card_learnt?: number
          user_settings?: Json
        }
        Update: {
          cards_goal?: number
          created_at?: string
          email?: string | null
          flash_card_streak?: number
          id?: string
          raw_user_meta_data?: Json | null
          total_new_card_learnt?: number
          user_settings?: Json
        }
        Relationships: []
      }
      user_card_datas: {
        Row: {
          card_id: number | null
          created_at: string
          id: string
          interval: number | null
          next_review_time: string | null
          user_id: string | null
        }
        Insert: {
          card_id?: number | null
          created_at?: string
          id?: string
          interval?: number | null
          next_review_time?: string | null
          user_id?: string | null
        }
        Update: {
          card_id?: number | null
          created_at?: string
          id?: string
          interval?: number | null
          next_review_time?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_card_datas_card_id_fkey1"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
