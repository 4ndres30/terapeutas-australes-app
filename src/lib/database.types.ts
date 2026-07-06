export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      agenda_eventos: {
        Row: {
          caso_id: string | null
          confirmado_por_paciente: boolean
          consulta_id: string | null
          created_at: string
          created_by: string | null
          enlace_online: string | null
          estado_evento: string
          evaluacion_id: string | null
          fecha_fin: string | null
          fecha_inicio: string
          google_calendar_event_id: string | null
          google_calendar_sync_estado: string
          google_calendar_synced_at: string | null
          id_agenda_evento: string
          modalidad: string | null
          notas_internas: string | null
          origen_evento: string
          paciente_id: string | null
          requiere_confirmacion: boolean
          revision_id: string | null
          solicitud_agenda_id: string | null
          tipo_evento: string
          titulo_evento: string
          titulo_publico: string
          trabajo_id: string | null
          trabajo_sesion_id: string | null
          ubicacion: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          caso_id?: string | null
          confirmado_por_paciente?: boolean
          consulta_id?: string | null
          created_at?: string
          created_by?: string | null
          enlace_online?: string | null
          estado_evento?: string
          evaluacion_id?: string | null
          fecha_fin?: string | null
          fecha_inicio: string
          google_calendar_event_id?: string | null
          google_calendar_sync_estado?: string
          google_calendar_synced_at?: string | null
          id_agenda_evento?: string
          modalidad?: string | null
          notas_internas?: string | null
          origen_evento?: string
          paciente_id?: string | null
          requiere_confirmacion?: boolean
          revision_id?: string | null
          solicitud_agenda_id?: string | null
          tipo_evento: string
          titulo_evento: string
          titulo_publico?: string
          trabajo_id?: string | null
          trabajo_sesion_id?: string | null
          ubicacion?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          caso_id?: string | null
          confirmado_por_paciente?: boolean
          consulta_id?: string | null
          created_at?: string
          created_by?: string | null
          enlace_online?: string | null
          estado_evento?: string
          evaluacion_id?: string | null
          fecha_fin?: string | null
          fecha_inicio?: string
          google_calendar_event_id?: string | null
          google_calendar_sync_estado?: string
          google_calendar_synced_at?: string | null
          id_agenda_evento?: string
          modalidad?: string | null
          notas_internas?: string | null
          origen_evento?: string
          paciente_id?: string | null
          requiere_confirmacion?: boolean
          revision_id?: string | null
          solicitud_agenda_id?: string | null
          tipo_evento?: string
          titulo_evento?: string
          titulo_publico?: string
          trabajo_id?: string | null
          trabajo_sesion_id?: string | null
          ubicacion?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agenda_eventos_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "casos"
            referencedColumns: ["id_caso"]
          },
          {
            foreignKeyName: "agenda_eventos_consulta_id_fkey"
            columns: ["consulta_id"]
            isOneToOne: false
            referencedRelation: "consultas"
            referencedColumns: ["id_consulta"]
          },
          {
            foreignKeyName: "agenda_eventos_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuarios_internos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agenda_eventos_evaluacion_id_fkey"
            columns: ["evaluacion_id"]
            isOneToOne: false
            referencedRelation: "evaluaciones"
            referencedColumns: ["id_evaluacion"]
          },
          {
            foreignKeyName: "agenda_eventos_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agenda_eventos_revision_id_fkey"
            columns: ["revision_id"]
            isOneToOne: false
            referencedRelation: "revisiones"
            referencedColumns: ["id_revision"]
          },
          {
            foreignKeyName: "agenda_eventos_solicitud_agenda_id_fkey"
            columns: ["solicitud_agenda_id"]
            isOneToOne: false
            referencedRelation: "solicitudes_agenda"
            referencedColumns: ["id_solicitud_agenda"]
          },
          {
            foreignKeyName: "agenda_eventos_trabajo_id_fkey"
            columns: ["trabajo_id"]
            isOneToOne: false
            referencedRelation: "trabajos"
            referencedColumns: ["id_trabajo"]
          },
          {
            foreignKeyName: "agenda_eventos_trabajo_sesion_id_fkey"
            columns: ["trabajo_sesion_id"]
            isOneToOne: false
            referencedRelation: "trabajo_sesiones"
            referencedColumns: ["id_trabajo_sesion"]
          },
          {
            foreignKeyName: "agenda_eventos_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "usuarios_internos"
            referencedColumns: ["id"]
          },
        ]
      }
      casos: {
        Row: {
          consulta_id: string | null
          created_at: string
          descripcion_general: string | null
          estado_caso: string
          evaluacion_id: string | null
          fecha_apertura: string
          fecha_cierre: string | null
          hora_apertura: string
          id_caso: string
          motivo_apertura: string
          nombre_caso: string
          notas_internas: string | null
          notas_seguimiento: string | null
          objetivo_trabajo: string | null
          paciente_id: string
          prioridad: string
          requiere_seguimiento: boolean
          resultado_cierre: string | null
          tipo_caso: string
          updated_at: string
        }
        Insert: {
          consulta_id?: string | null
          created_at?: string
          descripcion_general?: string | null
          estado_caso?: string
          evaluacion_id?: string | null
          fecha_apertura?: string
          fecha_cierre?: string | null
          hora_apertura?: string
          id_caso?: string
          motivo_apertura: string
          nombre_caso: string
          notas_internas?: string | null
          notas_seguimiento?: string | null
          objetivo_trabajo?: string | null
          paciente_id: string
          prioridad?: string
          requiere_seguimiento?: boolean
          resultado_cierre?: string | null
          tipo_caso?: string
          updated_at?: string
        }
        Update: {
          consulta_id?: string | null
          created_at?: string
          descripcion_general?: string | null
          estado_caso?: string
          evaluacion_id?: string | null
          fecha_apertura?: string
          fecha_cierre?: string | null
          hora_apertura?: string
          id_caso?: string
          motivo_apertura?: string
          nombre_caso?: string
          notas_internas?: string | null
          notas_seguimiento?: string | null
          objetivo_trabajo?: string | null
          paciente_id?: string
          prioridad?: string
          requiere_seguimiento?: boolean
          resultado_cierre?: string | null
          tipo_caso?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "casos_consulta_id_fkey"
            columns: ["consulta_id"]
            isOneToOne: false
            referencedRelation: "consultas"
            referencedColumns: ["id_consulta"]
          },
          {
            foreignKeyName: "casos_evaluacion_id_fkey"
            columns: ["evaluacion_id"]
            isOneToOne: false
            referencedRelation: "evaluaciones"
            referencedColumns: ["id_evaluacion"]
          },
          {
            foreignKeyName: "casos_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      cobros: {
        Row: {
          caso_id: string | null
          concepto_cobro: string
          consulta_id: string | null
          created_at: string
          descripcion_cobro: string | null
          estado_cobro: string
          evaluacion_id: string | null
          fecha_cobro: string
          fecha_vencimiento: string | null
          id_cobro: string
          moneda: string
          monto_cobro: number
          monto_descuento: number
          monto_total: number | null
          notas_internas: string | null
          observaciones: string | null
          paciente_id: string
          revision_id: string | null
          tipo_cobro: string
          trabajo_id: string | null
          updated_at: string
        }
        Insert: {
          caso_id?: string | null
          concepto_cobro: string
          consulta_id?: string | null
          created_at?: string
          descripcion_cobro?: string | null
          estado_cobro?: string
          evaluacion_id?: string | null
          fecha_cobro?: string
          fecha_vencimiento?: string | null
          id_cobro?: string
          moneda?: string
          monto_cobro: number
          monto_descuento?: number
          monto_total?: number | null
          notas_internas?: string | null
          observaciones?: string | null
          paciente_id: string
          revision_id?: string | null
          tipo_cobro: string
          trabajo_id?: string | null
          updated_at?: string
        }
        Update: {
          caso_id?: string | null
          concepto_cobro?: string
          consulta_id?: string | null
          created_at?: string
          descripcion_cobro?: string | null
          estado_cobro?: string
          evaluacion_id?: string | null
          fecha_cobro?: string
          fecha_vencimiento?: string | null
          id_cobro?: string
          moneda?: string
          monto_cobro?: number
          monto_descuento?: number
          monto_total?: number | null
          notas_internas?: string | null
          observaciones?: string | null
          paciente_id?: string
          revision_id?: string | null
          tipo_cobro?: string
          trabajo_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cobros_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "casos"
            referencedColumns: ["id_caso"]
          },
          {
            foreignKeyName: "cobros_consulta_id_fkey"
            columns: ["consulta_id"]
            isOneToOne: false
            referencedRelation: "consultas"
            referencedColumns: ["id_consulta"]
          },
          {
            foreignKeyName: "cobros_evaluacion_id_fkey"
            columns: ["evaluacion_id"]
            isOneToOne: false
            referencedRelation: "evaluaciones"
            referencedColumns: ["id_evaluacion"]
          },
          {
            foreignKeyName: "cobros_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cobros_revision_id_fkey"
            columns: ["revision_id"]
            isOneToOne: false
            referencedRelation: "revisiones"
            referencedColumns: ["id_revision"]
          },
          {
            foreignKeyName: "cobros_trabajo_id_fkey"
            columns: ["trabajo_id"]
            isOneToOne: false
            referencedRelation: "trabajos"
            referencedColumns: ["id_trabajo"]
          },
        ]
      }
      consultas: {
        Row: {
          created_at: string
          estado_consulta: string
          fecha_consulta: string
          hora_inicio: string | null
          hora_termino: string | null
          id_consulta: string
          modalidad: string
          motivo_consulta: string
          observaciones_internas: string | null
          paciente_id: string
          resumen_consulta: string | null
          tipo_consulta: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          estado_consulta?: string
          fecha_consulta?: string
          hora_inicio?: string | null
          hora_termino?: string | null
          id_consulta?: string
          modalidad: string
          motivo_consulta: string
          observaciones_internas?: string | null
          paciente_id: string
          resumen_consulta?: string | null
          tipo_consulta: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          estado_consulta?: string
          fecha_consulta?: string
          hora_inicio?: string | null
          hora_termino?: string | null
          id_consulta?: string
          modalidad?: string
          motivo_consulta?: string
          observaciones_internas?: string | null
          paciente_id?: string
          resumen_consulta?: string | null
          tipo_consulta?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultas_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      elementos_caso: {
        Row: {
          antecedentes_relevantes: string | null
          caso_id: string
          created_at: string
          descripcion_referencia: string | null
          estado_elemento: string
          fecha_nacimiento: string | null
          foto_url: string | null
          fuente_informacion: string
          id_elemento_caso: string
          motivo_inclusion: string | null
          nivel_confirmacion: string
          nombre_elemento: string
          notas_internas: string | null
          orden_elemento: number | null
          paciente_id: string
          prioridad_elemento: string
          rol_en_caso: string
          tipo_elemento: string
          updated_at: string
          vinculo_con_paciente: string | null
        }
        Insert: {
          antecedentes_relevantes?: string | null
          caso_id: string
          created_at?: string
          descripcion_referencia?: string | null
          estado_elemento?: string
          fecha_nacimiento?: string | null
          foto_url?: string | null
          fuente_informacion?: string
          id_elemento_caso?: string
          motivo_inclusion?: string | null
          nivel_confirmacion?: string
          nombre_elemento: string
          notas_internas?: string | null
          orden_elemento?: number | null
          paciente_id: string
          prioridad_elemento?: string
          rol_en_caso: string
          tipo_elemento: string
          updated_at?: string
          vinculo_con_paciente?: string | null
        }
        Update: {
          antecedentes_relevantes?: string | null
          caso_id?: string
          created_at?: string
          descripcion_referencia?: string | null
          estado_elemento?: string
          fecha_nacimiento?: string | null
          foto_url?: string | null
          fuente_informacion?: string
          id_elemento_caso?: string
          motivo_inclusion?: string | null
          nivel_confirmacion?: string
          nombre_elemento?: string
          notas_internas?: string | null
          orden_elemento?: number | null
          paciente_id?: string
          prioridad_elemento?: string
          rol_en_caso?: string
          tipo_elemento?: string
          updated_at?: string
          vinculo_con_paciente?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "elementos_caso_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "casos"
            referencedColumns: ["id_caso"]
          },
          {
            foreignKeyName: "elementos_caso_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      evaluaciones: {
        Row: {
          consulta_id: string
          created_at: string
          decision_revision: string
          estado_evaluacion: string
          fecha_evaluacion: string
          fundamento_decision: string | null
          hechos_clave: string | null
          hora_evaluacion: string
          id_evaluacion: string
          notas_internas: string | null
          paciente_id: string
          personas_mencionadas: string | null
          relato_antecedentes: string
          sintomas_reportados: string | null
          updated_at: string
        }
        Insert: {
          consulta_id: string
          created_at?: string
          decision_revision?: string
          estado_evaluacion?: string
          fecha_evaluacion?: string
          fundamento_decision?: string | null
          hechos_clave?: string | null
          hora_evaluacion?: string
          id_evaluacion?: string
          notas_internas?: string | null
          paciente_id: string
          personas_mencionadas?: string | null
          relato_antecedentes: string
          sintomas_reportados?: string | null
          updated_at?: string
        }
        Update: {
          consulta_id?: string
          created_at?: string
          decision_revision?: string
          estado_evaluacion?: string
          fecha_evaluacion?: string
          fundamento_decision?: string | null
          hechos_clave?: string | null
          hora_evaluacion?: string
          id_evaluacion?: string
          notas_internas?: string | null
          paciente_id?: string
          personas_mencionadas?: string | null
          relato_antecedentes?: string
          sintomas_reportados?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "evaluaciones_consulta_id_fkey"
            columns: ["consulta_id"]
            isOneToOne: false
            referencedRelation: "consultas"
            referencedColumns: ["id_consulta"]
          },
          {
            foreignKeyName: "evaluaciones_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      fotos_elementos_caso: {
        Row: {
          bucket_id: string
          caso_id: string
          created_at: string
          descripcion: string | null
          elemento_caso_id: string
          es_principal: boolean
          estado_foto: string
          id_foto_elemento_caso: string
          mime_type: string
          nombre_archivo: string
          paciente_id: string
          storage_path: string
          tamano_bytes: number | null
          tipo_foto: string
          updated_at: string
        }
        Insert: {
          bucket_id?: string
          caso_id: string
          created_at?: string
          descripcion?: string | null
          elemento_caso_id: string
          es_principal?: boolean
          estado_foto?: string
          id_foto_elemento_caso?: string
          mime_type: string
          nombre_archivo: string
          paciente_id: string
          storage_path: string
          tamano_bytes?: number | null
          tipo_foto?: string
          updated_at?: string
        }
        Update: {
          bucket_id?: string
          caso_id?: string
          created_at?: string
          descripcion?: string | null
          elemento_caso_id?: string
          es_principal?: boolean
          estado_foto?: string
          id_foto_elemento_caso?: string
          mime_type?: string
          nombre_archivo?: string
          paciente_id?: string
          storage_path?: string
          tamano_bytes?: number | null
          tipo_foto?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fotos_elementos_caso_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "casos"
            referencedColumns: ["id_caso"]
          },
          {
            foreignKeyName: "fotos_elementos_caso_elemento_caso_id_fkey"
            columns: ["elemento_caso_id"]
            isOneToOne: false
            referencedRelation: "elementos_caso"
            referencedColumns: ["id_elemento_caso"]
          },
          {
            foreignKeyName: "fotos_elementos_caso_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      pacientes: {
        Row: {
          apellidos: string
          comuna: string
          created_at: string
          email: string
          estado: string
          fecha_nacimiento: string
          id: string
          nombres: string
          region: string
          sexo: string
          telefono: string
          updated_at: string
        }
        Insert: {
          apellidos: string
          comuna: string
          created_at?: string
          email: string
          estado?: string
          fecha_nacimiento: string
          id?: string
          nombres: string
          region: string
          sexo: string
          telefono: string
          updated_at?: string
        }
        Update: {
          apellidos?: string
          comuna?: string
          created_at?: string
          email?: string
          estado?: string
          fecha_nacimiento?: string
          id?: string
          nombres?: string
          region?: string
          sexo?: string
          telefono?: string
          updated_at?: string
        }
        Relationships: []
      }
      pagos: {
        Row: {
          cobro_id: string
          comprobante_url: string | null
          created_at: string
          estado_pago: string
          fecha_pago: string
          hora_pago: string
          id_pago: string
          metodo_pago: string
          moneda: string
          monto_pago: number
          notas_internas: string | null
          observaciones: string | null
          paciente_id: string
          recibido_por: string | null
          referencia_pago: string | null
          updated_at: string
        }
        Insert: {
          cobro_id: string
          comprobante_url?: string | null
          created_at?: string
          estado_pago?: string
          fecha_pago?: string
          hora_pago?: string
          id_pago?: string
          metodo_pago: string
          moneda?: string
          monto_pago: number
          notas_internas?: string | null
          observaciones?: string | null
          paciente_id: string
          recibido_por?: string | null
          referencia_pago?: string | null
          updated_at?: string
        }
        Update: {
          cobro_id?: string
          comprobante_url?: string | null
          created_at?: string
          estado_pago?: string
          fecha_pago?: string
          hora_pago?: string
          id_pago?: string
          metodo_pago?: string
          moneda?: string
          monto_pago?: number
          notas_internas?: string | null
          observaciones?: string | null
          paciente_id?: string
          recibido_por?: string | null
          referencia_pago?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pagos_cobro_id_fkey"
            columns: ["cobro_id"]
            isOneToOne: false
            referencedRelation: "cobros"
            referencedColumns: ["id_cobro"]
          },
          {
            foreignKeyName: "pagos_cobro_id_fkey"
            columns: ["cobro_id"]
            isOneToOne: false
            referencedRelation: "vista_cobros_estado"
            referencedColumns: ["id_cobro"]
          },
          {
            foreignKeyName: "pagos_cobro_id_fkey"
            columns: ["cobro_id"]
            isOneToOne: false
            referencedRelation: "vista_finanzas_fotos_auditoria"
            referencedColumns: ["id_cobro"]
          },
          {
            foreignKeyName: "pagos_cobro_id_fkey"
            columns: ["cobro_id"]
            isOneToOne: false
            referencedRelation: "vista_finanzas_unidades_cobrables"
            referencedColumns: ["id_cobro"]
          },
          {
            foreignKeyName: "pagos_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      revision_aspectos: {
        Row: {
          area_revision: string
          aspecto_revisado: string
          caso_id: string
          created_at: string
          elemento_caso_id: string
          estado_revision_aspecto: string
          id_revision_aspecto: string
          informacion_canalizada: string | null
          metodo_revision: string
          metrica_revision: string | null
          motivo_pendiente: string | null
          notas_internas: string | null
          observaciones: string | null
          orden_aspecto: number | null
          paciente_id: string
          pendiente_revision: boolean
          presencia_detectada: boolean | null
          requiere_seguimiento: boolean
          resultado_aspecto: string | null
          revision_elemento_id: string
          revision_id: string
          tipo_detectado: string | null
          tipo_medicion: string
          updated_at: string
          valor_porcentaje: number | null
        }
        Insert: {
          area_revision: string
          aspecto_revisado: string
          caso_id: string
          created_at?: string
          elemento_caso_id: string
          estado_revision_aspecto?: string
          id_revision_aspecto?: string
          informacion_canalizada?: string | null
          metodo_revision?: string
          metrica_revision?: string | null
          motivo_pendiente?: string | null
          notas_internas?: string | null
          observaciones?: string | null
          orden_aspecto?: number | null
          paciente_id: string
          pendiente_revision?: boolean
          presencia_detectada?: boolean | null
          requiere_seguimiento?: boolean
          resultado_aspecto?: string | null
          revision_elemento_id: string
          revision_id: string
          tipo_detectado?: string | null
          tipo_medicion: string
          updated_at?: string
          valor_porcentaje?: number | null
        }
        Update: {
          area_revision?: string
          aspecto_revisado?: string
          caso_id?: string
          created_at?: string
          elemento_caso_id?: string
          estado_revision_aspecto?: string
          id_revision_aspecto?: string
          informacion_canalizada?: string | null
          metodo_revision?: string
          metrica_revision?: string | null
          motivo_pendiente?: string | null
          notas_internas?: string | null
          observaciones?: string | null
          orden_aspecto?: number | null
          paciente_id?: string
          pendiente_revision?: boolean
          presencia_detectada?: boolean | null
          requiere_seguimiento?: boolean
          resultado_aspecto?: string | null
          revision_elemento_id?: string
          revision_id?: string
          tipo_detectado?: string | null
          tipo_medicion?: string
          updated_at?: string
          valor_porcentaje?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "revision_aspectos_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "casos"
            referencedColumns: ["id_caso"]
          },
          {
            foreignKeyName: "revision_aspectos_elemento_caso_id_fkey"
            columns: ["elemento_caso_id"]
            isOneToOne: false
            referencedRelation: "elementos_caso"
            referencedColumns: ["id_elemento_caso"]
          },
          {
            foreignKeyName: "revision_aspectos_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "revision_aspectos_revision_elemento_id_fkey"
            columns: ["revision_elemento_id"]
            isOneToOne: false
            referencedRelation: "revision_elementos"
            referencedColumns: ["id_revision_elemento"]
          },
          {
            foreignKeyName: "revision_aspectos_revision_id_fkey"
            columns: ["revision_id"]
            isOneToOne: false
            referencedRelation: "revisiones"
            referencedColumns: ["id_revision"]
          },
        ]
      }
      revision_elementos: {
        Row: {
          caso_id: string
          created_at: string
          elemento_caso_id: string
          estado_revision_elemento: string
          id_revision_elemento: string
          motivo_pendiente: string | null
          notas_internas: string | null
          orden_revision: number | null
          paciente_id: string
          prioridad_revision: string
          proxima_accion_elemento: string | null
          requiere_seguimiento: boolean
          resumen_elemento: string | null
          revision_id: string
          updated_at: string
        }
        Insert: {
          caso_id: string
          created_at?: string
          elemento_caso_id: string
          estado_revision_elemento?: string
          id_revision_elemento?: string
          motivo_pendiente?: string | null
          notas_internas?: string | null
          orden_revision?: number | null
          paciente_id: string
          prioridad_revision?: string
          proxima_accion_elemento?: string | null
          requiere_seguimiento?: boolean
          resumen_elemento?: string | null
          revision_id: string
          updated_at?: string
        }
        Update: {
          caso_id?: string
          created_at?: string
          elemento_caso_id?: string
          estado_revision_elemento?: string
          id_revision_elemento?: string
          motivo_pendiente?: string | null
          notas_internas?: string | null
          orden_revision?: number | null
          paciente_id?: string
          prioridad_revision?: string
          proxima_accion_elemento?: string | null
          requiere_seguimiento?: boolean
          resumen_elemento?: string | null
          revision_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "revision_elementos_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "casos"
            referencedColumns: ["id_caso"]
          },
          {
            foreignKeyName: "revision_elementos_elemento_caso_id_fkey"
            columns: ["elemento_caso_id"]
            isOneToOne: false
            referencedRelation: "elementos_caso"
            referencedColumns: ["id_elemento_caso"]
          },
          {
            foreignKeyName: "revision_elementos_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "revision_elementos_revision_id_fkey"
            columns: ["revision_id"]
            isOneToOne: false
            referencedRelation: "revisiones"
            referencedColumns: ["id_revision"]
          },
        ]
      }
      revision_hallazgos: {
        Row: {
          caso_id: string
          categoria_hallazgo: string
          created_at: string
          descripcion_hallazgo: string
          elemento_caso_id: string
          estado_hallazgo: string
          fuente_deteccion: string
          id_revision_hallazgo: string
          informacion_canalizada: string | null
          intensidad_hallazgo_porcentaje: number | null
          nivel_bloqueo_porcentaje: number | null
          nivel_confirmacion: string
          notas_internas: string | null
          observaciones: string | null
          origen_sugerido: string | null
          paciente_id: string
          prioridad_hallazgo: string | null
          requiere_seguimiento: boolean
          revision_aspecto_id: string
          revision_elemento_id: string
          revision_id: string
          subtipo_hallazgo: string | null
          tipo_hallazgo: string | null
          updated_at: string
        }
        Insert: {
          caso_id: string
          categoria_hallazgo: string
          created_at?: string
          descripcion_hallazgo: string
          elemento_caso_id: string
          estado_hallazgo?: string
          fuente_deteccion?: string
          id_revision_hallazgo?: string
          informacion_canalizada?: string | null
          intensidad_hallazgo_porcentaje?: number | null
          nivel_bloqueo_porcentaje?: number | null
          nivel_confirmacion?: string
          notas_internas?: string | null
          observaciones?: string | null
          origen_sugerido?: string | null
          paciente_id: string
          prioridad_hallazgo?: string | null
          requiere_seguimiento?: boolean
          revision_aspecto_id: string
          revision_elemento_id: string
          revision_id: string
          subtipo_hallazgo?: string | null
          tipo_hallazgo?: string | null
          updated_at?: string
        }
        Update: {
          caso_id?: string
          categoria_hallazgo?: string
          created_at?: string
          descripcion_hallazgo?: string
          elemento_caso_id?: string
          estado_hallazgo?: string
          fuente_deteccion?: string
          id_revision_hallazgo?: string
          informacion_canalizada?: string | null
          intensidad_hallazgo_porcentaje?: number | null
          nivel_bloqueo_porcentaje?: number | null
          nivel_confirmacion?: string
          notas_internas?: string | null
          observaciones?: string | null
          origen_sugerido?: string | null
          paciente_id?: string
          prioridad_hallazgo?: string | null
          requiere_seguimiento?: boolean
          revision_aspecto_id?: string
          revision_elemento_id?: string
          revision_id?: string
          subtipo_hallazgo?: string | null
          tipo_hallazgo?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "revision_hallazgos_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "casos"
            referencedColumns: ["id_caso"]
          },
          {
            foreignKeyName: "revision_hallazgos_elemento_caso_id_fkey"
            columns: ["elemento_caso_id"]
            isOneToOne: false
            referencedRelation: "elementos_caso"
            referencedColumns: ["id_elemento_caso"]
          },
          {
            foreignKeyName: "revision_hallazgos_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "revision_hallazgos_revision_aspecto_id_fkey"
            columns: ["revision_aspecto_id"]
            isOneToOne: false
            referencedRelation: "revision_aspectos"
            referencedColumns: ["id_revision_aspecto"]
          },
          {
            foreignKeyName: "revision_hallazgos_revision_elemento_id_fkey"
            columns: ["revision_elemento_id"]
            isOneToOne: false
            referencedRelation: "revision_elementos"
            referencedColumns: ["id_revision_elemento"]
          },
          {
            foreignKeyName: "revision_hallazgos_revision_id_fkey"
            columns: ["revision_id"]
            isOneToOne: false
            referencedRelation: "revisiones"
            referencedColumns: ["id_revision"]
          },
        ]
      }
      revisiones: {
        Row: {
          alcance_revision: string
          caso_id: string
          consulta_id: string | null
          created_at: string
          estado_revision: string
          evaluacion_id: string | null
          fecha_revision: string
          hora_inicio: string | null
          hora_termino: string | null
          id_revision: string
          metodo_revision: string
          modalidad: string
          notas_internas: string | null
          numero_revision: number
          objetivo_revision: string
          paciente_id: string
          proxima_accion: string | null
          requiere_seguimiento: boolean
          resultado_general: string | null
          resumen_general: string | null
          tipo_revision: string
          updated_at: string
        }
        Insert: {
          alcance_revision: string
          caso_id: string
          consulta_id?: string | null
          created_at?: string
          estado_revision?: string
          evaluacion_id?: string | null
          fecha_revision?: string
          hora_inicio?: string | null
          hora_termino?: string | null
          id_revision?: string
          metodo_revision?: string
          modalidad: string
          notas_internas?: string | null
          numero_revision: number
          objetivo_revision: string
          paciente_id: string
          proxima_accion?: string | null
          requiere_seguimiento?: boolean
          resultado_general?: string | null
          resumen_general?: string | null
          tipo_revision: string
          updated_at?: string
        }
        Update: {
          alcance_revision?: string
          caso_id?: string
          consulta_id?: string | null
          created_at?: string
          estado_revision?: string
          evaluacion_id?: string | null
          fecha_revision?: string
          hora_inicio?: string | null
          hora_termino?: string | null
          id_revision?: string
          metodo_revision?: string
          modalidad?: string
          notas_internas?: string | null
          numero_revision?: number
          objetivo_revision?: string
          paciente_id?: string
          proxima_accion?: string | null
          requiere_seguimiento?: boolean
          resultado_general?: string | null
          resumen_general?: string | null
          tipo_revision?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "revisiones_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "casos"
            referencedColumns: ["id_caso"]
          },
          {
            foreignKeyName: "revisiones_consulta_id_fkey"
            columns: ["consulta_id"]
            isOneToOne: false
            referencedRelation: "consultas"
            referencedColumns: ["id_consulta"]
          },
          {
            foreignKeyName: "revisiones_evaluacion_id_fkey"
            columns: ["evaluacion_id"]
            isOneToOne: false
            referencedRelation: "evaluaciones"
            referencedColumns: ["id_evaluacion"]
          },
          {
            foreignKeyName: "revisiones_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      solicitudes_agenda: {
        Row: {
          canal_preferido: string | null
          confirmada_at: string | null
          consentimiento_contacto: boolean
          consentimiento_version: string | null
          consulta_id: string | null
          created_at: string
          created_by: string | null
          decision_interna: string | null
          email_contacto: string | null
          estado_solicitud: string
          fecha_consentimiento: string | null
          fecha_preferida: string | null
          fecha_solicitud: string
          id_solicitud_agenda: string
          idempotency_key: string | null
          ip_hash: string | null
          mensaje_contacto: string | null
          modalidad_preferida: string | null
          motivo_rechazo: string | null
          nombre_contacto: string
          notas_internas: string | null
          origen_solicitud: string
          paciente_id: string | null
          rango_horario_preferido: string | null
          responsable_interno_id: string | null
          revisada_at: string | null
          telefono_contacto: string | null
          tipo_atencion_solicitada: string | null
          updated_at: string
          updated_by: string | null
          user_agent_hash: string | null
        }
        Insert: {
          canal_preferido?: string | null
          confirmada_at?: string | null
          consentimiento_contacto?: boolean
          consentimiento_version?: string | null
          consulta_id?: string | null
          created_at?: string
          created_by?: string | null
          decision_interna?: string | null
          email_contacto?: string | null
          estado_solicitud?: string
          fecha_consentimiento?: string | null
          fecha_preferida?: string | null
          fecha_solicitud?: string
          id_solicitud_agenda?: string
          idempotency_key?: string | null
          ip_hash?: string | null
          mensaje_contacto?: string | null
          modalidad_preferida?: string | null
          motivo_rechazo?: string | null
          nombre_contacto: string
          notas_internas?: string | null
          origen_solicitud?: string
          paciente_id?: string | null
          rango_horario_preferido?: string | null
          responsable_interno_id?: string | null
          revisada_at?: string | null
          telefono_contacto?: string | null
          tipo_atencion_solicitada?: string | null
          updated_at?: string
          updated_by?: string | null
          user_agent_hash?: string | null
        }
        Update: {
          canal_preferido?: string | null
          confirmada_at?: string | null
          consentimiento_contacto?: boolean
          consentimiento_version?: string | null
          consulta_id?: string | null
          created_at?: string
          created_by?: string | null
          decision_interna?: string | null
          email_contacto?: string | null
          estado_solicitud?: string
          fecha_consentimiento?: string | null
          fecha_preferida?: string | null
          fecha_solicitud?: string
          id_solicitud_agenda?: string
          idempotency_key?: string | null
          ip_hash?: string | null
          mensaje_contacto?: string | null
          modalidad_preferida?: string | null
          motivo_rechazo?: string | null
          nombre_contacto?: string
          notas_internas?: string | null
          origen_solicitud?: string
          paciente_id?: string | null
          rango_horario_preferido?: string | null
          responsable_interno_id?: string | null
          revisada_at?: string | null
          telefono_contacto?: string | null
          tipo_atencion_solicitada?: string | null
          updated_at?: string
          updated_by?: string | null
          user_agent_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "solicitudes_agenda_consulta_id_fkey"
            columns: ["consulta_id"]
            isOneToOne: false
            referencedRelation: "consultas"
            referencedColumns: ["id_consulta"]
          },
          {
            foreignKeyName: "solicitudes_agenda_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuarios_internos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitudes_agenda_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitudes_agenda_responsable_interno_id_fkey"
            columns: ["responsable_interno_id"]
            isOneToOne: false
            referencedRelation: "usuarios_internos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitudes_agenda_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "usuarios_internos"
            referencedColumns: ["id"]
          },
        ]
      }
      trabajo_acciones: {
        Row: {
          accion_realizada: string
          caso_id: string
          created_at: string
          elemento_caso_id: string
          estado_posterior_elemento: string | null
          estado_previo_elemento: string | null
          id_trabajo_accion: string
          informacion_canalizada: string | null
          metodo_accion: string | null
          notas_internas: string | null
          observaciones: string | null
          orden_accion: number | null
          paciente_id: string
          porcentaje_avance_accion: number
          requiere_seguimiento: boolean
          resultado_accion: string | null
          revision_hallazgo_id: string | null
          tipo_intervencion: string
          tipo_sello: string | null
          trabajo_elemento_id: string
          trabajo_id: string
          trabajo_sesion_id: string
          updated_at: string
        }
        Insert: {
          accion_realizada: string
          caso_id: string
          created_at?: string
          elemento_caso_id: string
          estado_posterior_elemento?: string | null
          estado_previo_elemento?: string | null
          id_trabajo_accion?: string
          informacion_canalizada?: string | null
          metodo_accion?: string | null
          notas_internas?: string | null
          observaciones?: string | null
          orden_accion?: number | null
          paciente_id: string
          porcentaje_avance_accion?: number
          requiere_seguimiento?: boolean
          resultado_accion?: string | null
          revision_hallazgo_id?: string | null
          tipo_intervencion: string
          tipo_sello?: string | null
          trabajo_elemento_id: string
          trabajo_id: string
          trabajo_sesion_id: string
          updated_at?: string
        }
        Update: {
          accion_realizada?: string
          caso_id?: string
          created_at?: string
          elemento_caso_id?: string
          estado_posterior_elemento?: string | null
          estado_previo_elemento?: string | null
          id_trabajo_accion?: string
          informacion_canalizada?: string | null
          metodo_accion?: string | null
          notas_internas?: string | null
          observaciones?: string | null
          orden_accion?: number | null
          paciente_id?: string
          porcentaje_avance_accion?: number
          requiere_seguimiento?: boolean
          resultado_accion?: string | null
          revision_hallazgo_id?: string | null
          tipo_intervencion?: string
          tipo_sello?: string | null
          trabajo_elemento_id?: string
          trabajo_id?: string
          trabajo_sesion_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trabajo_acciones_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "casos"
            referencedColumns: ["id_caso"]
          },
          {
            foreignKeyName: "trabajo_acciones_elemento_caso_id_fkey"
            columns: ["elemento_caso_id"]
            isOneToOne: false
            referencedRelation: "elementos_caso"
            referencedColumns: ["id_elemento_caso"]
          },
          {
            foreignKeyName: "trabajo_acciones_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trabajo_acciones_revision_hallazgo_id_fkey"
            columns: ["revision_hallazgo_id"]
            isOneToOne: false
            referencedRelation: "revision_hallazgos"
            referencedColumns: ["id_revision_hallazgo"]
          },
          {
            foreignKeyName: "trabajo_acciones_trabajo_elemento_id_fkey"
            columns: ["trabajo_elemento_id"]
            isOneToOne: false
            referencedRelation: "trabajo_elementos"
            referencedColumns: ["id_trabajo_elemento"]
          },
          {
            foreignKeyName: "trabajo_acciones_trabajo_id_fkey"
            columns: ["trabajo_id"]
            isOneToOne: false
            referencedRelation: "trabajos"
            referencedColumns: ["id_trabajo"]
          },
          {
            foreignKeyName: "trabajo_acciones_trabajo_sesion_id_fkey"
            columns: ["trabajo_sesion_id"]
            isOneToOne: false
            referencedRelation: "trabajo_sesiones"
            referencedColumns: ["id_trabajo_sesion"]
          },
        ]
      }
      trabajo_elementos: {
        Row: {
          caso_id: string
          created_at: string
          elemento_caso_id: string
          estado_final_resumen: string | null
          estado_inicial_resumen: string | null
          estado_trabajo_elemento: string
          id_trabajo_elemento: string
          notas_internas: string | null
          objetivo_elemento: string | null
          observaciones: string | null
          orden_trabajo: number | null
          paciente_id: string
          porcentaje_avance_elemento: number
          prioridad_elemento_trabajo: string
          requiere_seguimiento: boolean
          revision_hallazgo_id: string | null
          rol_en_trabajo: string
          tipo_intervencion_prevista: string | null
          trabajo_id: string
          updated_at: string
        }
        Insert: {
          caso_id: string
          created_at?: string
          elemento_caso_id: string
          estado_final_resumen?: string | null
          estado_inicial_resumen?: string | null
          estado_trabajo_elemento?: string
          id_trabajo_elemento?: string
          notas_internas?: string | null
          objetivo_elemento?: string | null
          observaciones?: string | null
          orden_trabajo?: number | null
          paciente_id: string
          porcentaje_avance_elemento?: number
          prioridad_elemento_trabajo?: string
          requiere_seguimiento?: boolean
          revision_hallazgo_id?: string | null
          rol_en_trabajo: string
          tipo_intervencion_prevista?: string | null
          trabajo_id: string
          updated_at?: string
        }
        Update: {
          caso_id?: string
          created_at?: string
          elemento_caso_id?: string
          estado_final_resumen?: string | null
          estado_inicial_resumen?: string | null
          estado_trabajo_elemento?: string
          id_trabajo_elemento?: string
          notas_internas?: string | null
          objetivo_elemento?: string | null
          observaciones?: string | null
          orden_trabajo?: number | null
          paciente_id?: string
          porcentaje_avance_elemento?: number
          prioridad_elemento_trabajo?: string
          requiere_seguimiento?: boolean
          revision_hallazgo_id?: string | null
          rol_en_trabajo?: string
          tipo_intervencion_prevista?: string | null
          trabajo_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trabajo_elementos_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "casos"
            referencedColumns: ["id_caso"]
          },
          {
            foreignKeyName: "trabajo_elementos_elemento_caso_id_fkey"
            columns: ["elemento_caso_id"]
            isOneToOne: false
            referencedRelation: "elementos_caso"
            referencedColumns: ["id_elemento_caso"]
          },
          {
            foreignKeyName: "trabajo_elementos_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trabajo_elementos_revision_hallazgo_id_fkey"
            columns: ["revision_hallazgo_id"]
            isOneToOne: false
            referencedRelation: "revision_hallazgos"
            referencedColumns: ["id_revision_hallazgo"]
          },
          {
            foreignKeyName: "trabajo_elementos_trabajo_id_fkey"
            columns: ["trabajo_id"]
            isOneToOne: false
            referencedRelation: "trabajos"
            referencedColumns: ["id_trabajo"]
          },
        ]
      }
      trabajo_sesiones: {
        Row: {
          acciones_realizadas: string | null
          caso_id: string
          created_at: string
          estado_posterior_resumen: string | null
          estado_previo_resumen: string | null
          estado_sesion: string
          fase_sesion: string
          fecha_sesion: string
          hora_inicio: string | null
          hora_termino: string | null
          id_trabajo_sesion: string
          notas_internas: string | null
          numero_semana: number | null
          numero_sesion: number
          objetivo_sesion: string | null
          observaciones: string | null
          paciente_id: string
          porcentaje_avance_sesion: number
          proxima_fecha_sugerida: string | null
          requiere_continuidad: boolean
          requiere_revision_posterior: boolean
          resultado_sesion: string | null
          revision_posterior_id: string | null
          revision_previa_id: string | null
          tipo_sesion: string
          trabajo_id: string
          updated_at: string
        }
        Insert: {
          acciones_realizadas?: string | null
          caso_id: string
          created_at?: string
          estado_posterior_resumen?: string | null
          estado_previo_resumen?: string | null
          estado_sesion?: string
          fase_sesion: string
          fecha_sesion?: string
          hora_inicio?: string | null
          hora_termino?: string | null
          id_trabajo_sesion?: string
          notas_internas?: string | null
          numero_semana?: number | null
          numero_sesion: number
          objetivo_sesion?: string | null
          observaciones?: string | null
          paciente_id: string
          porcentaje_avance_sesion?: number
          proxima_fecha_sugerida?: string | null
          requiere_continuidad?: boolean
          requiere_revision_posterior?: boolean
          resultado_sesion?: string | null
          revision_posterior_id?: string | null
          revision_previa_id?: string | null
          tipo_sesion: string
          trabajo_id: string
          updated_at?: string
        }
        Update: {
          acciones_realizadas?: string | null
          caso_id?: string
          created_at?: string
          estado_posterior_resumen?: string | null
          estado_previo_resumen?: string | null
          estado_sesion?: string
          fase_sesion?: string
          fecha_sesion?: string
          hora_inicio?: string | null
          hora_termino?: string | null
          id_trabajo_sesion?: string
          notas_internas?: string | null
          numero_semana?: number | null
          numero_sesion?: number
          objetivo_sesion?: string | null
          observaciones?: string | null
          paciente_id?: string
          porcentaje_avance_sesion?: number
          proxima_fecha_sugerida?: string | null
          requiere_continuidad?: boolean
          requiere_revision_posterior?: boolean
          resultado_sesion?: string | null
          revision_posterior_id?: string | null
          revision_previa_id?: string | null
          tipo_sesion?: string
          trabajo_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trabajo_sesiones_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "casos"
            referencedColumns: ["id_caso"]
          },
          {
            foreignKeyName: "trabajo_sesiones_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trabajo_sesiones_revision_posterior_id_fkey"
            columns: ["revision_posterior_id"]
            isOneToOne: false
            referencedRelation: "revisiones"
            referencedColumns: ["id_revision"]
          },
          {
            foreignKeyName: "trabajo_sesiones_revision_previa_id_fkey"
            columns: ["revision_previa_id"]
            isOneToOne: false
            referencedRelation: "revisiones"
            referencedColumns: ["id_revision"]
          },
          {
            foreignKeyName: "trabajo_sesiones_trabajo_id_fkey"
            columns: ["trabajo_id"]
            isOneToOne: false
            referencedRelation: "trabajos"
            referencedColumns: ["id_trabajo"]
          },
        ]
      }
      trabajos: {
        Row: {
          alcance_trabajo: string
          ambito_trabajo: string
          caso_id: string
          created_at: string
          descripcion_plan: string | null
          dias_planificados: string | null
          duracion_estimada_semanas: number | null
          estado_trabajo: string
          fase_actual: string
          fecha_cierre: string | null
          fecha_estimada_cierre: string | null
          fecha_inicio: string
          frecuencia_planificada: string | null
          id_trabajo: string
          metodo_principal: string
          modalidad_ejecucion: string
          nombre_trabajo: string
          notas_internas: string | null
          numero_trabajo: number
          objetivo_trabajo: string
          observaciones: string | null
          paciente_id: string
          porcentaje_avance_general: number
          prioridad_trabajo: string
          proxima_accion: string | null
          requiere_revision_posterior: boolean
          requiere_revision_previa: boolean
          requiere_seguimiento: boolean
          resultado_general: string | null
          revision_cierre_id: string | null
          revision_hallazgo_origen_id: string | null
          revision_inicial_id: string | null
          tipo_trabajo: string
          updated_at: string
        }
        Insert: {
          alcance_trabajo: string
          ambito_trabajo: string
          caso_id: string
          created_at?: string
          descripcion_plan?: string | null
          dias_planificados?: string | null
          duracion_estimada_semanas?: number | null
          estado_trabajo?: string
          fase_actual?: string
          fecha_cierre?: string | null
          fecha_estimada_cierre?: string | null
          fecha_inicio?: string
          frecuencia_planificada?: string | null
          id_trabajo?: string
          metodo_principal?: string
          modalidad_ejecucion?: string
          nombre_trabajo: string
          notas_internas?: string | null
          numero_trabajo: number
          objetivo_trabajo: string
          observaciones?: string | null
          paciente_id: string
          porcentaje_avance_general?: number
          prioridad_trabajo?: string
          proxima_accion?: string | null
          requiere_revision_posterior?: boolean
          requiere_revision_previa?: boolean
          requiere_seguimiento?: boolean
          resultado_general?: string | null
          revision_cierre_id?: string | null
          revision_hallazgo_origen_id?: string | null
          revision_inicial_id?: string | null
          tipo_trabajo: string
          updated_at?: string
        }
        Update: {
          alcance_trabajo?: string
          ambito_trabajo?: string
          caso_id?: string
          created_at?: string
          descripcion_plan?: string | null
          dias_planificados?: string | null
          duracion_estimada_semanas?: number | null
          estado_trabajo?: string
          fase_actual?: string
          fecha_cierre?: string | null
          fecha_estimada_cierre?: string | null
          fecha_inicio?: string
          frecuencia_planificada?: string | null
          id_trabajo?: string
          metodo_principal?: string
          modalidad_ejecucion?: string
          nombre_trabajo?: string
          notas_internas?: string | null
          numero_trabajo?: number
          objetivo_trabajo?: string
          observaciones?: string | null
          paciente_id?: string
          porcentaje_avance_general?: number
          prioridad_trabajo?: string
          proxima_accion?: string | null
          requiere_revision_posterior?: boolean
          requiere_revision_previa?: boolean
          requiere_seguimiento?: boolean
          resultado_general?: string | null
          revision_cierre_id?: string | null
          revision_hallazgo_origen_id?: string | null
          revision_inicial_id?: string | null
          tipo_trabajo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trabajos_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "casos"
            referencedColumns: ["id_caso"]
          },
          {
            foreignKeyName: "trabajos_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trabajos_revision_cierre_id_fkey"
            columns: ["revision_cierre_id"]
            isOneToOne: false
            referencedRelation: "revisiones"
            referencedColumns: ["id_revision"]
          },
          {
            foreignKeyName: "trabajos_revision_hallazgo_origen_id_fkey"
            columns: ["revision_hallazgo_origen_id"]
            isOneToOne: false
            referencedRelation: "revision_hallazgos"
            referencedColumns: ["id_revision_hallazgo"]
          },
          {
            foreignKeyName: "trabajos_revision_inicial_id_fkey"
            columns: ["revision_inicial_id"]
            isOneToOne: false
            referencedRelation: "revisiones"
            referencedColumns: ["id_revision"]
          },
        ]
      }
      usuarios_internos: {
        Row: {
          activo: boolean
          created_at: string
          email: string
          id: string
          nombre_completo: string
          rol: string
          updated_at: string
        }
        Insert: {
          activo?: boolean
          created_at?: string
          email: string
          id: string
          nombre_completo: string
          rol: string
          updated_at?: string
        }
        Update: {
          activo?: boolean
          created_at?: string
          email?: string
          id?: string
          nombre_completo?: string
          rol?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      vista_agenda_operativa: {
        Row: {
          caso_id: string | null
          confirmado_por_paciente: boolean | null
          consulta_id: string | null
          created_at: string | null
          email_contacto: string | null
          estado_evento: string | null
          estado_solicitud: string | null
          evaluacion_id: string | null
          fecha_fin: string | null
          fecha_inicio: string | null
          fecha_solicitud: string | null
          google_calendar_sync_estado: string | null
          id_agenda_evento: string | null
          modalidad: string | null
          nombre_contacto: string | null
          nombre_operativo: string | null
          origen_evento: string | null
          origen_solicitud: string | null
          paciente_id: string | null
          requiere_confirmacion: boolean | null
          revision_id: string | null
          solicitud_agenda_id: string | null
          telefono_contacto: string | null
          tipo_contexto: string | null
          tipo_evento: string | null
          titulo_evento: string | null
          titulo_publico: string | null
          trabajo_id: string | null
          trabajo_sesion_id: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agenda_eventos_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "casos"
            referencedColumns: ["id_caso"]
          },
          {
            foreignKeyName: "agenda_eventos_consulta_id_fkey"
            columns: ["consulta_id"]
            isOneToOne: false
            referencedRelation: "consultas"
            referencedColumns: ["id_consulta"]
          },
          {
            foreignKeyName: "agenda_eventos_evaluacion_id_fkey"
            columns: ["evaluacion_id"]
            isOneToOne: false
            referencedRelation: "evaluaciones"
            referencedColumns: ["id_evaluacion"]
          },
          {
            foreignKeyName: "agenda_eventos_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agenda_eventos_revision_id_fkey"
            columns: ["revision_id"]
            isOneToOne: false
            referencedRelation: "revisiones"
            referencedColumns: ["id_revision"]
          },
          {
            foreignKeyName: "agenda_eventos_solicitud_agenda_id_fkey"
            columns: ["solicitud_agenda_id"]
            isOneToOne: false
            referencedRelation: "solicitudes_agenda"
            referencedColumns: ["id_solicitud_agenda"]
          },
          {
            foreignKeyName: "agenda_eventos_trabajo_id_fkey"
            columns: ["trabajo_id"]
            isOneToOne: false
            referencedRelation: "trabajos"
            referencedColumns: ["id_trabajo"]
          },
          {
            foreignKeyName: "agenda_eventos_trabajo_sesion_id_fkey"
            columns: ["trabajo_sesion_id"]
            isOneToOne: false
            referencedRelation: "trabajo_sesiones"
            referencedColumns: ["id_trabajo_sesion"]
          },
        ]
      }
      vista_cobros_estado: {
        Row: {
          caso_id: string | null
          concepto_cobro: string | null
          consulta_id: string | null
          estado_calculado: string | null
          estado_cobro: string | null
          evaluacion_id: string | null
          fecha_cobro: string | null
          fecha_vencimiento: string | null
          id_cobro: string | null
          moneda: string | null
          monto_cobro: number | null
          monto_descuento: number | null
          monto_pagado: number | null
          monto_total: number | null
          paciente_id: string | null
          revision_id: string | null
          saldo_pendiente: number | null
          tipo_cobro: string | null
          trabajo_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cobros_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "casos"
            referencedColumns: ["id_caso"]
          },
          {
            foreignKeyName: "cobros_consulta_id_fkey"
            columns: ["consulta_id"]
            isOneToOne: false
            referencedRelation: "consultas"
            referencedColumns: ["id_consulta"]
          },
          {
            foreignKeyName: "cobros_evaluacion_id_fkey"
            columns: ["evaluacion_id"]
            isOneToOne: false
            referencedRelation: "evaluaciones"
            referencedColumns: ["id_evaluacion"]
          },
          {
            foreignKeyName: "cobros_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cobros_revision_id_fkey"
            columns: ["revision_id"]
            isOneToOne: false
            referencedRelation: "revisiones"
            referencedColumns: ["id_revision"]
          },
          {
            foreignKeyName: "cobros_trabajo_id_fkey"
            columns: ["trabajo_id"]
            isOneToOne: false
            referencedRelation: "trabajos"
            referencedColumns: ["id_trabajo"]
          },
        ]
      }
      vista_finanzas_fotos_auditoria: {
        Row: {
          caso_id: string | null
          elemento_caso_id: string | null
          estado_foto: string | null
          fecha_carga: string | null
          id_cobro: string | null
          id_foto: string | null
          mime_type: string | null
          nombre_archivo: string | null
          paciente_id: string | null
          storage_path: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cobros_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "casos"
            referencedColumns: ["id_caso"]
          },
          {
            foreignKeyName: "cobros_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fotos_elementos_caso_elemento_caso_id_fkey"
            columns: ["elemento_caso_id"]
            isOneToOne: false
            referencedRelation: "elementos_caso"
            referencedColumns: ["id_elemento_caso"]
          },
        ]
      }
      vista_finanzas_unidades_cobrables: {
        Row: {
          alias_administrativo_paciente: string | null
          codigo_paciente: string | null
          concepto_cobro_administrativo: string | null
          estado_cobro: string | null
          estado_pago: string | null
          fecha_cobro: string | null
          fecha_ultimo_pago: string | null
          fecha_vencimiento: string | null
          id_cobro: string | null
          id_pago: string | null
          metodo_ultimo_pago: string | null
          moneda: string | null
          monto_cobro: number | null
          monto_descuento: number | null
          monto_pagado: number | null
          monto_total: number | null
          paciente_id: string | null
          referencia_pago: string | null
          referencia_unidad_administrativa: string | null
          saldo_pendiente: number | null
          tipo_cobro: string | null
          tipo_unidad_cobrable: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cobros_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      actualizar_estado_cobro: {
        Args: { p_cobro_id: string }
        Returns: undefined
      }
      es_admin: { Args: never; Returns: boolean }
      es_finanzas_o_admin: { Args: never; Returns: boolean }
      es_terapeuta_o_admin: { Args: never; Returns: boolean }
      rol_usuario_actual: { Args: never; Returns: string }
      usuario_interno_activo: { Args: never; Returns: boolean }
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

