import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import './ClinicalModuleBase.css'

type TipoContextoAgenda = 'todos' | 'solicitudes' | 'eventos' | 'consultas'

type AgendaOperativa = {
  id_agenda_evento: string
  solicitud_agenda_id: string | null
  paciente_id: string | null
  consulta_id: string | null
  evaluacion_id: string | null
  caso_id: string | null
  revision_id: string | null
  trabajo_id: string | null
  trabajo_sesion_id: string | null
  tipo_evento: string
  estado_evento: string
  origen_evento: string
  titulo_evento: string
  titulo_publico: string
  fecha_inicio: string
  fecha_fin: string | null
  modalidad: string | null
  requiere_confirmacion: boolean
  confirmado_por_paciente: boolean
  google_calendar_sync_estado: string | null
  estado_solicitud: string | null
  origen_solicitud: string | null
  fecha_solicitud: string | null
  nombre_contacto: string | null
  email_contacto: string | null
  telefono_contacto: string | null
  nombre_operativo: string | null
  tipo_contexto: string
  created_at: string
  updated_at: string
}

const AGENDA_OPERATIVA_SELECT = [
  'id_agenda_evento',
  'solicitud_agenda_id',
  'paciente_id',
  'consulta_id',
  'evaluacion_id',
  'caso_id',
  'revision_id',
  'trabajo_id',
  'trabajo_sesion_id',
  'tipo_evento',
  'estado_evento',
  'origen_evento',
  'titulo_evento',
  'titulo_publico',
  'fecha_inicio',
  'fecha_fin',
  'modalidad',
  'requiere_confirmacion',
  'confirmado_por_paciente',
  'google_calendar_sync_estado',
  'estado_solicitud',
  'origen_solicitud',
  'fecha_solicitud',
  'nombre_contacto',
  'email_contacto',
  'telefono_contacto',
  'nombre_operativo',
  'tipo_contexto',
  'created_at',
  'updated_at',
].join(', ')

function normalizarTexto(texto: string) {
  return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function formatearEtiqueta(valor: string | null | undefined) {
  if (!valor) {
    return 'Sin dato'
  }

  return valor
    .split('_')
    .filter(Boolean)
    .map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1))
    .join(' ')
}

function formatearFechaHora(fecha: string | null) {
  if (!fecha) {
    return 'Sin fecha'
  }

  const fechaAgenda = new Date(fecha)

  if (Number.isNaN(fechaAgenda.getTime())) {
    return 'Sin fecha'
  }

  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(fechaAgenda)
}

