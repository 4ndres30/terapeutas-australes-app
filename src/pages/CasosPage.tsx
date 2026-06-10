import type { FormEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import './CasosPage.css'

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

function CasosPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([])
  const [casos, setCasos] = useState<Caso[]>([])
  const [busqueda, setBusqueda] = useState('')
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

  function actualizarFormulario(campo: keyof FormularioCaso, valor: string | boolean) {
    setFormulario((actual) => ({ ...actual, [campo]: valor }))
  }

  function actualizarPaciente(pacienteId: string) {
    setFormulario((actual) => ({
      ...actual,
      paciente_id: pacienteId,
      consulta_id: '',
      evaluacion_id: '',
    }))
  }

  function actualizarEvaluacion(evaluacionId: string) {
    const evaluacion = evaluaciones.find((item) => item.id_evaluacion === evaluacionId)

    setFormulario((actual) => ({
      ...actual,
      evaluacion_id: evaluacionId,
      consulta_id: evaluacion?.consulta_id || actual.consulta_id,
    }))
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

  function validarFormulario() {
    if (pacientes.length === 0) {
      return 'Error: primero debes crear un paciente antes de abrir un caso.'
    }

    if (!formulario.paciente_id) {
      return 'Error: selecciona el paciente asociado al caso.'
    }

    if (!formulario.nombre_caso.trim() || !formulario.motivo_apertura.trim()) {
      return 'Error: completa el nombre del caso y el motivo de apertura.'
    }

    if (!formulario.fecha_apertura) {
      return 'Error: selecciona la fecha de apertura del caso.'
    }

    if (formulario.consulta_id) {
      const consulta = consultasPorId.get(formulario.consulta_id)

      if (!consulta || consulta.paciente_id !== formulario.paciente_id) {
        return 'Error: la consulta seleccionada no pertenece al paciente del caso.'
      }
    }

    if (formulario.evaluacion_id) {
      const evaluacion = evaluacionesPorId.get(formulario.evaluacion_id)

      if (!evaluacion || evaluacion.paciente_id !== formulario.paciente_id) {
        return 'Error: la evaluación seleccionada no pertenece al paciente del caso.'
      }

      if (formulario.consulta_id && evaluacion.consulta_id !== formulario.consulta_id) {
        return 'Error: la evaluación seleccionada pertenece a otra consulta.'
      }
    }

    const duplicado = casos.some((caso) => (
      caso.paciente_id === formulario.paciente_id
      && normalizarTexto(caso.nombre_caso) === normalizarTexto(formulario.nombre_caso.trim())
      && caso.estado_caso !== 'Cerrado'
      && caso.estado_caso !== 'Anulado'
    ))

    if (duplicado) {
      return 'Error: ya existe un caso abierto o en proceso con ese nombre para este paciente.'
    }

    return ''
  }

  async function guardarCaso(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const errorValidacion = validarFormulario()

    if (errorValidacion) {
      setMensaje(errorValidacion)
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
    setMensaje('Caso guardado correctamente')
    setGuardando(false)
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
          <p>Casos reales conectados a `public.casos`, con paciente directo y origen clínico opcional.</p>
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
                <p>Apertura vinculada a `public.casos` con columnas reales.</p>
              </div>
            </div>
            <button className="guardar-paciente" disabled={guardando || pacientes.length === 0} form="caso-form" type="submit">
              {guardando ? 'Guardando...' : 'Guardar caso'}
            </button>
          </div>

          <div className="intake-command-layout">
            <form className="formulario-ficha formulario-ficha--command" id="caso-form" onSubmit={guardarCaso}>
              <section className="form-section form-section--active">
                <div className="form-section__header">
                  <span>01</span>
                  <div>
                    <h3>Paciente y origen</h3>
                    <p>`casos.paciente_id` es obligatorio. Consulta y evaluación son vínculos opcionales.</p>
                  </div>
                </div>

                <div className="form-grid form-grid--command">
                  <label>
                    Paciente *
                    <select value={formulario.paciente_id} onChange={(event) => actualizarPaciente(event.target.value)} required>
                      <option value="">Seleccionar paciente</option>
                      {pacientes.map((paciente) => (
                        <option key={paciente.id} value={paciente.id}>{obtenerNombrePaciente(paciente)}</option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Consulta asociada
                    <select
                      disabled={!formulario.paciente_id || consultasPaciente.length === 0}
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
                      disabled={!formulario.paciente_id || evaluacionesPaciente.length === 0}
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
                      required
                      type="date"
                      value={formulario.fecha_apertura}
                      onChange={(event) => actualizarFormulario('fecha_apertura', event.target.value)}
                    />
                  </label>
                </div>

                {formulario.paciente_id && consultasPaciente.length === 0 && evaluacionesPaciente.length === 0 && (
                  <p className="casos-inline-note">
                    Este paciente no tiene consultas/evaluaciones asociadas. La tabla `casos` permite abrir el caso con paciente directo.
                  </p>
                )}
              </section>

              <section className="form-section form-section--active">
                <div className="form-section__header">
                  <span>02</span>
                  <div>
                    <h3>Datos del caso</h3>
                    <p>Usa los valores exactos permitidos por los checks de `public.casos`.</p>
                  </div>
                </div>

                <div className="form-grid form-grid--command">
                  <label>
                    Nombre del caso *
                    <input
                      value={formulario.nombre_caso}
                      onChange={(event) => actualizarFormulario('nombre_caso', event.target.value)}
                      placeholder="Ej: Bloqueo familiar recurrente"
                      required
                    />
                  </label>

                  <label>
                    Tipo de caso *
                    <select value={formulario.tipo_caso} onChange={(event) => actualizarFormulario('tipo_caso', event.target.value as TipoCaso)} required>
                      {tiposCaso.map((tipo) => (
                        <option key={tipo} value={tipo}>{tipo}</option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Prioridad *
                    <select value={formulario.prioridad} onChange={(event) => actualizarFormulario('prioridad', event.target.value as PrioridadCaso)} required>
                      {prioridadesCaso.map((prioridad) => (
                        <option key={prioridad} value={prioridad}>{prioridad}</option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Estado *
                    <select value={formulario.estado_caso} onChange={(event) => actualizarFormulario('estado_caso', event.target.value as EstadoCaso)} required>
                      {estadosCaso.map((estado) => (
                        <option key={estado} value={estado}>{estado}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <label>
                  Motivo de apertura *
                  <textarea
                    value={formulario.motivo_apertura}
                    onChange={(event) => actualizarFormulario('motivo_apertura', event.target.value)}
                    placeholder="Describe el motivo inicial del caso."
                    required
                  />
                </label>

                <label>
                  Objetivo de trabajo
                  <textarea
                    value={formulario.objetivo_trabajo}
                    onChange={(event) => actualizarFormulario('objetivo_trabajo', event.target.value)}
                    placeholder="Objetivo terapéutico o resultado esperado."
                  />
                </label>

                <label>
                  Descripción general
                  <textarea
                    value={formulario.descripcion_general}
                    onChange={(event) => actualizarFormulario('descripcion_general', event.target.value)}
                    placeholder="Contexto, antecedentes o alcance inicial."
                  />
                </label>
              </section>

              <section className="form-section form-section--active">
                <div className="form-section__header">
                  <span>03</span>
                  <div>
                    <h3>Seguimiento</h3>
                    <p>Campos reales: `requiere_seguimiento` y `notas_seguimiento`.</p>
                  </div>
                </div>

                <label className="casos-checkbox-card">
                  <input
                    checked={formulario.requiere_seguimiento}
                    type="checkbox"
                    onChange={(event) => actualizarFormulario('requiere_seguimiento', event.target.checked)}
                  />
                  <span>Este caso requiere seguimiento</span>
                </label>

                <label>
                  Notas de seguimiento
                  <textarea
                    value={formulario.notas_seguimiento}
                    onChange={(event) => actualizarFormulario('notas_seguimiento', event.target.value)}
                    placeholder="Próxima acción, pendiente o criterio de seguimiento."
                  />
                </label>
              </section>
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
              <div className="preview-help">El caso se guardará usando únicamente columnas reales de `public.casos`.</div>
            </aside>
          </div>

          {mensaje && <p className={mensaje.startsWith('Error') ? 'mensaje mensaje--error' : 'mensaje'}>{mensaje}</p>}
        </section>
      </section>
    </main>
  )
}

export default CasosPage
