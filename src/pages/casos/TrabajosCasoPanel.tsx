import type { FormEvent } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { formatearFecha, normalizarTexto, textoCorto } from '../../lib/format'
import { supabase } from '../../lib/supabase'
import '../ClinicalModuleBase.css'

type TrabajosCasoPanelProps = {
  casoId: string
  pacienteId: string
}

type TipoTrabajo =
  | 'Retiro de entidades'
  | 'Retiro de espíritus trascendidos'
  | 'Liberación de trabajo energético'
  | 'Desarme de trabajo energético'
  | 'Limpieza energética'
  | 'Ajuste energético'
  | 'Sello energético'
  | 'Protección energética'
  | 'Trabajo sobre vínculo'
  | 'Trabajo sobre linaje'
  | 'Trabajo sobre hogar/espacio'
  | 'Trabajo sobre terreno'
  | 'Trabajo sobre habitación'
  | 'Trabajo sobre bloqueo'
  | 'Integración de cuerpos sutiles'
  | 'Recuperación de cuerpos sutiles'
  | 'Liberación de cuerpos sutiles secuestrados'
  | 'Trabajo sobre trauma localizado'
  | 'Seguimiento energético'
  | 'Cierre energético'
  | 'Mixto'
  | 'Otro'
type AmbitoTrabajo =
  | 'Persona'
  | 'Familia'
  | 'Hogar/Espacio'
  | 'Habitación'
  | 'Terreno'
  | 'Negocio/Lugar'
  | 'Vínculo'
  | 'Linaje'
  | 'Entidad/Presencia'
  | 'Trabajo/Bloqueo'
  | 'Cuerpos sutiles'
  | 'Trauma energético'
  | 'Protección/Sello'
  | 'Mixto'
  | 'Otro'
type ModalidadEjecucion =
  | 'Trabajo único'
  | 'Proceso por semanas'
  | 'Seguimiento posterior'
  | 'Trabajo por etapas'
  | 'Trabajo de cierre'
  | 'Mixto'
type FaseActual =
  | 'Planificación'
  | 'Revisión previa'
  | 'Limpieza/Retiro'
  | 'Liberación/Desarme'
  | 'Ajuste energético'
  | 'Sellado'
  | 'Seguimiento'
  | 'Revisión posterior'
  | 'Cierre'
  | 'Pausado'
  | 'Anulado'
type AlcanceTrabajo =
  | 'Caso completo'
  | 'Elementos seleccionados'
  | 'Grupo familiar'
  | 'Persona individual'
  | 'Hogar completo'
  | 'Habitación específica'
  | 'Terreno'
  | 'Seguimiento de hallazgo'
  | 'Seguimiento de ajuste'
  | 'Cierre general'
  | 'Otro'
type MetodoPrincipal =
  | 'Radiestesia'
  | 'Canalización'
  | 'Radiestesia y canalización'
  | 'Oración/Decreto'
  | 'Trabajo energético'
  | 'Meditación guiada'
  | 'Mixto'
  | 'Otro'
type PrioridadTrabajo = 'Baja' | 'Media' | 'Alta' | 'Urgente'
type EstadoTrabajo =
  | 'Pendiente'
  | 'En proceso'
  | 'Pausado'
  | 'Completado'
  | 'Completado parcialmente'
  | 'Requiere seguimiento'
  | 'Cerrado'
  | 'Anulado'

type Trabajo = {
  id_trabajo: string
  paciente_id: string
  caso_id: string
  revision_inicial_id: string | null
  revision_cierre_id: string | null
  fecha_inicio: string
  fecha_estimada_cierre: string | null
  fecha_cierre: string | null
  numero_trabajo: number
  nombre_trabajo: string
  tipo_trabajo: TipoTrabajo
  ambito_trabajo: AmbitoTrabajo
  modalidad_ejecucion: ModalidadEjecucion
  fase_actual: FaseActual
  alcance_trabajo: AlcanceTrabajo
  metodo_principal: MetodoPrincipal
  objetivo_trabajo: string
  prioridad_trabajo: PrioridadTrabajo
  porcentaje_avance_general: number
  requiere_seguimiento: boolean
  proxima_accion: string | null
  resultado_general: string | null
  estado_trabajo: EstadoTrabajo
  observaciones: string | null
  created_at: string
}

