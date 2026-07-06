import { describe, expect, it } from 'vitest'
import { QUERY_COLUMNS } from './queries'

describe('QUERY_COLUMNS', () => {
  it('expone las tablas principales del modulo clinico y financiero', () => {
    expect(QUERY_COLUMNS).toHaveProperty('casos')
    expect(QUERY_COLUMNS).toHaveProperty('consultas')
    expect(QUERY_COLUMNS).toHaveProperty('evaluaciones')
    expect(QUERY_COLUMNS).toHaveProperty('cobros')
    expect(QUERY_COLUMNS).toHaveProperty('pagos')
  })

  it('cada proyeccion es un string de columnas separadas por coma', () => {
    for (const tabla of Object.values(QUERY_COLUMNS)) {
      for (const proyeccion of Object.values(tabla)) {
        expect(typeof proyeccion).toBe('string')
        expect(proyeccion.length).toBeGreaterThan(0)
      }
    }
  })

  it('casos.detalle incluye la PK real id_caso, no un id generico', () => {
    expect(QUERY_COLUMNS.casos.detalle).toContain('id_caso')
    expect(QUERY_COLUMNS.casos.detalle.split(', ')).not.toContain('id')
  })
})
