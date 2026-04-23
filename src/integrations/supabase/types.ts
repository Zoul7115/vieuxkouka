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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      deliveries: {
        Row: {
          created_at: string | null
          id: string
          livreur_idx: number
          notes: string | null
          order_id: string | null
          status: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          livreur_idx: number
          notes?: string | null
          order_id?: string | null
          status: string
        }
        Update: {
          created_at?: string | null
          id?: string
          livreur_idx?: number
          notes?: string | null
          order_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "deliveries_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      livreurs: {
        Row: {
          active: boolean
          created_at: string
          emoji: string | null
          id: string
          idx: number
          name: string
          updated_at: string
          whatsapp: string
          zone: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          emoji?: string | null
          id?: string
          idx: number
          name: string
          updated_at?: string
          whatsapp: string
          zone?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string
          emoji?: string | null
          id?: string
          idx?: number
          name?: string
          updated_at?: string
          whatsapp?: string
          zone?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          ai_flags: string[] | null
          ai_score: number | null
          car_transport: string | null
          city: string | null
          country: string | null
          created_at: string | null
          first_name: string | null
          id: string
          is_available: boolean | null
          last_name: string | null
          livreur_idx: number | null
          neighborhood: string | null
          notes: string | null
          offer_label: string | null
          order_number: string
          product_name: string
          product_price: number
          product_slug: string | null
          source: string | null
          status: string | null
          whatsapp: string | null
        }
        Insert: {
          ai_flags?: string[] | null
          ai_score?: number | null
          car_transport?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          is_available?: boolean | null
          last_name?: string | null
          livreur_idx?: number | null
          neighborhood?: string | null
          notes?: string | null
          offer_label?: string | null
          order_number: string
          product_name: string
          product_price: number
          product_slug?: string | null
          source?: string | null
          status?: string | null
          whatsapp?: string | null
        }
        Update: {
          ai_flags?: string[] | null
          ai_score?: number | null
          car_transport?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          is_available?: boolean | null
          last_name?: string | null
          livreur_idx?: number | null
          neighborhood?: string | null
          notes?: string | null
          offer_label?: string | null
          order_number?: string
          product_name?: string
          product_price?: number
          product_slug?: string | null
          source?: string | null
          status?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      stock_transactions: {
        Row: {
          created_at: string | null
          id: string
          livreur_idx: number | null
          motif: string | null
          produit: string
          quantite: number
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          livreur_idx?: number | null
          motif?: string | null
          produit: string
          quantite: number
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          livreur_idx?: number | null
          motif?: string | null
          produit?: string
          quantite?: number
          type?: string
        }
        Relationships: []
      }
      visits: {
        Row: {
          city: string | null
          country: string | null
          device: string | null
          id: string
          page: string | null
          referrer: string | null
          source: string | null
          visited_at: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          device?: string | null
          id?: string
          page?: string | null
          referrer?: string | null
          source?: string | null
          visited_at?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          device?: string | null
          id?: string
          page?: string | null
          referrer?: string | null
          source?: string | null
          visited_at?: string | null
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
