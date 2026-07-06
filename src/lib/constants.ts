/**
 * Constantes globales del proyecto
 * Extraidas de src/App.tsx, src/pages/ReportesPage.tsx y src/pages/casos/ElementosCasoPanel.tsx,
 * y de los CHECK constraints reales en supabase/migrations/
 */

export const ROLES = {
  ADMIN: 'admin',
  TERAPEUTA: 'terapeuta',
  FINANZAS: 'finanzas',
} as const

export const ROLES_ARRAY = ['admin', 'terapeuta', 'finanzas'] as const
export type Rol = typeof ROLES_ARRAY[number]

export const LABELS_ROL = {
  admin: 'Administrador',
  terapeuta: 'Terapeuta',
  finanzas: 'Finanzas',
} as const

export const ESTADOS_PACIENTE = {
  ACTIVO: 'activo',
  INACTIVO: 'inactivo',
} as const

export const ESTADOS_CASO = {
  ABIERTO: 'Abierto',
  EN_PROCESO: 'En proceso',
  PAUSADO: 'Pausado',
  CERRADO: 'Cerrado',
  ANULADO: 'Anulado',
} as const

export const ESTADOS_CONSULTA = {
  AGENDADA: 'Agendada',
  REALIZADA: 'Realizada',
  PENDIENTE: 'Pendiente',
  CANCELADA: 'Cancelada',
  REAGENDADA: 'Reagendada',
  NO_ASISTIO: 'No asistió',
} as const

export const ESTADOS_EVALUACION = {
  ABIERTA: 'Abierta',
  COMPLETADA: 'Completada',
  ANULADA: 'Anulada',
} as const

export const ESTADOS_REVISION = {
  PENDIENTE: 'Pendiente',
  EN_PROCESO: 'En proceso',
  COMPLETADA: 'Completada',
  REQUIERE_SEGUIMIENTO: 'Requiere seguimiento',
  ANULADA: 'Anulada',
} as const

export const ESTADOS_TRABAJO = {
  PENDIENTE: 'Pendiente',
  EN_PROCESO: 'En proceso',
  PAUSADO: 'Pausado',
  COMPLETADO: 'Completado',
  COMPLETADO_PARCIALMENTE: 'Completado parcialmente',
  REQUIERE_SEGUIMIENTO: 'Requiere seguimiento',
  CERRADO: 'Cerrado',
  ANULADO: 'Anulado',
} as const

export const ESTADOS_COBRO = {
  PENDIENTE: 'Pendiente',
  PARCIAL: 'Parcial',
  PAGADO: 'Pagado',
  VENCIDO: 'Vencido',
  ANULADO: 'Anulado',
  CONDONADO: 'Condonado',
} as const

export const MIME_TYPES_FOTOS = {
  JPEG: 'image/jpeg',
  PNG: 'image/png',
  WEBP: 'image/webp',
} as const

export const MIME_TYPES_FOTOS_ARRAY = ['image/jpeg', 'image/png', 'image/webp'] as const

export const FOTO_MAX_BYTES = 5 * 1024 * 1024