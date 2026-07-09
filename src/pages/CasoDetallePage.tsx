import { useCallback, useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { formatearFecha } from '../lib/format'
import DetalleRevisionesPanel from './casos/DetalleRevisionesPanel'
import ElementosCasoPanel from './casos/ElementosCasoPanel'
import PagosCasoPanel from './casos/PagosCasoPanel'
import RevisionesCasoPanel from './casos/RevisionesCasoPanel'
import TrabajosCasoPanel from './casos/TrabajosCasoPanel'
import './ClinicalModuleBase.css'
import './CasoDetallePage.css'

type Caso = {
  id_caso: string
  paciente_id: string
  consulta_id: string | null
  evaluacion_id: string | null
  fecha_apertura: string
  hora_apertura: string
  nombre_caso: string
  motivo_apertura: string
  descripcion_general: string | null
  objetivo_trabajo: string | null
  tipo_caso: string
  prioridad: string
  estado_caso: string
  requiere_seguimiento: boolean
  notas_seguimiento: string | null
  fecha_cierre: string | null
  resultado_cierre: string | null
  notas_internas: string | null
  created_at: string
  updated_at: string
}

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
  hora_inicio: string | null
  hora_termino: string | null
  tipo_consulta: string
  modalidad: string
  estado_consulta: string
  motivo_consulta: string
  resumen_consulta: string | null
  observaciones_internas: string | null
}

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
  decision_revision: string
  fundamento_decision: string | null
  notas_internas: string | null
  estado_evaluacion: string
}

const CASO_SELECT = [
  'id_caso',
  'paciente_id',
  'consulta_id',
  'evaluacion_id',
  'fecha_apertura',
  'hora_apertura',
  'nombre_caso',
  'motivo_apertura',
  'descripcion_general',
  'objetivo_trabajo',
  'tipo_caso',
  'prioridad',
  'estado_caso',
  'requiere_seguimiento',
  'notas_seguimiento',
  'fecha_cierre',
  'resultado_cierre',
  'notas_internas',
  'created_at',
  'updated_at',
].join(', ')

const CONSULTA_SELECT = [
  'id_consulta',
  'paciente_id',
  'fecha_consulta',
  'hora_inicio',
  'hora_termino',
  'tipo_consulta',
  'modalidad',
  'estado_consulta',
  'motivo_consulta',
  'resumen_consulta',
  'observaciones_internas',
].join(', ')

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
].join(', ')

function obtenerNombrePaciente(paciente: Paciente | null) {
  if (!paciente) {
    return 'Paciente no encontrado'
  }

  return `${paciente.nombres} ${paciente.apellidos}`.trim() || 'Paciente sin nombre'
}

function textoOpcional(texto: string | null | undefined, respaldo = 'Sin información registrada') {
  return texto?.trim() || respaldo
}

type TabSeccion = 'resumen' | 'elementos' | 'revisiones' | 'intervenciones' | 'pagos'

