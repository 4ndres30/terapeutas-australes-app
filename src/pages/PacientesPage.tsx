import type { FormEvent, KeyboardEvent } from 'react'
import { useMemo, useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { formatearFecha, normalizarTexto } from '../lib/format'
import { QUERY_KEYS } from '../lib/queryKeys'
import { supabase } from '../lib/supabase'
import {
  type FormularioPaciente,
  type OpcionFormulario,
  formularioInicial,
  opcionesSexo,
  opcionesEstado,
  regionesChile,
  construirClavePaciente,
  validarFormularioPaciente,
  prepararPacienteParaGuardar,
  pacienteAFormulario,
  obtenerEtiquetaOpcion,
} from '../hooks/usePacienteForm'
import './PacientesPage.css'

type Paciente = {
  id: string
  nombres: string
  apellidos: string
  fecha_nacimiento: string
  sexo: string
  telefono: string
  email: string
  comuna: string
  region: string
  estado: string
  created_at: string
}

type EstadoEventoHoy = 'programado' | 'confirmado' | 'reagendado' | 'completado'

type EventoAgendaHoy = {
  id_agenda_evento: string
  paciente_id: string | null
  fecha_inicio: string
  estado_evento: EstadoEventoHoy
  modalidad: string | null
  tipo_evento: string
}

type CitaDelDia = {
  evento: EventoAgendaHoy
  paciente: Paciente
}

type VistaPacientes = 'dia' | 'registro' | 'nuevo'
type FiltroEstado = 'todos' | 'activos' | 'inactivos'
type TipoMetrica = 'activos' | 'citas' | 'atendidas' | 'pendientes'
// PasoFicha sigue siendo necesario para el wizard de alta (intacto)
type PasoFicha = 'identidad' | 'contacto' | 'ubicacion' | 'estado'

type PasoFichaConfig = {
  clave: PasoFicha
  numero: string
  etiqueta: string
  titulo: string
  descripcion: string
  tono: string
}

const vistasPacientes: { etiqueta: string; valor: VistaPacientes }[] = [
  { etiqueta: 'Pacientes de hoy', valor: 'dia' },
  { etiqueta: 'Registro completo', valor: 'registro' },
  { etiqueta: 'Nuevo paciente', valor: 'nuevo' },
]

const filtrosEstado: { etiqueta: string; valor: FiltroEstado }[] = [
  { etiqueta: 'Todos', valor: 'todos' },
  { etiqueta: 'Activos', valor: 'activos' },
  { etiqueta: 'Inactivos', valor: 'inactivos' },
]

const ESTADOS_CITA_ACTIVA: EstadoEventoHoy[] = ['programado', 'confirmado', 'reagendado']

const AGENDA_HOY_SELECT = [
  'id_agenda_evento',
  'paciente_id',
  'fecha_inicio',
  'estado_evento',
  'modalidad',
  'tipo_evento',
].join(', ')

const pasosFicha: PasoFichaConfig[] = [
  {
    clave: 'identidad',
    numero: '1',
    etiqueta: 'Identidad',
    titulo: 'Identidad personal',
    descripcion: 'Datos base para reconocer la ficha clínica.',
    tono: 'violeta',
  },
  {
    clave: 'contacto',
    numero: '2',
    etiqueta: 'Contacto',
    titulo: 'Contacto',
    descripcion: 'Información de contacto y comunicación.',
    tono: 'azul',
  },
  {
    clave: 'ubicacion',
    numero: '3',
    etiqueta: 'Ubicación',
    titulo: 'Ubicación',
    descripcion: 'Comuna y región de residencia.',
    tono: 'dorado',
  },
  {
    clave: 'estado',
    numero: '4',
    etiqueta: 'Estado',
    titulo: 'Estado',
    descripcion: 'Estado actual del paciente.',
    tono: 'verde',
  },
]

// ---------------------------------------------------------------------------
// Helpers de acceso a BD
// ---------------------------------------------------------------------------

async function obtenerPacientes(): Promise<Paciente[]> {
  const { data, error } = await supabase
    .from('pacientes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Error al cargar pacientes: ${error.message}`)
  }

  return (data || []) as Paciente[]
}

function fechaLocalISO(fecha: Date) {
  const anio = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  return `${anio}-${mes}-${dia}`
}

async function obtenerEventosHoy(): Promise<EventoAgendaHoy[]> {
  const hoy = new Date()
  const manana = new Date(hoy)
  manana.setDate(hoy.getDate() + 1)

  const inicioHoy = new Date(`${fechaLocalISO(hoy)}T00:00:00`)
  const inicioManana = new Date(`${fechaLocalISO(manana)}T00:00:00`)

  const { data, error } = await supabase
    .from('agenda_eventos')
    .select(AGENDA_HOY_SELECT)
    .gte('fecha_inicio', inicioHoy.toISOString())
    .lt('fecha_inicio', inicioManana.toISOString())
    .in('estado_evento', ['programado', 'confirmado', 'reagendado', 'completado'])
    .order('fecha_inicio', { ascending: true })

  if (error) {
    throw new Error(`Error al cargar la agenda de hoy: ${error.message}`)
  }

  return (data || []) as unknown as EventoAgendaHoy[]
}

// ---------------------------------------------------------------------------
// Helpers visuales
// ---------------------------------------------------------------------------

function horaLocal(fecha: string) {
  const parseada = new Date(fecha)

  if (Number.isNaN(parseada.getTime())) {
    return '--:--'
  }

  return `${String(parseada.getHours()).padStart(2, '0')}:${String(parseada.getMinutes()).padStart(2, '0')}`
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

function obtenerIniciales(nombres: string, apellidos: string) {
  const inicialNombre = nombres.trim().charAt(0)
  const inicialApellido = apellidos.trim().charAt(0)
  const iniciales = `${inicialNombre}${inicialApellido}`.trim()

  return iniciales ? iniciales.toUpperCase() : 'TA'
}

function mostrarDato(valor: string, respaldo = 'Pendiente') {
  return valor.trim() || respaldo
}

function coincideConBusqueda(paciente: Paciente, busqueda: string) {
  if (!busqueda.trim()) {
    return true
  }

  const textoPaciente = normalizarTexto([
    paciente.nombres,
    paciente.apellidos,
    paciente.email,
    paciente.telefono,
    paciente.comuna,
    paciente.region,
  ].join(' '))

  return textoPaciente.includes(normalizarTexto(busqueda.trim()))
}

function coincideConFiltroEstado(paciente: Paciente, filtroEstado: FiltroEstado) {
  if (filtroEstado === 'activos') {
    return paciente.estado === 'activo'
  }

  if (filtroEstado === 'inactivos') {
    return paciente.estado === 'inactivo'
  }

  return true
}

// ---------------------------------------------------------------------------
// Helpers del wizard de alta (sólo para el modo 'nuevo', intacto)
// ---------------------------------------------------------------------------

function obtenerResumenPaso(paso: PasoFicha, formulario: FormularioPaciente) {
  if (paso === 'identidad') {
    const nombre = `${formulario.nombres} ${formulario.apellidos}`.trim()
    return nombre || 'Nombre, nacimiento y sexo del paciente.'
  }

  if (paso === 'contacto') {
    const contacto = [formulario.telefono, formulario.email].filter(Boolean).join(' · ')
    return contacto || 'Teléfono y correo principal.'
  }

  if (paso === 'ubicacion') {
    const ubicacion = [formulario.comuna, formulario.region].filter(Boolean).join(', ')
    return ubicacion || 'Comuna y región de residencia.'
  }

  return obtenerEtiquetaOpcion(opcionesEstado, formulario.estado) || 'Estado actual del paciente.'
}

function pasoEstaCompleto(paso: PasoFicha, formulario: FormularioPaciente) {
  if (paso === 'identidad') {
    return Boolean(formulario.nombres.trim() && formulario.apellidos.trim() && formulario.fecha_nacimiento && formulario.sexo)
  }

  if (paso === 'contacto') {
    return Boolean(formulario.telefono.trim() && /^\S+@\S+\.\S+$/.test(formulario.email.trim()))
  }

  if (paso === 'ubicacion') {
    return Boolean(formulario.comuna.trim() && formulario.region.trim())
  }

  return Boolean(formulario.estado)
}

function obtenerSiguientePaso(paso: PasoFicha) {
  const indiceActual = pasosFicha.findIndex((pasoFicha) => pasoFicha.clave === paso)
  return pasosFicha[indiceActual + 1]?.clave || null
}

function formularioCompleto(formulario: FormularioPaciente) {
  return validarFormularioPaciente(formulario) === null
}

// ---------------------------------------------------------------------------
// Ícono de métrica
// ---------------------------------------------------------------------------

function MetricaIcon({ tipo }: { tipo: TipoMetrica }) {
  if (tipo === 'activos') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
        <path d="M2.5 21a6.5 6.5 0 0 1 11 0" />
        <path d="M17 8v7" />
        <path d="M13.5 11.5H20.5" />
      </svg>
    )
  }

  if (tipo === 'atendidas') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
        <path d="m8.5 12.2 2.4 2.4 4.6-4.8" />
      </svg>
    )
  }

  if (tipo === 'pendientes') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
        <path d="M12 7v5l3 2" />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M6 3v4" />
      <path d="M18 3v4" />
      <path d="M4 8h16" />
      <path d="M5 5h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
      <path d="M9 13h6" />
      <path d="M9 17h3" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