type FormularioTrabajo = {
  nombre_trabajo: string
  tipo_trabajo: TipoTrabajo
  ambito_trabajo: AmbitoTrabajo
  modalidad_ejecucion: ModalidadEjecucion
  fase_actual: FaseActual
  alcance_trabajo: AlcanceTrabajo
  metodo_principal: MetodoPrincipal
  objetivo_trabajo: string
  prioridad_trabajo: PrioridadTrabajo
  estado_trabajo: EstadoTrabajo
  fecha_inicio: string
  fecha_estimada_cierre: string
  porcentaje_avance_general: number
  requiere_seguimiento: boolean
  proxima_accion: string
  observaciones: string
}

const TRABAJO_SELECT = [
  'id_trabajo',
  'paciente_id',
  'caso_id',
  'revision_inicial_id',
  'revision_cierre_id',
  'fecha_inicio',
  'fecha_estimada_cierre',
  'fecha_cierre',
  'numero_trabajo',
  'nombre_trabajo',
  'tipo_trabajo',
  'ambito_trabajo',
  'modalidad_ejecucion',
  'fase_actual',
  'alcance_trabajo',
  'metodo_principal',
  'objetivo_trabajo',
  'prioridad_trabajo',
  'porcentaje_avance_general',
  'requiere_seguimiento',
  'proxima_accion',
  'resultado_general',
  'estado_trabajo',
  'observaciones',
  'created_at',
].join(', ')

function hoy(): string {
  return new Date().toISOString().slice(0, 10)
}

function crearFormularioInicial(): FormularioTrabajo {
  return {
    nombre_trabajo: '',
    tipo_trabajo: 'Retiro de entidades',
    ambito_trabajo: 'Persona',
    modalidad_ejecucion: 'Proceso por semanas',
    fase_actual: 'Planificación',
    alcance_trabajo: 'Caso completo',
    metodo_principal: 'Radiestesia y canalización',
    objetivo_trabajo: '',
    prioridad_trabajo: 'Media',
    estado_trabajo: 'Pendiente',
    fecha_inicio: hoy(),
    fecha_estimada_cierre: '',
    porcentaje_avance_general: 0,
    requiere_seguimiento: false,
    proxima_accion: '',
    observaciones: '',
  }
}

function validarFormulario(f: FormularioTrabajo): string | null {
  if (!f.nombre_trabajo.trim()) return 'El nombre del trabajo es obligatorio.'
  if (!f.objetivo_trabajo.trim()) return 'El objetivo del trabajo es obligatorio.'
  if (!f.fecha_inicio) return 'La fecha de inicio es obligatoria.'
  if (f.porcentaje_avance_general < 0 || f.porcentaje_avance_general > 100) {
    return 'El porcentaje de avance debe estar entre 0 y 100.'
  }
  return null
}

