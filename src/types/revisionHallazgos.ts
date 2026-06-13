export type CategoriaHallazgo =
  | 'Cuerpo inestable'
  | 'Bloqueo'
  | 'Trabajo energético'
  | 'Magia negra'
  | 'Entidad/Presencia'
  | 'Abundancia afectada'
  | 'Protección debilitada'
  | 'Vínculo afectado'
  | 'Linaje afectado'
  | 'Hogar/Espacio afectado'
  | 'Información canalizada'
  | 'Otro'

export type FuenteDeteccion =
  | 'Radiestesia'
  | 'Canalización'
  | 'Radiestesia y canalización'
  | 'Testimonio'
  | 'Observación interna'
  | 'Otro'

export type NivelConfirmacion =
  | 'Detectado'
  | 'Por confirmar'
  | 'Confirmado'
  | 'Descartado'
  | 'Referencial'

export type PrioridadHallazgo = 'Baja' | 'Media' | 'Alta' | 'Urgente'

export type EstadoHallazgo =
  | 'Activo'
  | 'En observación'
  | 'Pendiente de trabajo'
  | 'Cerrado'
  | 'Descartado'

export type RevisionHallazgo = {
  id_revision_hallazgo: string
  paciente_id: string
  caso_id: string
  revision_id: string
  revision_elemento_id: string
  revision_aspecto_id: string
  elemento_caso_id: string
  categoria_hallazgo: CategoriaHallazgo
  tipo_hallazgo: string | null
  subtipo_hallazgo: string | null
  descripcion_hallazgo: string
  intensidad_hallazgo_porcentaje: number | null
  nivel_bloqueo_porcentaje: number | null
  origen_sugerido: string | null
  fuente_deteccion: FuenteDeteccion
  nivel_confirmacion: NivelConfirmacion
  requiere_seguimiento: boolean
  prioridad_hallazgo: PrioridadHallazgo | null
  estado_hallazgo: EstadoHallazgo
  informacion_canalizada: string | null
  observaciones: string | null
  notas_internas: string | null
  created_at: string
  updated_at: string
}

export type CrearRevisionHallazgoPayload = {
  paciente_id: string
  caso_id: string
  revision_id: string
  revision_elemento_id: string
  revision_aspecto_id: string
  elemento_caso_id: string
  categoria_hallazgo: CategoriaHallazgo
  tipo_hallazgo?: string | null
  subtipo_hallazgo?: string | null
  descripcion_hallazgo: string
  intensidad_hallazgo_porcentaje?: number | null
  nivel_bloqueo_porcentaje?: number | null
  origen_sugerido?: string | null
  fuente_deteccion?: FuenteDeteccion
  nivel_confirmacion?: NivelConfirmacion
  requiere_seguimiento?: boolean
  prioridad_hallazgo?: PrioridadHallazgo | null
  estado_hallazgo?: EstadoHallazgo
  informacion_canalizada?: string | null
  observaciones?: string | null
  notas_internas?: string | null
}

export const categoriasHallazgo: CategoriaHallazgo[] = [
  'Cuerpo inestable',
  'Bloqueo',
  'Trabajo energético',
  'Magia negra',
  'Entidad/Presencia',
  'Abundancia afectada',
  'Protección debilitada',
  'Vínculo afectado',
  'Linaje afectado',
  'Hogar/Espacio afectado',
  'Información canalizada',
  'Otro',
]

export const fuentesDeteccion: FuenteDeteccion[] = [
  'Radiestesia',
  'Canalización',
  'Radiestesia y canalización',
  'Testimonio',
  'Observación interna',
  'Otro',
]

export const nivelesConfirmacion: NivelConfirmacion[] = [
  'Detectado',
  'Por confirmar',
  'Confirmado',
  'Descartado',
  'Referencial',
]

export const prioridadesHallazgo: PrioridadHallazgo[] = ['Baja', 'Media', 'Alta', 'Urgente']

export const estadosHallazgo: EstadoHallazgo[] = [
  'Activo',
  'En observación',
  'Pendiente de trabajo',
  'Cerrado',
  'Descartado',
]
