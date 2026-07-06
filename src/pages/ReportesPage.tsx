import { useCallback, useEffect, useMemo, useState } from 'react'
import { aNumero, formatearFecha as formatearFechaBase, formatearMoneda, textoCorto } from '../lib/format'
import { supabase } from '../lib/supabase'
import './ClinicalModuleBase.css'

type RolUsuario = 'admin' | 'terapeuta' | 'finanzas'

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

type RevisionHallazgo = {
  id_revision_hallazgo: string
  estado_hallazgo: string
  prioridad_hallazgo: string | null
  requiere_seguimiento: boolean
  created_at: string
}

type Trabajo = {
  id_trabajo: string
  fecha_inicio: string
  estado_trabajo: string
  prioridad_trabajo: string
  porcentaje_avance_general: number
  requiere_seguimiento: boolean
  created_at: string
}

type UnidadCobrableFinanzas = {
  id_cobro: string
  id_pago: string | null
  codigo_paciente: string | null
  alias_administrativo_paciente: string | null
  tipo_unidad_cobrable: string | null
  referencia_unidad_administrativa: string | null
  concepto_cobro_administrativo: string | null
  fecha_cobro: string | null
  fecha_vencimiento: string | null
  tipo_cobro: string | null
  monto_cobro: number | string | null
  monto_total: number | string | null
  monto_pagado: number | string | null
  saldo_pendiente: number | string | null
  moneda: string | null
  estado_cobro: string | null
  estado_pago: string | null
  fecha_ultimo_pago: string | null
  metodo_ultimo_pago: string | null
  referencia_pago: string | null
}

type DatosClinicos = {
  pacientes: Paciente[]
  consultas: Consulta[]
  evaluaciones: Evaluacion[]
  casos: Caso[]
  elementos: ElementoCaso[]
  revisiones: Revision[]
  hallazgos: RevisionHallazgo[]
  trabajos: Trabajo[]
}

type Metrica = {
  etiqueta: string
  valor: string
  detalle: string
}

type Indicador = {
  etiqueta: string
  valor: string
  detalle: string
}

type ActividadClinica = {
  fecha: string | null
  titulo: string
  detalle: string
}

const rolesValidos: RolUsuario[] = ['admin', 'terapeuta', 'finanzas']

const UNIDAD_COBRABLE_SELECT = [
  'id_cobro',
  'id_pago',
  'codigo_paciente',
  'alias_administrativo_paciente',
  'tipo_unidad_cobrable',
  'referencia_unidad_administrativa',
  'concepto_cobro_administrativo',
  'fecha_cobro',
  'fecha_vencimiento',
  'tipo_cobro',
  'monto_cobro',
  'monto_total',
  'monto_pagado',
  'saldo_pendiente',
  'moneda',
  'estado_cobro',
  'estado_pago',
  'fecha_ultimo_pago',
  'metodo_ultimo_pago',
  'referencia_pago',
].join(', ')

function crearDatosClinicosVacios(): DatosClinicos {
  return {
    casos: [],
    consultas: [],
    elementos: [],
    evaluaciones: [],
    hallazgos: [],
    pacientes: [],
    revisiones: [],
    trabajos: [],
  }
}

function esRolUsuario(rol: string): rol is RolUsuario {
  return rolesValidos.includes(rol as RolUsuario)
}

function normalizarFecha(fecha: string | null | undefined) {
  if (!fecha) {
    return null
  }

  return fecha.includes('T') ? fecha : `${fecha}T00:00:00`
}

function valorFecha(fecha: string | null | undefined) {
  const normalizada = normalizarFecha(fecha)

  if (!normalizada) {
    return 0
  }

  const fechaReporte = new Date(normalizada)
  return Number.isNaN(fechaReporte.getTime()) ? 0 : fechaReporte.getTime()
}

function formatearFecha(fecha: string | null | undefined) {
  return formatearFechaBase(fecha ?? null)
}

function calcularPorcentaje(parte: number, total: number) {
  if (total === 0) {
    return '0%'
  }

  return `${Math.round((parte / total) * 100)}%`
}

function contarPorEstado<T>(registros: T[], obtenerEstado: (registro: T) => string | null | undefined) {
  return registros.reduce<Record<string, number>>((conteo, registro) => {
    const estado = obtenerEstado(registro) || 'Sin estado'
    return { ...conteo, [estado]: (conteo[estado] || 0) + 1 }
  }, {})
}

