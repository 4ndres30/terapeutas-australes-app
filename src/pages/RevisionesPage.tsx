import type { FormEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import './ClinicalModuleBase.css'

type Paciente = {
  id: string
  nombres: string
  apellidos: string
}

type Caso = {
  id_caso: string
  paciente_id: string
  consulta_id: string | null
  evaluacion_id: string | null
  fecha_apertura: string
  nombre_caso: string
  estado_caso: string
}

type Consulta = {
  id_consulta: string
  paciente_id: string
  fecha_consulta: string
  tipo_consulta: string
}

type Evaluacion = {
  id_evaluacion: string
  paciente_id: string
  consulta_id: string
  fecha_evaluacion: string
  estado_evaluacion: string
}

type TipoRevision = 'Inicial' | 'Seguimiento' | 'Profundización' | 'Control' | 'Cierre' | 'Urgencia' | 'Interna' | 'Otro'
type ModalidadRevision = 'Presencial' | 'Online' | 'WhatsApp' | 'Llamada telefónica' | 'Videollamada' | 'Interna'
type MetodoRevision = 'Radiestesia' | 'Canalización' | 'Radiestesia y canalización' | 'Tarot' | 'Observación interna' | 'Mixta' | 'Otro'
type AlcanceRevision = 'Caso completo' | 'Elementos seleccionados' | 'Seguimiento de pendientes' | 'Cierre general'
type EstadoRevision = 'Pendiente' | 'En proceso' | 'Completada' | 'Requiere seguimiento' | 'Anulada'

type Revision = {
  id_revision: string
  paciente_id: string
  caso_id: string
  consulta_id: string | null
  evaluacion_id: string | null
  fecha_revision: string
  hora_inicio: string | null
  hora_termino: string | null
  numero_revision: number
  tipo_revision: TipoRevision
  modalidad: ModalidadRevision
  metodo_revision: MetodoRevision
  alcance_revision: AlcanceRevision
  objetivo_revision: string
  resumen_general: string | null
  resultado_general: string | null
  requiere_seguimiento: boolean
  proxima_accion: string | null
  estado_revision: EstadoRevision
  notas_internas: string | null
  created_at: string
}

type FormularioRevision = {
  paciente_id: string
  caso_id: string
  consulta_id: string
  evaluacion_id: string
  fecha_revision: string
  hora_inicio: string
  hora_termino: string
  numero_revision: string
  tipo_revision: TipoRevision
  modalidad: ModalidadRevision
  metodo_revision: MetodoRevision
  alcance_revision: AlcanceRevision
  objetivo_revision: string
  resumen_general: string
  resultado_general: string
  requiere_seguimiento: boolean
  proxima_accion: string
  estado_revision: EstadoRevision
  notas_internas: string
}

const REVISION_SELECT = [
  'id_revision',
  'paciente_id',
  'caso_id',
  'consulta_id',
  'evaluacion_id',
  'fecha_revision',
  'hora_inicio',
  'hora_termino',
  'numero_revision',
  'tipo_revision',
  'modalidad',
  'metodo_revision',
  'alcance_revision',
  'objetivo_revision',
  'resumen_general',
  'resultado_general',
  'requiere_seguimiento',
  'proxima_accion',
  'estado_revision',
  'notas_internas',
  'created_at',
].join(', ')

const tiposRevision: TipoRevision[] = ['Inicial', 'Seguimiento', 'Profundización', 'Control', 'Cierre', 'Urgencia', 'Interna', 'Otro']
const modalidadesRevision: ModalidadRevision[] = ['Presencial', 'Online', 'WhatsApp', 'Llamada telefónica', 'Videollamada', 'Interna']
const metodosRevision: MetodoRevision[] = ['Radiestesia', 'Canalización', 'Radiestesia y canalización', 'Tarot', 'Observación interna', 'Mixta', 'Otro']
const alcancesRevision: AlcanceRevision[] = ['Caso completo', 'Elementos seleccionados', 'Seguimiento de pendientes', 'Cierre general']
const estadosRevision: EstadoRevision[] = ['Pendiente', 'En proceso', 'Completada', 'Requiere seguimiento', 'Anulada']

function fechaHoy() {
  return new Date().toISOString().slice(0, 10)
}

function crearFormularioInicial(): FormularioRevision {
  return {
    paciente_id: '',
    caso_id: '',
    consulta_id: '',
    evaluacion_id: '',
    fecha_revision: fechaHoy(),
    hora_inicio: '',
    hora_termino: '',
    numero_revision: '1',
    tipo_revision: 'Inicial',
    modalidad: 'Interna',
    metodo_revision: 'Radiestesia',
    alcance_revision: 'Caso completo',
    objetivo_revision: '',
    resumen_general: '',
    resultado_general: '',
    requiere_seguimiento: false,
    proxima_accion: '',
    estado_revision: 'Pendiente',
    notas_internas: '',
  }
}

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
  const fechaRevision = new Date(normalizada)

  if (Number.isNaN(fechaRevision.getTime())) {
    return 'Sin fecha'
  }

  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(fechaRevision)
}

