import { useCallback, useEffect, useMemo, useState } from 'react'
import { aNumero, formatearFecha, formatearMoneda, normalizarTexto, textoCorto } from '../../lib/format'
import { supabase } from '../../lib/supabase'
import '../ClinicalModuleBase.css'

type PagosCasoPanelProps = {
  casoId: string
  pacienteId: string
}

type CobroEstado = {
  id_cobro: string | null
  paciente_id: string | null
  caso_id: string | null
  revision_id: string | null
  trabajo_id: string | null
  fecha_cobro: string | null
  fecha_vencimiento: string | null
  concepto_cobro: string | null
  tipo_cobro: string | null
  monto_cobro: number | string | null
  monto_descuento: number | string | null
  monto_total: number | string | null
  moneda: string | null
  estado_cobro: string | null
  monto_pagado: number | string | null
  saldo_pendiente: number | string | null
  estado_calculado: string | null
}

type Pago = {
  id_pago: string
  cobro_id: string
  paciente_id: string
  fecha_pago: string
  monto_pago: number | string
  moneda: string
  metodo_pago: string
  estado_pago: string
  referencia_pago: string | null
  observaciones: string | null
  created_at: string
}

const COBRO_SELECT = [
  'id_cobro',
  'paciente_id',
  'caso_id',
  'revision_id',
  'trabajo_id',
  'fecha_cobro',
  'fecha_vencimiento',
  'concepto_cobro',
  'tipo_cobro',
  'monto_cobro',
  'monto_descuento',
  'monto_total',
  'moneda',
  'estado_cobro',
  'monto_pagado',
  'saldo_pendiente',
  'estado_calculado',
].join(', ')

const PAGO_SELECT = [
  'id_pago',
  'cobro_id',
  'paciente_id',
  'fecha_pago',
  'monto_pago',
  'moneda',
  'metodo_pago',
  'estado_pago',
  'referencia_pago',
  'observaciones',
  'created_at',
].join(', ')


