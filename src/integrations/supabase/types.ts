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
      game_sessions: {
        Row: {
          ended_at: string | null
          id: string
          max_players: number | null
          started_at: string | null
          status: string | null
        }
        Insert: {
          ended_at?: string | null
          id?: string
          max_players?: number | null
          started_at?: string | null
          status?: string | null
        }
        Update: {
          ended_at?: string | null
          id?: string
          max_players?: number | null
          started_at?: string | null
          status?: string | null
        }
        Relationships: []
      }
      player_room_assignments: {
        Row: {
          game_session_id: string | null
          id: string
          joined_at: string | null
          room_number: number
          user_id: string
        }
        Insert: {
          game_session_id?: string | null
          id?: string
          joined_at?: string | null
          room_number: number
          user_id: string
        }
        Update: {
          game_session_id?: string | null
          id?: string
          joined_at?: string | null
          room_number?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_room_assignments_game_session_id_fkey"
            columns: ["game_session_id"]
            isOneToOne: false
            referencedRelation: "game_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age_verified: boolean | null
          avatar_url: string | null
          created_at: string | null
          deal_breakers: string[] | null
          hobbies: string[] | null
          id: string
          location: string | null
          love_languages: string[] | null
          nickname: string | null
          profession: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          age_verified?: boolean | null
          avatar_url?: string | null
          created_at?: string | null
          deal_breakers?: string[] | null
          hobbies?: string[] | null
          id: string
          location?: string | null
          love_languages?: string[] | null
          nickname?: string | null
          profession?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          age_verified?: boolean | null
          avatar_url?: string | null
          created_at?: string | null
          deal_breakers?: string[] | null
          hobbies?: string[] | null
          id?: string
          location?: string | null
          love_languages?: string[] | null
          nickname?: string | null
          profession?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string | null
          current_pgl: number | null
          high_score: number | null
          id: string
          nickname: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_pgl?: number | null
          high_score?: number | null
          id: string
          nickname?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_pgl?: number | null
          high_score?: number | null
          id?: string
          nickname?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          bid_amount: number | null
          estimated_start_time: string | null
          game_session_id: string | null
          hobbies: string[] | null
          id: string
          is_premium: boolean | null
          is_sponsored: boolean | null
          joined_at: string | null
          nickname: string | null
          position: number | null
          profession: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          bid_amount?: number | null
          estimated_start_time?: string | null
          game_session_id?: string | null
          hobbies?: string[] | null
          id?: string
          is_premium?: boolean | null
          is_sponsored?: boolean | null
          joined_at?: string | null
          nickname?: string | null
          position?: number | null
          profession?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          bid_amount?: number | null
          estimated_start_time?: string | null
          game_session_id?: string | null
          hobbies?: string[] | null
          id?: string
          is_premium?: boolean | null
          is_sponsored?: boolean | null
          joined_at?: string | null
          nickname?: string | null
          position?: number | null
          profession?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "waitlist_game_session_id_fkey"
            columns: ["game_session_id"]
            isOneToOne: false
            referencedRelation: "game_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      whitelisted_emails: {
        Row: {
          created_at: string | null
          email: string
          id: string
          type: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          type?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_email_whitelisted: {
        Args: { email_to_check: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