function crearDetalleConteo(conteo: Record<string, number>) {
  const entradas = Object.entries(conteo)

  if (entradas.length === 0) {
    return 'Sin registros disponibles'
  }

  return entradas
    .sort(([, totalA], [, totalB]) => totalB - totalA)
    .slice(0, 3)
    .map(([estado, total]) => `${estado}: ${total}`)
    .join(' · ')
}

function esCasoActivo(caso: Caso) {
  return caso.estado_caso === 'Abierto' || caso.estado_caso === 'En proceso'
}

function esPrioridadAlta(prioridad: string | null | undefined) {
  return prioridad === 'Alta' || prioridad === 'Urgente'
}

function esTrabajoAbierto(trabajo: Trabajo) {
  return !['Cerrado', 'Anulado', 'Completado'].includes(trabajo.estado_trabajo)
}

async function obtenerRolActivo(): Promise<RolUsuario> {
  const { data: authData, error: authError } = await supabase.auth.getUser()

  if (authError || !authData.user) {
    throw new Error('No se pudo preparar el reporte para esta sesión.')
  }

  const { data, error } = await supabase
    .from('usuarios_internos')
    .select('rol, activo')
    .eq('id', authData.user.id)
    .maybeSingle()

  if (error || !data) {
    throw new Error('No se pudo confirmar el perfil interno para reportes.')
  }

  const usuario = data as { activo?: boolean; rol?: string }

  if (!usuario.activo || !usuario.rol || !esRolUsuario(usuario.rol)) {
    throw new Error('Tu perfil interno no tiene reportes disponibles.')
  }

  return usuario.rol
}

async function cargarDatosClinicos(): Promise<{ aviso: string; datos: DatosClinicos }> {
  const [
    pacientesRespuesta,
    consultasRespuesta,
    evaluacionesRespuesta,
    casosRespuesta,
    elementosRespuesta,
    revisionesRespuesta,
    hallazgosRespuesta,
    trabajosRespuesta,
  ] = await Promise.all([
    supabase.from('pacientes').select('id, estado, created_at'),
    supabase.from('consultas').select('id_consulta, fecha_consulta, estado_consulta'),
    supabase.from('evaluaciones').select('id_evaluacion, fecha_evaluacion, decision_revision, estado_evaluacion'),
    supabase.from('casos').select('id_caso, fecha_apertura, estado_caso, prioridad, requiere_seguimiento'),
    supabase.from('elementos_caso').select('id_elemento_caso, estado_elemento, prioridad_elemento'),
    supabase.from('revisiones').select('id_revision, fecha_revision, estado_revision, requiere_seguimiento'),
    supabase.from('revision_hallazgos').select('id_revision_hallazgo, estado_hallazgo, prioridad_hallazgo, requiere_seguimiento, created_at'),
    supabase.from('trabajos').select('id_trabajo, fecha_inicio, estado_trabajo, prioridad_trabajo, porcentaje_avance_general, requiere_seguimiento, created_at'),
  ])

  const hayError = [
    pacientesRespuesta,
    consultasRespuesta,
    evaluacionesRespuesta,
    casosRespuesta,
    elementosRespuesta,
    revisionesRespuesta,
    hallazgosRespuesta,
    trabajosRespuesta,
  ].some((respuesta) => Boolean(respuesta.error))

  return {
    aviso: hayError ? 'Algunos indicadores clínicos no están disponibles en este momento.' : '',
    datos: {
      casos: casosRespuesta.error ? [] : (casosRespuesta.data || []) as Caso[],
      consultas: consultasRespuesta.error ? [] : (consultasRespuesta.data || []) as Consulta[],
      elementos: elementosRespuesta.error ? [] : (elementosRespuesta.data || []) as ElementoCaso[],
      evaluaciones: evaluacionesRespuesta.error ? [] : (evaluacionesRespuesta.data || []) as Evaluacion[],
      hallazgos: hallazgosRespuesta.error ? [] : (hallazgosRespuesta.data || []) as RevisionHallazgo[],
      pacientes: pacientesRespuesta.error ? [] : (pacientesRespuesta.data || []) as Paciente[],
      revisiones: revisionesRespuesta.error ? [] : (revisionesRespuesta.data || []) as Revision[],
      trabajos: trabajosRespuesta.error ? [] : (trabajosRespuesta.data || []) as Trabajo[],
    },
  }
}

