import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Ban, CalendarClock, CheckCircle2, Pencil, Plus, RotateCcw, Save, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import './ClinicalModuleBase.css'

type TipoContextoAgenda = 'todos' | 'solicitudes' | 'eventos' | 'consultas'
type EstadoEventoAgenda = 'programado' | 'confirmado' | 'reagendado' | 'cancelado' | 'completado' | 'no_asistio'
type TipoEventoAgenda = 'solicitud' | 'consulta' | 'evaluacion' | 'revision' | 'sesion_trabajo' | 'seguimiento' | 'administrativo' | 'bloqueo_horario' | 'otro'
type ModalidadAgenda = 'presencial' | 'online' | 'telefonica' | 'whatsapp' | 'videollamada' | 'por_definir'
type ModoFormularioAgenda = 'crear' | 'editar' | 'reagendar'

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
  tipo_evento: TipoEventoAgenda
  estado_evento: EstadoEventoAgenda
  origen_evento: string
  titulo_evento: string
  titulo_publico: string
  fecha_inicio: string
  fecha_fin: string | null
  modalidad: ModalidadAgenda | null
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

type AgendaEventoDetalle = {
  id_agenda_evento: string
  titulo_evento: string
  tipo_evento: string
  estado_evento: string
  fecha_inicio: string
  fecha_fin: string | null
  modalidad: string | null
  ubicacion: string | null
  enlace_online: string | null
  notas_internas: string | null
}

type AgendaEventoForm = {
  titulo_evento: string
  tipo_evento: TipoEventoAgenda
  estado_evento: EstadoEventoAgenda
  fecha_evento: string
  hora_inicio: string
  duracion_minutos: number
  modalidad: ModalidadAgenda
  ubicacion: string
  enlace_online: string
  notas_internas: string
}