function TrabajosCasoPanel({ casoId, pacienteId }: TrabajosCasoPanelProps) {
  const [trabajos, setTrabajos] = useState<Trabajo[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [formulario, setFormulario] = useState<FormularioTrabajo>(crearFormularioInicial())
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [trabajoExpandido, setTrabajoExpandido] = useState<string | null>(null)

  const trabajosFiltrados = useMemo(() => {
    if (!busqueda.trim()) return trabajos
    const filtro = normalizarTexto(busqueda.trim())
    return trabajos.filter((trabajo) => {
      const texto = [
        trabajo.nombre_trabajo,
        trabajo.tipo_trabajo,
        trabajo.ambito_trabajo,
        trabajo.fase_actual,
        trabajo.estado_trabajo,
        trabajo.objetivo_trabajo,
        trabajo.proxima_accion || '',
      ].join(' ')
      return normalizarTexto(texto).includes(filtro)
    })
  }, [busqueda, trabajos])

  const metricas = [
    { etiqueta: 'Trabajos', valor: trabajos.length, detalle: 'Registrados en el caso' },
    {
      etiqueta: 'Activos',
      valor: trabajos.filter((t) => t.estado_trabajo !== 'Cerrado' && t.estado_trabajo !== 'Anulado').length,
      detalle: 'En curso o planificados',
    },
    {
      etiqueta: 'Seguimiento',
      valor: trabajos.filter((t) => t.requiere_seguimiento).length,
      detalle: 'Requieren acción próxima',
    },
    {
      etiqueta: 'Avance prom.',
      valor: trabajos.length
        ? `${Math.round(trabajos.reduce((total, t) => total + t.porcentaje_avance_general, 0) / trabajos.length)}%`
        : '0%',
      detalle: 'Promedio del caso',
    },
  ]

  const cargarTrabajos = useCallback(async () => {
    setCargando(true)
    setMensaje('')
    const { data, error } = await supabase
      .from('trabajos')
      .select(TRABAJO_SELECT)
      .eq('caso_id', casoId)
      .eq('paciente_id', pacienteId)
      .order('fecha_inicio', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      setMensaje(`Error al cargar intervenciones: ${error.message}`)
      setCargando(false)
      return
    }
    setTrabajos((data || []) as unknown as Trabajo[])
    setCargando(false)
  }, [casoId, pacienteId])

  async function guardarTrabajo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const errorValidacion = validarFormulario(formulario)
    if (errorValidacion) {
      setMensaje(`Error: ${errorValidacion}`)
      return
    }

    setGuardando(true)
    setMensaje('Guardando intervención...')

    const siguienteNumero = trabajos.length > 0 ? Math.max(...trabajos.map((t) => t.numero_trabajo)) + 1 : 1

    const payload = {
      paciente_id: pacienteId,
      caso_id: casoId,
      numero_trabajo: siguienteNumero,
      nombre_trabajo: formulario.nombre_trabajo.trim(),
      tipo_trabajo: formulario.tipo_trabajo,
      ambito_trabajo: formulario.ambito_trabajo,
      modalidad_ejecucion: formulario.modalidad_ejecucion,
      fase_actual: formulario.fase_actual,
      alcance_trabajo: formulario.alcance_trabajo,
      metodo_principal: formulario.metodo_principal,
      objetivo_trabajo: formulario.objetivo_trabajo.trim(),
      prioridad_trabajo: formulario.prioridad_trabajo,
      estado_trabajo: formulario.estado_trabajo,
      fecha_inicio: formulario.fecha_inicio,
      fecha_estimada_cierre: formulario.fecha_estimada_cierre || null,
      porcentaje_avance_general: formulario.porcentaje_avance_general,
      requiere_seguimiento: formulario.requiere_seguimiento,
      proxima_accion: formulario.proxima_accion.trim() || null,
      observaciones: formulario.observaciones.trim() || null,
    }

    const { data, error } = await supabase
      .from('trabajos')
      .insert(payload)
      .select(TRABAJO_SELECT)
      .single()

    if (error) {
      setMensaje(`Error al guardar intervención: ${error.message}`)
      setGuardando(false)
      return
    }

    setTrabajos((prev) => [data as unknown as Trabajo, ...prev])
    setFormulario(crearFormularioInicial())
    setMostrarFormulario(false)
    setMensaje('Intervención registrada correctamente.')
    setGuardando(false)
  }

  function cambiarCampo<K extends keyof FormularioTrabajo>(campo: K, valor: FormularioTrabajo[K]) {
    setFormulario((prev) => ({ ...prev, [campo]: valor }))
  }

  useEffect(() => {
    const carga = window.setTimeout(() => { void cargarTrabajos() }, 0)
    return () => window.clearTimeout(carga)
  }, [cargarTrabajos])

  return (
    <section className="caso-detail-section" id="trabajos-intervenciones">
      <div className="caso-section-heading">
        <div>
          <span className="clinical-kicker">Trabajos / Intervenciones</span>
          <h2>Intervenciones del caso</h2>
          <p>Seguimiento y creación de planes de trabajo clínico vinculados a este caso.</p>
        </div>
        <button
          className="caso-secondary-action"
          type="button"
          onClick={() => {
            setMostrarFormulario((v) => !v)
            setMensaje('')
          }}
        >
          {mostrarFormulario ? '✕ Cerrar formulario' : '+ Nueva intervención'}
        </button>
      </div>

      <section className="clinical-metrics caso-detail-metrics" aria-label="Métricas de intervenciones del caso">
        {metricas.map((metrica) => (
          <article className="clinical-metric-card" key={metrica.etiqueta}>
            <strong>{metrica.valor}</strong>
            <span>{metrica.etiqueta}</span>
            <p>{metrica.detalle}</p>
          </article>
        ))}
      </section>

      {mostrarFormulario && (
        <section className="clinical-panel" aria-label="Formulario nueva intervención">
          <div className="clinical-panel__header">
            <div>
              <span className="clinical-kicker">Registro</span>
              <h2>Nueva intervención</h2>
              <p>Completa los campos para registrar un plan de trabajo en este caso.</p>
            </div>
          </div>

          <form className="clinical-form" onSubmit={(e) => { void guardarTrabajo(e) }}>
            <div className="clinical-form-grid">
              <label className="clinical-label clinical-label--full">
                <span>Nombre de la intervención *</span>
                <input
                  className="clinical-input"
                  id="trabajo-nombre"
                  maxLength={200}
                  placeholder="Nombre descriptivo del plan de trabajo"
                  required
                  type="text"
                  value={formulario.nombre_trabajo}
                  onChange={(e) => cambiarCampo('nombre_trabajo', e.target.value)}
                />
              </label>

              <label className="clinical-label clinical-label--full">
                <span>Objetivo *</span>
                <textarea
                  className="clinical-input clinical-textarea"
                  id="trabajo-objetivo"
                  maxLength={800}
                  placeholder="Describe el objetivo terapéutico o clínico de esta intervención"
                  required
                  rows={3}
                  value={formulario.objetivo_trabajo}
                  onChange={(e) => cambiarCampo('objetivo_trabajo', e.target.value)}
                />
              </label>

              <label className="clinical-label">
                <span>Tipo</span>
                <select
                  className="clinical-input"
                  id="trabajo-tipo"
                  value={formulario.tipo_trabajo}
                  onChange={(e) => cambiarCampo('tipo_trabajo', e.target.value as TipoTrabajo)}
                >
                  {([
                    'Retiro de entidades',
                    'Retiro de espíritus trascendidos',
                    'Liberación de trabajo energético',
                    'Desarme de trabajo energético',
                    'Limpieza energética',
                    'Ajuste energético',
                    'Sello energético',
                    'Protección energética',
                    'Trabajo sobre vínculo',
                    'Trabajo sobre linaje',
                    'Trabajo sobre hogar/espacio',
                    'Trabajo sobre terreno',
                    'Trabajo sobre habitación',
                    'Trabajo sobre bloqueo',
                    'Integración de cuerpos sutiles',
                    'Recuperación de cuerpos sutiles',
                    'Liberación de cuerpos sutiles secuestrados',
                    'Trabajo sobre trauma localizado',
                    'Seguimiento energético',
                    'Cierre energético',
                    'Mixto',
                    'Otro',
                  ] as TipoTrabajo[]).map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </label>

              <label className="clinical-label">
                <span>Ámbito</span>
                <select
                  className="clinical-input"
                  id="trabajo-ambito"
                  value={formulario.ambito_trabajo}
                  onChange={(e) => cambiarCampo('ambito_trabajo', e.target.value as AmbitoTrabajo)}
                >
                  {([
                    'Persona',
                    'Familia',
                    'Hogar/Espacio',
                    'Habitación',
                    'Terreno',
                    'Negocio/Lugar',
                    'Vínculo',
                    'Linaje',
                    'Entidad/Presencia',
                    'Trabajo/Bloqueo',
                    'Cuerpos sutiles',
                    'Trauma energético',
                    'Protección/Sello',
                    'Mixto',
                    'Otro',
                  ] as AmbitoTrabajo[]).map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </label>

              <label className="clinical-label">
                <span>Modalidad</span>
                <select
                  className="clinical-input"
                  id="trabajo-modalidad"
                  value={formulario.modalidad_ejecucion}
                  onChange={(e) => cambiarCampo('modalidad_ejecucion', e.target.value as ModalidadEjecucion)}
                >
                  {([
                    'Trabajo único',
                    'Proceso por semanas',
                    'Seguimiento posterior',
                    'Trabajo por etapas',
                    'Trabajo de cierre',
                    'Mixto',
                  ] as ModalidadEjecucion[]).map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </label>

              <label className="clinical-label">
                <span>Método principal</span>
                <select
                  className="clinical-input"
                  id="trabajo-metodo"
                  value={formulario.metodo_principal}
                  onChange={(e) => cambiarCampo('metodo_principal', e.target.value as MetodoPrincipal)}
                >
                  {([
                    'Radiestesia',
                    'Canalización',
                    'Radiestesia y canalización',
                    'Oración/Decreto',
                    'Trabajo energético',
                    'Meditación guiada',
                    'Mixto',
                    'Otro',
                  ] as MetodoPrincipal[]).map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </label>

              <label className="clinical-label">
                <span>Alcance</span>
                <select
                  className="clinical-input"
                  id="trabajo-alcance"
                  value={formulario.alcance_trabajo}
                  onChange={(e) => cambiarCampo('alcance_trabajo', e.target.value as AlcanceTrabajo)}
                >
                  {([
                    'Caso completo',
                    'Elementos seleccionados',
                    'Grupo familiar',
                    'Persona individual',
                    'Hogar completo',
                    'Habitación específica',
                    'Terreno',
                    'Seguimiento de hallazgo',
                    'Seguimiento de ajuste',
                    'Cierre general',
                    'Otro',
                  ] as AlcanceTrabajo[]).map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </label>

              <label className="clinical-label">
                <span>Prioridad</span>
                <select
                  className="clinical-input"
                  id="trabajo-prioridad"
                  value={formulario.prioridad_trabajo}
                  onChange={(e) => cambiarCampo('prioridad_trabajo', e.target.value as PrioridadTrabajo)}
                >
                  {(['Baja', 'Media', 'Alta', 'Urgente'] as PrioridadTrabajo[]).map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </label>

              <label className="clinical-label">
                <span>Fase actual</span>
                <select
                  className="clinical-input"
                  id="trabajo-fase"
                  value={formulario.fase_actual}
                  onChange={(e) => cambiarCampo('fase_actual', e.target.value as FaseActual)}
                >
                  {([
                    'Planificación',
                    'Revisión previa',
                    'Limpieza/Retiro',
                    'Liberación/Desarme',
                    'Ajuste energético',
                    'Sellado',
                    'Seguimiento',
                    'Revisión posterior',
                    'Cierre',
                    'Pausado',
                    'Anulado',
                  ] as FaseActual[]).map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </label>

              <label className="clinical-label">
                <span>Estado</span>
                <select
                  className="clinical-input"
                  id="trabajo-estado"
                  value={formulario.estado_trabajo}
                  onChange={(e) => cambiarCampo('estado_trabajo', e.target.value as EstadoTrabajo)}
                >
                  {([
                    'Pendiente',
                    'En proceso',
                    'Pausado',
                    'Completado',
                    'Completado parcialmente',
                    'Requiere seguimiento',
                    'Cerrado',
                    'Anulado',
                  ] as EstadoTrabajo[]).map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </label>

              <label className="clinical-label">
                <span>Fecha de inicio *</span>
                <input
                  className="clinical-input"
                  id="trabajo-fecha-inicio"
                  required
                  type="date"
                  value={formulario.fecha_inicio}
                  onChange={(e) => cambiarCampo('fecha_inicio', e.target.value)}
                />
              </label>

              <label className="clinical-label">
                <span>Fecha estimada de cierre</span>
                <input
                  className="clinical-input"
                  id="trabajo-fecha-cierre"
                  min={formulario.fecha_inicio}
                  type="date"
                  value={formulario.fecha_estimada_cierre}
                  onChange={(e) => cambiarCampo('fecha_estimada_cierre', e.target.value)}
                />
              </label>

              <label className="clinical-label">
                <span>Avance general (%)</span>
                <input
                  className="clinical-input"
                  id="trabajo-avance"
                  max={100}
                  min={0}
                  type="number"
                  value={formulario.porcentaje_avance_general}
                  onChange={(e) => cambiarCampo('porcentaje_avance_general', Number(e.target.value))}
                />
              </label>

              <label className="clinical-label clinical-label--checkbox">
                <input
                  id="trabajo-seguimiento"
                  type="checkbox"
                  checked={formulario.requiere_seguimiento}
                  onChange={(e) => cambiarCampo('requiere_seguimiento', e.target.checked)}
                />
                <span>Requiere seguimiento activo</span>
              </label>

              <label className="clinical-label clinical-label--full">
                <span>Próxima acción</span>
                <input
                  className="clinical-input"
                  id="trabajo-proxima-accion"
                  maxLength={400}
                  placeholder="Describe la acción inmediata requerida (opcional)"
                  type="text"
                  value={formulario.proxima_accion}
                  onChange={(e) => cambiarCampo('proxima_accion', e.target.value)}
                />
              </label>

              <label className="clinical-label clinical-label--full">
                <span>Observaciones internas</span>
                <textarea
                  className="clinical-input clinical-textarea"
                  id="trabajo-observaciones"
                  maxLength={800}
                  placeholder="Notas internas del terapeuta (opcionales)"
                  rows={2}
                  value={formulario.observaciones}
                  onChange={(e) => cambiarCampo('observaciones', e.target.value)}
                />
              </label>
            </div>

            <div className="clinical-form-actions">
              <button
                className="caso-back-link"
                disabled={guardando}
                id="trabajo-submit"
                type="submit"
              >
                {guardando ? 'Guardando...' : 'Registrar intervención'}
              </button>
              <button
                className="caso-secondary-action"
                type="button"
                onClick={() => {
                  setFormulario(crearFormularioInicial())
                  setMensaje('')
                }}
              >
                Limpiar
              </button>
            </div>

            {mensaje && (
              <p className={mensaje.startsWith('Error') ? 'clinical-message clinical-message--error' : 'clinical-message'}>
                {mensaje}
              </p>
            )}
          </form>
        </section>
      )}

      <section className="clinical-layout caso-panel-layout">
        <section className="clinical-panel" aria-label="Intervenciones registradas en el caso">
          <div className="clinical-panel__header">
            <div>
              <span className="clinical-kicker">Listado</span>
              <h2>Intervenciones registradas</h2>
              <p>Solo se muestran las intervenciones de este caso clínico.</p>
            </div>
            <span className="clinical-count">{trabajosFiltrados.length}</span>
          </div>

          <label className="clinical-search">
            <span>Buscar</span>
            <input
              className="clinical-input"
              placeholder="Nombre, tipo, fase, estado u objetivo"
              type="search"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
            />
          </label>

          {trabajosFiltrados.length === 0 ? (
            <div className="clinical-empty">
              <strong>{cargando ? 'Cargando intervenciones' : 'Sin intervenciones registradas en este caso'}</strong>
              <p>{cargando ? 'Consultando información...' : 'Usa el botón "Nueva intervención" para registrar el primer plan de trabajo.'}</p>
            </div>
          ) : (
            <div className="clinical-list">
              {trabajosFiltrados.map((trabajo) => (
                <article className="clinical-card" key={trabajo.id_trabajo}>
                  <div className="clinical-card__top">
                    <div>
                      <h3>{trabajo.nombre_trabajo}</h3>
                      <small>Intervención {trabajo.numero_trabajo} · inicio {formatearFecha(trabajo.fecha_inicio)}</small>
                    </div>
                    <span className="clinical-badge">{trabajo.estado_trabajo}</span>
                  </div>
                  <p>{textoCorto(trabajo.objetivo_trabajo, 140)}</p>
                  <dl className="clinical-details">
                    <div>
                      <dt>Tipo</dt>
                      <dd>{trabajo.tipo_trabajo}</dd>
                    </div>
                    <div>
                      <dt>Fase</dt>
                      <dd>{trabajo.fase_actual}</dd>
                    </div>
                    <div>
                      <dt>Prioridad</dt>
                      <dd>{trabajo.prioridad_trabajo}</dd>
                    </div>
                    <div>
                      <dt>Avance</dt>
                      <dd>{trabajo.porcentaje_avance_general}%</dd>
                    </div>
                  </dl>

                  <button
                    className="caso-secondary-action"
                    type="button"
                    style={{ marginTop: '8px', fontSize: '11px' }}
                    onClick={() => setTrabajoExpandido(trabajoExpandido === trabajo.id_trabajo ? null : trabajo.id_trabajo)}
                  >
                    {trabajoExpandido === trabajo.id_trabajo ? 'Ocultar detalle' : 'Ver detalle'}
                  </button>

                  {trabajoExpandido === trabajo.id_trabajo && (
                    <div className="clinical-expandido">
                      <dl className="clinical-details">
                        <div>
                          <dt>Ámbito</dt>
                          <dd>{trabajo.ambito_trabajo}</dd>
                        </div>
                        <div>
                          <dt>Modalidad</dt>
                          <dd>{trabajo.modalidad_ejecucion}</dd>
                        </div>
                        <div>
                          <dt>Método</dt>
                          <dd>{trabajo.metodo_principal}</dd>
                        </div>
                        <div>
                          <dt>Alcance</dt>
                          <dd>{trabajo.alcance_trabajo}</dd>
                        </div>
                        {trabajo.proxima_accion && (
                          <div>
                            <dt>Próxima acción</dt>
                            <dd>{trabajo.proxima_accion}</dd>
                          </div>
                        )}
                        {trabajo.fecha_estimada_cierre && (
                          <div>
                            <dt>Cierre estimado</dt>
                            <dd>{formatearFecha(trabajo.fecha_estimada_cierre)}</dd>
                          </div>
                        )}
                        {trabajo.observaciones && (
                          <div style={{ gridColumn: '1 / -1' }}>
                            <dt>Observaciones</dt>
                            <dd>{trabajo.observaciones}</dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}

          {!mostrarFormulario && mensaje && (
            <p className={mensaje.startsWith('Error') ? 'clinical-message clinical-message--error' : 'clinical-message'}>
              {mensaje}
            </p>
          )}
        </section>
      </section>
    </section>
  )
}

export default TrabajosCasoPanel
