import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { aNumero, formatearFecha, formatearMoneda, normalizarTexto, textoCorto } from '../lib/format'
import { supabase } from '../lib/supabase'
import './ClinicalModuleBase.css'

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
  monto_descuento: number | string | null
  monto_total: number | string | null
  moneda: string | null
  estado_cobro: string | null
  monto_pagado: number | string | null
  saldo_pendiente: number | string | null
  estado_pago: string | null
  fecha_ultimo_pago: string | null
  metodo_ultimo_pago: string | null
  referencia_pago: string | null
  observaciones_cobro_administrativas: string | null
  observaciones_pago_administrativas: string | null
  nota_conciliacion_pago: string | null
}

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
  'monto_descuento',
  'monto_total',
  'moneda',
  'estado_cobro',
  'monto_pagado',
  'saldo_pendiente',
  'estado_pago',
  'fecha_ultimo_pago',
  'metodo_ultimo_pago',
  'referencia_pago',
  'observaciones_cobro_administrativas',
  'observaciones_pago_administrativas',
  'nota_conciliacion_pago',
].join(', ')


async function obtenerUnidadesCobrables(): Promise<UnidadCobrableFinanzas[]> {
  const { data, error } = await supabase
    .from('vista_finanzas_unidades_cobrables')
    .select(UNIDAD_COBRABLE_SELECT)
    .order('fecha_cobro', { ascending: false })

  if (error) {
    throw new Error(`Error al cargar unidades cobrables: ${error.message}`)
  }

  return (data || []) as unknown as UnidadCobrableFinanzas[]
}

