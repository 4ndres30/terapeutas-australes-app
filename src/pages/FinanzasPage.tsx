import { useEffect, useMemo, useState } from 'react'
import { aNumero, formatearFecha, formatearMoneda, normalizarTexto, textoCorto } from '../lib/format'
import { supabase } from '../lib/supabase'
import './ClinicalModuleBase.css'

type UnidadCobrableFinanzas = {
  id_cobro: string
  id_pago: string | null
  paciente_id: string
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
}

const UNIDAD_COBRABLE_SELECT = [
  'id_cobro',
  'id_pago',
  'paciente_id',
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
].join(', ')


function FinanzasPage() {
  const [unidadesCobrables, setUnidadesCobrables] = useState<UnidadCobrableFinanzas[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(true)

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

  async function cargarDatos() {
    setCargando(true)
    setMensaje('')

    const { data: unidadesData, error: unidadesError } = await supabase
      .from('vista_finanzas_unidades_cobrables')
      .select(UNIDAD_COBRABLE_SELECT)
      .order('fecha_cobro', { ascending: false })

    if (unidadesError) {
      setMensaje(`Error al cargar unidades cobrables: ${unidadesError.message}`)
      setCargando(false)
      return
    }

    setUnidadesCobrables((unidadesData || []) as unknown as UnidadCobrableFinanzas[])
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
