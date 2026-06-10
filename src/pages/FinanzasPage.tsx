import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import './ClinicalModuleBase.css'

type Paciente = {
  id: string
  nombres: string
  apellidos: string
}

type CobroEstado = {
  id_cobro: string
  paciente_id: string
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

function normalizarTexto(texto: string) {
  return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function nombrePaciente(paciente?: Paciente) {
  if (!paciente) {
    return 'Paciente no encontrado'
  }

  return `${paciente.nombres} ${paciente.apellidos}`.trim() || 'Paciente sin nombre'
}

function formatearFecha(fecha: string | null) {
  if (!fecha) {
    return 'Sin fecha'
  }

  const normalizada = fecha.includes('T') ? fecha : `${fecha}T00:00:00`
  const fechaFinanzas = new Date(normalizada)

  if (Number.isNaN(fechaFinanzas.getTime())) {
    return 'Sin fecha'
  }

  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(fechaFinanzas)
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

function textoCorto(texto: string, largo = 110) {
  const limpio = texto.trim()
  return limpio.length > largo ? `${limpio.slice(0, largo - 1)}...` : limpio
}

function FinanzasPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [cobros, setCobros] = useState<CobroEstado[]>([])
  const [pagos, setPagos] = useState<Pago[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(true)

  const pacientesPorId = useMemo(() => new Map(pacientes.map((paciente) => [paciente.id, paciente])), [pacientes])

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
        nombrePaciente(pacientesPorId.get(cobro.paciente_id)),
      ].join(' ')

      return normalizarTexto(texto).includes(filtro)
    })
  }, [busqueda, cobros, pacientesPorId])

  const pagosFiltrados = useMemo(() => {
    if (!busqueda.trim()) {
      return pagos
    }

    const filtro = normalizarTexto(busqueda.trim())

    return pagos.filter((pago) => {
      const texto = [
        pago.metodo_pago,
        pago.estado_pago,
        pago.referencia_pago || '',
        pago.observaciones || '',
        nombrePaciente(pacientesPorId.get(pago.paciente_id)),
      ].join(' ')

      return normalizarTexto(texto).includes(filtro)
    })
  }, [busqueda, pagos, pacientesPorId])

  const totalCobrado = cobros.reduce((total, cobro) => total + aNumero(cobro.monto_total ?? cobro.monto_cobro), 0)
  const totalPagado = cobros.reduce((total, cobro) => total + aNumero(cobro.monto_pagado), 0)
  const saldoPendiente = cobros.reduce((total, cobro) => total + aNumero(cobro.saldo_pendiente), 0)

  const metricas = [
    { etiqueta: 'Cobros', valor: String(cobros.length), detalle: 'Registros reales' },
    { etiqueta: 'Total', valor: formatearMoneda(totalCobrado), detalle: 'Monto emitido' },
    { etiqueta: 'Pagado', valor: formatearMoneda(totalPagado), detalle: 'Pagos aplicados' },
    { etiqueta: 'Saldo', valor: formatearMoneda(saldoPendiente), detalle: 'Pendiente' },
  ]

  async function cargarDatos() {
    setCargando(true)
    setMensaje('')

    const { data: pacientesData, error: pacientesError } = await supabase
      .from('pacientes')
      .select('id, nombres, apellidos')
      .order('created_at', { ascending: false })

    if (pacientesError) {
      setMensaje(`Error al cargar pacientes: ${pacientesError.message}`)
      setCargando(false)
      return
    }

    const { data: cobrosData, error: cobrosError } = await supabase
      .from('vista_cobros_estado')
      .select(COBRO_SELECT)
      .order('fecha_cobro', { ascending: false })

    if (cobrosError) {
      setMensaje(`Error al cargar cobros: ${cobrosError.message}`)
      setCargando(false)
      return
    }

    const { data: pagosData, error: pagosError } = await supabase
      .from('pagos')
      .select(PAGO_SELECT)
      .order('fecha_pago', { ascending: false })
      .order('created_at', { ascending: false })

    if (pagosError) {
      setMensaje(`Error al cargar pagos: ${pagosError.message}`)
      setCargando(false)
      return
    }

    setPacientes((pacientesData || []) as Paciente[])
    setCobros((cobrosData || []) as unknown as CobroEstado[])
    setPagos((pagosData || []) as unknown as Pago[])
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
          <p>Vista base de lectura conectada a cobros, pagos y vista_cobros_estado.</p>
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
              <p>Usa la vista calculada real de Supabase local.</p>
            </div>
            <span className="clinical-count">{cobrosFiltrados.length}</span>
          </div>

          <label className="clinical-search">
            <span>Buscar</span>
            <input
              className="clinical-input"
              placeholder="Paciente, concepto, tipo o estado"
              type="search"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
            />
          </label>

          {cobrosFiltrados.length === 0 ? (
            <div className="clinical-empty">
              <strong>{cargando ? 'Cargando cobros' : 'Sin cobros registrados'}</strong>
              <p>{cargando ? 'Consultando vista financiera.' : 'No hay cobros visibles para este filtro.'}</p>
            </div>
          ) : (
            <div className="clinical-list">
              {cobrosFiltrados.map((cobro) => (
                <article className="clinical-card" key={cobro.id_cobro}>
                  <div className="clinical-card__top">
                    <div>
                      <h3>{cobro.concepto_cobro || 'Cobro sin concepto'}</h3>
                      <small>{nombrePaciente(pacientesPorId.get(cobro.paciente_id))} · {formatearFecha(cobro.fecha_cobro)}</small>
                    </div>
                    <span className="clinical-badge">{cobro.estado_calculado || cobro.estado_cobro || 'Sin estado'}</span>
                  </div>
                  <p>{textoCorto(cobro.tipo_cobro || 'Sin tipo registrado')}</p>
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

        <section className="clinical-panel" aria-label="Pagos reales">
          <div className="clinical-panel__header">
            <div>
              <span className="clinical-kicker">Pagos</span>
              <h2>Movimientos registrados</h2>
              <p>Lectura directa desde public.pagos.</p>
            </div>
            <span className="clinical-count">{pagosFiltrados.length}</span>
          </div>

          {pagosFiltrados.length === 0 ? (
            <div className="clinical-empty">
              <strong>{cargando ? 'Cargando pagos' : 'Sin pagos registrados'}</strong>
              <p>{cargando ? 'Consultando movimientos.' : 'No hay pagos visibles para este filtro.'}</p>
            </div>
          ) : (
            <div className="clinical-list">
              {pagosFiltrados.map((pago) => (
                <article className="clinical-card" key={pago.id_pago}>
                  <div className="clinical-card__top">
                    <div>
                      <h3>{formatearMoneda(aNumero(pago.monto_pago))}</h3>
                      <small>{nombrePaciente(pacientesPorId.get(pago.paciente_id))} · {formatearFecha(pago.fecha_pago)}</small>
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