function CasoDetallePage() {
  const { id } = useParams()
  const casoId = id || ''
  const [caso, setCaso] = useState<Caso | null>(null)
  const [paciente, setPaciente] = useState<Paciente | null>(null)
  const [consulta, setConsulta] = useState<Consulta | null>(null)
  const [evaluacion, setEvaluacion] = useState<Evaluacion | null>(null)
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(true)
  const [activeTab, setActiveTab] = useState<TabSeccion>('resumen')
  const [visitedTabs, setVisitedTabs] = useState<Set<TabSeccion>>(() => new Set<TabSeccion>(['resumen']))

  const seleccionarTab = useCallback((tab: TabSeccion) => {
    setActiveTab(tab)
    setVisitedTabs((previo) => (previo.has(tab) ? previo : new Set(previo).add(tab)))
  }, [])

  const pacienteNombre = obtenerNombrePaciente(paciente)

  const cargarFichaCaso = useCallback(async () => {
    if (!casoId) {
      return
    }

    setCargando(true)
    setMensaje('')

    const { data: casoData, error: casoError } = await supabase
      .from('casos')
      .select(CASO_SELECT)
      .eq('id_caso', casoId)
      .maybeSingle()

    if (casoError) {
      setMensaje(`Error al cargar caso: ${casoError.message}`)
      setCargando(false)
      return
    }

    if (!casoData) {
      setMensaje('Error: No se encontró el caso solicitado.')
      setCaso(null)
      setCargando(false)
      return
    }

    const casoActual = casoData as unknown as Caso
    setCaso(casoActual)

    const { data: pacienteData, error: pacienteError } = await supabase
      .from('pacientes')
      .select('id, nombres, apellidos, telefono, email')
      .eq('id', casoActual.paciente_id)
      .maybeSingle()

    if (pacienteError) {
      setMensaje(`Error al cargar paciente del caso: ${pacienteError.message}`)
      setCargando(false)
      return
    }

    setPaciente((pacienteData || null) as Paciente | null)

    if (casoActual.consulta_id) {
      const { data: consultaData, error: consultaError } = await supabase
        .from('consultas')
        .select(CONSULTA_SELECT)
        .eq('id_consulta', casoActual.consulta_id)
        .maybeSingle()

      if (consultaError) {
        setMensaje(`Error al cargar consulta de origen: ${consultaError.message}`)
        setCargando(false)
        return
      }

      setConsulta((consultaData || null) as Consulta | null)
    } else {
      setConsulta(null)
    }

    if (casoActual.evaluacion_id) {
      const { data: evaluacionData, error: evaluacionError } = await supabase
        .from('evaluaciones')
        .select(EVALUACION_SELECT)
        .eq('id_evaluacion', casoActual.evaluacion_id)
        .maybeSingle()

      if (evaluacionError) {
        setMensaje(`Error al cargar evaluación de origen: ${evaluacionError.message}`)
        setCargando(false)
        return
      }

      setEvaluacion((evaluacionData || null) as Evaluacion | null)
    } else {
      setEvaluacion(null)
    }

    setCargando(false)
  }, [casoId])

  useEffect(() => {
    const carga = window.setTimeout(() => {
      void cargarFichaCaso()
    }, 0)

    return () => window.clearTimeout(carga)
  }, [cargarFichaCaso])

  if (!casoId) {
    return <Navigate to="/casos" replace />
  }

  if (cargando) {
    return (
      <main className="clinical-module-page caso-detalle-page">
        <section className="clinical-panel">
          <span className="clinical-kicker">Ficha operativa</span>
          <h1>Cargando caso</h1>
          <p>Consultando caso, paciente y origen clínico desde Supabase local.</p>
        </section>
      </main>
    )
  }

  if (!caso) {
    return (
      <main className="clinical-module-page caso-detalle-page">
        <section className="clinical-panel">
          <span className="clinical-kicker">Ficha operativa</span>
          <h1>Caso no disponible</h1>
          <p>{mensaje || 'No fue posible resolver el caso solicitado.'}</p>
          <Link className="caso-back-link" to="/casos">Volver a Casos</Link>
        </section>
      </main>
    )
  }

  return (
    <main className="clinical-module-page caso-detalle-page">
      <section className="caso-detail-hero">
        <div className="caso-detail-hero__copy">
          <span className="clinical-kicker">Ficha operativa de caso</span>
          <h1>{caso.nombre_caso}</h1>
          <p>{textoOpcional(caso.motivo_apertura)}</p>
          <div className="caso-hero-actions">
            <Link className="caso-back-link" to="/casos">Volver a Casos</Link>
            <button className="caso-secondary-action" type="button" onClick={() => void cargarFichaCaso()}>Actualizar ficha</button>
          </div>
        </div>

        <aside className="caso-detail-summary" aria-label="Resumen del caso">
          <dl>
            <div>
              <dt>Paciente</dt>
              <dd>{pacienteNombre}</dd>
            </div>
            <div>
              <dt>Estado</dt>
              <dd>{caso.estado_caso}</dd>
            </div>
            <div>
              <dt>Prioridad</dt>
              <dd>{caso.prioridad}</dd>
            </div>
            <div>
              <dt>Fecha apertura</dt>
              <dd>{formatearFecha(caso.fecha_apertura)}</dd>
            </div>
          </dl>
        </aside>
      </section>

      {mensaje && <p className={mensaje.startsWith('Error') ? 'clinical-message clinical-message--error' : 'clinical-message'}>{mensaje}</p>}

      <nav className="caso-detail-tabs" aria-label="Secciones de la ficha del caso" role="tablist">
        <button
          id="tab-resumen"
          className={activeTab === 'resumen' ? 'caso-detail-tab caso-detail-tab--active' : 'caso-detail-tab'}
          type="button"
          role="tab"
          aria-selected={activeTab === 'resumen'}
          aria-controls="panel-resumen"
          onClick={() => seleccionarTab('resumen')}
        >
          Resumen
        </button>
        <button
          id="tab-elementos"
          className={activeTab === 'elementos' ? 'caso-detail-tab caso-detail-tab--active' : 'caso-detail-tab'}
          type="button"
          role="tab"
          aria-selected={activeTab === 'elementos'}
          aria-controls="panel-elementos"
          onClick={() => seleccionarTab('elementos')}
        >
          Elementos
        </button>
        <button
          id="tab-revisiones"
          className={activeTab === 'revisiones' ? 'caso-detail-tab caso-detail-tab--active' : 'caso-detail-tab'}
          type="button"
          role="tab"
          aria-selected={activeTab === 'revisiones'}
          aria-controls="panel-revisiones"
          onClick={() => seleccionarTab('revisiones')}
        >
          Revisiones
        </button>
        <button
          id="tab-intervenciones"
          className={activeTab === 'intervenciones' ? 'caso-detail-tab caso-detail-tab--active' : 'caso-detail-tab'}
          type="button"
          role="tab"
          aria-selected={activeTab === 'intervenciones'}
          aria-controls="panel-intervenciones"
          onClick={() => seleccionarTab('intervenciones')}
        >
          Intervenciones
        </button>
        <button
          id="tab-pagos"
          className={activeTab === 'pagos' ? 'caso-detail-tab caso-detail-tab--active' : 'caso-detail-tab'}
          type="button"
          role="tab"
          aria-selected={activeTab === 'pagos'}
          aria-controls="panel-pagos"
          onClick={() => seleccionarTab('pagos')}
        >
          Finanzas
        </button>
      </nav>

      {visitedTabs.has('resumen') && (
        <div id="panel-resumen" role="tabpanel" aria-labelledby="tab-resumen" hidden={activeTab !== 'resumen'}>
          <section className="caso-detail-section" id="resumen">
            <div className="caso-section-heading">
              <div>
                <span className="clinical-kicker">Resumen</span>
                <h2>Datos base del caso</h2>
                <p>Resumen administrativo del caso clínico.</p>
              </div>
            </div>

            <div className="caso-info-grid">
              <article className="caso-info-card">
                <span>Tipo</span>
                <strong>{caso.tipo_caso}</strong>
              </article>
              <article className="caso-info-card">
                <span>Objetivo</span>
                <p>{textoOpcional(caso.objetivo_trabajo)}</p>
              </article>
              <article className="caso-info-card">
                <span>Descripción general</span>
                <p>{textoOpcional(caso.descripcion_general)}</p>
              </article>
              <article className="caso-info-card">
                <span>Notas internas</span>
                <p>{textoOpcional(caso.notas_internas)}</p>
              </article>
            </div>
          </section>

          <section className="caso-detail-section" id="consulta-evaluacion">
            <div className="caso-section-heading">
              <div>
                <span className="clinical-kicker">Origen clínico</span>
                <h2>Consulta / Evaluación de origen</h2>
                <p>Consulta y evaluación vinculadas que dieron origen a este caso.</p>
              </div>
            </div>

            {!consulta && !evaluacion ? (
              <div className="clinical-empty">
                <strong>Sin consulta/evaluación asociada</strong>
                <p>El caso existe con paciente directo, pero no tiene origen clínico vinculado.</p>
              </div>
            ) : (
              <div className="caso-origin-grid">
                <article className="clinical-card">
                  <div className="clinical-card__top">
                    <div>
                      <h3>Consulta</h3>
                      <small>{consulta ? `${formatearFecha(consulta.fecha_consulta)} · ${consulta.tipo_consulta}` : 'Sin consulta asociada'}</small>
                    </div>
                    {consulta && <span className="clinical-badge">{consulta.estado_consulta}</span>}
                  </div>
                  <p>{consulta ? textoOpcional(consulta.motivo_consulta) : 'Sin consulta asociada al caso.'}</p>
                  {consulta && (
                    <dl className="clinical-details">
                      <div>
                        <dt>Modalidad</dt>
                        <dd>{consulta.modalidad}</dd>
                      </div>
                      <div>
                        <dt>Inicio</dt>
                        <dd>{consulta.hora_inicio || 'Sin hora'}</dd>
                      </div>
                      <div>
                        <dt>Resumen</dt>
                        <dd>{consulta.resumen_consulta ? 'Registrado' : 'Pendiente'}</dd>
                      </div>
                    </dl>
                  )}
                </article>

                <article className="clinical-card">
                  <div className="clinical-card__top">
                    <div>
                      <h3>Evaluación</h3>
                      <small>{evaluacion ? `${formatearFecha(evaluacion.fecha_evaluacion)} · ${evaluacion.decision_revision}` : 'Sin evaluación asociada'}</small>
                    </div>
                    {evaluacion && <span className="clinical-badge">{evaluacion.estado_evaluacion}</span>}
                  </div>
                  <p>{evaluacion ? textoOpcional(evaluacion.relato_antecedentes) : 'Sin evaluación asociada al caso.'}</p>
                  {evaluacion && (
                    <dl className="clinical-details">
                      <div>
                        <dt>Síntomas</dt>
                        <dd>{evaluacion.sintomas_reportados ? 'Registrados' : 'Pendiente'}</dd>
                      </div>
                      <div>
                        <dt>Hechos clave</dt>
                        <dd>{evaluacion.hechos_clave ? 'Registrados' : 'Pendiente'}</dd>
                      </div>
                      <div>
                        <dt>Fundamento</dt>
                        <dd>{evaluacion.fundamento_decision ? 'Registrado' : 'Pendiente'}</dd>
                      </div>
                    </dl>
                  )}
                </article>
              </div>
            )}
          </section>

          <section className="caso-detail-section" id="seguimiento">
            <div className="caso-section-heading">
              <div>
                <span className="clinical-kicker">Seguimiento</span>
                <h2>Estado y próximas acciones</h2>
                <p>Seguimiento evolutivo e información de cierre.</p>
              </div>
            </div>

            <div className="caso-info-grid">
              <article className="caso-info-card">
                <span>Requiere seguimiento</span>
                <strong>{caso.requiere_seguimiento ? 'Sí' : 'No'}</strong>
              </article>
              <article className="caso-info-card">
                <span>Notas de seguimiento</span>
                <p>{textoOpcional(caso.notas_seguimiento, 'Sin notas de seguimiento registradas')}</p>
              </article>
              <article className="caso-info-card">
                <span>Fecha cierre</span>
                <strong>{formatearFecha(caso.fecha_cierre)}</strong>
              </article>
              <article className="caso-info-card">
                <span>Resultado cierre</span>
                <p>{textoOpcional(caso.resultado_cierre, 'Sin cierre registrado')}</p>
              </article>
            </div>
          </section>
        </div>
      )}

      {visitedTabs.has('elementos') && (
        <div id="panel-elementos" role="tabpanel" aria-labelledby="tab-elementos" hidden={activeTab !== 'elementos'}>
          <ElementosCasoPanel casoId={caso.id_caso} pacienteId={caso.paciente_id} pacienteNombre={pacienteNombre} />
        </div>
      )}

      {visitedTabs.has('revisiones') && (
        <div id="panel-revisiones" role="tabpanel" aria-labelledby="tab-revisiones" hidden={activeTab !== 'revisiones'}>
          <RevisionesCasoPanel casoId={caso.id_caso} pacienteId={caso.paciente_id} consultaId={caso.consulta_id} evaluacionId={caso.evaluacion_id} pacienteNombre={pacienteNombre} />
          <DetalleRevisionesPanel casoId={caso.id_caso} pacienteId={caso.paciente_id} />
        </div>
      )}

      {visitedTabs.has('intervenciones') && (
        <div id="panel-intervenciones" role="tabpanel" aria-labelledby="tab-intervenciones" hidden={activeTab !== 'intervenciones'}>
          <TrabajosCasoPanel casoId={caso.id_caso} pacienteId={caso.paciente_id} />
        </div>
      )}

      {visitedTabs.has('pagos') && (
        <div id="panel-pagos" role="tabpanel" aria-labelledby="tab-pagos" hidden={activeTab !== 'pagos'}>
          <PagosCasoPanel casoId={caso.id_caso} pacienteId={caso.paciente_id} />
        </div>
      )}
    </main>
  )
}

export default CasoDetallePage
