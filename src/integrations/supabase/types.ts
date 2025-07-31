export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          assigned_to: string | null
          created_at: string
          description: string
          id: string
          resolved_at: string | null
          severity: Database["public"]["Enums"]["severity_level"]
          status: Database["public"]["Enums"]["alert_status"]
          title: string
          transaction_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          description: string
          id?: string
          resolved_at?: string | null
          severity: Database["public"]["Enums"]["severity_level"]
          status?: Database["public"]["Enums"]["alert_status"]
          title: string
          transaction_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          description?: string
          id?: string
          resolved_at?: string | null
          severity?: Database["public"]["Enums"]["severity_level"]
          status?: Database["public"]["Enums"]["alert_status"]
          title?: string
          transaction_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      dashboard_metrics: {
        Row: {
          created_at: string
          date: string
          false_positive_rate: number
          flagged_transactions: number
          id: string
          risk_score_avg: number
          total_transactions: number
        }
        Insert: {
          created_at?: string
          date?: string
          false_positive_rate?: number
          flagged_transactions?: number
          id?: string
          risk_score_avg?: number
          total_transactions?: number
        }
        Update: {
          created_at?: string
          date?: string
          false_positive_rate?: number
          flagged_transactions?: number
          id?: string
          risk_score_avg?: number
          total_transactions?: number
        }
        Relationships: []
      }
      heatmap_data: {
        Row: {
          count: number
          created_at: string
          id: string
          suspicious: boolean
          value: number
          x_coordinate: string
          y_coordinate: string
        }
        Insert: {
          count?: number
          created_at?: string
          id?: string
          suspicious?: boolean
          value: number
          x_coordinate: string
          y_coordinate: string
        }
        Update: {
          count?: number
          created_at?: string
          id?: string
          suspicious?: boolean
          value?: number
          x_coordinate?: string
          y_coordinate?: string
        }
        Relationships: []
      }
      network_links: {
        Row: {
          created_at: string
          id: string
          relationship: Database["public"]["Enums"]["relationship_type"]
          source_node_id: string
          strength: number
          suspicious: boolean
          target_node_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          relationship: Database["public"]["Enums"]["relationship_type"]
          source_node_id: string
          strength: number
          suspicious?: boolean
          target_node_id: string
        }
        Update: {
          created_at?: string
          id?: string
          relationship?: Database["public"]["Enums"]["relationship_type"]
          source_node_id?: string
          strength?: number
          suspicious?: boolean
          target_node_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "network_links_source_node_id_fkey"
            columns: ["source_node_id"]
            isOneToOne: false
            referencedRelation: "network_nodes"
            referencedColumns: ["node_id"]
          },
          {
            foreignKeyName: "network_links_target_node_id_fkey"
            columns: ["target_node_id"]
            isOneToOne: false
            referencedRelation: "network_nodes"
            referencedColumns: ["node_id"]
          },
        ]
      }
      network_nodes: {
        Row: {
          amount: number | null
          created_at: string
          id: string
          label: string
          node_id: string
          risk_score: number
          suspicious: boolean
          type: Database["public"]["Enums"]["node_type"]
          x_position: number | null
          y_position: number | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          id?: string
          label: string
          node_id: string
          risk_score: number
          suspicious?: boolean
          type: Database["public"]["Enums"]["node_type"]
          x_position?: number | null
          y_position?: number | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          id?: string
          label?: string
          node_id?: string
          risk_score?: number
          suspicious?: boolean
          type?: Database["public"]["Enums"]["node_type"]
          x_position?: number | null
          y_position?: number | null
        }
        Relationships: []
      }
      pattern_badges: {
        Row: {
          count: number
          created_at: string
          description: string
          id: string
          severity: Database["public"]["Enums"]["severity_level"]
          type: Database["public"]["Enums"]["pattern_type"]
          updated_at: string
        }
        Insert: {
          count?: number
          created_at?: string
          description: string
          id?: string
          severity: Database["public"]["Enums"]["severity_level"]
          type: Database["public"]["Enums"]["pattern_type"]
          updated_at?: string
        }
        Update: {
          count?: number
          created_at?: string
          description?: string
          id?: string
          severity?: Database["public"]["Enums"]["severity_level"]
          type?: Database["public"]["Enums"]["pattern_type"]
          updated_at?: string
        }
        Relationships: []
      }
      report_templates: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          template_config: Json
          type: Database["public"]["Enums"]["report_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          template_config: Json
          type: Database["public"]["Enums"]["report_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          template_config?: Json
          type?: Database["public"]["Enums"]["report_type"]
          updated_at?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          completed_at: string | null
          created_at: string
          description: string | null
          end_date: string | null
          file_path: string | null
          file_size: number | null
          generated_by: string
          id: string
          parameters: Json | null
          start_date: string | null
          title: string
          type: Database["public"]["Enums"]["report_type"]
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          file_path?: string | null
          file_size?: number | null
          generated_by: string
          id?: string
          parameters?: Json | null
          start_date?: string | null
          title: string
          type: Database["public"]["Enums"]["report_type"]
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          file_path?: string | null
          file_size?: number | null
          generated_by?: string
          id?: string
          parameters?: Json | null
          start_date?: string | null
          title?: string
          type?: Database["public"]["Enums"]["report_type"]
        }
        Relationships: []
      }
      timeline_events: {
        Row: {
          amount: number
          created_at: string
          id: string
          location: string
          merchant: string
          pattern_type: Database["public"]["Enums"]["pattern_type"]
          risk_score: number
          timestamp: string
          transaction_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          location: string
          merchant: string
          pattern_type: Database["public"]["Enums"]["pattern_type"]
          risk_score: number
          timestamp: string
          transaction_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          location?: string
          merchant?: string
          pattern_type?: Database["public"]["Enums"]["pattern_type"]
          risk_score?: number
          timestamp?: string
          transaction_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          card_number_masked: string | null
          created_at: string
          currency: string
          description: string | null
          id: string
          is_suspicious: boolean
          location: string
          merchant_category: string | null
          merchant_name: string
          risk_score: number
          status: Database["public"]["Enums"]["transaction_status"]
          timestamp: string
          transaction_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          card_number_masked?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          is_suspicious?: boolean
          location: string
          merchant_category?: string | null
          merchant_name: string
          risk_score: number
          status?: Database["public"]["Enums"]["transaction_status"]
          timestamp?: string
          transaction_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          card_number_masked?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          is_suspicious?: boolean
          location?: string
          merchant_category?: string | null
          merchant_name?: string
          risk_score?: number
          status?: Database["public"]["Enums"]["transaction_status"]
          timestamp?: string
          transaction_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      alert_status: "new" | "investigating" | "resolved" | "dismissed"
      node_type: "transaction" | "account" | "merchant" | "location"
      pattern_type:
        | "velocity_attack"
        | "account_takeover"
        | "location_anomaly"
        | "amount_pattern"
        | "merchant_fraud"
        | "time_based"
        | "account_muling"
      relationship_type:
        | "same_account"
        | "same_merchant"
        | "same_location"
        | "time_proximity"
      report_type:
        | "daily"
        | "weekly"
        | "monthly"
        | "quarterly"
        | "incident"
        | "sama_compliance"
      severity_level: "low" | "medium" | "high"
      transaction_status: "pending" | "completed" | "failed" | "cancelled"
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
      alert_status: ["new", "investigating", "resolved", "dismissed"],
      node_type: ["transaction", "account", "merchant", "location"],
      pattern_type: [
        "velocity_attack",
        "account_takeover",
        "location_anomaly",
        "amount_pattern",
        "merchant_fraud",
        "time_based",
        "account_muling",
      ],
      relationship_type: [
        "same_account",
        "same_merchant",
        "same_location",
        "time_proximity",
      ],
      report_type: [
        "daily",
        "weekly",
        "monthly",
        "quarterly",
        "incident",
        "sama_compliance",
      ],
      severity_level: ["low", "medium", "high"],
      transaction_status: ["pending", "completed", "failed", "cancelled"],
    },
  },
} as const
