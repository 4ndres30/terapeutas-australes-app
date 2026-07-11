export const QUERY_KEYS = {
  pacientes: {
    all: ['pacientes'] as const,
    registroCompleto: ['pacientes', 'registro-completo'] as const,
    selectorClinico: ['pacientes', 'selector-clinico'] as const,
  },
  consultas: {
    all: ['consultas'] as const,
    registroCompleto: ['consultas', 'registro-completo'] as const,
    selectorEvaluaciones: ['consultas', 'selector-evaluaciones'] as const,
  },
  evaluaciones: {
    all: ['evaluaciones'] as const,
    registroCompleto: ['evaluaciones', 'registro-completo'] as const,
    selectorCasos: ['evaluaciones', 'selector-casos'] as const,
    detalle: (id: string) => ['evaluaciones', 'detalle', id] as const,
  },
  casos: {
    all: ['casos'] as const,
    registroCompleto: ['casos', 'registro-completo'] as const,
    detalle: (id: string) => ['casos', 'detalle', id] as const,
  },
} as const

export const QUERY_KEYS_DETALLE = {
  paciente: (id: string) => ['pacientes', 'detalle', id] as const,
  consulta: (id: string) => ['consultas', 'detalle', id] as const,
}
