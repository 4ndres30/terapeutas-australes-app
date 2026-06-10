import type { FormEvent, KeyboardEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import './CasosPage.css'
import './CasoDetallePage.css'

type Paciente = {
  id: string
  nombres: string
  apellidos: string
  telefono: string
  email: string
}

type Consulta = {
  id_consulta: string
  paciente_id: string
  fecha_consulta: string
  tipo_consulta: string
  estado_consulta: string
  motivo_consulta: string
}

type Evaluacion = {
  id_evaluacion: string
  paciente_id: string
  consulta_id: string
  fecha_evaluacion: string
  decision_revision: string
  estado_evaluacion: string
  relato_antecedentes: string
}

type TipoCaso =
  | 'Personal'
  | 'Familiar'
  | 'Vinculo'
  | 'Linaje'
  | 'Casa/Espacio'
  | 'Bloqueo'
  | 'Entidad/Presencia'
  | 'Proteccion'
  | 'Seguimiento'
  | 'Otro'

type PrioridadCaso = 'Baja' | 'Media' | 'Alta' | 'Urgente'
type EstadoCaso = 'Abierto' | 'En proceso' | 'Pausado' | 'Cerrado' | 'Anulado'
type PasoCaso = 'origen' | 'datos' | 'seguimiento'

type Caso = {
  id_caso: string
  paciente_id: string
  consulta_id: string | null
  evaluacion_id: string | null
  fecha_apertura: string
  nombre_caso: string
  motivo_apertura: string
  descripcion_general: string | null
  objetivo_trabajo: string | null
  tipo_caso: TipoCaso
  prioridad: PrioridadCaso
  estado_caso: EstadoCaso
  requiere_seguimiento: boolean
  notas_seguimiento: string | null
  created_at: string
}

type FormularioCaso = {
  paciente_id: string
  consulta_id: string
  evaluacion_id: string
  fecha_apertura: string
  nombre_caso: string
  motivo_apertura: string
  descripcion_general: string
  objetivo_trabajo: string
  tipo_caso: TipoCaso
  prioridad: PrioridadCaso
  estado_caso: EstadoCaso
  requiere_seguimiento: boolean
  notas_seguimiento: string
}

type PasoCasoConfig = {
  clave: PasoCaso
  numero: string
  titulo: string
  descripcion: string
  tono: string
}

const CASO_SELECT = [
  'id_caso',
  'paciente_id',
  'consulta_id',
  'evaluacion_id',
  'fecha_apertura',
  'nombre_caso',
  'motivo_apertura',
  'descripcion_general',
  'objetivo_trabajo',
  'tipo_caso',
  'prioridad',
  'estado_caso',
  'requiere_seguimiento',
  'notas_seguimiento',
  'created_at',
].join(', ')

const tiposCaso: TipoCaso[] = [
  'Personal',
  'Familiar',
  'Vinculo',
  'Linaje',
  'Casa/Espacio',
  'Bloqueo',
  'Entidad/Presencia',
  'Proteccion',
  'Seguimiento',
  'Otro',
]

const prioridadesCaso: PrioridadCaso[] = ['Baja', 'Media', 'Alta', 'Urgente']
const estadosCaso: EstadoCaso[] = ['Abierto', 'En proceso', 'Pausado', 'Cerrado', 'Anulado']

const pasosCaso: PasoCasoConfig[] = [
  {
    clave: 'origen',
    numero: '1',
    titulo: 'Paciente y origen',
    descripcion: 'Paciente obligatorio y vínculos opcionales con consulta o evaluación.',
    tono: 'violeta',
  },
  {
    clave: 'datos',
    numero: '2',
    titulo: 'Datos del caso',
    descripcion: 'Nombre, tipo, prioridad, estado y motivo de apertura.',
    tono: 'azul',
  },
  {
    clave: 'seguimiento',
    numero: '3',
    titulo: 'Seguimiento',
    descripcion: 'Define si requiere seguimiento y registra la próxima acción.',
    tono: 'dorado',
  },
]

function obtenerFechaHoy() {
  return new Date().toISOString().slice(0, 10)
}

function crearFormularioInicial(): FormularioCaso {
  return {
    paciente_id: '',
    consulta_id: '',
    evaluacion_id: '',
    fecha_apertura: obtenerFechaHoy(),
    nombre_caso: '',
    motivo_apertura: '',
    descripcion_general: '',
    objetivo_trabajo: '',
    tipo_caso: 'Personal',
    prioridad: 'Media',
    estado_caso: 'Abierto',
    requiere_seguimiento: false,
    notas_seguimiento: '',
  }
}

function normalizarTexto(texto: string) {
  return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function obtenerNombrePaciente(paciente?: Paciente) {
  if (!paciente) {
    return 'Paciente sin seleccionar'
  }

  return `${paciente.nombres} ${paciente.apellidos}`.trim() || 'Paciente sin nombre'
}

function formatearFecha(fecha: string) {
  if (!fecha) {
    return 'Sin fecha'
  }

  const fechaNormalizada = fecha.includes('T') ? fecha : `${fecha}T00:00:00`
  const fechaCaso = new Date(fechaNormalizada)

  if (Number.isNaN(fechaCaso.getTime())) {
    return 'Sin fecha'
  }

  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(fechaCaso)
}

function textoCorto(texto: string, largo = 96) {
  const limpio = texto.trim()

  if (limpio.length <= largo) {
    return limpio
  }

  return `${limpio.slice(0, largo - 1)}...`
}

function obtenerConsultaResumen(consulta?: Consulta) {
  if (!consulta) {
    return 'Sin consulta asociada'
  }

  return `${formatearFecha(consulta.fecha_consulta)} · ${consulta.tipo_consulta} · ${textoCorto(consulta.motivo_consulta, 58)}`
}

function obtenerEvaluacionResumen(evaluacion?: Evaluacion) {
  if (!evaluacion) {
    return 'Sin evaluación asociada'
  }

  return `${formatearFecha(evaluacion.fecha_evaluacion)} · ${evaluacion.estado_evaluacion} · ${textoCorto(evaluacion.relato_antecedentes, 58)}`
}

function estadoBadgeVisual(estado: EstadoCaso) {
  return estado === 'Cerrado' || estado === 'Anulado' ? 'inactivo' : 'activo'
}

function obtenerResumenPaso(paso: PasoCaso, formulario: FormularioCaso, paciente?: Paciente, consulta?: Consulta, evaluacion?: Evaluacion) {
  if (paso === 'origen') {
    const resumen = [
      obtenerNombrePaciente(paciente),
      formulario.fecha_apertura ? formatearFecha(formulario.fecha_apertura) : '',
      consulta ? 'con consulta' : '',
      evaluacion ? 'con evaluación' : '',
    ].filter(Boolean).join(' · ')

    return formulario.paciente_id ? resumen : 'Paciente, origen opcional y fecha de apertura.'
  }

  if (paso === 'datos') {
    const resumen = [formulario.nombre_caso, formulario.tipo_caso, formulario.prioridad].filter(Boolean).join(' · ')
    return resumen || 'Nombre, clasificación, prioridad y motivo de apertura.'
  }

  if (formulario.requiere_seguimiento) {
    return formulario.notas_seguimiento.trim() || 'Requiere seguimiento, sin nota registrada.'
  }

  return 'Seguimiento opcional para próximas acciones.'
}

function pasoEstaCompleto(paso: PasoCaso, formulario: FormularioCaso) {
  if (paso === 'origen') {
    return Boolean(formulario.paciente_id && formulario.fecha_apertura)
  }

  if (paso === 'datos') {
    return Boolean(
      formulario.nombre_caso.trim()
      && formulario.motivo_apertura.trim()
      && formulario.tipo_caso
      && formulario.prioridad
      && formulario.estado_caso,
    )
  }

  return true
}

function obtenerSiguientePaso(paso: PasoCaso) {
  const indiceActual = pasosCaso.findIndex((pasoCaso) => pasoCaso.clave === paso)
  return pasosCaso[indiceActual + 1]?.clave || null
}

function validarFormularioCaso(
  formulario: FormularioCaso,
  pacientes: Paciente[],
  consultasPorId: Map<string, Consulta>,
  evaluacionesPorId: Map<string, Evaluacion>,
  casos: Caso[],
): { paso: PasoCaso; mensaje: string } | null {
  if (pacientes.length === 0) {
    return { paso: 'origen', mensaje: 'Primero debes crear un paciente antes de abrir un caso.' }
  }

  if (!formulario.paciente_id) {
    return { paso: 'origen', mensaje: 'Selecciona el paciente asociado al caso.' }
  }

  if (!formulario.fecha_apertura) {
    return { paso: 'origen', mensaje: 'Selecciona la fecha de apertura del caso.' }
  }

  if (formulario.consulta_id) {
    const consulta = consultasPorId.get(formulario.consulta_id)

    if (!consulta || consulta.paciente_id !== formulario.paciente_id) {
      return { paso: 'origen', mensaje: 'La consulta seleccionada no pertenece al paciente del caso.' }
    }
  }

  if (formulario.evaluacion_id) {
    const evaluacion = evaluacionesPorId.get(formulario.evaluacion_id)

    if (!evaluacion || evaluacion.paciente_id !== formulario.paciente_id) {
      return { paso: 'origen', mensaje: 'La evaluación seleccionada no pertenece al paciente del caso.' }
    }

    if (formulario.consulta_id && evaluacion.consulta_id !== formulario.consulta_id) {
      return { paso: 'origen', mensaje: 'La evaluación seleccionada pertenece a otra consulta.' }
    }
  }

  if (!formulario.nombre_caso.trim() || !formulario.motivo_apertura.trim()) {
    return { paso: 'datos', mensaje: 'Completa el nombre del caso y el motivo de apertura.' }
  }

  const duplicado = casos.some((caso) => (
    caso.paciente_id === formulario.paciente_id
    && normalizarTexto(caso.nombre_caso) === normalizarTexto(formulario.nombre_caso.trim())
    && caso.estado_caso !== 'Cerrado'
    && caso.estado_caso !== 'Anulado'
  ))

  if (duplicado) {
    return { paso: 'datos', mensaje: 'Ya existe un caso abierto o en proceso con ese nombre para este paciente.' }
  }

  return null
}

function formularioCompleto(
  formulario: FormularioCaso,
  pacientes: Paciente[],
  consultasPorId: Map<string, Consulta>,
  evaluacionesPorId: Map<string, Evaluacion>,
  casos: Caso[],
) {
  return validarFormularioCaso(formulario, pacientes, consultasPorId, evaluacionesPorId, casos) === null
}

function CasosPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([])
  const [casos, setCasos] = useState<Caso[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [pasoActivo, setPasoActivo] = useState<PasoCaso>('origen')
  const [formulario, setFormulario] = useState<FormularioCaso>(() => crearFormularioInicial())
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)

  const pacienteSeleccionado = pacientes.find((paciente) => paciente.id === formulario.paciente_id)
  const consultaSeleccionada = consultas.find((consulta) => consulta.id_consulta === formulario.consulta_id)
  const evaluacionSeleccionada = evaluaciones.find((evaluacion) => evaluacion.id_evaluacion === formulario.evaluacion_id)

  const pacientesPorId = useMemo(() => new Map(pacientes.map((paciente) => [paciente.id, paciente])), [pacientes])
  const consultasPorId = useMemo(() => new Map(consultas.map((consulta) => [consulta.id_consulta, consulta])), [consultas])
  const evaluacionesPorId = useMemo(() => new Map(evaluaciones.map((evaluacion) => [evaluacion.id_evaluacion, evaluacion])), [evaluaciones])

  const consultasPaciente = useMemo(() => (
    consultas.filter((consulta) => consulta.paciente_id === formulario.paciente_id)
  ), [consultas, formulario.paciente_id])

  const evaluacionesPaciente = useMemo(() => (
    evaluaciones.filter((evaluacion) => evaluacion.paciente_id === formulario.paciente_id)
  ), [evaluaciones, formulario.paciente_id])

  const casosFiltrados = useMemo(() => {
    if (!busqueda.trim()) {
      return casos
    }

    const filtro = normalizarTexto(busqueda.trim())

    return casos.filter((caso) => {
      const paciente = pacientesPorId.get(caso.paciente_id)
      const consulta = caso.consulta_id ? consultasPorId.get(caso.consulta_id) : undefined
      const evaluacion = caso.evaluacion_id ? evaluacionesPorId.get(caso.evaluacion_id) : undefined
      const texto = [
        caso.nombre_caso,
        caso.motivo_apertura,
        caso.tipo_caso,
        caso.prioridad,
        caso.estado_caso,
        caso.objetivo_trabajo || '',
        obtenerNombrePaciente(paciente),
        consulta?.motivo_consulta || '',
        evaluacion?.relato_antecedentes || '',
      ].join(' ')

      return normalizarTexto(texto).includes(filtro)
    })
  }, [busqueda, casos, consultasPorId, evaluacionesPorId, pacientesPorId])

  const metricas = [
    { etiqueta: 'Total', valor: casos.length, detalle: 'Casos reales' },
    { etiqueta: 'Abiertos', valor: casos.filter((caso) => caso.estado_caso === 'Abierto').length, detalle: 'Inicio activo' },
    { etiqueta: 'En proceso', valor: casos.filter((caso) => caso.estado_caso === 'En proceso').length, detalle: 'Trabajo vigente' },
    { etiqueta: 'Seguimiento', valor: casos.filter((caso) => caso.requiere_seguimiento).length, detalle: 'Requieren acción' },
  ]

  function avanzarAlSiguientePasoSiCorresponde(pasoActual: PasoCaso, formularioActualizado: FormularioCaso) {
    const siguientePaso = obtenerSiguientePaso(pasoActual)

    if (siguientePaso && pasoEstaCompleto(pasoActual, formularioActualizado)) {
      window.setTimeout(() => setPasoActivo(siguientePaso), 180)
    }
  }

  function actualizarFormulario(campo: keyof FormularioCaso, valor: string | boolean) {
    setFormulario((actual) => {
      const actualizado = { ...actual, [campo]: valor }
      avanzarAlSiguientePasoSiCorresponde(pasoActivo, actualizado)
      return actualizado
    })
  }

  function actualizarPaciente(pacienteId: string) {
    setFormulario((actual) => {
      const actualizado = {
        ...actual,
        paciente_id: pacienteId,
        consulta_id: '',
        evaluacion_id: '',
      }

      avanzarAlSiguientePasoSiCorresponde(pasoActivo, actualizado)
      return actualizado
    })
  }

  function actualizarEvaluacion(evaluacionId: string) {
    const evaluacion = evaluaciones.find((item) => item.id_evaluacion === evaluacionId)

    setFormulario((actual) => {
      const actualizado = {
        ...actual,
        evaluacion_id: evaluacionId,
        consulta_id: evaluacion?.consulta_id || actual.consulta_id,
      }

      avanzarAlSiguientePasoSiCorresponde(pasoActivo, actualizado)
      return actualizado
    })
  }

  async function cargarBaseCasos() {
    const { data: pacientesData, error: pacientesError } = await supabase
      .from('pacientes')
      .select('id, nombres, apellidos, telefono, email')
      .order('created_at', { ascending: false })

    if (pacientesError) {
      setMensaje(`Error al cargar pacientes: ${pacientesError.message}`)
      setCargando(false)
      return
    }

    const { data: consultasData, error: consultasError } = await supabase
      .from('consultas')
      .select('id_consulta, paciente_id, fecha_consulta, tipo_consulta, estado_consulta, motivo_consulta')
      .order('fecha_consulta', { ascending: false })

    if (consultasError) {
      setMensaje(`Error al cargar consultas: ${consultasError.message}`)
      setCargando(false)
      return
    }

    const { data: evaluacionesData, error: evaluacionesError } = await supabase
      .from('evaluaciones')
      .select('id_evaluacion, paciente_id, consulta_id, fecha_evaluacion, decision_revision, estado_evaluacion, relato_antecedentes')
      .order('fecha_evaluacion', { ascending: false })

    if (evaluacionesError) {
      setMensaje(`Error al cargar evaluaciones: ${evaluacionesError.message}`)
      setCargando(false)
      return
    }

    const { data: casosData, error: casosError } = await supabase
      .from('casos')
      .select(CASO_SELECT)
      .order('created_at', { ascending: false })

    if (casosError) {
      setMensaje(`Error al cargar casos: ${casosError.message}`)
      setCargando(false)
      return
    }

    setPacientes((pacientesData || []) as Paciente[])
    setConsultas((consultasData || []) as Consulta[])
    setEvaluaciones((evaluacionesData || []) as Evaluacion[])
    setCasos((casosData || []) as unknown as Caso[])
    setCargando(false)
  }

  async function guardarCaso(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const validacion = validarFormularioCaso(formulario, pacientes, consultasPorId, evaluacionesPorId, casos)

    if (validacion) {
      setPasoActivo(validacion.paso)
      setMensaje(`Error: ${validacion.mensaje}`)
      return
    }

    setGuardando(true)
    setMensaje('Guardando caso...')

    const payload = {
      paciente_id: formulario.paciente_id,
      consulta_id: formulario.consulta_id || null,
      evaluacion_id: formulario.evaluacion_id || null,
      fecha_apertura: formulario.fecha_apertura,
      nombre_caso: formulario.nombre_caso.trim(),
      motivo_apertura: formulario.motivo_apertura.trim(),
      descripcion_general: formulario.descripcion_general.trim() || null,
      objetivo_trabajo: formulario.objetivo_trabajo.trim() || null,
      tipo_caso: formulario.tipo_caso,
      prioridad: formulario.prioridad,
      estado_caso: formulario.estado_caso,
      requiere_seguimiento: formulario.requiere_seguimiento,
      notas_seguimiento: formulario.notas_seguimiento.trim() || null,
    }

    const { data, error } = await supabase
      .from('casos')
      .insert(payload)
      .select(CASO_SELECT)
      .single()

    if (error) {
      setMensaje(`Error al guardar caso: ${error.message}`)
      setGuardando(false)
      return
    }

    setCasos((actuales) => [data as unknown as Caso, ...actuales])
    setFormulario(crearFormularioInicial())
    setPasoActivo('origen')
    setMensaje('Caso guardado correctamente')
    setGuardando(false)
  }

  function manejarEnterFormulario(event: KeyboardEvent<HTMLFormElement>) {
    if (event.key !== 'Enter' || event.shiftKey) {
      return
    }

    const elemento = event.target as HTMLElement

    if (elemento.tagName === 'TEXTAREA') {
      return
    }

    event.preventDefault()

    const siguientePaso = obtenerSiguientePaso(pasoActivo)

    if (siguientePaso && pasoEstaCompleto(pasoActivo, formulario)) {
      setPasoActivo(siguientePaso)
      return
    }

    if (formularioCompleto(formulario, pacientes, consultasPorId, evaluacionesPorId, casos)) {
      event.currentTarget.requestSubmit()
      return
    }

    const validacion = validarFormularioCaso(formulario, pacientes, consultasPorId, evaluacionesPorId, casos)

    if (validacion) {
      setPasoActivo(validacion.paso)
      setMensaje(`Error: ${validacion.mensaje}`)
    }
  }

  function renderCamposPaso(paso: PasoCaso) {
    if (paso === 'origen') {
      return (
        <>
          <div className="form-grid form-grid--command">
            <label>
              Paciente *
              <select
                disabled={guardando}
                value={formulario.paciente_id}
                onChange={(event) => actualizarPaciente(event.target.value)}
                required
              >
                <option value="">Seleccionar paciente</option>
                {pacientes.map((paciente) => (
                  <option key={paciente.id} value={paciente.id}>{obtenerNombrePaciente(paciente)}</option>
                ))}
              </select>
            </label>

            <label>
              Consulta asociada
              <select
                disabled={guardando || !formulario.paciente_id || consultasPaciente.length === 0}
                value={formulario.consulta_id}
                onChange={(event) => actualizarFormulario('consulta_id', event.target.value)}
              >
                <option value="">Sin consulta asociada</option>
                {consultasPaciente.map((consulta) => (
                  <option key={consulta.id_consulta} value={consulta.id_consulta}>{obtenerConsultaResumen(consulta)}</option>
                ))}
              </select>
            </label>

            <label>
              Evaluación asociada
              <select
                disabled={guardando || !formulario.paciente_id || evaluacionesPaciente.length === 0}
                value={formulario.evaluacion_id}
                onChange={(event) => actualizarEvaluacion(event.target.value)}
              >
                <option value="">Sin evaluación asociada</option>
                {evaluacionesPaciente.map((evaluacion) => (
                  <option key={evaluacion.id_evaluacion} value={evaluacion.id_evaluacion}>{obtenerEvaluacionResumen(evaluacion)}</option>
                ))}
              </select>
            </label>

            <label>
              Fecha de apertura *
              <input
                disabled={guardando}
                required
                type="date"
                value={formulario.fecha_apertura}
                onChange={(event) => actualizarFormulario('fecha_apertura', event.target.value)}
              />
            </label>
          </div>

          {formulario.paciente_id && consultasPaciente.length === 0 && evaluacionesPaciente.length === 0 && (
            <p className="casos-inline-note">
              Este paciente no tiene consultas/evaluaciones asociadas. La tabla casos permite abrir el caso con paciente directo.
            </p>
          )}
        </>
      )
    }

    if (paso === 'datos') {
      return (
        <>
          <div className="form-grid form-grid--command">
            <label>
              Nombre del caso *
              <input
                disabled={guardando}
                value={formulario.nombre_caso}
                onChange={(event) => actualizarFormulario('nombre_caso', event.target.value)}
                placeholder="Ej: Bloqueo familiar recurrente"
                required
              />
            </label>

            <label>
              Tipo de caso *
              <select
                disabled={guardando}
                value={formulario.tipo_caso}
                onChange={(event) => actualizarFormulario('tipo_caso', event.target.value as TipoCaso)}
                required
              >
                {tiposCaso.map((tipo) => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </label>

            <label>
              Prioridad *
              <select
                disabled={guardando}
                value={formulario.prioridad}
                onChange={(event) => actualizarFormulario('prioridad', event.target.value as PrioridadCaso)}
                required
              >
                {prioridadesCaso.map((prioridad) => (
                  <option key={prioridad} value={prioridad}>{prioridad}</option>
                ))}
              </select>
            </label>

            <label>
              Estado *
              <select
                disabled={guardando}
                value={formulario.estado_caso}
                onChange={(event) => actualizarFormulario('estado_caso', event.target.value as EstadoCaso)}
                required
              >
                {estadosCaso.map((estado) => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </label>
          </div>

          <label>
            Motivo de apertura *
            <textarea
              disabled={guardando}
              value={formulario.motivo_apertura}
              onChange={(event) => actualizarFormulario('motivo_apertura', event.target.value)}
              placeholder="Describe el motivo inicial del caso."
              required
            />
          </label>

          <label>
            Objetivo de trabajo
            <textarea
              disabled={guardando}
              value={formulario.objetivo_trabajo}
              onChange={(event) => actualizarFormulario('objetivo_trabajo', event.target.value)}
              placeholder="Objetivo terapéutico o resultado esperado."
            />
          </label>

          <label>
            Descripción general
            <textarea
              disabled={guardando}
              value={formulario.descripcion_general}
              onChange={(event) => actualizarFormulario('descripcion_general', event.target.value)}
              placeholder="Contexto, antecedentes o alcance inicial."
            />
          </label>
        </>
      )
    }

    return (
      <>
        <label className="casos-checkbox-card">
          <input
            checked={formulario.requiere_seguimiento}
            disabled={guardando}
            type="checkbox"
            onChange={(event) => actualizarFormulario('requiere_seguimiento', event.target.checked)}
          />
          <span>Este caso requiere seguimiento</span>
        </label>

        <label>
          Notas de seguimiento
          <textarea
            disabled={guardando}
            value={formulario.notas_seguimiento}
            onChange={(event) => actualizarFormulario('notas_seguimiento', event.target.value)}
            placeholder="Próxima acción, pendiente o criterio de seguimiento."
          />
        </label>
      </>
    )
  }

  function renderPasoFormulario(paso: PasoCasoConfig) {
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
              <p>{obtenerResumenPaso(paso.clave, formulario, pacienteSeleccionado, consultaSeleccionada, evaluacionSeleccionada)}</p>
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

  useEffect(() => {
    const cargaInicial = window.setTimeout(() => {
      void cargarBaseCasos()
    }, 0)

    return () => window.clearTimeout(cargaInicial)
  }, [])

  return (
    <main className="pacientes-shell pacientes-shell--command casos-page">
      <section className="pacientes-command-topbar">
        <div className="pacientes-command-title">
          <span className="modulo-badge">Módulo clínico</span>
          <h1>Casos</h1>
          <p>Casos reales conectados a public.casos, con paciente directo y origen clínico opcional.</p>
        </div>

        <section className="pacientes-metricas-rail" aria-label="Métricas de casos">
          {metricas.map((metrica) => (
            <article className="metrica-rail-card" key={metrica.etiqueta}>
              <span className="metrica-icon" aria-hidden="true">◇</span>
              <div>
                <strong>{metrica.valor}</strong>
                <span>{metrica.etiqueta}</span>
                <p>{metrica.detalle}</p>
              </div>
            </article>
          ))}
        </section>
      </section>

      <section className="pacientes-command-grid">
        <aside className="pacientes-directory-panel" aria-label="Listado de casos">
          <div className="panel-heading panel-heading--compact">
            <div>
              <span className="panel-kicker">Directorio</span>
              <h2>Casos registrados</h2>
            </div>
            <strong>{casosFiltrados.length}</strong>
          </div>

          <label className="buscador-pacientes buscador-pacientes--compact">
            <span>Buscar</span>
            <input
              placeholder="Paciente, nombre, motivo, tipo o estado"
              type="search"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
            />
          </label>

          {casosFiltrados.length === 0 ? (
            <div className="estado-listado estado-listado--vacio">
              <strong>{cargando ? 'Cargando casos' : 'Aún no hay casos en esta vista'}</strong>
              <p>{cargando ? 'Consultando pacientes, consultas, evaluaciones y casos reales.' : 'Crea el primer caso desde el formulario de ingreso.'}</p>
            </div>
          ) : (
            <div className="pacientes-cards pacientes-cards--compact" aria-live="polite">
              {casosFiltrados.map((caso) => {
                const paciente = pacientesPorId.get(caso.paciente_id)
                const consulta = caso.consulta_id ? consultasPorId.get(caso.consulta_id) : undefined
                const evaluacion = caso.evaluacion_id ? evaluacionesPorId.get(caso.evaluacion_id) : undefined

                return (
                  <article className="paciente-card paciente-card--compact" key={caso.id_caso}>
                    <div className="paciente-avatar" aria-hidden="true">C</div>
                    <div className="paciente-card__body">
                      <div className="paciente-card__topline">
                        <div>
                          <h3>{caso.nombre_caso}</h3>
                          <p className="paciente-card__contact-line">
                            {obtenerNombrePaciente(paciente)} · abierto el {formatearFecha(caso.fecha_apertura)}
                          </p>
                        </div>
                        <span className={`estado-badge estado-badge--${estadoBadgeVisual(caso.estado_caso)}`}>
                          {caso.estado_caso}
                        </span>
                      </div>

                      <dl className="paciente-card__details paciente-card__details--inline casos-card-details">
                        <div>
                          <dt>Tipo</dt>
                          <dd>{caso.tipo_caso}</dd>
                        </div>
                        <div>
                          <dt>Prioridad</dt>
                          <dd>{caso.prioridad}</dd>
                        </div>
                        <div>
                          <dt>Consulta</dt>
                          <dd>{consulta ? formatearFecha(consulta.fecha_consulta) : 'Sin vínculo'}</dd>
                        </div>
                        <div>
                          <dt>Evaluación</dt>
                          <dd>{evaluacion ? formatearFecha(evaluacion.fecha_evaluacion) : 'Sin vínculo'}</dd>
                        </div>
                      </dl>
                      <Link className="abrir-ficha-caso" to={`/casos/${caso.id_caso}`}>Abrir ficha</Link>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </aside>

        <section className="pacientes-intake-panel" aria-label="Nuevo caso">
          <div className="form-panel-header form-panel-header--command">
            <div className="form-panel-title">
              <span className="form-panel-icon" aria-hidden="true">C</span>
              <div>
                <span className="panel-kicker">Ficha de caso</span>
                <h2>Nuevo caso</h2>
                <p>Formulario progresivo con avance automático por secciones.</p>
              </div>
            </div>
            <button className="guardar-paciente" disabled={guardando || pacientes.length === 0} form="caso-form" type="submit">
              {guardando ? 'Guardando...' : 'Guardar caso'}
            </button>
          </div>

          <div className="intake-command-layout">
            <form
              className="formulario-ficha formulario-ficha--command"
              id="caso-form"
              onKeyDown={manejarEnterFormulario}
              onSubmit={guardarCaso}
            >
              {pasosCaso.map((paso) => renderPasoFormulario(paso))}
            </form>

            <aside className="preview-paciente preview-paciente--command" aria-label="Preview del caso">
              <div className="preview-avatar" aria-hidden="true">C</div>
              <div className="preview-heading">
                <span>Preview vivo</span>
                <h3>{formulario.nombre_caso || 'Nuevo caso'}</h3>
                <p>{obtenerNombrePaciente(pacienteSeleccionado)}</p>
              </div>
              <span className={`estado-badge estado-badge--${estadoBadgeVisual(formulario.estado_caso)}`}>
                {formulario.estado_caso}
              </span>
              <div className="preview-data preview-data--command">
                <p><strong>Tipo</strong> <span>{formulario.tipo_caso}</span></p>
                <p><strong>Prioridad</strong> <span>{formulario.prioridad}</span></p>
                <p><strong>Consulta</strong> <span>{consultaSeleccionada ? formatearFecha(consultaSeleccionada.fecha_consulta) : 'Sin vínculo'}</span></p>
                <p><strong>Evaluación</strong> <span>{evaluacionSeleccionada ? formatearFecha(evaluacionSeleccionada.fecha_evaluacion) : 'Sin vínculo'}</span></p>
                <p><strong>Motivo</strong> <span>{formulario.motivo_apertura || 'Pendiente'}</span></p>
              </div>
              <div className="preview-help">El caso se guardará usando únicamente columnas reales de public.casos.</div>
            </aside>
          </div>

          {mensaje && <p className={mensaje.startsWith('Error') ? 'mensaje mensaje--error' : 'mensaje'}>{mensaje}</p>}
        </section>
      </section>
    </main>
  )
}

export default CasosPage