function FinanzasPage() {
  const [busqueda, setBusqueda] = useState('')

  const {
    data: unidadesCobrables = [],
    isLoading: cargando,
    error: errorConsulta,
  } = useQuery({
    queryKey: ['unidades-cobrables'],
    queryFn: obtenerUnidadesCobrables,
  })

  const mensaje = errorConsulta ? errorConsulta.message : ''

  const unidadesFiltradas = useMemo(() => {
    if (!busqueda.trim()) {
      return unidadesCobrables
    }

    const filtro = normalizarTexto(busqueda.trim())

    return unidadesCobrables.filter((unidad) => {
      const texto = [
        unidad.alias_administrativo_paciente || '',
        unidad.codigo_paciente || '',
        unidad.concepto_cobro_administrativo || '',
        unidad.tipo_unidad_cobrable || '',
        unidad.referencia_unidad_administrativa || '',
        unidad.tipo_cobro || '',
        unidad.estado_cobro || '',
        unidad.estado_pago || '',
        unidad.metodo_ultimo_pago || '',
        unidad.referencia_pago || '',
        unidad.moneda || '',
        unidad.observaciones_cobro_administrativas || '',
        unidad.observaciones_pago_administrativas || '',
        unidad.nota_conciliacion_pago || '',
      ].join(' ')

      return normalizarTexto(texto).includes(filtro)
    })
  }, [busqueda, unidadesCobrables])

  const unidadesConPago = unidadesFiltradas.filter((unidad) => unidad.id_pago)

  const totalCobrado = unidadesCobrables.reduce((total, unidad) => total + aNumero(unidad.monto_total ?? unidad.monto_cobro), 0)
  const totalPagado = unidadesCobrables.reduce((total, unidad) => total + aNumero(unidad.monto_pagado), 0)
  const saldoPendiente = unidadesCobrables.reduce((total, unidad) => total + aNumero(unidad.saldo_pendiente), 0)

  const metricas = [
    { etiqueta: 'Cobros', valor: String(unidadesCobrables.length), detalle: 'Unidades visibles' },
    { etiqueta: 'Total', valor: formatearMoneda(totalCobrado), detalle: 'Monto emitido' },
    { etiqueta: 'Pagado', valor: formatearMoneda(totalPagado), detalle: 'Pagos aplicados' },
    { etiqueta: 'Saldo', valor: formatearMoneda(saldoPendiente), detalle: 'Pendiente' },
  ]

  return (
    <main className="clinical-module-page">
      <section className="clinical-hero">
        <div className="clinical-hero__copy">
          <span className="clinical-kicker">Módulo financiero</span>
          <h1>Cobros y Pagos</h1>
          <p>Cobros, saldos y pagos con identificadores administrativos.</p>
        </div>

        <section className="clinical-metrics" aria-label="Métricas financieras">
          {metricas.map((metrica) => (
            <article className="clinical-metric-card" key={metrica.etiqueta}>
              <strong>{metrica.valor}</strong>
              <span>{metrica.etiqueta}</span>
              <p>{metrica.detalle}</p>
            </article>
          ))}
        </section>
      </section>

      <section className="clinical-layout">
        <section className="clinical-panel" aria-label="Cobros reales">
          <div className="clinical-panel__header">
            <div>
              <span className="clinical-kicker">Cobros</span>
              <h2>Estado de cobros</h2>
              <p>Seguimiento operativo de cobros y saldos.</p>
            </div>
            <span className="clinical-count">{unidadesFiltradas.length}</span>
          </div>

          <label className="clinical-search">
            <span>Buscar</span>
            <input
              className="clinical-input"
              placeholder="Alias, código, referencia, tipo o estado"
              type="search"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
            />
          </label>

          {unidadesFiltradas.length === 0 ? (
            <div className="clinical-empty">
              <strong>{cargando ? 'Cargando cobros' : 'Sin cobros registrados'}</strong>
              <p>{cargando ? 'Preparando información financiera.' : 'No hay unidades visibles para este filtro.'}</p>
            </div>
          ) : (
            <div className="clinical-list">
              {unidadesFiltradas.map((unidad) => (
                <article className="clinical-card" key={unidad.id_cobro}>
                  <div className="clinical-card__top">
                    <div>
                      <h3>{unidad.concepto_cobro_administrativo || 'Cobro administrativo'}</h3>
                      <small>{unidad.alias_administrativo_paciente || unidad.codigo_paciente || 'Paciente administrativo'} · {formatearFecha(unidad.fecha_cobro)}</small>
                    </div>
                    <span className="clinical-badge">{unidad.estado_cobro || 'Sin estado'}</span>
                  </div>
                  <p>{textoCorto([unidad.tipo_unidad_cobrable, unidad.referencia_unidad_administrativa].filter(Boolean).join(' · ') || 'Sin referencia administrativa', 110)}</p>
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
                  {unidad.observaciones_cobro_administrativas && (
                    <div className="clinical-details" style={{ display: 'block', marginTop: '0.5rem', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                      <strong>Nota administrativa:</strong> {unidad.observaciones_cobro_administrativas}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="clinical-panel" aria-label="Pagos reales">
          <div className="clinical-panel__header">
            <div>
              <span className="clinical-kicker">Pagos</span>
              <h2>Movimientos registrados</h2>
              <p>Referencia del pago más reciente asociado a cada cobro.</p>
            </div>
            <span className="clinical-count">{unidadesConPago.length}</span>
          </div>

          {unidadesConPago.length === 0 ? (
            <div className="clinical-empty">
              <strong>{cargando ? 'Cargando pagos' : 'Sin pagos registrados'}</strong>
              <p>{cargando ? 'Consultando movimientos.' : 'No hay pagos visibles para este filtro.'}</p>
            </div>
          ) : (
            <div className="clinical-list">
              {unidadesConPago.map((unidad) => (
                <article className="clinical-card" key={unidad.id_pago || unidad.id_cobro}>
                  <div className="clinical-card__top">
                    <div>
                      <h3>{formatearMoneda(aNumero(unidad.monto_pagado))}</h3>
                      <small>{unidad.alias_administrativo_paciente || unidad.codigo_paciente || 'Paciente administrativo'} · {formatearFecha(unidad.fecha_ultimo_pago)}</small>
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
                  {unidad.observaciones_pago_administrativas && (
                    <div className="clinical-details" style={{ display: 'block', marginTop: '0.5rem', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                      <strong>Nota pago:</strong> {unidad.observaciones_pago_administrativas}
                    </div>
                  )}
                  {unidad.nota_conciliacion_pago && (
                    <div className="clinical-details" style={{ display: 'block', marginTop: '0.25rem', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                      <strong>Conciliación:</strong> {unidad.nota_conciliacion_pago}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}

          {mensaje && <p className={mensaje.startsWith('Error') ? 'clinical-message clinical-message--error' : 'clinical-message'}>{mensaje}</p>}
        </section>
      </section>
    </main>
  )
}

export default FinanzasPage
