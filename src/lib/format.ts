/**
 * Utilidades de formato compartidas
 * Extraidas fielmente de la implementacion repetida en src/pages/*.tsx
 * (FinanzasPage, ConsultasPage, EvaluacionesPage, CasosPage, ReportesPage,
 * casos/ElementosCasoPanel, casos/PagosCasoPanel, casos/DetalleRevisionesPanel,
 * casos/RevisionesCasoPanel, casos/TrabajosCasoPanel) y de src/App.tsx.
 */

export const formatearFecha = (fecha: string | null): string => {
  if (!fecha) {
    return 'Sin fecha'
  }

  const normalizada = fecha.includes('T') ? fecha : `${fecha}T00:00:00`
  const fechaParseada = new Date(normalizada)

  if (Number.isNaN(fechaParseada.getTime())) {
    return 'Sin fecha'
  }

  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(fechaParseada)
}

const DIACRITICOS_REGEX = /[̀-ͯ]/g

export const normalizarTexto = (texto: string): string =>
  texto.toLowerCase().normalize('NFD').replace(DIACRITICOS_REGEX, '')

export const textoCorto = (texto: string, largo: number = 120): string => {
  const limpio = texto.trim()
  return limpio.length > largo ? `${limpio.slice(0, largo - 1)}...` : limpio
}

export const aNumero = (valor: number | string | null | undefined): number => {
  if (valor === null || valor === undefined || valor === '') {
    return 0
  }

  const numero = typeof valor === 'number' ? valor : Number(valor)
  return Number.isFinite(numero) ? numero : 0
}

export const formatearMoneda = (valor: number): string =>
  new Intl.NumberFormat('es-CL', {
    currency: 'CLP',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(valor)

export const obtenerInicialesNombre = (nombreCompleto: string): string => {
  const iniciales = nombreCompleto
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte.charAt(0))
    .join('')
    .toUpperCase()

  return iniciales || 'TA'
}