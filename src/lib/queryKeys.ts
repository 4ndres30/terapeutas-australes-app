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
  },
} as const