async function cargarDatosFinancieros(): Promise<{ aviso: string; unidades: UnidadCobrableFinanzas[] }> {
  const { data, error } = await supabase
    .from('vista_finanzas_unidades_cobrables')
    .select(UNIDAD_COBRABLE_SELECT)
    .order('fecha_cobro', { ascending: false })

  if (error) {
    return {
      aviso: 'No se pudo preparar el resumen financiero en este momento.',
      unidades: [],
    }
  }

  return {
    aviso: '',
    unidades: (data || []) as unknown as UnidadCobrableFinanzas[],
  }
}

function TarjetasMetricas({ ariaLabel, metricas }: { ariaLabel: string; metricas: Metrica[] }) {
  return (
    <section className="clinical-metrics" aria-label={ariaLabel}>
      {metricas.map((metrica) => (
        <article className="clinical-metric-card" key={metrica.etiqueta}>
          <strong>{metrica.valor}</strong>
          <span>{metrica.etiqueta}</span>
          <p>{metrica.detalle}</p>
        </article>
      ))}
    </section>
  )
}

function ListaIndicadores({ indicadores }: { indicadores: Indicador[] }) {
  return (
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
  )
}

function useResumenClinico(datos: DatosClinicos) {
  return useMemo(() => {
    const casosActivos = datos.casos.filter(esCasoActivo)
    const casosSeguimiento = datos.casos.filter((caso) => caso.requiere_seguimiento)
    const revisionesSeguimiento = datos.revisiones.filter((revision) => revision.requiere_seguimiento)
    const hallazgosSeguimiento = datos.hallazgos.filter((hallazgo) => hallazgo.requiere_seguimiento)
    const hallazgosPendientes = datos.hallazgos.filter((hallazgo) => hallazgo.estado_hallazgo === 'Pendiente de trabajo')
    const trabajosAbiertos = datos.trabajos.filter(esTrabajoAbierto)
    const trabajosSeguimiento = datos.trabajos.filter((trabajo) => trabajo.requiere_seguimiento)
    const avancePromedio = datos.trabajos.length
      ? Math.round(datos.trabajos.reduce((total, trabajo) => total + aNumero(trabajo.porcentaje_avance_general), 0) / datos.trabajos.length)
      : 0

    const actividad: ActividadClinica[] = [
      ...datos.revisiones.map((revision) => ({
        detalle: revision.requiere_seguimiento ? 'Requiere seguimiento' : revision.estado_revision,
        fecha: revision.fecha_revision,
        titulo: 'Revisión registrada',
      })),
      ...datos.hallazgos.map((hallazgo) => ({
        detalle: hallazgo.prioridad_hallazgo || hallazgo.estado_hallazgo,
        fecha: hallazgo.created_at,
        titulo: 'Hallazgo operativo',
      })),
      ...datos.trabajos.map((trabajo) => ({
        detalle: `${trabajo.estado_trabajo} · ${trabajo.porcentaje_avance_general}% avance`,
        fecha: trabajo.fecha_inicio || trabajo.created_at,
        titulo: 'Trabajo clínico',
      })),
    ]
      .sort((actividadA, actividadB) => valorFecha(actividadB.fecha) - valorFecha(actividadA.fecha))
      .slice(0, 5)

    return {
      actividad,
      avancePromedio,
      casosActivos,
      casosSeguimiento,
      hallazgosPendientes,
      hallazgosSeguimiento,
      revisionesSeguimiento,
      trabajosAbiertos,
      trabajosSeguimiento,
    }
  }, [datos])
}

function useResumenFinanciero(unidades: UnidadCobrableFinanzas[]) {
  return useMemo(() => {
    const totalEmitido = unidades.reduce((total, unidad) => total + aNumero(unidad.monto_total ?? unidad.monto_cobro), 0)
    const totalPagado = unidades.reduce((total, unidad) => total + aNumero(unidad.monto_pagado), 0)
    const saldoPendiente = unidades.reduce((total, unidad) => total + aNumero(unidad.saldo_pendiente), 0)
    const cobrosPendientes = unidades.filter((unidad) => aNumero(unidad.saldo_pendiente) > 0)
    const cobrosPorEstado = contarPorEstado(unidades, (unidad) => unidad.estado_cobro)
    const movimientos = unidades
      .filter((unidad) => unidad.id_pago || unidad.fecha_ultimo_pago)
      .sort((unidadA, unidadB) => valorFecha(unidadB.fecha_ultimo_pago || unidadB.fecha_cobro) - valorFecha(unidadA.fecha_ultimo_pago || unidadA.fecha_cobro))
      .slice(0, 5)

    return {
      cobrosPendientes,
      cobrosPorEstado,
      movimientos,
      saldoPendiente,
      totalEmitido,
      totalPagado,
    }
  }, [unidades])
}

