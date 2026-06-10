import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import './ClinicalModuleBase.css'

type Paciente = {
  id: string
  estado: string
  created_at: string
}

type Consulta = {
  id_consulta: string
  fecha_consulta: string
  estado_consulta: string
}

type Evaluacion = {
  id_evaluacion: string
  fecha_evaluacion: string
  decision_revision: string
  estado_evaluacion: string
}

type Caso = {
  id_caso: string
  fecha_apertura: string
  estado_caso: string
  prioridad: string
  requiere_seguimiento: boolean
}

type ElementoCaso = {
  id_elemento_caso: string
  estado_elemento: string
  prioridad_elemento: string
}

type Revision = {
  id_revision: string
  fecha_revision: string
  estado_revision: string
  requiere_seguimiento: boolean
}

type CobroEstado = {
  id_cobro: string
  monto_total: number | string | null
  monto_pagado: number | string | null
  saldo_pendiente: number | string | null
  estado_calculado: string | null
}

type Pago = {
  id_pago: string
  monto_pago: number | string
  estado_pago: string
}

function aNumero(valor: number | string | null | undefined) {
  if (valor === null || valor === undefined || valor === '') {
    return 0
  }

  const numero = typeof valor === 'number' ? valor : Number(valor)
  return Number.isFinite(numero) ? numero : 0
}