function textoCorto(texto: string, largo = 120) {
  const limpio = texto.trim()
  return limpio.length > largo ? `${limpio.slice(0, largo - 1)}...` : limpio
}

function obtenerSiguienteNumero(casoId: string, revisiones: Revision[]) {
  const numeros = revisiones
    .filter((revision) => revision.caso_id === casoId)
    .map((revision) => revision.numero_revision)

  return String((Math.max(0, ...numeros) || 0) + 1)
}

function validarFormulario(formulario: FormularioRevision, casos: Caso[], revisiones: Revision[]) {
  if (casos.length === 0) {
    return 'Para crear una revisión primero debes crear un caso.'
  }

  const caso = casos.find((item) => item.id_caso === formulario.caso_id)

  if (!caso || !formulario.paciente_id) {
    return 'Selecciona el caso asociado a la revisión.'
  }

  if (caso.paciente_id !== formulario.paciente_id) {
    return 'El paciente de la revisión debe coincidir con el paciente del caso.'
  }

  const numeroRevision = Number(formulario.numero_revision)

  if (!Number.isInteger(numeroRevision) || numeroRevision <= 0) {
    return 'El número de revisión debe ser un entero mayor a cero.'
  }

  const numeroDuplicado = revisiones.some((revision) => (
    revision.caso_id === formulario.caso_id
    && revision.numero_revision === numeroRevision
  ))

  if (numeroDuplicado) {
    return 'Ya existe una revisión con ese número para el caso seleccionado.'
  }

  if (!formulario.fecha_revision) {
    return 'Selecciona la fecha de revisión.'
  }

  if (formulario.hora_inicio && formulario.hora_termino && formulario.hora_termino < formulario.hora_inicio) {
    return 'La hora de término no puede ser anterior a la hora de inicio.'
  }

  if (!formulario.objetivo_revision.trim()) {
    return 'Completa el objetivo de la revisión.'
  }

  return ''
}

function RevisionesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [casos, setCasos] = useState<Caso[]>([])
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([])
  const [revisiones, setRevisiones] = useState<Revision[]>([])
  const [formulario, setFormulario] = useState<FormularioRevision>(() => crearFormularioInicial())
  const [busqueda, setBusqueda] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)

  const pacientesPorId = useMemo(() => new Map(pacientes.map((paciente) => [paciente.id, paciente])), [pacientes])
  const casosPorId = useMemo(() => new Map(casos.map((caso) => [caso.id_caso, caso])), [casos])
  const consultasPorId = useMemo(() => new Map(consultas.map((consulta) => [consulta.id_consulta, consulta])), [consultas])
  const evaluacionesPorId = useMemo(() => new Map(evaluaciones.map((evaluacion) => [evaluacion.id_evaluacion, evaluacion])), [evaluaciones])
  const casoSeleccionado = casosPorId.get(formulario.caso_id)
  const consultaDisponible = casoSeleccionado?.consulta_id ? consultasPorId.get(casoSeleccionado.consulta_id) : undefined
  const evaluacionDisponible = casoSeleccionado?.evaluacion_id ? evaluacionesPorId.get(casoSeleccionado.evaluacion_id) : undefined

  const revisionesFiltradas = useMemo(() => {
    if (!busqueda.trim()) {
      return revisiones
    }

    const filtro = normalizarTexto(busqueda.trim())

    return revisiones.filter((revision) => {
      const caso = casosPorId.get(revision.caso_id)
      const texto = [
        caso?.nombre_caso || '',
        nombrePaciente(pacientesPorId.get(revision.paciente_id)),
        revision.numero_revision,
        revision.tipo_revision,
        revision.modalidad,
        revision.metodo_revision,
        revision.alcance_revision,
        revision.estado_revision,
        revision.objetivo_revision,
      ].join(' ')

      return normalizarTexto(texto).includes(filtro)
    })
  }, [busqueda, casosPorId, pacientesPorId, revisiones])

  const metricas = [
    { etiqueta: 'Total', valor: revisiones.length, detalle: 'Revisiones reales' },
    { etiqueta: 'Pendientes', valor: revisiones.filter((revision) => revision.estado_revision === 'Pendiente').length, detalle: 'Por trabajar' },
    { etiqueta: 'Completadas', valor: revisiones.filter((revision) => revision.estado_revision === 'Completada').length, detalle: 'Cerradas' },
    { etiqueta: 'Seguimiento', valor: revisiones.filter((revision) => revision.requiere_seguimiento).length, detalle: 'Con próxima acción' },
  ]

  function actualizarFormulario(campo: keyof FormularioRevision, valor: string | boolean) {
    setFormulario((actual) => ({ ...actual, [campo]: valor }))
  }

  function actualizarCaso(casoId: string) {
    const caso = casos.find((item) => item.id_caso === casoId)

    setFormulario((actual) => ({
      ...actual,
      caso_id: casoId,
      paciente_id: caso?.paciente_id || '',
      consulta_id: caso?.consulta_id || '',
      evaluacion_id: caso?.evaluacion_id || '',
      numero_revision: casoId ? obtenerSiguienteNumero(casoId, revisiones) : '1',
    }))
  }

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

    const { data: casosData, error: casosError } = await supabase
      .from('casos')
      .select('id_caso, paciente_id, consulta_id, evaluacion_id, fecha_apertura, nombre_caso, estado_caso')
      .order('created_at', { ascending: false })

    if (casosError) {
      setMensaje(`Error al cargar casos: ${casosError.message}`)
      setCargando(false)
      return
    }

    const { data: consultasData, error: consultasError } = await supabase
      .from('consultas')
      .select('id_consulta, paciente_id, fecha_consulta, tipo_consulta')
      .order('fecha_consulta', { ascending: false })

    if (consultasError) {
      setMensaje(`Error al cargar consultas: ${consultasError.message}`)
      setCargando(false)
      return
    }

    const { data: evaluacionesData, error: evaluacionesError } = await supabase
      .from('evaluaciones')
      .select('id_evaluacion, paciente_id, consulta_id, fecha_evaluacion, estado_evaluacion')
      .order('fecha_evaluacion', { ascending: false })

    if (evaluacionesError) {
      setMensaje(`Error al cargar evaluaciones: ${evaluacionesError.message}`)
      setCargando(false)
      return
    }

    const { data: revisionesData, error: revisionesError } = await supabase
      .from('revisiones')
      .select(REVISION_SELECT)
      .order('fecha_revision', { ascending: false })
      .order('created_at', { ascending: false })

    if (revisionesError) {
      setMensaje(`Error al cargar revisiones: ${revisionesError.message}`)
      setCargando(false)
      return
    }

    setPacientes((pacientesData || []) as Paciente[])
    setCasos((casosData || []) as Caso[])
    setConsultas((consultasData || []) as Consulta[])
    setEvaluaciones((evaluacionesData || []) as Evaluacion[])
    setRevisiones((revisionesData || []) as unknown as Revision[])
    setCargando(false)
  }

  async function guardarRevision(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const errorFormulario = validarFormulario(formulario, casos, revisiones)

    if (errorFormulario) {
      setMensaje(`Error: ${errorFormulario}`)
      return
    }

    setGuardando(true)
    setMensaje('Guardando revisión...')

    const payload = {
      paciente_id: formulario.paciente_id,
      caso_id: formulario.caso_id,
      consulta_id: formulario.consulta_id || null,
      evaluacion_id: formulario.evaluacion_id || null,
      fecha_revision: formulario.fecha_revision,
      hora_inicio: formulario.hora_inicio || null,
      hora_termino: formulario.hora_termino || null,
      numero_revision: Number(formulario.numero_revision),
      tipo_revision: formulario.tipo_revision,
      modalidad: formulario.modalidad,
      metodo_revision: formulario.metodo_revision,
      alcance_revision: formulario.alcance_revision,
      objetivo_revision: formulario.objetivo_revision.trim(),
      resumen_general: formulario.resumen_general.trim() || null,
      resultado_general: formulario.resultado_general.trim() || null,
      requiere_seguimiento: formulario.requiere_seguimiento,
      proxima_accion: formulario.proxima_accion.trim() || null,
      estado_revision: formulario.estado_revision,
      notas_internas: formulario.notas_internas.trim() || null,
    }

    const { data, error } = await supabase
      .from('revisiones')
      .insert(payload)
      .select(REVISION_SELECT)
      .single()

    if (error) {
      setMensaje(`Error al guardar revisión: ${error.message}`)
      setGuardando(false)
      return
    }

    setRevisiones((actuales) => [data as unknown as Revision, ...actuales])
    setFormulario(crearFormularioInicial())
    setMensaje('Revisión guardada correctamente')
    setGuardando(false)
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
          <span className="clinical-kicker">Módulo clínico</span>
          <h1>Revisiones</h1>
          <p>Revisiones reales conectadas a casos, con numeración por caso.</p>
        </div>

        <section className="clinical-metrics" aria-label="Métricas de revisiones">
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
        <section className="clinical-panel" aria-label="Directorio de revisiones">
          <div className="clinical-panel__header">
            <div>
              <span className="clinical-kicker">Directorio</span>
              <h2>Revisiones registradas</h2>
              <p>Lectura directa desde public.revisiones.</p>
            </div>
            <span className="clinical-count">{revisionesFiltradas.length}</span>
          </div>

          <label className="clinical-search">
            <span>Buscar</span>
            <input
              className="clinical-input"
              placeholder="Caso, paciente, tipo, método, alcance o estado"
              type="search"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
            />
          </label>

          {revisionesFiltradas.length === 0 ? (
            <div className="clinical-empty">
              <strong>{cargando ? 'Cargando revisiones' : 'Sin revisiones registradas'}</strong>
              <p>{cargando ? 'Consultando Supabase local.' : 'Crea una revisión cuando exista un caso asociado.'}</p>
            </div>
          ) : (
            <div className="clinical-list">
              {revisionesFiltradas.map((revision) => {
                const caso = casosPorId.get(revision.caso_id)

                return (
                  <article className="clinical-card" key={revision.id_revision}>
                    <div className="clinical-card__top">
                      <div>
                        <h3>{caso?.nombre_caso || 'Caso no encontrado'} · revisión {revision.numero_revision}</h3>
                        <small>{nombrePaciente(pacientesPorId.get(revision.paciente_id))} · {formatearFecha(revision.fecha_revision)}</small>
                      </div>
                      <span className="clinical-badge">{revision.estado_revision}</span>
                    </div>
                    <p>{textoCorto(revision.objetivo_revision)}</p>
                    <dl className="clinical-details">
                      <div>
                        <dt>Tipo</dt>
                        <dd>{revision.tipo_revision}</dd>
                      </div>
                      <div>
                        <dt>Método</dt>
                        <dd>{revision.metodo_revision}</dd>
                      </div>
                      <div>
                        <dt>Alcance</dt>
                        <dd>{revision.alcance_revision}</dd>
                      </div>
                    </dl>
                  </article>
                )
              })}
            </div>
          )}
        </section>

        <section className="clinical-form-panel" aria-label="Nueva revisión">
          <div className="clinical-form-panel__header">
            <div>
              <span className="clinical-kicker">Formulario base</span>
              <h2>Nueva revisión</h2>
              <p>Selecciona un caso real. La relación con consulta/evaluación se toma desde el caso si existe.</p>
            </div>
          </div>

          {casos.length === 0 && (
            <p className="clinical-note">Para crear una revisión primero debes crear un caso.</p>
          )}

          <form className="clinical-form" onSubmit={guardarRevision}>
            <label className="clinical-field">
              <span>Caso *</span>
              <select
                className="clinical-select"
                disabled={guardando || casos.length === 0}
                value={formulario.caso_id}
                onChange={(event) => actualizarCaso(event.target.value)}
                required
              >
                <option value="">Seleccionar caso</option>
                {casos.map((caso) => (
                  <option key={caso.id_caso} value={caso.id_caso}>{caso.nombre_caso} · {nombrePaciente(pacientesPorId.get(caso.paciente_id))}</option>
                ))}
              </select>
            </label>

            <p className="clinical-note">
              Paciente: {nombrePaciente(pacientesPorId.get(formulario.paciente_id))}. Consulta vinculada: {consultaDisponible ? formatearFecha(consultaDisponible.fecha_consulta) : 'sin consulta en el caso'}. Evaluación vinculada: {evaluacionDisponible ? formatearFecha(evaluacionDisponible.fecha_evaluacion) : 'sin evaluación en el caso'}.
            </p>

            <div className="clinical-grid">
              <label className="clinical-field">
                <span>Número *</span>
                <input
                  className="clinical-input"
                  disabled={guardando}
                  min="1"
                  type="number"
                  value={formulario.numero_revision}
                  onChange={(event) => actualizarFormulario('numero_revision', event.target.value)}
                  required
                />
              </label>

              <label className="clinical-field">
                <span>Fecha *</span>
                <input
                  className="clinical-input"
                  disabled={guardando}
                  type="date"
                  value={formulario.fecha_revision}
                  onChange={(event) => actualizarFormulario('fecha_revision', event.target.value)}
                  required
                />
              </label>
            </div>

            <div className="clinical-grid">
              <label className="clinical-field">
                <span>Tipo *</span>
                <select className="clinical-select" disabled={guardando} value={formulario.tipo_revision} onChange={(event) => actualizarFormulario('tipo_revision', event.target.value as TipoRevision)} required>
                  {tiposRevision.map((tipo) => <option key={tipo} value={tipo}>{tipo}</option>)}
                </select>
              </label>

              <label className="clinical-field">
                <span>Modalidad *</span>
                <select className="clinical-select" disabled={guardando} value={formulario.modalidad} onChange={(event) => actualizarFormulario('modalidad', event.target.value as ModalidadRevision)} required>
                  {modalidadesRevision.map((modalidad) => <option key={modalidad} value={modalidad}>{modalidad}</option>)}
                </select>
              </label>
            </div>

            <div className="clinical-grid">
              <label className="clinical-field">
                <span>Método *</span>
                <select className="clinical-select" disabled={guardando} value={formulario.metodo_revision} onChange={(event) => actualizarFormulario('metodo_revision', event.target.value as MetodoRevision)} required>
                  {metodosRevision.map((metodo) => <option key={metodo} value={metodo}>{metodo}</option>)}
                </select>
              </label>

              <label className="clinical-field">
                <span>Alcance *</span>
                <select className="clinical-select" disabled={guardando} value={formulario.alcance_revision} onChange={(event) => actualizarFormulario('alcance_revision', event.target.value as AlcanceRevision)} required>
                  {alcancesRevision.map((alcance) => <option key={alcance} value={alcance}>{alcance}</option>)}
                </select>
              </label>
            </div>

            <div className="clinical-grid">
              <label className="clinical-field">
                <span>Hora inicio</span>
                <input className="clinical-input" disabled={guardando} type="time" value={formulario.hora_inicio} onChange={(event) => actualizarFormulario('hora_inicio', event.target.value)} />
              </label>

              <label className="clinical-field">
                <span>Hora término</span>
                <input className="clinical-input" disabled={guardando} type="time" value={formulario.hora_termino} onChange={(event) => actualizarFormulario('hora_termino', event.target.value)} />
              </label>
            </div>

            <label className="clinical-field">
              <span>Estado *</span>
              <select className="clinical-select" disabled={guardando} value={formulario.estado_revision} onChange={(event) => actualizarFormulario('estado_revision', event.target.value as EstadoRevision)} required>
                {estadosRevision.map((estado) => <option key={estado} value={estado}>{estado}</option>)}
              </select>
            </label>

            <label className="clinical-field">
              <span>Objetivo *</span>
              <textarea className="clinical-textarea" disabled={guardando} value={formulario.objetivo_revision} onChange={(event) => actualizarFormulario('objetivo_revision', event.target.value)} required />
            </label>

            <label className="clinical-field">
              <span>Resumen general</span>
              <textarea className="clinical-textarea" disabled={guardando} value={formulario.resumen_general} onChange={(event) => actualizarFormulario('resumen_general', event.target.value)} />
            </label>

            <label className="clinical-field">
              <span>Resultado general</span>
              <textarea className="clinical-textarea" disabled={guardando} value={formulario.resultado_general} onChange={(event) => actualizarFormulario('resultado_general', event.target.value)} />
            </label>

            <label className="clinical-checkbox">
              <input checked={formulario.requiere_seguimiento} disabled={guardando} type="checkbox" onChange={(event) => actualizarFormulario('requiere_seguimiento', event.target.checked)} />
              <span>Requiere seguimiento</span>
            </label>

            <label className="clinical-field">
              <span>Próxima acción</span>
              <textarea className="clinical-textarea" disabled={guardando} value={formulario.proxima_accion} onChange={(event) => actualizarFormulario('proxima_accion', event.target.value)} />
            </label>

            <label className="clinical-field">
              <span>Notas internas</span>
              <textarea className="clinical-textarea" disabled={guardando} value={formulario.notas_internas} onChange={(event) => actualizarFormulario('notas_internas', event.target.value)} />
            </label>

            <button className="clinical-button" disabled={guardando || casos.length === 0} type="submit">
              {guardando ? 'Guardando...' : 'Guardar revisión'}
            </button>
          </form>

          {mensaje && <p className={mensaje.startsWith('Error') ? 'clinical-message clinical-message--error' : 'clinical-message'}>{mensaje}</p>}
        </section>
      </section>
    </main>
  )
}

export default RevisionesPage