function PacientesPage() {
  const queryClient = useQueryClient()

  const {
    data: pacientes = [],
    isLoading: cargando,
    error: errorCarga,
  } = useQuery({
    queryKey: QUERY_KEYS.pacientes.registroCompleto,
    queryFn: obtenerPacientes,
  })

  const {
    data: eventosHoy = [],
    isLoading: cargandoAgenda,
    error: errorAgenda,
  } = useQuery({
    queryKey: ['agenda-hoy-pacientes'],
    queryFn: obtenerEventosHoy,
  })

  const [vista, setVista] = useState<VistaPacientes>('dia')
  const [pacienteEnEdicion, setPacienteEnEdicion] = useState<Paciente | null>(null)
  const [guardando, setGuardando] = useState(false)
  const [accionEnCurso, setAccionEnCurso] = useState('')
  const [mensajeGuardado, setMensajeGuardado] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>('todos')
  // Estado del wizard de alta (intacto)
  const [pasoActivo, setPasoActivo] = useState<PasoFicha>('identidad')
  const [formulario, setFormulario] = useState<FormularioPaciente>(formularioInicial)
  // Errores inline para formulario plano de edición (UI-045)
  const [errorEdicion, setErrorEdicion] = useState('')
  // UI-046 / DEC-045: overlay de confirmación en tablet/mobile
  const [mostrandoConfirmacionMovil, setMostrandoConfirmacionMovil] = useState(false)
  // Ref al form del wizard para submit programático desde el overlay
  const formAltaRef = useRef<HTMLFormElement>(null)

  async function invalidarConsultasPacientes() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.pacientes.all }),
      queryClient.invalidateQueries({ queryKey: ['agenda-hoy-pacientes'] }),
    ])
  }

  const totalPacientes = pacientes.length
  const pacientesActivos = pacientes.filter((paciente) => paciente.estado === 'activo').length

  const eventosHoyConPaciente = useMemo(() => (
    eventosHoy.filter((evento) => Boolean(evento.paciente_id))
  ), [eventosHoy])

  const citasActivasHoy = useMemo(() => (
    eventosHoyConPaciente.filter((evento) => ESTADOS_CITA_ACTIVA.includes(evento.estado_evento))
  ), [eventosHoyConPaciente])

  const atendidasHoy = eventosHoyConPaciente.filter((evento) => evento.estado_evento === 'completado').length
  const pendientesHoy = citasActivasHoy.length

  const pacientesPorId = useMemo(() => (
    new Map(pacientes.map((paciente) => [paciente.id, paciente]))
  ), [pacientes])

  const citasDelDia = useMemo<CitaDelDia[]>(() => (
    citasActivasHoy.flatMap((evento) => {
      const paciente = evento.paciente_id ? pacientesPorId.get(evento.paciente_id) : undefined
      return paciente ? [{ evento, paciente }] : []
    })
  ), [citasActivasHoy, pacientesPorId])

  const pacientesFiltrados = useMemo(() => (
    pacientes.filter((paciente) => (
      coincideConBusqueda(paciente, busqueda)
      && coincideConFiltroEstado(paciente, filtroEstado)
    ))
  ), [busqueda, filtroEstado, pacientes])

  const formularioTieneDatos = Object.entries(formulario).some(([campo, valor]) => (
    campo === 'estado' ? valor !== 'activo' : Boolean(valor.trim())
  ))

  const nombrePreview = `${formulario.nombres} ${formulario.apellidos}`.trim()
  const ubicacionPreview = [formulario.comuna, formulario.region].filter(Boolean).join(', ')
  const sexoPreview = obtenerEtiquetaOpcion(opcionesSexo, formulario.sexo)
  const fechaNacimientoPreview = formulario.fecha_nacimiento ? formatearFecha(formulario.fecha_nacimiento) : 'Pendiente'
  const mensaje = mensajeGuardado
    || (errorCarga ? errorCarga.message : '')
    || (errorAgenda ? errorAgenda.message : '')
  const mensajeEsError = mensaje.toLowerCase().startsWith('error')
  const cantidadVisible = pacientesFiltrados.length

  // ---------------------------------------------------------------------------
  // Navegación y estado
  // ---------------------------------------------------------------------------

  function cambiarVista(vistaNueva: VistaPacientes) {
    if (pacienteEnEdicion) {
      setPacienteEnEdicion(null)
      setFormulario(formularioInicial)
      setPasoActivo('identidad')
      setErrorEdicion('')
    }

    setMensajeGuardado('')
    setVista(vistaNueva)
  }

  function iniciarEdicion(paciente: Paciente) {
    setPacienteEnEdicion(paciente)
    setFormulario(pacienteAFormulario(paciente))
    setPasoActivo('identidad')
    setMensajeGuardado('')
    setErrorEdicion('')
  }

  function cancelarEdicion() {
    setPacienteEnEdicion(null)
    setFormulario(formularioInicial)
    setPasoActivo('identidad')
    setMensajeGuardado('')
    setErrorEdicion('')
  }

  async function cambiarEstadoPaciente(paciente: Paciente, estadoNuevo: 'activo' | 'inactivo') {
    const nombre = `${paciente.nombres} ${paciente.apellidos}`.trim()

    setAccionEnCurso(paciente.id)
    setMensajeGuardado('')

    const { error } = await supabase
      .from('pacientes')
      .update({ estado: estadoNuevo })
      .eq('id', paciente.id)

    setAccionEnCurso('')

    if (error) {
      setMensajeGuardado(`Error al actualizar el estado: ${error.message}`)
      return
    }

    await invalidarConsultasPacientes()
    setMensajeGuardado(estadoNuevo === 'inactivo'
      ? `Paciente anulado: ${nombre} quedó inactivo (sin eliminación).`
      : `Paciente reactivado: ${nombre} volvió a estado activo.`)
  }

  async function anularPaciente(paciente: Paciente) {
    if (paciente.estado !== 'activo') {
      return
    }

    const nombre = `${paciente.nombres} ${paciente.apellidos}`.trim()

    if (!window.confirm(`¿Anular a ${nombre}? Quedará inactivo, no se elimina.`)) {
      return
    }

    await cambiarEstadoPaciente(paciente, 'inactivo')
  }

  async function reactivarPaciente(paciente: Paciente) {
    if (paciente.estado !== 'inactivo') {
      return
    }

    await cambiarEstadoPaciente(paciente, 'activo')
  }

  function actualizarFormulario(campo: keyof FormularioPaciente, valor: string) {
    setFormulario((formularioActual) => ({
      ...formularioActual,
      [campo]: valor,
    }))
  }

  // Versión para el wizard (avanza al siguiente paso automáticamente)
  function actualizarFormularioWizard(campo: keyof FormularioPaciente, valor: string) {
    setFormulario((formularioActual) => {
      const formularioActualizado = {
        ...formularioActual,
        [campo]: valor,
      }

      const siguientePaso = obtenerSiguientePaso(pasoActivo)
      if (siguientePaso && pasoEstaCompleto(pasoActivo, formularioActualizado)) {
        window.setTimeout(() => setPasoActivo(siguientePaso), 180)
      }

      return formularioActualizado
    })
  }

  // ---------------------------------------------------------------------------
  // Guardar (compartido para alta y edición)
  // ---------------------------------------------------------------------------

  async function guardarPaciente(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const validacion = validarFormularioPaciente(formulario)

    if (validacion) {
      if (pacienteEnEdicion) {
        // Formulario plano: error inline, no cambio de paso
        setErrorEdicion(`${validacion.mensaje}`)
      } else {
        // Wizard: mapear campo → paso
        const mapaCampoPaso: Partial<Record<keyof FormularioPaciente, PasoFicha>> = {
          nombres: 'identidad',
          apellidos: 'identidad',
          fecha_nacimiento: 'identidad',
          sexo: 'identidad',
          telefono: 'contacto',
          email: 'contacto',
          comuna: 'ubicacion',
          region: 'ubicacion',
          estado: 'estado',
        }
        const paso = mapaCampoPaso[validacion.campo] || 'identidad'
        setPasoActivo(paso)
        setMensajeGuardado(`Error: ${validacion.mensaje}`)
      }
      return
    }

    const pacienteParaGuardar = prepararPacienteParaGuardar(formulario)
    const clavePacienteNuevo = construirClavePaciente(pacienteParaGuardar)
    const existeDuplicado = pacientes.some((paciente) => (
      paciente.id !== pacienteEnEdicion?.id
      && construirClavePaciente(pacienteAFormulario(paciente)) === clavePacienteNuevo
    ))

    if (existeDuplicado) {
      if (pacienteEnEdicion) {
        setErrorEdicion('Este paciente ya existe con exactamente los mismos datos.')
      } else {
        setPasoActivo('identidad')
        setMensajeGuardado('Error: Este paciente ya existe con exactamente los mismos datos.')
      }
      return
    }

    setGuardando(true)
    if (pacienteEnEdicion) {
      setErrorEdicion('')
    }
    setMensajeGuardado(pacienteEnEdicion ? 'Guardando cambios...' : 'Guardando paciente...')

    if (pacienteEnEdicion) {
      const { error } = await supabase
        .from('pacientes')
        .update(pacienteParaGuardar)
        .eq('id', pacienteEnEdicion.id)

      if (error) {
        setErrorEdicion(`Error al guardar: ${error.message}`)
        setGuardando(false)
        return
      }

      await invalidarConsultasPacientes()
      setMensajeGuardado('Paciente actualizado correctamente')
      setPacienteEnEdicion(null)
    } else {
      const { error } = await supabase.from('pacientes').insert(pacienteParaGuardar)

      if (error) {
        setMensajeGuardado(`Error al guardar: ${error.message}`)
        setGuardando(false)
        return
      }

      await invalidarConsultasPacientes()
      setMensajeGuardado('Paciente guardado correctamente')
    }

    setFormulario(formularioInicial)
    setPasoActivo('identidad')
    setMostrandoConfirmacionMovil(false)
    setGuardando(false)
  }

  // ---------------------------------------------------------------------------
  // UI-046: Revisar y guardar (tablet/mobile) — abre overlay de confirmación
  // ---------------------------------------------------------------------------

  function manejarRevisarYGuardar() {
    const validacion = validarFormularioPaciente(formulario)
    if (validacion) {
      // Misma lógica del wizard: mueve al paso con el error
      const mapaCampoPaso: Partial<Record<keyof FormularioPaciente, PasoFicha>> = {
        nombres: 'identidad', apellidos: 'identidad',
        fecha_nacimiento: 'identidad', sexo: 'identidad',
        telefono: 'contacto', email: 'contacto',
        comuna: 'ubicacion', region: 'ubicacion',
        estado: 'estado',
      }
      setPasoActivo(mapaCampoPaso[validacion.campo] || 'identidad')
      setMensajeGuardado(`Error: ${validacion.mensaje}`)
      return
    }
    // Anti-duplicado (igual que en guardarPaciente)
    const pacienteParaGuardar = prepararPacienteParaGuardar(formulario)
    const clavePacienteNuevo = construirClavePaciente(pacienteParaGuardar)
    const existeDuplicado = pacientes.some((p) =>
      construirClavePaciente(pacienteAFormulario(p)) === clavePacienteNuevo
    )
    if (existeDuplicado) {
      setPasoActivo('identidad')
      setMensajeGuardado('Error: Este paciente ya existe con exactamente los mismos datos.')
      return
    }
    // Formulario válido → abre la ventana de confirmación
    setMostrandoConfirmacionMovil(true)
  }

  function confirmarYGuardar() {
    // El submit dispara guardarPaciente() que cierra el overlay en la ruta de éxito
    formAltaRef.current?.requestSubmit()
  }

  // ---------------------------------------------------------------------------
  // Wizard: Enter avanza al siguiente paso
  // ---------------------------------------------------------------------------

  function manejarEnterFormulario(event: KeyboardEvent<HTMLFormElement>) {
    if (event.key !== 'Enter' || event.shiftKey) {
      return
    }

    const elemento = event.target as HTMLElement

    if (elemento.tagName !== 'INPUT') {
      return
    }

    event.preventDefault()

    const siguientePaso = obtenerSiguientePaso(pasoActivo)

    if (siguientePaso && pasoEstaCompleto(pasoActivo, formulario)) {
      setPasoActivo(siguientePaso)
      return
    }

    if (formularioCompleto(formulario)) {
      event.currentTarget.requestSubmit()
      return
    }

    const validacion = validarFormularioPaciente(formulario)

    if (validacion) {
      const mapaCampoPaso: Partial<Record<keyof FormularioPaciente, PasoFicha>> = {
        nombres: 'identidad',
        apellidos: 'identidad',
        fecha_nacimiento: 'identidad',
        sexo: 'identidad',
        telefono: 'contacto',
        email: 'contacto',
        comuna: 'ubicacion',
        region: 'ubicacion',
        estado: 'estado',
      }
      const paso = mapaCampoPaso[validacion.campo] || 'identidad'
      setPasoActivo(paso)
      setMensajeGuardado(`Error: ${validacion.mensaje}`)
    }
  }

  // ---------------------------------------------------------------------------
  // Métricas
  // ---------------------------------------------------------------------------

  const metricas: { etiqueta: string; valor: number | string; detalle: string; tipo: TipoMetrica }[] = [
    { etiqueta: 'Pacientes activos', valor: pacientesActivos, detalle: 'En seguimiento', tipo: 'activos' },
    { etiqueta: 'Citas hoy', valor: eventosHoyConPaciente.length, detalle: 'Agendadas', tipo: 'citas' },
    { etiqueta: 'Atendidas hoy', valor: atendidasHoy, detalle: 'Completadas', tipo: 'atendidas' },
    { etiqueta: 'Pendientes hoy', valor: pendientesHoy, detalle: 'Por atender', tipo: 'pendientes' },
  ]

  // ---------------------------------------------------------------------------
  // Renders: acciones de tarjeta
  // ---------------------------------------------------------------------------

  function renderAccionesPaciente(paciente: Paciente) {
    const ocupado = accionEnCurso === paciente.id

    return (
      <div className="paciente-card__acciones">
        <button
          className="card-accion"
          disabled={ocupado}
          onClick={() => iniciarEdicion(paciente)}
          type="button"
        >
          Editar
        </button>
        {paciente.estado === 'activo' ? (
          <button
            className="card-accion card-accion--peligro"
            disabled={ocupado}
            onClick={() => anularPaciente(paciente)}
            type="button"
          >
            {ocupado ? 'Anulando...' : 'Anular'}
          </button>
        ) : (
          <button
            className="card-accion card-accion--positivo"
            disabled={ocupado}
            onClick={() => reactivarPaciente(paciente)}
            type="button"
          >
            {ocupado ? 'Reactivando...' : 'Reactivar'}
          </button>
        )}
      </div>
    )
  }

  // ---------------------------------------------------------------------------
  // Renders: wizard de alta (intacto, sin cambios)
  // ---------------------------------------------------------------------------

  function renderCamposPaso(paso: PasoFicha) {
    if (paso === 'identidad') {
      return (
        <>
          <div className="form-grid form-grid--command">
            <label>
              Nombres *
              <input
                autoComplete="given-name"
                disabled={guardando}
                placeholder="Ej: Catalina Belén"
                value={formulario.nombres}
                onChange={(event) => actualizarFormularioWizard('nombres', event.target.value)}
                required
              />
            </label>

            <label>
              Apellidos *
              <input
                autoComplete="family-name"
                disabled={guardando}
                placeholder="Ej: Troncoso Caro"
                value={formulario.apellidos}
                onChange={(event) => actualizarFormularioWizard('apellidos', event.target.value)}
                required
              />
            </label>

            <label>
              Fecha de nacimiento *
              <input
                disabled={guardando}
                type="date"
                value={formulario.fecha_nacimiento}
                onChange={(event) => actualizarFormularioWizard('fecha_nacimiento', event.target.value)}
                required
              />
            </label>
          </div>

          <div className="chip-field">
            <span>Sexo *</span>
            <div className="selector-chips selector-chips--command">
              {opcionesSexo.map((opcion) => (
                <label
                  className={formulario.sexo === opcion.valor ? 'selector-chip selector-chip--activo' : 'selector-chip'}
                  key={opcion.valor}
                >
                  <input
                    checked={formulario.sexo === opcion.valor}
                    disabled={guardando}
                    name="sexo"
                    onChange={(event) => actualizarFormularioWizard('sexo', event.target.value)}
                    required
                    type="radio"
                    value={opcion.valor}
                  />
                  {opcion.etiqueta}
                </label>
              ))}
            </div>
          </div>
        </>
      )
    }

    if (paso === 'contacto') {
      return (
        <div className="form-grid form-grid--command">
          <label>
            Teléfono *
            <input
              autoComplete="tel"
              disabled={guardando}
              placeholder="Ej: +56 9 1234 5678"
              type="tel"
              value={formulario.telefono}
              onChange={(event) => actualizarFormularioWizard('telefono', event.target.value)}
              required
            />
          </label>

          <label>
            Email *
            <input
              autoComplete="email"
              disabled={guardando}
              placeholder="Ej: paciente@correo.cl"
              type="email"
              value={formulario.email}
              onChange={(event) => actualizarFormularioWizard('email', event.target.value)}
              required
            />
          </label>
        </div>
      )
    }

    if (paso === 'ubicacion') {
      return (
        <div className="form-grid form-grid--command">
          <label>
            Comuna *
            <input
              autoComplete="address-level2"
              disabled={guardando}
              placeholder="Ej: Castro"
              value={formulario.comuna}
              onChange={(event) => actualizarFormularioWizard('comuna', event.target.value)}
              required
            />
          </label>

          <label>
            Región *
            <input
              autoComplete="address-level1"
              disabled={guardando}
              list="regiones-chile"
              placeholder="Ej: Los Lagos"
              value={formulario.region}
              onChange={(event) => actualizarFormularioWizard('region', event.target.value)}
              required
            />
          </label>
        </div>
      )
    }

    return (
      <div className="selector-chips selector-chips--estado selector-chips--command">
        {opcionesEstado.map((opcion) => (
          <label
            className={formulario.estado === opcion.valor ? 'selector-chip selector-chip--activo' : 'selector-chip'}
            key={opcion.valor}
          >
            <input
              checked={formulario.estado === opcion.valor}
              disabled={guardando}
              name="estado"
              onChange={(event) => actualizarFormularioWizard('estado', event.target.value)}
              required
              type="radio"
              value={opcion.valor}
            />
            {opcion.etiqueta}
          </label>
        ))}
      </div>
    )
  }

  function renderPasoFormulario(paso: PasoFichaConfig) {
    const estaActivo = pasoActivo === paso.clave

    if (!estaActivo) {
      return (
        <button
          className={`form-section form-section--summary form-section--summary-${paso.tono}`}
          key={paso.clave}
          onClick={() => setPasoActivo(paso.clave)}
          type="button"
        >
          <div className="form-section__header">
            <span>{paso.numero.padStart(2, '0')}</span>
            <div>
              <h3>{paso.titulo}</h3>
              <p>{obtenerResumenPaso(paso.clave, formulario)}</p>
            </div>
          </div>
          <span className="form-section__chevron" aria-hidden="true">⌄</span>
        </button>
      )
    }

    return (
      <section className={`form-section form-section--${paso.clave} form-section--active`} key={paso.clave}>
        <div className="form-section__header">
          <span>{paso.numero.padStart(2, '0')}</span>
          <div>
            <h3>{paso.titulo}</h3>
            <p>{paso.descripcion}</p>
          </div>
        </div>

        {renderCamposPaso(paso.clave)}
      </section>
    )
  }

  // ---------------------------------------------------------------------------
  // Renders: formulario plano de edición (UI-045 / DEC-044)
  // ---------------------------------------------------------------------------

  function renderFormularioEdicion() {
    if (!pacienteEnEdicion) return null

    const nombreEnEdicion = `${pacienteEnEdicion.nombres} ${pacienteEnEdicion.apellidos}`.trim()

    return (
      <section
        className="edicion-plana-panel pacientes-intake-panel"
        aria-label={`Editar paciente: ${nombreEnEdicion}`}
      >
        {/* Cabecera */}
        <div className="edicion-plana-cabecera">
          <div className="form-panel-title">
            <span className="form-panel-icon" aria-hidden="true">E</span>
            <div>
              <span className="panel-kicker">Edición</span>
              <h2>Editar paciente</h2>
              <p>Todos los campos disponibles. Guardá los cambios cuando estés listo.</p>
            </div>
          </div>
        </div>

        {/* Mensaje de error inline */}
        {errorEdicion && (
          <p
            aria-live="assertive"
            className="mensaje mensaje--error edicion-plana-error"
            role="alert"
          >
            {errorEdicion}
          </p>
        )}

        {/* Formulario plano — grid 2 col desktop / 1 col mobile */}
        <form
          className="formulario-edicion-plana"
          id="edicion-paciente-form"
          onSubmit={guardarPaciente}
        >
          <datalist id="regiones-chile-edicion">
            {regionesChile.map((region) => (
              <option key={region} value={region} />
            ))}
          </datalist>

          {/* Fila 1: Nombres / Apellidos */}
          <label className="edicion-campo-label">
            Nombres *
            <input
              autoComplete="given-name"
              disabled={guardando}
              id="edicion-nombres"
              placeholder="Ej: Catalina Belén"
              value={formulario.nombres}
              onChange={(e) => actualizarFormulario('nombres', e.target.value)}
              required
            />
          </label>

          <label className="edicion-campo-label">
            Apellidos *
            <input
              autoComplete="family-name"
              disabled={guardando}
              id="edicion-apellidos"
              placeholder="Ej: Troncoso Caro"
              value={formulario.apellidos}
              onChange={(e) => actualizarFormulario('apellidos', e.target.value)}
              required
            />
          </label>

          {/* Fila 2: Fecha nacimiento / Sexo */}
          <label className="edicion-campo-label">
            Fecha de nacimiento *
            <input
              disabled={guardando}
              id="edicion-fecha-nacimiento"
              type="date"
              value={formulario.fecha_nacimiento}
              onChange={(e) => actualizarFormulario('fecha_nacimiento', e.target.value)}
              required
            />
          </label>

          <div className="edicion-campo-label edicion-chips-field">
            <span>Sexo *</span>
            <div className="selector-chips" role="group" aria-label="Sexo del paciente">
              {opcionesSexo.map((opcion: OpcionFormulario) => (
                <label
                  className={formulario.sexo === opcion.valor ? 'selector-chip selector-chip--activo' : 'selector-chip'}
                  key={opcion.valor}
                >
                  <input
                    checked={formulario.sexo === opcion.valor}
                    disabled={guardando}
                    name="edicion-sexo"
                    onChange={(e) => actualizarFormulario('sexo', e.target.value)}
                    type="radio"
                    value={opcion.valor}
                  />
                  {opcion.etiqueta}
                </label>
              ))}
            </div>
          </div>

          {/* Fila 3: Teléfono / Email */}
          <label className="edicion-campo-label">
            Teléfono *
            <input
              autoComplete="tel"
              disabled={guardando}
              id="edicion-telefono"
              placeholder="Ej: +56 9 1234 5678"
              type="tel"
              value={formulario.telefono}
              onChange={(e) => actualizarFormulario('telefono', e.target.value)}
              required
            />
          </label>

          <label className="edicion-campo-label">
            Email *
            <input
              autoComplete="email"
              disabled={guardando}
              id="edicion-email"
              placeholder="Ej: paciente@correo.cl"
              type="email"
              value={formulario.email}
              onChange={(e) => actualizarFormulario('email', e.target.value)}
              required
            />
          </label>

          {/* Fila 4: Comuna / Región */}
          <label className="edicion-campo-label">
            Comuna *
            <input
              autoComplete="address-level2"
              disabled={guardando}
              id="edicion-comuna"
              placeholder="Ej: Castro"
              value={formulario.comuna}
              onChange={(e) => actualizarFormulario('comuna', e.target.value)}
              required
            />
          </label>

          <label className="edicion-campo-label">
            Región *
            <input
              autoComplete="address-level1"
              disabled={guardando}
              id="edicion-region"
              list="regiones-chile-edicion"
              placeholder="Ej: Los Lagos"
              value={formulario.region}
              onChange={(e) => actualizarFormulario('region', e.target.value)}
              required
            />
          </label>

          {/* Fila 5: Estado (ancho completo) */}
          <div className="edicion-campo-label edicion-chips-field edicion-campo--full">
            <span>Estado *</span>
            <div className="selector-chips" role="group" aria-label="Estado del paciente">
              {opcionesEstado.map((opcion: OpcionFormulario) => (
                <label
                  className={formulario.estado === opcion.valor ? 'selector-chip selector-chip--activo' : 'selector-chip'}
                  key={opcion.valor}
                >
                  <input
                    checked={formulario.estado === opcion.valor}
                    disabled={guardando}
                    name="edicion-estado"
                    onChange={(e) => actualizarFormulario('estado', e.target.value)}
                    type="radio"
                    value={opcion.valor}
                  />
                  {opcion.etiqueta}
                </label>
              ))}
            </div>
          </div>
        </form>

        {/* Barra de acciones fija (sticky bottom) */}
        <div className="edicion-plana-barra-acciones">
          <button
            className="accion-vista"
            disabled={guardando}
            onClick={cancelarEdicion}
            type="button"
          >
            Cancelar
          </button>
          <button
            className="guardar-paciente"
            disabled={guardando}
            form="edicion-paciente-form"
            type="submit"
          >
            {guardando ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </section>
    )
  }

  // ---------------------------------------------------------------------------
  // Renders: wizard de alta (intacto)
  // ---------------------------------------------------------------------------

  function renderFormularioPaciente() {
    return (
      <section className="pacientes-intake-panel" aria-label="Nuevo paciente">
        <div className="form-panel-header form-panel-header--command">
          <div className="form-panel-title">
            <span className="form-panel-icon" aria-hidden="true">N</span>
            <div>
              <span className="panel-kicker">Ficha inteligente</span>
              <h2>Nuevo paciente</h2>
              <p>Ingreso inicial con preview en vivo antes de guardar.</p>
            </div>
          </div>

          <div className="form-panel-actions">
            {/* Botón desktop (≥ 1025px): guarda directo */}
            <button
              className="guardar-paciente guardar-wizard--desktop"
              disabled={guardando}
              form="paciente-form"
              type="submit"
            >
              {guardando ? 'Guardando...' : 'Guardar paciente'}
            </button>
            {/* Botón tablet/mobile (≤ 1024px): abre overlay de confirmación */}
            <button
              className="guardar-paciente guardar-wizard--movil"
              disabled={guardando}
              onClick={manejarRevisarYGuardar}
              type="button"
            >
              Revisar y guardar
            </button>
          </div>
        </div>

        <div className="form-stepper" aria-label="Etapas de la ficha de paciente">
          {pasosFicha.map((paso) => (
            <button
              aria-current={pasoActivo === paso.clave ? 'step' : undefined}
              className={pasoActivo === paso.clave ? 'form-stepper__item form-stepper__item--activo' : 'form-stepper__item'}
              key={paso.numero}
              onClick={() => setPasoActivo(paso.clave)}
              type="button"
            >
              <strong>{paso.numero}</strong>
              {paso.etiqueta}
            </button>
          ))}
        </div>

        <div className="intake-command-layout">
          <form
            className="formulario-ficha formulario-ficha--command"
            id="paciente-form"
            ref={formAltaRef}
            onKeyDown={manejarEnterFormulario}
            onSubmit={guardarPaciente}
          >
            <datalist id="regiones-chile">
              {regionesChile.map((region) => (
                <option key={region} value={region} />
              ))}
            </datalist>
            {pasosFicha.map(renderPasoFormulario)}
          </form>

          <aside className="preview-paciente preview-paciente--command" aria-label="Preview del paciente">
            <div className="preview-avatar" aria-hidden="true">
              {obtenerIniciales(formulario.nombres, formulario.apellidos)}
            </div>

            <div className="preview-heading">
              <span>Preview vivo</span>
              <h3>{nombrePreview || 'Nuevo paciente'}</h3>
              <p>
                {formularioTieneDatos
                  ? 'Así se verá la ficha antes de guardarla.'
                  : 'Completa la ficha para construir el resumen clínico.'}
              </p>
            </div>

            <span className={`estado-badge estado-badge--${formulario.estado}`}>
              {obtenerEtiquetaOpcion(opcionesEstado, formulario.estado) || formulario.estado}
            </span>

            <div className="preview-data preview-data--command">
              <p><strong>Tel.</strong> <span>{mostrarDato(formulario.telefono)}</span></p>
              <p><strong>Email</strong> <span>{mostrarDato(formulario.email)}</span></p>
              <p><strong>Zona</strong> <span>{mostrarDato(ubicacionPreview)}</span></p>
              <p><strong>Sexo</strong> <span>{sexoPreview || 'Pendiente'}</span></p>
              <p><strong>Nacimiento</strong> <span>{fechaNacimientoPreview}</span></p>
            </div>

            <div className="preview-help">
              Esta tarjeta se actualiza mientras completas la ficha, sin guardar cambios hasta confirmar.
            </div>
          </aside>
        </div>

        {/* UI-046 / DEC-045: overlay de confirmación — solo en tablet/mobile (≤ 1024px) */}
        {mostrandoConfirmacionMovil && (
          <div
            className="wizard-confirmacion-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Confirmar datos del nuevo paciente"
          >
            <div className="wizard-confirmacion-panel">
              <div className="wizard-confirmacion-cabecera">
                <div className="preview-avatar wizard-confirmacion-avatar" aria-hidden="true">
                  {obtenerIniciales(formulario.nombres, formulario.apellidos)}
                </div>
                <div>
                  <span className="panel-kicker">Confirmación</span>
                  <h2 className="wizard-confirmacion-titulo">
                    {nombrePreview || 'Nuevo paciente'}
                  </h2>
                  <span className={`estado-badge estado-badge--${formulario.estado}`}>
                    {obtenerEtiquetaOpcion(opcionesEstado, formulario.estado) || formulario.estado}
                  </span>
                </div>
              </div>

              <p className="wizard-confirmacion-subtitulo">
                Revisá el resumen antes de guardar. Si necesitás corregir algo, volvé a editar.
              </p>

              <div className="wizard-confirmacion-datos">
                <div className="wizard-confirmacion-dato">
                  <strong>Tel.</strong>
                  <span>{mostrarDato(formulario.telefono)}</span>
                </div>
                <div className="wizard-confirmacion-dato">
                  <strong>Email</strong>
                  <span>{mostrarDato(formulario.email)}</span>
                </div>
                <div className="wizard-confirmacion-dato">
                  <strong>Zona</strong>
                  <span>{mostrarDato(ubicacionPreview)}</span>
                </div>
                <div className="wizard-confirmacion-dato">
                  <strong>Sexo</strong>
                  <span>{sexoPreview || 'Pendiente'}</span>
                </div>
                <div className="wizard-confirmacion-dato">
                  <strong>Nacimiento</strong>
                  <span>{fechaNacimientoPreview}</span>
                </div>
              </div>

              <div className="wizard-confirmacion-acciones">
                <button
                  className="accion-vista"
                  disabled={guardando}
                  onClick={() => setMostrandoConfirmacionMovil(false)}
                  type="button"
                >
                  Volver a editar
                </button>
                <button
                  className="guardar-paciente"
                  disabled={guardando}
                  onClick={confirmarYGuardar}
                  type="button"
                >
                  {guardando ? 'Guardando...' : 'Confirmar y guardar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    )
  }

  // ---------------------------------------------------------------------------
  // Renders: panel del día y registro completo (sin cambios)
  // ---------------------------------------------------------------------------

  function renderPanelDia() {
    return (
      <section className="pacientes-directory-panel pacientes-dia-panel" aria-label="Pacientes agendados hoy">
        <div className="panel-heading panel-heading--compact">
          <div>
            <span className="panel-kicker">Panel del día</span>
            <h2>Pacientes agendados hoy</h2>
          </div>
          <strong>{citasDelDia.length}</strong>
        </div>

        {cargando || cargandoAgenda ? (
          <div className="estado-listado">
            <strong>Cargando agenda del día</strong>
            <p>Cruzando citas de hoy con el directorio de pacientes.</p>
          </div>
        ) : citasDelDia.length === 0 ? (
          <div className="estado-listado estado-listado--vacio">
            <strong>Sin pacientes agendados para hoy</strong>
            <p>No hay citas programadas, confirmadas ni reagendadas para hoy.</p>
            <button
              className="accion-vista accion-vista--vacio"
              onClick={() => cambiarVista('registro')}
              type="button"
            >
              Ir al registro completo
            </button>
          </div>
        ) : (
          <div className="pacientes-cards pacientes-cards--compact" aria-live="polite">
            {citasDelDia.map(({ evento, paciente }) => (
              <article className="paciente-card paciente-card--compact cita-dia-card" key={evento.id_agenda_evento}>
                <div className="cita-dia-hora">
                  <strong>{horaLocal(evento.fecha_inicio)}</strong>
                  <span>hrs</span>
                </div>

                <div className="paciente-card__body">
                  <div className="paciente-card__topline">
                    <div>
                      <h3>{paciente.nombres} {paciente.apellidos}</h3>
                      <p className="paciente-card__contact-line">
                        <span>{formatearEtiqueta(evento.modalidad)}</span>
                        <span aria-hidden="true">·</span>
                        <span>{formatearEtiqueta(evento.tipo_evento)}</span>
                        <span aria-hidden="true">·</span>
                        <span>{mostrarDato(paciente.telefono, 'Sin teléfono')}</span>
                      </p>
                    </div>
                    <span className={`estado-badge estado-evento-badge--${evento.estado_evento}`}>
                      {formatearEtiqueta(evento.estado_evento)}
                    </span>
                  </div>

                  {renderAccionesPaciente(paciente)}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    )
  }

  function renderRegistroCompleto() {
    return (
      <section className="pacientes-directory-panel" aria-label="Listado de pacientes">
        <div className="panel-heading panel-heading--compact">
          <div>
            <span className="panel-kicker">Directorio</span>
            <h2>Pacientes registrados</h2>
          </div>
          <strong>{cantidadVisible}</strong>
        </div>

        <div className="directory-search-row">
          <label className="buscador-pacientes buscador-pacientes--compact">
            <span>Buscar</span>
            <input
              autoComplete="off"
              placeholder="Nombre, email, teléfono, comuna o región"
              type="search"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
            />
          </label>
          <button className="directory-filter-button" type="button" aria-label="Abrir filtros avanzados">
            ≡
          </button>
        </div>

        <div className="filtros-rapidos filtros-rapidos--compact" aria-label="Filtros rápidos de pacientes">
          {filtrosEstado.map((filtro) => (
            <button
              aria-pressed={filtroEstado === filtro.valor}
              className={filtroEstado === filtro.valor ? 'chip chip--activo' : 'chip'}
              key={filtro.valor}
              onClick={() => setFiltroEstado(filtro.valor)}
              type="button"
            >
              {filtro.etiqueta}
            </button>
          ))}
        </div>

        {cargando ? (
          <div className="estado-listado">
            <strong>Cargando pacientes</strong>
            <p>Preparando el directorio clínico local.</p>
          </div>
        ) : pacientes.length === 0 ? (
          <div className="estado-listado estado-listado--vacio">
            <strong>Aún no hay pacientes registrados</strong>
            <p>Completa la ficha de ingreso para crear el primer registro.</p>
          </div>
        ) : pacientesFiltrados.length === 0 ? (
          <div className="estado-listado estado-listado--vacio">
            <strong>No hay resultados</strong>
            <p>Ajusta la búsqueda o cambia el filtro de estado.</p>
          </div>
        ) : (
          <>
            <div className="pacientes-cards pacientes-cards--compact" aria-live="polite">
              {pacientesFiltrados.map((paciente) => {
                const ubicacionPaciente = [paciente.comuna, paciente.region].filter(Boolean).join(', ')

                return (
                  <article className="paciente-card paciente-card--compact" key={paciente.id}>
                    <div className="paciente-avatar" aria-hidden="true">
                      {obtenerIniciales(paciente.nombres, paciente.apellidos)}
                    </div>

                    <div className="paciente-card__body">
                      <div className="paciente-card__topline">
                        <div>
                          <h3>{paciente.nombres} {paciente.apellidos}</h3>
                          <p className="paciente-card__contact-line">
                            <span>{mostrarDato(paciente.telefono, 'Sin teléfono')}</span>
                            <span aria-hidden="true">·</span>
                            <span>{mostrarDato(paciente.email, 'Sin email')}</span>
                          </p>
                        </div>
                        <span className={`estado-badge estado-badge--${paciente.estado}`}>
                          {obtenerEtiquetaOpcion(opcionesEstado, paciente.estado) || paciente.estado}
                        </span>
                      </div>

                      <div className="paciente-card__footer-line">
                        <span>{mostrarDato(ubicacionPaciente, 'Sin ubicación')}</span>
                        <time dateTime={paciente.created_at}>{formatearFecha(paciente.created_at)}</time>
                      </div>

                      {renderAccionesPaciente(paciente)}
                    </div>
                  </article>
                )
              })}
            </div>

            <div className="directory-pagination">
              <span>Mostrando 1 a {cantidadVisible} de {totalPacientes} pacientes</span>
              <div aria-hidden="true">
                <button type="button">‹</button>
                <strong>1</strong>
                <button type="button">›</button>
              </div>
            </div>
          </>
        )}
      </section>
    )
  }

  // ---------------------------------------------------------------------------
  // Render principal
  // ---------------------------------------------------------------------------

  return (
    <main className="pacientes-shell pacientes-shell--command">
      <section className="pacientes-command-topbar">
        <div className="pacientes-command-title">
          <span className="modulo-badge">Módulo clínico</span>
          <h1>Pacientes</h1>
          <p>Panel de trabajo diario: pacientes agendados hoy, registro completo y fichas clínicas.</p>
        </div>

        <section className="pacientes-metricas-rail" aria-label="Métricas de pacientes">
          {metricas.map((metrica) => (
            <article className={`metrica-rail-card metrica-rail-card--${metrica.tipo}`} key={metrica.etiqueta}>
              <span className="metrica-icon" aria-hidden="true"><MetricaIcon tipo={metrica.tipo} /></span>
              <div>
                <strong>{metrica.valor}</strong>
                <span>{metrica.etiqueta}</span>
                <p>{metrica.detalle}</p>
              </div>
            </article>
          ))}
        </section>
      </section>

      <nav className="pacientes-acciones-bar" aria-label="Vistas de pacientes">
        {vistasPacientes.map((opcionVista) => {
          const activa = !pacienteEnEdicion && vista === opcionVista.valor

          return (
            <button
              aria-pressed={activa}
              className={activa ? 'accion-vista accion-vista--activa' : 'accion-vista'}
              key={opcionVista.valor}
              onClick={() => cambiarVista(opcionVista.valor)}
              type="button"
            >
              {opcionVista.etiqueta}
            </button>
          )
        })}
      </nav>

      <p aria-live="polite" role="status" className={`mensaje pacientes-mensaje-live${mensajeEsError ? ' mensaje--error' : ''}`}>
        {mensaje}
      </p>

      <section className="pacientes-vista-contenido">
        {pacienteEnEdicion
          ? renderFormularioEdicion()
          : vista === 'nuevo'
            ? renderFormularioPaciente()
            : (vista === 'registro' ? renderRegistroCompleto() : renderPanelDia())}
      </section>
    </main>
  )
}

export default PacientesPage
