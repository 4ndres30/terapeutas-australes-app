import type { FormEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import './ClinicalModuleBase.css'

type Paciente = {
  id: string
  nombres: string
  apellidos: string
}

type Consulta = {
  id_consulta: string
  paciente_id: string
  fecha_consulta: string
  tipo_consulta: string
  estado_consulta: string
  motivo_consulta: string
}

type DecisionRevision = 'Pendiente' | 'Sí requiere revisión' | 'No requiere revisión'
type EstadoEvaluacion = 'Abierta' | 'Completada' | 'Anulada'

type Evaluacion = {
  id_evaluacion: string
  paciente_id: string
  consulta_id: string
  fecha_evaluacion: string
  hora_evaluacion: string
  relato_antecedentes: string
  sintomas_reportados: string | null
  hechos_clave: string | null
  personas_mencionadas: string | null
  decision_revision: DecisionRevision
  fundamento_decision: string | null
  notas_internas: string | null
  estado_evaluacion: EstadoEvaluacion
  created_at: string
}

type FormularioEvaluacion = {
  paciente_id: string
  consulta_id: string
  fecha_evaluacion: string
  relato_antecedentes: string
  sintomas_reportados: string
  hechos_clave: string
  personas_mencionadas: string
  decision_revision: DecisionRevision
  fundamento_decision: string
  notas_internas: string
  estado_evaluacion: EstadoEvaluacion
}

const EVALUACION_SELECT = [
  'id_evaluacion',
  'paciente_id',
  'consulta_id',
  'fecha_evaluacion',
  'hora_evaluacion',
  'relato_antecedentes',
  'sintomas_reportados',
  'hechos_clave',
  'personas_mencionadas',
  'decision_revision',
  'fundamento_decision',
  'notas_internas',
  'estado_evaluacion',
  'created_at',
].join(', ')

const decisionesRevision: DecisionRevision[] = ['Pendiente', 'Sí requiere revisión', 'No requiere revisión']
const estadosEvaluacion: EstadoEvaluacion[] = ['Abierta', 'Completada', 'Anulada']

function fechaHoy() {
  return new Date().toISOString().slice(0, 10)
}

function crearFormularioInicial(): FormularioEvaluacion {
  return {
    paciente_id: '',
    consulta_id: '',
    fecha_evaluacion: fechaHoy(),
    relato_antecedentes: '',
    sintomas_reportados: '',
    hechos_clave: '',
    personas_mencionadas: '',
    decision_revision: 'Pendiente',
    fundamento_decision: '',
    notas_internas: '',
    estado_evaluacion: 'Abierta',
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

function formatearFecha(fecha: string) {
  if (!fecha) {
    return 'Sin fecha'
  }

  const normalizada = fecha.includes('T') ? fecha : `${fecha}T00:00:00`
  const fechaEvaluacion = new Date(normalizada)

  if (Number.isNaN(fechaEvaluacion.getTime())) {
    return 'Sin fecha'
  }

  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(fechaEvaluacion)
}

function textoCorto(texto: string, largo = 120) {
  const limpio = texto.trim()
  return limpio.length > largo ? `${limpio.slice(0, largo - 1)}...` : limpio
}

function resumenConsulta(consulta: Consulta, pacientesPorId: Map<string, Paciente>) {
  return `${nombrePaciente(pacientesPorId.get(consulta.paciente_id))} · ${formatearFecha(consulta.fecha_consulta)} · ${consulta.tipo_consulta}`
}

function validarFormulario(formulario: FormularioEvaluacion, consultas: Consulta[]) {
  if (consultas.length === 0) {
    return 'Para crear una evaluación primero debes crear una consulta asociada al paciente.'
  }

  if (!formulario.consulta_id || !formulario.paciente_id) {
    return 'Selecciona la consulta asociada a esta evaluación.'
  }

  const consulta = consultas.find((item) => item.id_consulta === formulario.consulta_id)

  if (!consulta || consulta.paciente_id !== formulario.paciente_id) {
    return 'La consulta seleccionada no coincide con el paciente de la evaluación.'
  }

  if (!formulario.fecha_evaluacion) {
    return 'Selecciona la fecha de evaluación.'
  }

  if (!formulario.relato_antecedentes.trim()) {
    return 'Registra el relato de antecedentes de la evaluación.'
  }

  return ''
}

function EvaluacionesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([])
  const [formulario, setFormulario] = useState<FormularioEvaluacion>(() => crearFormularioInicial())
  const [busqueda, setBusqueda] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)

  const pacientesPorId = useMemo(() => new Map(pacientes.map((paciente) => [paciente.id, paciente])), [pacientes])
  const consultasPorId = useMemo(() => new Map(consultas.map((consulta) => [consulta.id_consulta, consulta])), [consultas])
  const consultasDisponibles = useMemo(() => (
    formulario.paciente_id ? consultas.filter((consulta) => consulta.paciente_id === formulario.paciente_id) : consultas
  ), [consultas, formulario.paciente_id])

  const evaluacionesFiltradas = useMemo(() => {
    if (!busqueda.trim()) {
      return evaluaciones
    }

    const filtro = normalizarTexto(busqueda.trim())

    return evaluaciones.filter((evaluacion) => {
      const consulta = consultasPorId.get(evaluacion.consulta_id)
      const texto = [
        nombrePaciente(pacientesPorId.get(evaluacion.paciente_id)),
        consulta?.tipo_consulta || '',
        evaluacion.relato_antecedentes,
        evaluacion.sintomas_reportados || '',
        evaluacion.decision_revision,
        evaluacion.estado_evaluacion,
      ].join(' ')

      return normalizarTexto(texto).includes(filtro)
    })
  }, [busqueda, consultasPorId, evaluaciones, pacientesPorId])

  const metricas = [
    { etiqueta: 'Total', valor: evaluaciones.length, detalle: 'Evaluaciones reales' },
    { etiqueta: 'Abiertas', valor: evaluaciones.filter((evaluacion) => evaluacion.estado_evaluacion === 'Abierta').length, detalle: 'En seguimiento' },
    { etiqueta: 'Completadas', valor: evaluaciones.filter((evaluacion) => evaluacion.estado_evaluacion === 'Completada').length, detalle: 'Cerradas clínicamente' },
    { etiqueta: 'Revisión', valor: evaluaciones.filter((evaluacion) => evaluacion.decision_revision === 'Sí requiere revisión').length, detalle: 'Requieren revisión' },
  ]

  function actualizarFormulario(campo: keyof FormularioEvaluacion, valor: string) {
    setFormulario((actual) => ({ ...actual, [campo]: valor }))
  }

  function actualizarConsulta(consultaId: string) {
    const consulta = consultas.find((item) => item.id_consulta === consultaId)

    setFormulario((actual) => ({
      ...actual,
      consulta_id: consultaId,
      paciente_id: consulta?.paciente_id || actual.paciente_id,
    }))
  }

  function actualizarPaciente(pacienteId: string) {
    setFormulario((actual) => ({ ...actual, paciente_id: pacienteId, consulta_id: '' }))
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
      .select(EVALUACION_SELECT)
      .order('fecha_evaluacion', { ascending: false })
      .order('created_at', { ascending: false })

    if (evaluacionesError) {
      setMensaje(`Error al cargar evaluaciones: ${evaluacionesError.message}`)
      setCargando(false)
      return
    }

    setPacientes((pacientesData || []) as Paciente[])
    setConsultas((consultasData || []) as Consulta[])
    setEvaluaciones((evaluacionesData || []) as unknown as Evaluacion[])
    setCargando(false)
  }

  async function guardarEvaluacion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const errorFormulario = validarFormulario(formulario, consultas)

    if (errorFormulario) {
      setMensaje(`Error: ${errorFormulario}`)
      return
    }

    setGuardando(true)
    setMensaje('Guardando evaluación...')

    const payload = {
      paciente_id: formulario.paciente_id,
      consulta_id: formulario.consulta_id,
      fecha_evaluacion: formulario.fecha_evaluacion,
      relato_antecedentes: formulario.relato_antecedentes.trim(),
      sintomas_reportados: formulario.sintomas_reportados.trim() || null,
      hechos_clave: formulario.hechos_clave.trim() || null,
      personas_mencionadas: formulario.personas_mencionadas.trim() || null,
      decision_revision: formulario.decision_revision,
      fundamento_decision: formulario.fundamento_decision.trim() || null,
      notas_internas: formulario.notas_internas.trim() || null,
      estado_evaluacion: formulario.estado_evaluacion,
    }

    const { data, error } = await supabase
      .from('evaluaciones')
      .insert(payload)
      .select(EVALUACION_SELECT)
      .single()

    if (error) {
      setMensaje(`Error al guardar evaluación: ${error.message}`)
      setGuardando(false)
      return
    }

    setEvaluaciones((actuales) => [data as unknown as Evaluacion, ...actuales])
    setFormulario(crearFormularioInicial())
    setMensaje('Evaluación guardada correctamente')
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
          <h1>Evaluaciones</h1>
          <p>Base conectada a public.evaluaciones. Cada evaluación nace desde una consulta real.</p>
        </div>

        <section className="clinical-metrics" aria-label="Métricas de evaluaciones">
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
        <section className="clinical-panel" aria-label="Directorio de evaluaciones">
          <div className="clinical-panel__header">
            <div>
              <span className="clinical-kicker">Directorio</span>
              <h2>Evaluaciones registradas</h2>
              <p>Lectura directa desde Supabase local.</p>
            </div>
            <span className="clinical-count">{evaluacionesFiltradas.length}</span>
          </div>

          <label className="clinical-search">
            <span>Buscar</span>
            <input
              className="clinical-input"
              placeholder="Paciente, relato, síntomas, decisión o estado"
              type="search"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
            />
          </label>

          {evaluacionesFiltradas.length === 0 ? (
            <div className="clinical-empty">
              <strong>{cargando ? 'Cargando evaluaciones' : 'Sin evaluaciones registradas'}</strong>
              <p>{cargando ? 'Consultando tablas reales.' : 'Crea una evaluación cuando exista una consulta asociada.'}</p>
            </div>
          ) : (
            <div className="clinical-list">
              {evaluacionesFiltradas.map((evaluacion) => {
                const consulta = consultasPorId.get(evaluacion.consulta_id)

                return (
                  <article className="clinical-card" key={evaluacion.id_evaluacion}>
                    <div className="clinical-card__top">
                      <div>
                        <h3>{nombrePaciente(pacientesPorId.get(evaluacion.paciente_id))}</h3>
                        <small>{formatearFecha(evaluacion.fecha_evaluacion)} · {consulta?.tipo_consulta || 'Consulta no encontrada'}</small>
                      </div>
                      <span className="clinical-badge">{evaluacion.estado_evaluacion}</span>
                    </div>
                    <p>{textoCorto(evaluacion.relato_antecedentes)}</p>
                    <dl className="clinical-details">
                      <div>
                        <dt>Decisión</dt>
                        <dd>{evaluacion.decision_revision}</dd>
                      </div>
                      <div>
                        <dt>Síntomas</dt>
                        <dd>{evaluacion.sintomas_reportados ? 'Registrados' : 'Pendiente'}</dd>
                      </div>
                      <div>
                        <dt>Consulta</dt>
                        <dd>{consulta ? formatearFecha(consulta.fecha_consulta) : 'Sin vínculo'}</dd>
                      </div>
                    </dl>
                  </article>
                )
              })}
            </div>
          )}
        </section>

        <section className="clinical-form-panel" aria-label="Nueva evaluación">
          <div className="clinical-form-panel__header">
            <div>
              <span className="clinical-kicker">Formulario base</span>
              <h2>Nueva evaluación</h2>
              <p>Respeta la relación obligatoria evaluación → consulta → paciente.</p>
            </div>
          </div>

          {consultas.length === 0 && (
            <p className="clinical-note">Para crear una evaluación primero debes crear una consulta asociada al paciente.</p>
          )}

          <form className="clinical-form" onSubmit={guardarEvaluacion}>
            <label className="clinical-field">
              <span>Paciente</span>
              <select
                className="clinical-select"
                disabled={guardando || consultas.length === 0}
                value={formulario.paciente_id}
                onChange={(event) => actualizarPaciente(event.target.value)}
              >
                <option value="">Todos los pacientes con consulta</option>
                {pacientes.map((paciente) => (
                  <option key={paciente.id} value={paciente.id}>{nombrePaciente(paciente)}</option>
                ))}
              </select>
            </label>

            <label className="clinical-field">
              <span>Consulta asociada *</span>
              <select
                className="clinical-select"
                disabled={guardando || consultasDisponibles.length === 0}
                value={formulario.consulta_id}
                onChange={(event) => actualizarConsulta(event.target.value)}
                required
              >
                <option value="">Seleccionar consulta</option>
                {consultasDisponibles.map((consulta) => (
                  <option key={consulta.id_consulta} value={consulta.id_consulta}>{resumenConsulta(consulta, pacientesPorId)}</option>
                ))}
              </select>
            </label>

            {formulario.paciente_id && consultasDisponibles.length === 0 && (
              <p className="clinical-note">Para crear una evaluación primero debes crear una consulta asociada al paciente.</p>
            )}

            <div className="clinical-grid">
              <label className="clinical-field">
                <span>Fecha *</span>
                <input
                  className="clinical-input"
                  disabled={guardando}
                  type="date"
                  value={formulario.fecha_evaluacion}
                  onChange={(event) => actualizarFormulario('fecha_evaluacion', event.target.value)}
                  required
                />
              </label>

              <label className="clinical-field">
                <span>Estado *</span>
                <select
                  className="clinical-select"
                  disabled={guardando}
                  value={formulario.estado_evaluacion}
                  onChange={(event) => actualizarFormulario('estado_evaluacion', event.target.value as EstadoEvaluacion)}
                  required
                >
                  {estadosEvaluacion.map((estado) => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="clinical-field">
              <span>Decisión de revisión *</span>
              <select
                className="clinical-select"
                disabled={guardando}
                value={formulario.decision_revision}
                onChange={(event) => actualizarFormulario('decision_revision', event.target.value as DecisionRevision)}
                required
              >
                {decisionesRevision.map((decision) => (
                  <option key={decision} value={decision}>{decision}</option>
                ))}
              </select>
            </label>

            <label className="clinical-field">
              <span>Relato antecedentes *</span>
              <textarea
                className="clinical-textarea"
                disabled={guardando}
                value={formulario.relato_antecedentes}
                onChange={(event) => actualizarFormulario('relato_antecedentes', event.target.value)}
                placeholder="Relato inicial y antecedentes relevantes."
                required
              />
            </label>

            <label className="clinical-field">
              <span>Síntomas reportados</span>
              <textarea
                className="clinical-textarea"
                disabled={guardando}
                value={formulario.sintomas_reportados}
                onChange={(event) => actualizarFormulario('sintomas_reportados', event.target.value)}
              />
            </label>

            <label className="clinical-field">
              <span>Hechos clave</span>
              <textarea
                className="clinical-textarea"
                disabled={guardando}
                value={formulario.hechos_clave}
                onChange={(event) => actualizarFormulario('hechos_clave', event.target.value)}
              />
            </label>

            <label className="clinical-field">
              <span>Personas mencionadas</span>
              <textarea
                className="clinical-textarea"
                disabled={guardando}
                value={formulario.personas_mencionadas}
                onChange={(event) => actualizarFormulario('personas_mencionadas', event.target.value)}
              />
            </label>

            <label className="clinical-field">
              <span>Fundamento decisión</span>
              <textarea
                className="clinical-textarea"
                disabled={guardando}
                value={formulario.fundamento_decision}
                onChange={(event) => actualizarFormulario('fundamento_decision', event.target.value)}
              />
            </label>

            <label className="clinical-field">
              <span>Notas internas</span>
              <textarea
                className="clinical-textarea"
                disabled={guardando}
                value={formulario.notas_internas}
                onChange={(event) => actualizarFormulario('notas_internas', event.target.value)}
              />
            </label>

            <button className="clinical-button" disabled={guardando || consultas.length === 0} type="submit">
              {guardando ? 'Guardando...' : 'Guardar evaluación'}
            </button>
          </form>

          {mensaje && <p className={mensaje.startsWith('Error') ? 'clinical-message clinical-message--error' : 'clinical-message'}>{mensaje}</p>}
        </section>
      </section>
    </main>
  )
}

export default EvaluacionesPage