function formatearRangoHorario(evento: AgendaOperativa) {
  const inicio = formatearFechaHora(evento.fecha_inicio)

  if (!evento.fecha_fin) {
    return inicio
  }

  const fechaFin = new Date(evento.fecha_fin)

  if (Number.isNaN(fechaFin.getTime())) {
    return inicio
  }

  const horaFin = new Intl.DateTimeFormat('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(fechaFin)

  return `${inicio} - ${horaFin}`
}

function textoCorto(texto: string, largo = 130) {
  const limpio = texto.trim()
  return limpio.length > largo ? `${limpio.slice(0, largo - 1)}...` : limpio
}

function obtenerContexto(evento: AgendaOperativa) {
  if (evento.consulta_id) {
    return 'Consulta clinica'
  }

  if (evento.solicitud_agenda_id || evento.tipo_contexto === 'solicitud') {
    return 'Solicitud agenda'
  }

  if (evento.paciente_id || evento.tipo_contexto === 'paciente') {
    return 'Paciente vinculado'
  }

  return 'Evento interno'
}

function obtenerContacto(evento: AgendaOperativa) {
  if (evento.email_contacto && evento.telefono_contacto) {
    return `${evento.email_contacto} / ${evento.telefono_contacto}`
  }

  return evento.email_contacto || evento.telefono_contacto || 'Sin contacto en vista'
}

function coincideConFiltroContexto(evento: AgendaOperativa, filtro: TipoContextoAgenda) {
  if (filtro === 'todos') {
    return true
  }

  if (filtro === 'solicitudes') {
    return Boolean(evento.solicitud_agenda_id || evento.tipo_contexto === 'solicitud')
  }

  if (filtro === 'consultas') {
    return Boolean(evento.consulta_id)
  }

  return !evento.solicitud_agenda_id && !evento.consulta_id
}

function AgendaPage() {
  const [agenda, setAgenda] = useState<AgendaOperativa[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [filtroContexto, setFiltroContexto] = useState<TipoContextoAgenda>('todos')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(true)

  const estadosDisponibles = useMemo(() => {
    return Array.from(new Set(agenda.map((evento) => evento.estado_evento).filter(Boolean))).sort()
  }, [agenda])

  const agendaFiltrada = useMemo(() => {
    const filtroTexto = normalizarTexto(busqueda.trim())

    return agenda.filter((evento) => {
      if (!coincideConFiltroContexto(evento, filtroContexto)) {
        return false
      }

      if (filtroEstado !== 'todos' && evento.estado_evento !== filtroEstado) {
        return false
      }

      if (!filtroTexto) {
        return true
      }

      const texto = [
        evento.titulo_evento,
        evento.titulo_publico,
        evento.tipo_evento,
        evento.estado_evento,
        evento.origen_evento,
        evento.origen_solicitud || '',
        evento.estado_solicitud || '',
        evento.modalidad || '',
        evento.nombre_operativo || '',
        evento.nombre_contacto || '',
        obtenerContexto(evento),
      ].join(' ')

      return normalizarTexto(texto).includes(filtroTexto)
    })
  }, [agenda, busqueda, filtroContexto, filtroEstado])

  const solicitudesVinculadas = agenda.filter((evento) => evento.solicitud_agenda_id || evento.tipo_contexto === 'solicitud')
  const consultasVinculadas = agenda.filter((evento) => evento.consulta_id)
  const eventosInternos = agenda.filter((evento) => !evento.solicitud_agenda_id && !evento.consulta_id)
  const pendientesConfirmacion = agenda.filter((evento) => evento.requiere_confirmacion && !evento.confirmado_por_paciente)

  const metricas = [
    { etiqueta: 'Eventos', valor: agenda.length, detalle: 'Vista operativa' },
    { etiqueta: 'Solicitudes', valor: solicitudesVinculadas.length, detalle: 'Vinculadas a evento' },
    { etiqueta: 'Consultas', valor: consultasVinculadas.length, detalle: 'Con consulta asociada' },
    { etiqueta: 'Confirmar', valor: pendientesConfirmacion.length, detalle: 'Pendientes' },
  ]

  async function cargarAgenda() {
    setCargando(true)
    setMensaje('')

    const { data, error } = await supabase
      .from('vista_agenda_operativa')
      .select(AGENDA_OPERATIVA_SELECT)
      .order('fecha_inicio', { ascending: true })

    if (error) {
      setAgenda([])
      setMensaje('No se pudo cargar la agenda operativa interna.')
      setCargando(false)
      return
    }

    setAgenda((data || []) as unknown as AgendaOperativa[])
    setCargando(false)
  }

  useEffect(() => {
    const carga = window.setTimeout(() => {
      void cargarAgenda()
    }, 0)

    return () => window.clearTimeout(carga)
  }, [])

  return (
    <main className="clinical-module-page">
      <section className="clinical-hero">
        <div className="clinical-hero__copy">
          <span className="clinical-kicker">Agenda interna</span>
          <h1>Agenda</h1>
          <p>Vista operativa conectada a eventos internos, solicitudes vinculadas y consultas confirmadas.</p>
        </div>

        <section className="clinical-metrics" aria-label="Métricas de agenda">
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
        <section className="clinical-panel" aria-label="Agenda operativa">
          <div className="clinical-panel__header">
            <div>
              <span className="clinical-kicker">Vista interna</span>
              <h2>Eventos operativos</h2>
              <p>Lectura desde la vista operativa interna.</p>
            </div>
            <span className="clinical-count">{agendaFiltrada.length}</span>
          </div>

          <label className="clinical-search">
            <span>Buscar</span>
            <input
              className="clinical-input"
              placeholder="Título, paciente, contacto, tipo, modalidad, estado u origen"
              type="search"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
            />
          </label>

          <div className="clinical-grid">
            <label className="clinical-field">
              <span>Contexto</span>
              <select
                className="clinical-select"
                value={filtroContexto}
                onChange={(event) => setFiltroContexto(event.target.value as TipoContextoAgenda)}
              >
                <option value="todos">Todos</option>
                <option value="solicitudes">Solicitudes</option>
                <option value="eventos">Eventos internos</option>
                <option value="consultas">Consultas clínicas</option>
              </select>
            </label>

            <label className="clinical-field">
              <span>Estado</span>
              <select
                className="clinical-select"
                value={filtroEstado}
                onChange={(event) => setFiltroEstado(event.target.value)}
              >
                <option value="todos">Todos</option>
                {estadosDisponibles.map((estado) => (
                  <option key={estado} value={estado}>{formatearEtiqueta(estado)}</option>
                ))}
              </select>
            </label>
          </div>

          {mensaje && <p className="clinical-message clinical-message--error">{mensaje}</p>}

          {agendaFiltrada.length === 0 ? (
            <div className="clinical-empty">
              <strong>{cargando ? 'Cargando agenda' : 'Sin eventos visibles'}</strong>
              <p>{cargando ? 'Consultando agenda operativa interna.' : 'No hay eventos para el filtro actual.'}</p>
            </div>
          ) : (
            <div className="clinical-list">
              {agendaFiltrada.map((evento) => (
                <article className="clinical-card" key={evento.id_agenda_evento}>
                  <div className="clinical-card__top">
                    <div>
                      <h3>{evento.titulo_evento || evento.titulo_publico}</h3>
                      <small>{formatearRangoHorario(evento)} · {evento.nombre_operativo || 'Sin contexto operativo'}</small>
                    </div>
                    <span className="clinical-badge">{formatearEtiqueta(evento.estado_evento)}</span>
                  </div>

                  <p>{textoCorto(`${obtenerContexto(evento)} · ${formatearEtiqueta(evento.tipo_evento)} · ${formatearEtiqueta(evento.origen_evento)}`)}</p>

                  <dl className="clinical-details">
                    <div>
                      <dt>Modalidad</dt>
                      <dd>{formatearEtiqueta(evento.modalidad)}</dd>
                    </div>
                    <div>
                      <dt>Contacto</dt>
                      <dd>{obtenerContacto(evento)}</dd>
                    </div>
                    <div>
                      <dt>Solicitud</dt>
                      <dd>{formatearEtiqueta(evento.estado_solicitud)}</dd>
                    </div>
                    <div>
                      <dt>Origen</dt>
                      <dd>{formatearEtiqueta(evento.origen_solicitud || evento.origen_evento)}</dd>
                    </div>
                    <div>
                      <dt>Confirmación</dt>
                      <dd>{evento.requiere_confirmacion ? (evento.confirmado_por_paciente ? 'Confirmada' : 'Pendiente') : 'No requerida'}</dd>
                    </div>
                    <div>
                      <dt>Google</dt>
                      <dd>{formatearEtiqueta(evento.google_calendar_sync_estado)}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="clinical-panel" aria-label="Separación de agenda">
          <div className="clinical-panel__header">
            <div>
              <span className="clinical-kicker">Separación operativa</span>
              <h2>Solicitudes, eventos y consultas</h2>
              <p>La agenda no crea pacientes ni consultas automáticamente.</p>
            </div>
          </div>

          <div className="clinical-readonly-stack">
            <article>
              <span>Solicitudes de agenda</span>
              <strong>{solicitudesVinculadas.length}</strong>
              <small>Solicitudes ya vinculadas a eventos internos.</small>
            </article>

            <article>
              <span>Eventos internos</span>
              <strong>{eventosInternos.length}</strong>
              <small>Eventos creados o vinculados dentro del sistema interno.</small>
            </article>

            <article>
              <span>Consultas clínicas</span>
              <strong>{consultasVinculadas.length}</strong>
              <small>Eventos que ya apuntan a una consulta confirmada.</small>
            </article>
          </div>

          <p className="clinical-note">
            UI-025 queda en modo lectura. Alta y edición controlada deben quedar para una fase posterior.
          </p>
        </section>
      </section>
    </main>
  )
}

export default AgendaPage