function PanelClinico({ datos, modo }: { datos: DatosClinicos; modo: 'admin' | 'terapeuta' }) {
  const resumen = useResumenClinico(datos)
  const metricas: Metrica[] = modo === 'admin'
    ? [
        { detalle: `${datos.pacientes.filter((paciente) => paciente.estado === 'activo').length} activos`, etiqueta: 'Pacientes', valor: String(datos.pacientes.length) },
        { detalle: `${resumen.casosActivos.length} activos/en proceso`, etiqueta: 'Casos', valor: String(datos.casos.length) },
        { detalle: `${datos.consultas.filter((consulta) => consulta.estado_consulta === 'Realizada').length} realizadas`, etiqueta: 'Consultas', valor: String(datos.consultas.length) },
        { detalle: `${resumen.revisionesSeguimiento.length} con seguimiento`, etiqueta: 'Revisiones', valor: String(datos.revisiones.length) },
      ]
    : [
        { detalle: `${resumen.casosActivos.length} activos/en proceso`, etiqueta: 'Casos activos', valor: String(resumen.casosActivos.length) },
        { detalle: `${resumen.revisionesSeguimiento.length} con seguimiento`, etiqueta: 'Revisiones', valor: String(datos.revisiones.length) },
        { detalle: `${resumen.hallazgosSeguimiento.length} con seguimiento`, etiqueta: 'Hallazgos', valor: String(datos.hallazgos.length) },
        { detalle: `${resumen.trabajosAbiertos.length} abiertos`, etiqueta: 'Trabajos', valor: String(datos.trabajos.length) },
      ]

  const indicadores: Indicador[] = [
    {
      detalle: `${datos.evaluaciones.length} evaluaciones consideradas`,
      etiqueta: 'Evaluaciones que requieren revisión',
      valor: calcularPorcentaje(
        datos.evaluaciones.filter((evaluacion) => evaluacion.decision_revision === 'Sí requiere revisión').length,
        datos.evaluaciones.length,
      ),
    },
    {
      detalle: `${datos.casos.length} casos considerados`,
      etiqueta: 'Casos con seguimiento',
      valor: calcularPorcentaje(resumen.casosSeguimiento.length, datos.casos.length),
    },
    {
      detalle: `${datos.elementos.length} elementos considerados`,
      etiqueta: 'Elementos activos',
      valor: calcularPorcentaje(
        datos.elementos.filter((elemento) => elemento.estado_elemento === 'Activo').length,
        datos.elementos.length,
      ),
    },
    {
      detalle: `${datos.trabajos.length} trabajos considerados`,
      etiqueta: 'Avance promedio de trabajos',
      valor: `${resumen.avancePromedio}%`,
    },
  ]

  const alertasOperativas: Indicador[] = [
    {
      detalle: 'Prioridad alta o urgente',
      etiqueta: 'Casos priorizados',
      valor: String(datos.casos.filter((caso) => esPrioridadAlta(caso.prioridad)).length),
    },
    {
      detalle: 'Revisiones marcadas para continuidad',
      etiqueta: 'Revisiones con seguimiento',
      valor: String(resumen.revisionesSeguimiento.length),
    },
    {
      detalle: 'Hallazgos pendientes de decisión clínica',
      etiqueta: 'Hallazgos pendientes',
      valor: String(resumen.hallazgosPendientes.length),
    },
    {
      detalle: 'Trabajos abiertos o con seguimiento',
      etiqueta: 'Trabajos por revisar',
      valor: String(new Set([...resumen.trabajosAbiertos, ...resumen.trabajosSeguimiento].map((trabajo) => trabajo.id_trabajo)).size),
    },
  ]

  return (
    <>
      <TarjetasMetricas ariaLabel={modo === 'admin' ? 'Métricas clínicas generales' : 'Métricas clínicas del terapeuta'} metricas={metricas} />

      <section className="clinical-layout">
        <section className="clinical-panel" aria-label="Indicadores clínicos">
          <div className="clinical-panel__header">
            <div>
              <span className="clinical-kicker">Indicadores clínicos</span>
              <h2>{modo === 'admin' ? 'Resumen clínico autorizado' : 'Reporte clínico operativo'}</h2>
              <p>{modo === 'admin' ? 'Indicadores agregados para administración.' : 'Seguimiento de casos, revisiones, hallazgos y trabajos.'}</p>
            </div>
          </div>
          <ListaIndicadores indicadores={indicadores} />
        </section>

        <section className="clinical-panel" aria-label="Panel operativo">
          <div className="clinical-panel__header">
            <div>
              <span className="clinical-kicker">Operación</span>
              <h2>Alertas de seguimiento</h2>
              <p>Lectura agregada para priorizar revisión interna.</p>
            </div>
          </div>
          <ListaIndicadores indicadores={alertasOperativas} />
        </section>
      </section>

      <section className="clinical-panel" aria-label="Actividad clínica reciente">
        <div className="clinical-panel__header">
          <div>
            <span className="clinical-kicker">Actividad</span>
            <h2>Actividad terapéutica reciente</h2>
            <p>Registro resumido sin edición desde reportes.</p>
          </div>
          <span className="clinical-count">{resumen.actividad.length}</span>
        </div>

        {resumen.actividad.length === 0 ? (
          <div className="clinical-empty">
            <strong>Sin actividad para mostrar</strong>
            <p>Cuando existan revisiones, hallazgos o trabajos, aparecerán aquí como resumen operativo.</p>
          </div>
        ) : (
          <div className="clinical-list">
            {resumen.actividad.map((actividad) => (
              <article className="clinical-card" key={`${actividad.titulo}-${actividad.fecha}-${actividad.detalle}`}>
                <div className="clinical-card__top">
                  <div>
                    <h3>{actividad.titulo}</h3>
                    <small>{formatearFecha(actividad.fecha)}</small>
                  </div>
                  <span className="clinical-badge clinical-badge--muted">{actividad.detalle}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  )
}

function PanelFinanciero({ unidades }: { unidades: UnidadCobrableFinanzas[] }) {
  const resumen = useResumenFinanciero(unidades)
  const metricas: Metrica[] = [
    { detalle: 'Monto emitido', etiqueta: 'Total emitido', valor: formatearMoneda(resumen.totalEmitido) },
    { detalle: 'Pagos aplicados', etiqueta: 'Total pagado', valor: formatearMoneda(resumen.totalPagado) },
    { detalle: 'Saldo por cobrar', etiqueta: 'Saldo pendiente', valor: formatearMoneda(resumen.saldoPendiente) },
    { detalle: `${resumen.cobrosPendientes.length} con saldo`, etiqueta: 'Cobros', valor: String(unidades.length) },
  ]

  const indicadores: Indicador[] = [
    {
      detalle: crearDetalleConteo(resumen.cobrosPorEstado),
      etiqueta: 'Cobros por estado',
      valor: String(unidades.length),
    },
    {
      detalle: 'Cobros con saldo mayor a cero',
      etiqueta: 'Pendientes de pago',
      valor: String(resumen.cobrosPendientes.length),
    },
    {
      detalle: `${resumen.movimientos.length} movimientos visibles`,
      etiqueta: 'Movimientos recientes',
      valor: String(resumen.movimientos.length),
    },
  ]

  return (
    <>
      <TarjetasMetricas ariaLabel="Métricas financieras" metricas={metricas} />

      <section className="clinical-layout">
        <section className="clinical-panel" aria-label="Indicadores financieros">
          <div className="clinical-panel__header">
            <div>
              <span className="clinical-kicker">Finanzas</span>
              <h2>Resumen financiero</h2>
              <p>Montos, estados y saldos por unidad cobrable autorizada.</p>
            </div>
          </div>
          <ListaIndicadores indicadores={indicadores} />
        </section>

        <section className="clinical-panel" aria-label="Movimientos financieros recientes">
          <div className="clinical-panel__header">
            <div>
              <span className="clinical-kicker">Movimientos</span>
              <h2>Últimos pagos visibles</h2>
              <p>Fechas, métodos y referencias administrativas.</p>
            </div>
            <span className="clinical-count">{resumen.movimientos.length}</span>
          </div>

          {resumen.movimientos.length === 0 ? (
            <div className="clinical-empty">
              <strong>Sin pagos registrados</strong>
              <p>Cuando existan pagos asociados a cobros, aparecerán en este resumen.</p>
            </div>
          ) : (
            <div className="clinical-list">
              {resumen.movimientos.map((unidad) => (
                <article className="clinical-card" key={unidad.id_pago || unidad.id_cobro}>
                  <div className="clinical-card__top">
                    <div>
                      <h3>{formatearMoneda(aNumero(unidad.monto_pagado))}</h3>
                      <small>{unidad.alias_administrativo_paciente || unidad.codigo_paciente || 'Referencia administrativa'} · {formatearFecha(unidad.fecha_ultimo_pago)}</small>
                    </div>
                    <span className="clinical-badge clinical-badge--muted">{unidad.estado_pago || 'Sin estado'}</span>
                  </div>
                  <dl className="clinical-details">
                    <div>
                      <dt>Método</dt>
                      <dd>{unidad.metodo_ultimo_pago || 'Sin método'}</dd>
                    </div>
                    <div>
                      <dt>Moneda</dt>
                      <dd>{unidad.moneda || 'Sin moneda'}</dd>
                    </div>
                    <div>
                      <dt>Referencia</dt>
                      <dd>{unidad.referencia_pago || 'Sin referencia'}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>

      <section className="clinical-panel" aria-label="Cobros administrativos recientes">
        <div className="clinical-panel__header">
          <div>
            <span className="clinical-kicker">Cobros</span>
            <h2>Unidades cobrables recientes</h2>
            <p>Conceptos, estados, referencias administrativas y saldos.</p>
          </div>
          <span className="clinical-count">{unidades.length}</span>
        </div>

        {unidades.length === 0 ? (
          <div className="clinical-empty">
            <strong>Sin cobros registrados</strong>
            <p>No hay unidades cobrables visibles para este reporte.</p>
          </div>
        ) : (
          <div className="clinical-list">
            {unidades.slice(0, 6).map((unidad) => (
              <article className="clinical-card" key={unidad.id_cobro}>
                <div className="clinical-card__top">
                  <div>
                    <h3>{unidad.concepto_cobro_administrativo || 'Cobro administrativo'}</h3>
                    <small>{unidad.alias_administrativo_paciente || unidad.codigo_paciente || 'Referencia administrativa'} · {formatearFecha(unidad.fecha_cobro)}</small>
                  </div>
                  <span className="clinical-badge">{unidad.estado_cobro || 'Sin estado'}</span>
                </div>
                <p>{textoCorto([unidad.tipo_unidad_cobrable, unidad.referencia_unidad_administrativa].filter(Boolean).join(' · ') || 'Sin referencia administrativa')}</p>
                <dl className="clinical-details">
                  <div>
                    <dt>Total</dt>
                    <dd>{formatearMoneda(aNumero(unidad.monto_total ?? unidad.monto_cobro))}</dd>
                  </div>
                  <div>
                    <dt>Pagado</dt>
                    <dd>{formatearMoneda(aNumero(unidad.monto_pagado))}</dd>
                  </div>
                  <div>
                    <dt>Saldo</dt>
                    <dd>{formatearMoneda(aNumero(unidad.saldo_pendiente))}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  )
}

function PantallaCargaReportes() {
  return (
    <main className="clinical-module-page">
      <section className="clinical-hero">
        <div className="clinical-hero__copy">
          <span className="clinical-kicker">Reportes</span>
          <h1>Preparando reportes</h1>
          <p>Estamos cargando el panel correspondiente a tu perfil.</p>
        </div>
      </section>
    </main>
  )
}

function ReportesAdmin({ datosClinicos, mensaje, unidadesFinancieras }: {
  datosClinicos: DatosClinicos
  mensaje: string
  unidadesFinancieras: UnidadCobrableFinanzas[]
}) {
  return (
    <main className="clinical-module-page">
      <section className="clinical-hero">
        <div className="clinical-hero__copy">
          <span className="clinical-kicker">Panel administrador</span>
          <h1>Reportes</h1>
          <p>Resumen general con indicadores clínicos, financieros y operativos autorizados.</p>
        </div>
      </section>

      {mensaje && <p className="clinical-message">{mensaje}</p>}
      <PanelClinico datos={datosClinicos} modo="admin" />
      <PanelFinanciero unidades={unidadesFinancieras} />
    </main>
  )
}

function ReportesTerapeuta({ datosClinicos, mensaje }: {
  datosClinicos: DatosClinicos
  mensaje: string
}) {
  return (
    <main className="clinical-module-page">
      <section className="clinical-hero">
        <div className="clinical-hero__copy">
          <span className="clinical-kicker">Panel clínico</span>
          <h1>Reportes clínicos</h1>
          <p>Indicadores de casos, revisiones, hallazgos, trabajos y seguimiento terapéutico.</p>
        </div>
      </section>

      {mensaje && <p className="clinical-message">{mensaje}</p>}
      <PanelClinico datos={datosClinicos} modo="terapeuta" />
    </main>
  )
}

function ReportesFinanzas({ mensaje, unidadesFinancieras }: {
  mensaje: string
  unidadesFinancieras: UnidadCobrableFinanzas[]
}) {
  return (
    <main className="clinical-module-page">
      <section className="clinical-hero">
        <div className="clinical-hero__copy">
          <span className="clinical-kicker">Panel financiero</span>
          <h1>Reportes financieros</h1>
          <p>Cobros, pagos, saldos y movimientos con referencias administrativas.</p>
        </div>
      </section>

      {mensaje && <p className="clinical-message">{mensaje}</p>}
      <PanelFinanciero unidades={unidadesFinancieras} />
    </main>
  )
}

function ReportesPage() {
  const [rolActivo, setRolActivo] = useState<RolUsuario | null>(null)
  const [datosClinicos, setDatosClinicos] = useState<DatosClinicos>(crearDatosClinicosVacios)
  const [unidadesFinancieras, setUnidadesFinancieras] = useState<UnidadCobrableFinanzas[]>([])
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(true)

  const cargarReportes = useCallback(async () => {
    setCargando(true)
    setMensaje('')

    try {
      const rol = await obtenerRolActivo()
      setRolActivo(rol)

      if (rol === 'finanzas') {
        const datosFinancieros = await cargarDatosFinancieros()
        setDatosClinicos(crearDatosClinicosVacios())
        setUnidadesFinancieras(datosFinancieros.unidades)
        setMensaje(datosFinancieros.aviso)
        return
      }

      const datosClinicosRespuesta = await cargarDatosClinicos()
      setDatosClinicos(datosClinicosRespuesta.datos)

      if (rol === 'admin') {
        const datosFinancieros = await cargarDatosFinancieros()
        setUnidadesFinancieras(datosFinancieros.unidades)
        setMensaje([datosClinicosRespuesta.aviso, datosFinancieros.aviso].filter(Boolean).join(' '))
        return
      }

      setUnidadesFinancieras([])
      setMensaje(datosClinicosRespuesta.aviso)
    } catch (error) {
      setRolActivo(null)
      setDatosClinicos(crearDatosClinicosVacios())
      setUnidadesFinancieras([])
      setMensaje(error instanceof Error ? error.message : 'No se pudo preparar el reporte.')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    const carga = window.setTimeout(() => {
      void cargarReportes()
    }, 0)

    return () => window.clearTimeout(carga)
  }, [cargarReportes])

  if (cargando && !rolActivo) {
    return <PantallaCargaReportes />
  }

  if (rolActivo === 'admin') {
    return <ReportesAdmin datosClinicos={datosClinicos} mensaje={mensaje} unidadesFinancieras={unidadesFinancieras} />
  }

  if (rolActivo === 'terapeuta') {
    return <ReportesTerapeuta datosClinicos={datosClinicos} mensaje={mensaje} />
  }

  if (rolActivo === 'finanzas') {
    return <ReportesFinanzas mensaje={mensaje} unidadesFinancieras={unidadesFinancieras} />
  }

  return (
    <main className="clinical-module-page">
      <section className="clinical-hero">
        <div className="clinical-hero__copy">
          <span className="clinical-kicker">Reportes</span>
          <h1>Reportes no disponibles</h1>
          <p>{mensaje || 'No fue posible preparar los reportes para este perfil.'}</p>
        </div>
      </section>
    </main>
  )
}

export default ReportesPage
