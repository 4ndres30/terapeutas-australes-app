import { describe, expect, it } from 'vitest'
import {
  aNumero,
  formatearFecha,
  formatearMoneda,
  normalizarTexto,
  obtenerInicialesNombre,
  textoCorto,
} from './format'

describe('formatearFecha', () => {
  it('devuelve "Sin fecha" para null', () => {
    expect(formatearFecha(null)).toBe('Sin fecha')
  })

  it('devuelve "Sin fecha" para string vacio', () => {
    expect(formatearFecha('')).toBe('Sin fecha')
  })

  it('devuelve "Sin fecha" para fecha invalida', () => {
    expect(formatearFecha('no-es-una-fecha')).toBe('Sin fecha')
  })

  it('formatea fecha date-only sin corrimiento de dia por timezone', () => {
    // Regresion: new Date('2026-07-04') sin T00:00:00 se interpreta en UTC
    // y puede mostrar el dia anterior en timezones negativos (ej. Chile).
    expect(formatearFecha('2026-07-04')).toBe('04 jul 2026')
  })

  it('formatea fecha con componente de hora ya presente', () => {
    expect(formatearFecha('2026-01-15T10:30:00')).toBe('15 ene 2026')
  })
})

describe('normalizarTexto', () => {
  it('pasa a minuscula', () => {
    expect(normalizarTexto('HOLA')).toBe('hola')
  })

  it('quita acentos/diacriticos', () => {
    expect(normalizarTexto('María José Muñoz')).toBe('maria jose munoz')
  })

  it('no falla con string vacio', () => {
    expect(normalizarTexto('')).toBe('')
  })
})

describe('textoCorto', () => {
  it('no trunca texto mas corto que el limite', () => {
    expect(textoCorto('hola', 10)).toBe('hola')
  })

  it('trunca y agrega puntos suspensivos cuando excede el limite', () => {
    expect(textoCorto('a'.repeat(10), 5)).toBe('aaaa...')
  })

  it('recorta espacios en blanco antes de medir', () => {
    expect(textoCorto('  hola  ', 10)).toBe('hola')
  })

  it('usa 120 como largo por defecto', () => {
    const texto = 'a'.repeat(130)
    expect(textoCorto(texto)).toBe(`${'a'.repeat(119)}...`)
  })
})

describe('aNumero', () => {
  it('convierte string numerico', () => {
    expect(aNumero('42.5')).toBe(42.5)
  })

  it('devuelve el numero tal cual si ya es number', () => {
    expect(aNumero(10)).toBe(10)
  })

  it('devuelve 0 para null/undefined/string vacio', () => {
    expect(aNumero(null)).toBe(0)
    expect(aNumero(undefined)).toBe(0)
    expect(aNumero('')).toBe(0)
  })

  it('devuelve 0 para string no numerico', () => {
    expect(aNumero('no-es-numero')).toBe(0)
  })
})

describe('formatearMoneda', () => {
  it('formatea como CLP sin decimales', () => {
    expect(formatearMoneda(40000)).toBe('$40.000')
  })

  it('formatea cero', () => {
    expect(formatearMoneda(0)).toBe('$0')
  })
})

describe('obtenerInicialesNombre', () => {
  it('toma la inicial de las primeras dos palabras', () => {
    expect(obtenerInicialesNombre('Javier Hernandez')).toBe('JH')
  })

  it('devuelve fallback "TA" para string vacio', () => {
    expect(obtenerInicialesNombre('')).toBe('TA')
  })

  it('maneja espacios extra entre palabras', () => {
    expect(obtenerInicialesNombre('  Ana   Maria  Lopez ')).toBe('AM')
  })
})