function PagosCasoPanel({ casoId, pacienteId }: PagosCasoPanelProps) {
  const [cobros, setCobros] = useState<CobroEstado[]>([])
  const [pagos, setPagos] = useState<Pago[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(true)

  const cobrosPorId = useMemo(() => new Map(cobros.filter((cobro) => cobro.id_cobro).map((cobro) => [cobro.id_cobro as string, cobro])), [cobros])

  const cobrosFiltrados = useMemo(() => {
    if (!busqueda.trim()) {
      return cobros
    }

    const filtro = normalizarTexto(busqueda.trim())

    return cobros.filter((cobro) => {
      const texto = [
        cobro.concepto_cobro || '',
        cobro.tipo_cobro || '',
        cobro.estado_cobro || '',
        cobro.estado_calculado || '',
        cobro.moneda || '',
      ].join(' ')

      return normalizarTexto(texto).includes(filtro)
    })
  }, [busqueda, cobros])

  const pagosFiltrados = useMemo(() => {
    if (!busqueda.trim()) {
      return pagos
    }

    const filtro = normalizarTexto(busqueda.trim())

    return pagos.filter((pago) => {
      const cobro = cobrosPorId.get(pago.cobro_id)
      const texto = [
        pago.metodo_pago,
        pago.estado_pago,
        pago.referencia_pago || '',
        pago.observaciones || '',
        cobro?.concepto_cobro || '',
      ].join(' ')

      return normalizarTexto(texto).includes(filtro)
    })
  }, [busqueda, cobrosPorId, pagos])

  const totalCobrado = cobros.reduce((total, cobro) => total + aNumero(cobro.monto_total ?? cobro.monto_cobro), 0)
  const totalPagado = cobros.reduce((total, cobro) => total + aNumero(cobro.monto_pagado), 0)
  const saldoPendiente = cobros.reduce((total, cobro) => total + aNumero(cobro.saldo_pendiente), 0)

  const metricas = [
    { etiqueta: 'Cobros', valor: cobros.length, detalle: 'Asociados al caso' },
    { etiqueta: 'Total', valor: formatearMoneda(totalCobrado), detalle: 'Monto emitido' },
    { etiqueta: 'Pagado', valor: formatearMoneda(totalPagado), detalle: 'Pagos aplicados' },
    { etiqueta: 'Saldo', valor: formatearMoneda(saldoPendiente), detalle: 'Pendiente' },
  ]

  const cargarFinanzasCaso = useCallback(async () => {
    setCargando(true)
    setMensaje('')

    const { data: cobrosData, error: cobrosError } = await supabase
      .from('vista_cobros_estado')
      .select(COBRO_SELECT)
      .eq('caso_id', casoId)
      .eq('paciente_id', pacienteId)
      .order('fecha_cobro', { ascending: false })

    if (cobrosError) {
      setMensaje(`Error al cargar cobros del caso: ${cobrosError.message}`)
      setCargando(false)
      return
    }

    const cobrosCaso = (cobrosData || []) as unknown as CobroEstado[]
    const cobroIds = cobrosCaso.map((cobro) => cobro.id_cobro).filter((idCobro): idCobro is string => Boolean(idCobro))

    if (cobroIds.length === 0) {
      setCobros(cobrosCaso)
      setPagos([])
      setCargando(false)
      return
    }

    const { data: pagosData, error: pagosError } = await supabase
      .from('pagos')
      .select(PAGO_SELECT)
      .eq('paciente_id', pacienteId)
      .in('cobro_id', cobroIds)
      .order('fecha_pago', { ascending: false })
      .order('created_at', { ascending: false })

    if (pagosError) {
      setMensaje(`Error al cargar pagos del caso: ${pagosError.message}`)
      setCargando(false)
      return
    }

    setCobros(cobrosCaso)
    setPagos((pagosData || []) as unknown as Pago[])
    setCargando(false)
  }, [casoId, pacienteId])

  useEffect(() => {
    const carga = window.setTimeout(() => {
      void cargarFinanzasCaso()
    }, 0)

    return () => window.clearTimeout(carga)
  }, [cargarFinanzasCaso])

  return (
    <section className="caso-detail-section" id="pagos">
      <div className="caso-section-heading">
        <div>
          <span className="clinical-kicker">Pagos</span>
          <h2>Finanzas del caso</h2>
          <p>Pagos filtrados indirectamente por cobros del caso: `vista_cobros_estado.caso_id` → `pagos.cobro_id`.</p>
        </div>
      </div>

      <section className="clinical-metrics caso-detail-metrics" aria-label="Métricas financieras del caso">
        {metricas.map((metrica) => (
          <article className="clinical-metric-card" key={metrica.etiqueta}>
            <strong>{metrica.valor}</strong>
            <span>{metrica.etiqueta}</span>
            <p>{metrica.detalle}</p>
          </article>
        ))}
      </section>

      <section className="clinical-layout caso-panel-layout">
        <section className="clinical-panel" aria-label="Cobros asociados al caso">
          <div className="clinical-panel__header">
            <div>
              <span className="clinical-kicker">Cobros</span>
              <h2>Estado de cobros</h2>
              <p>Usa la vista calculada existente.</p>
            </div>
            <span className="clinical-count">{cobrosFiltrados.length}</span>
          </div>

          <label className="clinical-search">
            <span>Buscar</span>
            <input className="clinical-input" placeholder="Concepto, tipo o estado" type="search" value={busqueda} onChange={(event) => setBusqueda(event.target.value)} />
          </label>

          {cobrosFiltrados.length === 0 ? (
            <div className="clinical-empty">
              <strong>{cargando ? 'Cargando cobros' : 'Sin cobros asociados a este caso'}</strong>
              <p>{cargando ? 'Consultando vista financiera.' : 'Finanzas sigue disponible como módulo principal para gestión completa.'}</p>
            </div>
          ) : (
            <div className="clinical-list">
              {cobrosFiltrados.map((cobro) => (
                <article className="clinical-card" key={cobro.id_cobro || `${cobro.concepto_cobro}-${cobro.fecha_cobro}`}>
                  <div className="clinical-card__top">
                    <div>
                      <h3>{cobro.concepto_cobro || 'Cobro sin concepto'}</h3>
                      <small>{formatearFecha(cobro.fecha_cobro)} · {cobro.tipo_cobro || 'Sin tipo'}</small>
                    </div>
                    <span className="clinical-badge">{cobro.estado_calculado || cobro.estado_cobro || 'Sin estado'}</span>
                  </div>
                  <p>{textoCorto(cobro.trabajo_id ? 'Cobro asociado a trabajo del caso.' : cobro.revision_id ? 'Cobro asociado a revisión del caso.' : 'Cobro asociado directamente al caso.', 112)}</p>
                  <dl className="clinical-details">
                    <div>
                      <dt>Total</dt>
                      <dd>{formatearMoneda(aNumero(cobro.monto_total ?? cobro.monto_cobro))}</dd>
                    </div>
                    <div>
                      <dt>Pagado</dt>
                      <dd>{formatearMoneda(aNumero(cobro.monto_pagado))}</dd>
                    </div>
                    <div>
                      <dt>Saldo</dt>
                      <dd>{formatearMoneda(aNumero(cobro.saldo_pendiente))}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="clinical-panel" aria-label="Pagos asociados a cobros del caso">
          <div className="clinical-panel__header">
            <div>
              <span className="clinical-kicker">Pagos</span>
              <h2>Movimientos</h2>
              <p>Solo pagos vinculados a cobros del caso.</p>
            </div>
            <span className="clinical-count">{pagosFiltrados.length}</span>
          </div>

          {pagosFiltrados.length === 0 ? (
            <div className="clinical-empty">
              <strong>{cargando ? 'Cargando pagos' : 'Sin pagos asociados a cobros de este caso'}</strong>
              <p>{cargando ? 'Consultando movimientos.' : 'No hay pagos aplicados a los cobros de este caso.'}</p>
            </div>
          ) : (
            <div className="clinical-list">
              {pagosFiltrados.map((pago) => {
                const cobro = cobrosPorId.get(pago.cobro_id)

                return (
                  <article className="clinical-card" key={pago.id_pago}>
                    <div className="clinical-card__top">
                      <div>
                        <h3>{formatearMoneda(aNumero(pago.monto_pago))}</h3>
                        <small>{formatearFecha(pago.fecha_pago)} · {cobro?.concepto_cobro || 'Cobro asociado'}</small>
                      </div>
                      <span className="clinical-badge clinical-badge--muted">{pago.estado_pago}</span>
                    </div>
                    <dl className="clinical-details">
                      <div>
                        <dt>Método</dt>
                        <dd>{pago.metodo_pago}</dd>
                      </div>
                      <div>
                        <dt>Moneda</dt>
                        <dd>{pago.moneda}</dd>
                      </div>
                      <div>
                        <dt>Referencia</dt>
                        <dd>{pago.referencia_pago || 'Sin referencia'}</dd>
                      </div>
                    </dl>
                  </article>
                )
              })}
            </div>
          )}

          {mensaje && <p className={mensaje.startsWith('Error') ? 'clinical-message clinical-message--error' : 'clinical-message'}>{mensaje}</p>}
        </section>
      </section>
    </section>
  )
}

export default PagosCasoPanel