type AgendaEventoPayload = {
  titulo_evento?: string
  titulo_publico?: string
  tipo_evento?: TipoEventoAgenda
  estado_evento: EstadoEventoAgenda
  origen_evento?: 'interno'
  fecha_inicio: string
  fecha_fin: string | null
  modalidad?: ModalidadAgenda | null
  ubicacion?: string | null
  enlace_online?: string | null
  notas_internas?: string | null
  created_by?: string
  updated_by: string
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

const AGENDA_EVENTO_DETALLE_SELECT = [
  'id_agenda_evento',
  'titulo_evento',
  'tipo_evento',
  'estado_evento',
  'fecha_inicio',
  'fecha_fin',
  'modalidad',
  'ubicacion',
  'enlace_online',
  'notas_internas',
].join(', ')

const ESTADOS_EVENTO_AGENDA: EstadoEventoAgenda[] = [
  'programado',
  'confirmado',
  'reagendado',
  'cancelado',
  'completado',
  'no_asistio',
]

const TIPOS_EVENTO_AGENDA: TipoEventoAgenda[] = [
  'solicitud',
  'consulta',
  'evaluacion',
  'revision',
  'sesion_trabajo',
  'seguimiento',
  'administrativo',
  'bloqueo_horario',
  'otro',
]

const MODALIDADES_AGENDA: ModalidadAgenda[] = [
  'presencial',
  'online',
  'telefonica',
  'whatsapp',
  'videollamada',
  'por_definir',
]

const DURACION_CONSULTA_MINUTOS = 60
const BUFFER_CONSULTA_MINUTOS = 15
const DURACIONES_EVENTO_AGENDA = [30, 45, 60, 75, 90, 120]
const ESTADOS_OCUPAN_HORARIO = new Set<EstadoEventoAgenda>([
  'programado',
  'confirmado',
  'reagendado',
  'completado',
])
const HORARIOS_AGENDA = Array.from({ length: 96 }, (_, indice) => {
  const minutosTotales = indice * 15
  const horas = Math.floor(minutosTotales / 60)
  const minutos = minutosTotales % 60
  return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`
})

const FORMULARIO_EVENTO_INICIAL: AgendaEventoForm = {
  titulo_evento: '',
  tipo_evento: 'administrativo',
  estado_evento: 'programado',
  fecha_evento: '',
  hora_inicio: '',
  duracion_minutos: DURACION_CONSULTA_MINUTOS,
  modalidad: 'por_definir',
  ubicacion: '',
  enlace_online: '',
  notas_internas: '',
}

function normalizarTexto(texto: string) {
  return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function limpiarTextoOpcional(texto: string) {
  const limpio = texto.trim()
  return limpio || null
}

function esEstadoEventoAgenda(valor: string): valor is EstadoEventoAgenda {
  return ESTADOS_EVENTO_AGENDA.includes(valor as EstadoEventoAgenda)
}

function esTipoEventoAgenda(valor: string): valor is TipoEventoAgenda {
  return TIPOS_EVENTO_AGENDA.includes(valor as TipoEventoAgenda)
}

function esModalidadAgenda(valor: string | null): valor is ModalidadAgenda {
  return Boolean(valor && MODALIDADES_AGENDA.includes(valor as ModalidadAgenda))
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

function convertirFechaLocalAInput(fecha: Date) {
  const fechaLocal = new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000)
  return fechaLocal.toISOString().slice(0, 10)
}

function convertirIsoAFechaLocal(fecha: string | null) {
  if (!fecha) {
    return ''
  }

  const fechaAgenda = new Date(fecha)

  if (Number.isNaN(fechaAgenda.getTime())) {
    return ''
  }

  return convertirFechaLocalAInput(fechaAgenda)
}

function convertirIsoAHoraLocal(fecha: string | null) {
  if (!fecha) {
    return ''
  }

  const fechaAgenda = new Date(fecha)

  if (Number.isNaN(fechaAgenda.getTime())) {
    return ''
  }

  return `${String(fechaAgenda.getHours()).padStart(2, '0')}:${String(fechaAgenda.getMinutes()).padStart(2, '0')}`
}

function obtenerProximaHoraAgenda() {
  const ahora = new Date()
  ahora.setMinutes(Math.ceil(ahora.getMinutes() / 15) * 15, 0, 0)

  if (ahora.getHours() === 24) {
    return '08:00'
  }

  const hora = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`
  return HORARIOS_AGENDA.includes(hora) ? hora : '08:00'
}

function crearFormularioEventoInicial(): AgendaEventoForm {
  return {
    ...FORMULARIO_EVENTO_INICIAL,
    fecha_evento: convertirFechaLocalAInput(new Date()),
    hora_inicio: obtenerProximaHoraAgenda(),
  }
}

function combinarFechaHoraAIso(fecha: string, hora: string) {
  const fechaLimpia = fecha.trim()
  const horaLimpia = hora.trim()

  if (!fechaLimpia || !horaLimpia) {
    return null
  }

  const fechaAgenda = new Date(`${fechaLimpia}T${horaLimpia}:00`)

  if (Number.isNaN(fechaAgenda.getTime())) {
    return null
  }

  return fechaAgenda.toISOString()
}

function sumarMinutosAIso(fechaIso: string, minutos: number) {
  const fechaAgenda = new Date(fechaIso)

  if (Number.isNaN(fechaAgenda.getTime())) {
    return null
  }

  return new Date(fechaAgenda.getTime() + minutos * 60000).toISOString()
}

function calcularDuracionMinutos(fechaInicio: string | null, fechaFin: string | null) {
  if (!fechaInicio || !fechaFin) {
    return DURACION_CONSULTA_MINUTOS
  }

  const inicio = new Date(fechaInicio).getTime()
  const fin = new Date(fechaFin).getTime()

  if (Number.isNaN(inicio) || Number.isNaN(fin) || fin <= inicio) {
    return DURACION_CONSULTA_MINUTOS
  }

  const minutos = Math.round((fin - inicio) / 60000)
  return minutos > 0 ? minutos : DURACION_CONSULTA_MINUTOS
}

function obtenerDuracionesFormulario(duracionActual: number) {
  return Array.from(new Set([...DURACIONES_EVENTO_AGENDA, duracionActual]))
    .filter((duracion) => Number.isFinite(duracion) && duracion > 0)
    .sort((a, b) => a - b)
}

function obtenerHorariosFormulario(horaActual: string) {
  return Array.from(new Set([...HORARIOS_AGENDA, horaActual]))
    .filter(Boolean)
    .sort()
}

function formatearDuracion(minutos: number) {
  if (minutos < 60) {
    return `${minutos} min`
  }

  const horas = Math.floor(minutos / 60)
  const resto = minutos % 60

  return resto ? `${horas} h ${resto} min` : `${horas} h`
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
  const [mensajeOperacion, setMensajeOperacion] = useState('')
  const [mensajeFormulario, setMensajeFormulario] = useState('')
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [accionEnCurso, setAccionEnCurso] = useState('')
  const [formularioAbierto, setFormularioAbierto] = useState(false)
  const [modoFormulario, setModoFormulario] = useState<ModoFormularioAgenda>('crear')
  const [eventoSeleccionado, setEventoSeleccionado] = useState<AgendaOperativa | null>(null)
  const [formularioEvento, setFormularioEvento] = useState<AgendaEventoForm>(() => crearFormularioEventoInicial())

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
  const soloReagendar = modoFormulario === 'reagendar'
  const fechaInicioFormularioIso = combinarFechaHoraAIso(formularioEvento.fecha_evento, formularioEvento.hora_inicio)
  const fechaFinFormularioIso = fechaInicioFormularioIso
    ? sumarMinutosAIso(fechaInicioFormularioIso, formularioEvento.duracion_minutos)
    : null
  const horariosFormulario = obtenerHorariosFormulario(formularioEvento.hora_inicio)
  const duracionesFormulario = obtenerDuracionesFormulario(formularioEvento.duracion_minutos)

  const metricas = [
    { etiqueta: 'Eventos', valor: agenda.length, detalle: 'Vista operativa' },
    { etiqueta: 'Solicitudes', valor: solicitudesVinculadas.length, detalle: 'Vinculadas a evento' },
    { etiqueta: 'Consultas', valor: consultasVinculadas.length, detalle: 'Con consulta asociada' },
    { etiqueta: 'Pendientes', valor: pendientesConfirmacion.length, detalle: 'Por confirmar' },
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

  async function obtenerUsuarioActualId() {
    const { data, error } = await supabase.auth.getUser()

    if (error || !data.user) {
      return null
    }

    return data.user.id
  }

  function actualizarFormulario<K extends keyof AgendaEventoForm>(campo: K, valor: AgendaEventoForm[K]) {
    setFormularioEvento((actual) => ({
      ...actual,
      [campo]: valor,
      ...(campo === 'tipo_evento' && valor === 'consulta'
        ? { duracion_minutos: DURACION_CONSULTA_MINUTOS }
        : {}),
    }))
  }

  function abrirFormularioCreacion() {
    setModoFormulario('crear')
    setEventoSeleccionado(null)
    setFormularioEvento(crearFormularioEventoInicial())
    setMensaje('')
    setMensajeOperacion('')
    setMensajeFormulario('')
    setFormularioAbierto(true)
  }

  async function abrirFormularioEdicion(evento: AgendaOperativa, modo: Exclude<ModoFormularioAgenda, 'crear'>) {
    setAccionEnCurso(`${evento.id_agenda_evento}:${modo}`)
    setMensaje('')
    setMensajeOperacion('')
    setMensajeFormulario('')

    const { data, error } = await supabase
      .from('agenda_eventos')
      .select(AGENDA_EVENTO_DETALLE_SELECT)
      .eq('id_agenda_evento', evento.id_agenda_evento)
      .maybeSingle()

    setAccionEnCurso('')

    if (error || !data) {
      setMensaje('No se pudo cargar el evento para edicion.')
      return
    }

    const detalle = data as unknown as AgendaEventoDetalle

    setModoFormulario(modo)
    setEventoSeleccionado(evento)
    setFormularioEvento({
      titulo_evento: detalle.titulo_evento || '',
      tipo_evento: esTipoEventoAgenda(detalle.tipo_evento) ? detalle.tipo_evento : 'administrativo',
      estado_evento: modo === 'reagendar'
        ? 'reagendado'
        : (esEstadoEventoAgenda(detalle.estado_evento) ? detalle.estado_evento : 'programado'),
      fecha_evento: convertirIsoAFechaLocal(detalle.fecha_inicio),
      hora_inicio: convertirIsoAHoraLocal(detalle.fecha_inicio),
      duracion_minutos: calcularDuracionMinutos(detalle.fecha_inicio, detalle.fecha_fin),
      modalidad: esModalidadAgenda(detalle.modalidad) ? detalle.modalidad : 'por_definir',
      ubicacion: detalle.ubicacion || '',
      enlace_online: detalle.enlace_online || '',
      notas_internas: detalle.notas_internas || '',
    })
    setFormularioAbierto(true)
  }

  function cerrarFormulario() {
    if (guardando) {
      return
    }

    setFormularioAbierto(false)
    setEventoSeleccionado(null)
    setMensajeFormulario('')
  }

  function detectarSolapamiento(fechaInicioIso: string, fechaFinIso: string, tipoEvento: TipoEventoAgenda) {
    const inicioCandidato = new Date(fechaInicioIso).getTime()
    const finCandidato = new Date(fechaFinIso).getTime()

    if (Number.isNaN(inicioCandidato) || Number.isNaN(finCandidato)) {
      return false
    }

    const finCandidatoConBuffer = tipoEvento === 'consulta'
      ? finCandidato + BUFFER_CONSULTA_MINUTOS * 60000
      : finCandidato

    return agenda.some((evento) => {
      if (eventoSeleccionado?.id_agenda_evento === evento.id_agenda_evento) {
        return false
      }

      if (!ESTADOS_OCUPAN_HORARIO.has(evento.estado_evento)) {
        return false
      }

      const inicioExistente = new Date(evento.fecha_inicio).getTime()
      const finExistenteBase = evento.fecha_fin
        ? new Date(evento.fecha_fin).getTime()
        : inicioExistente + DURACION_CONSULTA_MINUTOS * 60000

      if (Number.isNaN(inicioExistente) || Number.isNaN(finExistenteBase) || finExistenteBase <= inicioExistente) {
        return false
      }

      const finExistenteConBuffer = evento.tipo_evento === 'consulta'
        ? finExistenteBase + BUFFER_CONSULTA_MINUTOS * 60000
        : finExistenteBase

      return inicioCandidato < finExistenteConBuffer && finCandidatoConBuffer > inicioExistente
    })
  }

  function construirPayloadEvento(usuarioId: string) {
    const fechaInicioIso = combinarFechaHoraAIso(formularioEvento.fecha_evento, formularioEvento.hora_inicio)

    if (!formularioEvento.fecha_evento.trim()) {
      return { error: 'La fecha del evento es obligatoria.', payload: null }
    }

    if (!formularioEvento.hora_inicio.trim()) {
      return { error: 'La hora de inicio es obligatoria.', payload: null }
    }

    if (!fechaInicioIso) {
      return { error: 'La fecha u hora seleccionada no es valida.', payload: null }
    }

    if (!Number.isFinite(formularioEvento.duracion_minutos) || formularioEvento.duracion_minutos <= 0) {
      return { error: 'La duracion seleccionada no es valida.', payload: null }
    }

    const fechaFinIso = sumarMinutosAIso(fechaInicioIso, formularioEvento.duracion_minutos)

    if (!fechaFinIso) {
      return { error: 'No se pudo calcular la hora de fin del evento.', payload: null }
    }

    if (!esEstadoEventoAgenda(formularioEvento.estado_evento)) {
      return { error: 'El estado seleccionado no pertenece al modelo de agenda.', payload: null }
    }

    if (
      ESTADOS_OCUPAN_HORARIO.has(formularioEvento.estado_evento)
      && detectarSolapamiento(fechaInicioIso, fechaFinIso, formularioEvento.tipo_evento)
    ) {
      return {
        error: 'El horario seleccionado se cruza con otro evento o con el espacio de 15 minutos entre consultas.',
        payload: null,
      }
    }

    const payloadBase = {
      estado_evento: formularioEvento.estado_evento,
      fecha_inicio: fechaInicioIso,
      fecha_fin: fechaFinIso,
      updated_by: usuarioId,
    }

    if (soloReagendar) {
      return { error: '', payload: payloadBase }
    }

    const titulo = formularioEvento.titulo_evento.trim()

    if (!titulo) {
      return { error: 'El titulo del evento es obligatorio.', payload: null }
    }

    if (!esTipoEventoAgenda(formularioEvento.tipo_evento)) {
      return { error: 'El tipo seleccionado no pertenece al modelo de agenda.', payload: null }
    }

    if (!esModalidadAgenda(formularioEvento.modalidad)) {
      return { error: 'La modalidad seleccionada no pertenece al modelo de agenda.', payload: null }
    }

    return {
      error: '',
      payload: {
        ...payloadBase,
        titulo_evento: titulo,
        tipo_evento: formularioEvento.tipo_evento,
        modalidad: formularioEvento.modalidad,
        ubicacion: limpiarTextoOpcional(formularioEvento.ubicacion),
        enlace_online: limpiarTextoOpcional(formularioEvento.enlace_online),
        notas_internas: limpiarTextoOpcional(formularioEvento.notas_internas),
      },
    }
  }

  async function guardarEvento(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMensajeFormulario('')
    setMensajeOperacion('')

    const usuarioId = await obtenerUsuarioActualId()

    if (!usuarioId) {
      setMensajeFormulario('No se pudo validar la sesion interna para guardar.')
      return
    }

    const { error, payload } = construirPayloadEvento(usuarioId)

    if (error || !payload) {
      setMensajeFormulario(error)
      return
    }

    setGuardando(true)

    if (modoFormulario === 'crear') {
      const payloadCreacion: AgendaEventoPayload = {
        ...payload,
        origen_evento: 'interno',
        titulo_publico: 'Cita Terapeutas Australes - Servicio reservado',
        created_by: usuarioId,
      }

      const { error: errorCreacion } = await supabase
        .from('agenda_eventos')
        .insert(payloadCreacion)
        .select('id_agenda_evento')
        .single()

      setGuardando(false)

      if (errorCreacion) {
        setMensajeFormulario('No se pudo crear el evento. Verifica permisos y datos obligatorios.')
        return
      }

      setFormularioAbierto(false)
      setMensajeOperacion('Evento interno creado correctamente.')
      await cargarAgenda()
      return
    }

    if (!eventoSeleccionado) {
      setGuardando(false)
      setMensajeFormulario('No se encontro el evento seleccionado.')
      return
    }

    const { data, error: errorActualizacion } = await supabase
      .from('agenda_eventos')
      .update(payload)
      .eq('id_agenda_evento', eventoSeleccionado.id_agenda_evento)
      .select('id_agenda_evento')
      .maybeSingle()

    setGuardando(false)

    if (errorActualizacion || !data) {
      setMensajeFormulario('No se pudo actualizar el evento. Verifica permisos y datos obligatorios.')
      return
    }

    setFormularioAbierto(false)
    setMensajeOperacion(soloReagendar ? 'Evento reagendado correctamente.' : 'Evento actualizado correctamente.')
    await cargarAgenda()
  }

  async function actualizarEstadoRapido(evento: AgendaOperativa, estado: EstadoEventoAgenda) {
    if (evento.estado_evento === estado) {
      setMensajeOperacion(`El evento ya esta en estado ${formatearEtiqueta(estado)}.`)
      return
    }

    if (estado === 'cancelado') {
      const confirmarCancelacion = window.confirm('Cancelar cambia el estado del evento, no lo borra. ¿Continuar?')

      if (!confirmarCancelacion) {
        return
      }
    }

    setMensaje('')
    setMensajeOperacion('')
    setAccionEnCurso(`${evento.id_agenda_evento}:${estado}`)

    const usuarioId = await obtenerUsuarioActualId()

    if (!usuarioId) {
      setAccionEnCurso('')
      setMensaje('No se pudo validar la sesion interna para actualizar.')
      return
    }

    const { data, error } = await supabase
      .from('agenda_eventos')
      .update({
        estado_evento: estado,
        updated_by: usuarioId,
      })
      .eq('id_agenda_evento', evento.id_agenda_evento)
      .select('id_agenda_evento')
      .maybeSingle()

    setAccionEnCurso('')

    if (error || !data) {
      setMensaje('No se pudo actualizar el estado del evento.')
      return
    }

    setMensajeOperacion(`Evento marcado como ${formatearEtiqueta(estado)}.`)
    await cargarAgenda()
  }

  useEffect(() => {
    const carga = window.setTimeout(() => {
      void cargarAgenda()
    }, 0)

    return () => window.clearTimeout(carga)
  }, [])

  return (
    <main className="clinical-module-page">
      <section className="clinical-hero clinical-hero--compact">
        <div className="clinical-hero__copy">
          <span className="clinical-kicker">Agenda interna</span>
          <h1>Agenda</h1>
          <p>Vista operativa conectada a eventos internos, solicitudes vinculadas y consultas confirmadas.</p>
        </div>

        <section className="clinical-metrics" aria-label="Metricas de agenda">
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
              <p>Lectura desde la vista operativa y edicion controlada de eventos internos.</p>
            </div>
            <div className="clinical-actions clinical-actions--end">
              <span className="clinical-count">{agendaFiltrada.length}</span>
              <button className="clinical-button clinical-button--compact" type="button" onClick={abrirFormularioCreacion}>
                <Plus aria-hidden="true" />
                Nuevo evento interno
              </button>
            </div>
          </div>

          <label className="clinical-search">
            <span>Buscar</span>
            <input
              className="clinical-input"
              placeholder="Buscar por titulo, paciente o contacto"
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
                <option value="todos">Todos los contextos</option>
                <option value="solicitudes">Solicitudes</option>
                <option value="eventos">Eventos internos</option>
                <option value="consultas">Consultas clinicas</option>
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
                {ESTADOS_EVENTO_AGENDA.map((estado) => (
                  <option key={estado} value={estado}>{formatearEtiqueta(estado)}</option>
                ))}
              </select>
            </label>
          </div>

          {mensaje && <p className="clinical-message clinical-message--error">{mensaje}</p>}
          {mensajeOperacion && <p className="clinical-message">{mensajeOperacion}</p>}

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
                      <dt>Confirmacion</dt>
                      <dd>{evento.requiere_confirmacion ? (evento.confirmado_por_paciente ? 'Confirmada' : 'Pendiente') : 'No requerida'}</dd>
                    </div>
                    <div>
                      <dt>Google</dt>
                      <dd>{formatearEtiqueta(evento.google_calendar_sync_estado)}</dd>
                    </div>
                  </dl>

                  <div className="clinical-actions clinical-actions--card" aria-label={`Acciones de agenda para ${evento.titulo_evento}`}>
                    <button
                      className="clinical-button clinical-button--secondary clinical-button--compact"
                      type="button"
                      disabled={Boolean(accionEnCurso)}
                      onClick={() => void abrirFormularioEdicion(evento, 'editar')}
                    >
                      <Pencil aria-hidden="true" />
                      Editar
                    </button>
                    <button
                      className="clinical-button clinical-button--secondary clinical-button--compact"
                      type="button"
                      disabled={Boolean(accionEnCurso)}
                      onClick={() => void abrirFormularioEdicion(evento, 'reagendar')}
                    >
                      <CalendarClock aria-hidden="true" />
                      Reagendar
                    </button>
                    <button
                      className="clinical-button clinical-button--secondary clinical-button--compact"
                      type="button"
                      disabled={Boolean(accionEnCurso) || evento.estado_evento === 'completado'}
                      onClick={() => void actualizarEstadoRapido(evento, 'completado')}
                    >
                      <CheckCircle2 aria-hidden="true" />
                      Completado
                    </button>
                    <button
                      className="clinical-button clinical-button--danger clinical-button--compact"
                      type="button"
                      disabled={Boolean(accionEnCurso) || evento.estado_evento === 'cancelado'}
                      onClick={() => void actualizarEstadoRapido(evento, 'cancelado')}
                    >
                      <Ban aria-hidden="true" />
                      Cancelar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="clinical-panel" aria-label="Separacion de agenda">
          <div className="clinical-panel__header">
            <div>
              <span className="clinical-kicker">Separacion operativa</span>
              <h2>Solicitudes, eventos y consultas</h2>
              <p>La agenda no crea pacientes ni consultas automaticamente.</p>
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
              <span>Consultas clinicas</span>
              <strong>{consultasVinculadas.length}</strong>
              <small>Eventos que ya apuntan a una consulta confirmada.</small>
            </article>
          </div>

          <p className="clinical-note">
            UI-025B habilita alta y edicion manual solo sobre agenda_eventos. No convierte solicitudes, no crea pacientes ni sincroniza Google.
          </p>
        </section>
      </section>

      {formularioAbierto && (
        <div className="clinical-modal-backdrop" role="presentation">
          <section
            aria-label={modoFormulario === 'crear' ? 'Nuevo evento interno' : 'Editar evento interno'}
            aria-modal="true"
            className="clinical-modal"
            role="dialog"
          >
            <div className="clinical-modal__header">
              <div>
                <span className="clinical-kicker">agenda_eventos</span>
                <h2>
                  {modoFormulario === 'crear'
                    ? 'Nuevo evento interno'
                    : (modoFormulario === 'reagendar' ? 'Reagendar evento' : 'Editar evento interno')}
                </h2>
                <p>
                  {soloReagendar
                    ? 'Ajusta fecha/hora y deja el estado de reagendamiento sin tocar entidades relacionadas.'
                    : 'Gestion manual interna sin crear pacientes, consultas ni solicitudes automaticamente.'}
                </p>
              </div>
              <button className="clinical-icon-button" type="button" aria-label="Cerrar formulario" onClick={cerrarFormulario}>
                <X aria-hidden="true" />
              </button>
            </div>

            <form className="clinical-form" onSubmit={(event) => void guardarEvento(event)}>
              <label className="clinical-field">
                <span>Titulo</span>
                <input
                  className="clinical-input"
                  disabled={soloReagendar || guardando}
                  maxLength={120}
                  required={!soloReagendar}
                  value={formularioEvento.titulo_evento}
                  onChange={(event) => actualizarFormulario('titulo_evento', event.target.value)}
                />
              </label>

              <div className="clinical-grid">
                <label className="clinical-field">
                  <span>Tipo</span>
                  <select
                    className="clinical-select"
                    disabled={soloReagendar || guardando}
                    value={formularioEvento.tipo_evento}
                    onChange={(event) => actualizarFormulario('tipo_evento', event.target.value as TipoEventoAgenda)}
                  >
                    {TIPOS_EVENTO_AGENDA.map((tipo) => (
                      <option key={tipo} value={tipo}>{formatearEtiqueta(tipo)}</option>
                    ))}
                  </select>
                </label>

                <label className="clinical-field">
                  <span>Estado</span>
                  <select
                    className="clinical-select"
                    disabled={guardando}
                    value={formularioEvento.estado_evento}
                    onChange={(event) => actualizarFormulario('estado_evento', event.target.value as EstadoEventoAgenda)}
                  >
                    {ESTADOS_EVENTO_AGENDA.map((estado) => (
                      <option key={estado} value={estado}>{formatearEtiqueta(estado)}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="clinical-grid">
                <label className="clinical-field">
                  <span>Fecha</span>
                  <input
                    className="clinical-input"
                    disabled={guardando}
                    required
                    type="date"
                    value={formularioEvento.fecha_evento}
                    onChange={(event) => actualizarFormulario('fecha_evento', event.target.value)}
                  />
                </label>

                <label className="clinical-field">
                  <span>Hora inicio</span>
                  <select
                    className="clinical-select"
                    disabled={guardando}
                    required
                    value={formularioEvento.hora_inicio}
                    onChange={(event) => actualizarFormulario('hora_inicio', event.target.value)}
                  >
                    {horariosFormulario.map((hora) => (
                      <option key={hora} value={hora}>{hora}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="clinical-grid">
                <label className="clinical-field">
                  <span>Duracion</span>
                  <select
                    className="clinical-select"
                    disabled={soloReagendar || guardando}
                    value={formularioEvento.duracion_minutos}
                    onChange={(event) => actualizarFormulario('duracion_minutos', Number(event.target.value))}
                  >
                    {duracionesFormulario.map((duracion) => (
                      <option key={duracion} value={duracion}>{formatearDuracion(duracion)}</option>
                    ))}
                  </select>
                  <small>{formularioEvento.tipo_evento === 'consulta'
                    ? 'Consulta estandar: 1 hora.'
                    : 'Duracion controlada, sin texto libre.'}</small>
                </label>

                <label className="clinical-field">
                  <span>Fin calculado</span>
                  <output className="clinical-readonly-value">
                    {fechaFinFormularioIso ? formatearFechaHora(fechaFinFormularioIso) : 'Selecciona fecha y hora'}
                  </output>
                  <small>Se calcula desde la hora de inicio y la duracion seleccionada.</small>
                </label>
              </div>

              <p className="clinical-note clinical-note--compact">
                {formularioEvento.tipo_evento === 'consulta'
                  ? 'Consulta de 1 hora + 15 minutos de separacion operativa para validar disponibilidad.'
                  : 'Se evita solapamiento con eventos activos; el buffer de 15 minutos aplica cuando participa una consulta.'}
              </p>

              <label className="clinical-field">
                <span>Modalidad</span>
                <select
                  className="clinical-select"
                  disabled={soloReagendar || guardando}
                  value={formularioEvento.modalidad}
                  onChange={(event) => actualizarFormulario('modalidad', event.target.value as ModalidadAgenda)}
                >
                  {MODALIDADES_AGENDA.map((modalidad) => (
                    <option key={modalidad} value={modalidad}>{formatearEtiqueta(modalidad)}</option>
                  ))}
                </select>
              </label>

              <div className="clinical-grid">
                <label className="clinical-field">
                  <span>Ubicacion</span>
                  <input
                    className="clinical-input"
                    disabled={soloReagendar || guardando}
                    maxLength={160}
                    placeholder="Consulta, sala o referencia interna"
                    value={formularioEvento.ubicacion}
                    onChange={(event) => actualizarFormulario('ubicacion', event.target.value)}
                  />
                </label>

                <label className="clinical-field">
                  <span>Enlace online</span>
                  <input
                    className="clinical-input"
                    disabled={soloReagendar || guardando}
                    maxLength={220}
                    placeholder="URL o referencia segura"
                    value={formularioEvento.enlace_online}
                    onChange={(event) => actualizarFormulario('enlace_online', event.target.value)}
                  />
                </label>
              </div>

              <label className="clinical-field">
                <span>Notas internas breves</span>
                <textarea
                  className="clinical-textarea"
                  disabled={soloReagendar || guardando}
                  maxLength={500}
                  value={formularioEvento.notas_internas}
                  onChange={(event) => actualizarFormulario('notas_internas', event.target.value)}
                />
                <small>No uses este campo para hallazgos clinicos, pagos, fotos ni mensajes privados.</small>
              </label>

              {mensajeFormulario && <p className="clinical-message clinical-message--error">{mensajeFormulario}</p>}

              <div className="clinical-actions clinical-actions--end">
                <button className="clinical-button clinical-button--ghost" type="button" disabled={guardando} onClick={cerrarFormulario}>
                  <X aria-hidden="true" />
                  Cancelar
                </button>
                <button className="clinical-button" type="submit" disabled={guardando}>
                  {soloReagendar ? <RotateCcw aria-hidden="true" /> : <Save aria-hidden="true" />}
                  {guardando
                    ? 'Guardando'
                    : (modoFormulario === 'crear' ? 'Crear evento' : (soloReagendar ? 'Guardar reagendamiento' : 'Guardar cambios'))}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  )
}

export default AgendaPage