function formatearMoneda(valor: number) {
  return new Intl.NumberFormat('es-CL', {
    currency: 'CLP',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(valor)
}

function calcularPorcentaje(parte: number, total: number) {
  if (total === 0) {
    return '0%'
  }

  return `${Math.round((parte / total) * 100)}%`
}

function ReportesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([])
  const [casos, setCasos] = useState<Caso[]>([])
  const [elementos, setElementos] = useState<ElementoCaso[]>([])
  const [revisiones, setRevisiones] = useState<Revision[]>([])
  const [cobros, setCobros] = useState<CobroEstado[]>([])
  const [pagos, setPagos] = useState<Pago[]>([])
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(true)

  const totalFinanciero = useMemo(() => ({
    cobrado: cobros.reduce((total, cobro) => total + aNumero(cobro.monto_total), 0),
    pagado: cobros.reduce((total, cobro) => total + aNumero(cobro.monto_pagado), 0),
    pendiente: cobros.reduce((total, cobro) => total + aNumero(cobro.saldo_pendiente), 0),
  }), [cobros])

  const metricasPrincipales = [
    { etiqueta: 'Pacientes', valor: String(pacientes.length), detalle: `${pacientes.filter((paciente) => paciente.estado === 'activo').length} activos` },
    { etiqueta: 'Casos', valor: String(casos.length), detalle: `${casos.filter((caso) => caso.estado_caso === 'Abierto' || caso.estado_caso === 'En proceso').length} activos/en proceso` },
    { etiqueta: 'Consultas', valor: String(consultas.length), detalle: `${consultas.filter((consulta) => consulta.estado_consulta === 'Realizada').length} realizadas` },
    { etiqueta: 'Revisiones', valor: String(revisiones.length), detalle: `${revisiones.filter((revision) => revision.requiere_seguimiento).length} con seguimiento` },
  ]

  const indicadores = [
    {
      etiqueta: 'Evaluaciones que requieren revisión',
      valor: calcularPorcentaje(
        evaluaciones.filter((evaluacion) => evaluacion.decision_revision === 'Sí requiere revisión').length,
        evaluaciones.length,
      ),
      detalle: `${evaluaciones.length} evaluaciones leídas`,
    },
    {
      etiqueta: 'Casos con seguimiento',
      valor: calcularPorcentaje(casos.filter((caso) => caso.requiere_seguimiento).length, casos.length),
      detalle: `${casos.length} casos leídos`,
    },
    {
      etiqueta: 'Elementos activos',
      valor: calcularPorcentaje(elementos.filter((elemento) => elemento.estado_elemento === 'Activo').length, elementos.length),
      detalle: `${elementos.length} elementos leídos`,
    },
    {
      etiqueta: 'Cobros pendientes',
      valor: formatearMoneda(totalFinanciero.pendiente),
      detalle: `${cobros.length} cobros en vista`,
    },
  ]

  async function cargarDatos() {
    setCargando(true)
    setMensaje('')

    const [
      pacientesRespuesta,
      consultasRespuesta,
      evaluacionesRespuesta,
      casosRespuesta,
      elementosRespuesta,
      revisionesRespuesta,
      cobrosRespuesta,
      pagosRespuesta,
    ] = await Promise.all([
      supabase.from('pacientes').select('id, estado, created_at'),
      supabase.from('consultas').select('id_consulta, fecha_consulta, estado_consulta'),
      supabase.from('evaluaciones').select('id_evaluacion, fecha_evaluacion, decision_revision, estado_evaluacion'),
      supabase.from('casos').select('id_caso, fecha_apertura, estado_caso, prioridad, requiere_seguimiento'),
      supabase.from('elementos_caso').select('id_elemento_caso, estado_elemento, prioridad_elemento'),
      supabase.from('revisiones').select('id_revision, fecha_revision, estado_revision, requiere_seguimiento'),
      supabase.from('vista_cobros_estado').select('id_cobro, monto_total, monto_pagado, saldo_pendiente, estado_calculado'),
      supabase.from('pagos').select('id_pago, monto_pago, estado_pago'),
    ])

    const errores: string[] = []

    if (pacientesRespuesta.error) errores.push('pacientes')
    if (consultasRespuesta.error) errores.push('consultas')
    if (evaluacionesRespuesta.error) errores.push('evaluaciones')
    if (casosRespuesta.error) errores.push('casos')
    if (elementosRespuesta.error) errores.push('elementos_caso')
    if (revisionesRespuesta.error) errores.push('revisiones')
    if (cobrosRespuesta.error) errores.push('vista_cobros_estado')
    if (pagosRespuesta.error) errores.push('pagos')

    setPacientes(pacientesRespuesta.error ? [] : (pacientesRespuesta.data || []) as Paciente[])
    setConsultas(consultasRespuesta.error ? [] : (consultasRespuesta.data || []) as Consulta[])
    setEvaluaciones(evaluacionesRespuesta.error ? [] : (evaluacionesRespuesta.data || []) as Evaluacion[])
    setCasos(casosRespuesta.error ? [] : (casosRespuesta.data || []) as Caso[])
    setElementos(elementosRespuesta.error ? [] : (elementosRespuesta.data || []) as ElementoCaso[])
    setRevisiones(revisionesRespuesta.error ? [] : (revisionesRespuesta.data || []) as Revision[])
    setCobros(cobrosRespuesta.error ? [] : (cobrosRespuesta.data || []) as unknown as CobroEstado[])
    setPagos(pagosRespuesta.error ? [] : (pagosRespuesta.data || []) as unknown as Pago[])
    setMensaje(errores.length > 0 ? `Reporte parcial: no se pudieron cargar ${errores.join(', ')} para el rol actual.` : '')
    setCargando(false)
  }

  useEffect(() => {
    const carga = window.setTimeout(() => {
      void cargarDatos()
    }, 0)

    return () => window.clearTimeout(carga)
  }, [])

  return (
    <main className="clinical-module-page">
      <section className="clinical-hero">
        <div className="clinical-hero__copy">
          <span className="clinical-kicker">Solo lectura</span>
          <h1>Reportes</h1>
          <p>Métricas generales calculadas desde tablas reales existentes. No guarda registros.</p>
        </div>

        <section className="clinical-metrics" aria-label="Métricas principales">
          {metricasPrincipales.map((metrica) => (
            <article className="clinical-metric-card" key={metrica.etiqueta}>
              <strong>{metrica.valor}</strong>
              <span>{metrica.etiqueta}</span>
              <p>{metrica.detalle}</p>
            </article>
          ))}
        </section>
      </section>

      <section className="clinical-layout">
        <section className="clinical-panel" aria-label="Indicadores clínicos">
          <div className="clinical-panel__header">
            <div>
              <span className="clinical-kicker">Indicadores</span>
              <h2>Resumen clínico</h2>
              <p>Agregados simples desde las tablas principales.</p>
            </div>
          </div>

          <div className="clinical-list">
            {indicadores.map((indicador) => (
              <article className="clinical-card" key={indicador.etiqueta}>
                <div className="clinical-card__top">
                  <div>
                    <h3>{indicador.etiqueta}</h3>
                    <small>{indicador.detalle}</small>
                  </div>
                  <span className="clinical-badge">{indicador.valor}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="clinical-panel" aria-label="Resumen financiero">
          <div className="clinical-panel__header">
            <div>
              <span className="clinical-kicker">Finanzas</span>
              <h2>Cobros y pagos</h2>
              <p>Lectura desde vista_cobros_estado y pagos.</p>
            </div>
          </div>

          <div className="clinical-list">
            <article className="clinical-card">
              <div className="clinical-card__top">
                <div>
                  <h3>Monto cobrado</h3>
                  <small>Total de cobros calculado desde vista real.</small>
                </div>
                <span className="clinical-badge">{formatearMoneda(totalFinanciero.cobrado)}</span>
              </div>
            </article>

            <article className="clinical-card">
              <div className="clinical-card__top">
                <div>
                  <h3>Monto pagado</h3>
                  <small>{pagos.length} pagos leídos desde public.pagos.</small>
                </div>
                <span className="clinical-badge">{formatearMoneda(totalFinanciero.pagado)}</span>
              </div>
            </article>

            <article className="clinical-card">
              <div className="clinical-card__top">
                <div>
                  <h3>Saldo pendiente</h3>
                  <small>Suma de saldo_pendiente calculado por la vista.</small>
                </div>
                <span className="clinical-badge clinical-badge--muted">{formatearMoneda(totalFinanciero.pendiente)}</span>
              </div>
            </article>
          </div>

          {mensaje && <p className={mensaje.startsWith('Error') ? 'clinical-message clinical-message--error' : 'clinical-message'}>{mensaje}</p>}
          {cargando && <p className="clinical-note">Cargando métricas desde Supabase local...</p>}
        </section>
      </section>
    </main>
  )
}

export default ReportesPage
