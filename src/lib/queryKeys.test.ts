import { QueryClient } from '@tanstack/react-query'
import { describe, expect, it } from 'vitest'
import { QUERY_KEYS } from './queryKeys'

function empiezaConRaiz(clave: readonly string[], raiz: readonly string[]) {
  return raiz.every((segmento, indice) => clave[indice] === segmento)
}

describe('QUERY_KEYS', () => {
  it('separa registros completos de selectores con proyecciones parciales', () => {
    expect(QUERY_KEYS.pacientes.registroCompleto).not.toEqual(QUERY_KEYS.pacientes.selectorClinico)
    expect(QUERY_KEYS.consultas.registroCompleto).not.toEqual(QUERY_KEYS.consultas.selectorEvaluaciones)
  })

  it('mantiene las variantes bajo una raiz invalidable por entidad', () => {
    expect(empiezaConRaiz(QUERY_KEYS.pacientes.registroCompleto, QUERY_KEYS.pacientes.all)).toBe(true)
    expect(empiezaConRaiz(QUERY_KEYS.pacientes.selectorClinico, QUERY_KEYS.pacientes.all)).toBe(true)
    expect(empiezaConRaiz(QUERY_KEYS.consultas.registroCompleto, QUERY_KEYS.consultas.all)).toBe(true)
    expect(empiezaConRaiz(QUERY_KEYS.consultas.selectorEvaluaciones, QUERY_KEYS.consultas.all)).toBe(true)
    expect(empiezaConRaiz(QUERY_KEYS.evaluaciones.registroCompleto, QUERY_KEYS.evaluaciones.all)).toBe(true)
  })

  it('no reutiliza una clave entre shapes incompatibles', () => {
    const claves = [
      QUERY_KEYS.pacientes.registroCompleto,
      QUERY_KEYS.pacientes.selectorClinico,
      QUERY_KEYS.consultas.registroCompleto,
      QUERY_KEYS.consultas.selectorEvaluaciones,
      QUERY_KEYS.evaluaciones.registroCompleto,
    ]

    expect(new Set(claves.map((clave) => JSON.stringify(clave))).size).toBe(claves.length)
  })

  it('simula navegacion Consultas -> Pacientes sin contaminar los shapes de cache', () => {
    const queryClient = new QueryClient()
    const pacienteCompleto = { id: 'paciente-1', nombres: 'Ana', telefono: '+56 9 1111 1111' }
    const pacienteResumen = { id: 'paciente-1', nombres: 'Ana' }

    queryClient.setQueryData(QUERY_KEYS.pacientes.selectorClinico, [pacienteResumen])
    expect(queryClient.getQueryData(QUERY_KEYS.pacientes.registroCompleto)).toBeUndefined()

    queryClient.setQueryData(QUERY_KEYS.pacientes.registroCompleto, [pacienteCompleto])

    expect(queryClient.getQueryData(QUERY_KEYS.pacientes.registroCompleto)).toEqual([pacienteCompleto])
    expect(queryClient.getQueryData(QUERY_KEYS.pacientes.selectorClinico)).toEqual([pacienteResumen])
  })

  it('invalida todas las proyecciones de una entidad desde su raiz', async () => {
    const queryClient = new QueryClient()

    queryClient.setQueryData(QUERY_KEYS.consultas.registroCompleto, [{ id_consulta: 'consulta-1' }])
    queryClient.setQueryData(QUERY_KEYS.consultas.selectorEvaluaciones, [{ id_consulta: 'consulta-1' }])

    await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.consultas.all, refetchType: 'none' })

    expect(queryClient.getQueryState(QUERY_KEYS.consultas.registroCompleto)?.isInvalidated).toBe(true)
    expect(queryClient.getQueryState(QUERY_KEYS.consultas.selectorEvaluaciones)?.isInvalidated).toBe(true)
  })
})
