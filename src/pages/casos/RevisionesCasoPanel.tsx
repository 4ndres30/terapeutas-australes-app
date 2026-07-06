import type { FormEvent } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { formatearFecha, normalizarTexto, textoCorto } from '../../lib/format'
import { supabase } from '../../lib/supabase'
import '../ClinicalModuleBase.css'

type RevisionesCasoPanelProps = {
  casoId: string
  pacienteId: string
  consultaId?: string | null
  evaluacionId?: string | null
  pacienteNombre?: string
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

function crearFormularioInicial(numeroRevision = '1'): FormularioRevision {
  return {
    fecha_revision: fechaHoy(),
    hora_inicio: '',
    hora_termino: '',
    numero_revision: numeroRevision,
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

function obtenerSiguienteNumero(revisiones: Revision[]) {
  const numeros = revisiones.map((revision) => revision.numero_revision)
  return String((Math.max(0, ...numeros) || 0) + 1)
}

function validarFormulario(formulario: FormularioRevision, casoId: string, pacienteId: string, revisiones: Revision[]) {
  if (!casoId || !pacienteId) {
    return 'No hay caso o paciente resuelto para asociar la revisión.'
  }

  const numeroRevision = Number(formulario.numero_revision)

  if (!Number.isInteger(numeroRevision) || numeroRevision <= 0) {
    return 'El número de revisión debe ser un entero mayor a cero.'
  }

  const numeroDuplicado = revisiones.some((revision) => revision.numero_revision === numeroRevision)

  if (numeroDuplicado) {
    return 'Ya existe una revisión con ese número para este caso.'
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

function RevisionesCasoPanel({ casoId, pacienteId, consultaId = null, evaluacionId = null, pacienteNombre }: RevisionesCasoPanelProps) {
  const [revisiones, setRevisiones] = useState<Revision[]>([])
  const [formulario, setFormulario] = useState<FormularioRevision>(() => crearFormularioInicial())
  const [busqueda, setBusqueda] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)

  const revisionesFiltradas = useMemo(() => {
    if (!busqueda.trim()) {
      return revisiones
    }

    const filtro = normalizarTexto(busqueda.trim())

    return revisiones.filter((revision) => {
      const texto = [
        revision.numero_revision,
        revision.tipo_revision,
        revision.modalidad,
        revision.metodo_revision,
        revision.alcance_revision,
        revision.estado_revision,
        revision.objetivo_revision,
        revision.resumen_general || '',
        revision.resultado_general || '',
      ].join(' ')

      return normalizarTexto(texto).includes(filtro)
    })
  }, [busqueda, revisiones])

  const metricas = [
    { etiqueta: 'Total', valor: revisiones.length, detalle: 'Revisiones del caso' },
    { etiqueta: 'Pendientes', valor: revisiones.filter((revision) => revision.estado_revision === 'Pendiente').length, detalle: 'Por trabajar' },
    { etiqueta: 'Completadas', valor: revisiones.filter((revision) => revision.estado_revision === 'Completada').length, detalle: 'Cerradas' },
    { etiqueta: 'Seguimiento', valor: revisiones.filter((revision) => revision.requiere_seguimiento).length, detalle: 'Con próxima acción' },
  ]

  function actualizarFormulario(campo: keyof FormularioRevision, valor: string | boolean) {
    setFormulario((actual) => ({ ...actual, [campo]: valor }))
  }

  const cargarRevisiones = useCallback(async () => {
    setCargando(true)
    setMensaje('')

    const { data, error } = await supabase
      .from('revisiones')
      .select(REVISION_SELECT)
      .eq('caso_id', casoId)
      .eq('paciente_id', pacienteId)
      .order('fecha_revision', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      setMensaje(`Error al cargar revisiones: ${error.message}`)
      setCargando(false)
      return
    }

    const registros = (data || []) as unknown as Revision[]
    setRevisiones(registros)
    setFormulario(crearFormularioInicial(obtenerSiguienteNumero(registros)))
    setCargando(false)
  }, [casoId, pacienteId])

  async function guardarRevision(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const errorFormulario = validarFormulario(formulario, casoId, pacienteId, revisiones)

    if (errorFormulario) {
      setMensaje(`Error: ${errorFormulario}`)
      return
    }

    setGuardando(true)
    setMensaje('Guardando revisión...')

    const payload = {
      paciente_id: pacienteId,
      caso_id: casoId,
      consulta_id: consultaId || null,
      evaluacion_id: evaluacionId || null,
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

    const revisionCreada = data as unknown as Revision
    const nuevasRevisiones = [revisionCreada, ...revisiones]
    setRevisiones(nuevasRevisiones)
    setFormulario(crearFormularioInicial(obtenerSiguienteNumero(nuevasRevisiones)))
    setMensaje('Revisión guardada correctamente en este caso')
    setGuardando(false)
  }

  useEffect(() => {
    const carga = window.setTimeout(() => {
      void cargarRevisiones()
    }, 0)

    return () => window.clearTimeout(carga)
  }, [cargarRevisiones])

  return (
    <section className="caso-detail-section" id="revisiones">
      <div className="caso-section-heading">
        <div>
          <span className="clinical-kicker">Revisiones</span>
          <h2>Revisiones del caso</h2>
          <p>Filtradas por `revisiones.caso_id`. Las nuevas revisiones heredan paciente, consulta y evaluación del caso.</p>
        </div>
      </div>

      <section className="clinical-metrics caso-detail-metrics" aria-label="Métricas de revisiones del caso">
        {metricas.map((metrica) => (
          <article className="clinical-metric-card" key={metrica.etiqueta}>
            <strong>{metrica.valor}</strong>
            <span>{metrica.etiqueta}</span>
            <p>{metrica.detalle}</p>
          </article>
        ))}
      </section>

      <section className="clinical-layout caso-panel-layout">
        <section className="clinical-panel" aria-label="Revisiones registradas en el caso">
          <div className="clinical-panel__header">
            <div>
              <span className="clinical-kicker">Listado</span>
              <h2>Registradas</h2>
              <p>Paciente asociado: {pacienteNombre || pacienteId}</p>
            </div>
            <span className="clinical-count">{revisionesFiltradas.length}</span>
          </div>

          <label className="clinical-search">
            <span>Buscar</span>
            <input
              className="clinical-input"
              placeholder="Número, tipo, método, alcance o estado"
              type="search"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
            />
          </label>

          {revisionesFiltradas.length === 0 ? (
            <div className="clinical-empty">
              <strong>{cargando ? 'Cargando revisiones' : 'Sin revisiones registradas en este caso'}</strong>
              <p>{cargando ? 'Consultando Supabase local.' : 'Registra la primera revisión desde el formulario de esta ficha.'}</p>
            </div>
          ) : (
            <div className="clinical-list">
              {revisionesFiltradas.map((revision) => (
                <article className="clinical-card" key={revision.id_revision}>
                  <div className="clinical-card__top">
                    <div>
                      <h3>Revisión {revision.numero_revision} · {revision.tipo_revision}</h3>
                      <small>{formatearFecha(revision.fecha_revision)} · {revision.modalidad}</small>
                    </div>
                    <span className="clinical-badge">{revision.estado_revision}</span>
                  </div>
                  <p>{textoCorto(revision.objetivo_revision)}</p>
                  <dl className="clinical-details">
                    <div>
                      <dt>Método</dt>
                      <dd>{revision.metodo_revision}</dd>
                    </div>
                    <div>
                      <dt>Alcance</dt>
                      <dd>{revision.alcance_revision}</dd>
                    </div>
                    <div>
                      <dt>Seguimiento</dt>
                      <dd>{revision.requiere_seguimiento ? 'Sí' : 'No'}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="clinical-form-panel" aria-label="Nueva revisión del caso">
          <div className="clinical-form-panel__header">
            <div>
              <span className="clinical-kicker">Formulario</span>
              <h2>Nueva revisión</h2>
              <p>La revisión queda asociada únicamente al caso abierto.</p>
            </div>
          </div>

          <p className="clinical-note">
            Paciente: {pacienteNombre || pacienteId}. Consulta: {consultaId ? 'asociada desde el caso' : 'sin consulta en el caso'}. Evaluación: {evaluacionId ? 'asociada desde el caso' : 'sin evaluación en el caso'}.
          </p>

          <form className="clinical-form" onSubmit={guardarRevision}>
            <div className="clinical-grid">
              <label className="clinical-field">
                <span>Número *</span>
                <input className="clinical-input" disabled={guardando} min="1" type="number" value={formulario.numero_revision} onChange={(event) => actualizarFormulario('numero_revision', event.target.value)} required />
              </label>

              <label className="clinical-field">
                <span>Fecha *</span>
                <input className="clinical-input" disabled={guardando} type="date" value={formulario.fecha_revision} onChange={(event) => actualizarFormulario('fecha_revision', event.target.value)} required />
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

            <button className="clinical-button" disabled={guardando} type="submit">
              {guardando ? 'Guardando...' : 'Guardar revisión'}
            </button>
          </form>

          {mensaje && <p className={mensaje.startsWith('Error') ? 'clinical-message clinical-message--error' : 'clinical-message'}>{mensaje}</p>}
        </section>
      </section>
    </section>
  )
}

export default RevisionesCasoPanel
