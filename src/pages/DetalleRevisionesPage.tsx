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
  nombre_caso: string
}

type Revision = {
  id_revision: string
  paciente_id: string
  caso_id: string
  fecha_revision: string
  numero_revision: number
  tipo_revision: string
  estado_revision: string
}

type ElementoCaso = {
  id_elemento_caso: string
  paciente_id: string
  caso_id: string
  tipo_elemento: string
  nombre_elemento: string
  estado_elemento: string
}

type RevisionElemento = {
  id_revision_elemento: string
  paciente_id: string
  caso_id: string
  revision_id: string
  elemento_caso_id: string
  prioridad_revision: string
  estado_revision_elemento: string
}

type AreaRevision =
  | 'Persona/Involucrado'
  | 'Hogar/Espacio'
  | 'Negocio/Lugar'
  | 'Objeto'
  | 'Vínculo'
  | 'Linaje'
  | 'Cuerpo físico'
  | 'Cuerpo energético'
  | 'Cuerpo emocional'
  | 'Cuerpo mental'
  | 'Cuerpo espiritual'
  | 'Cuerpos sutiles'
  | 'Campo energético'
  | 'Trauma energético'
  | 'Entidad/Presencia'
  | 'Trabajo/Bloqueo'
  | 'Protección'
  | 'Abundancia'
  | 'Otro'

type MetodoRevision = 'Radiestesia' | 'Canalización' | 'Radiestesia y canalización' | 'Tarot' | 'Observación interna' | 'Mixta' | 'Otro'
type TipoMedicion = 'Porcentaje' | 'Sí/No' | 'Clasificación' | 'Texto/Canalización' | 'Mixto' | 'No aplica'
type MetricaRevision = 'Estabilidad' | 'Bloqueo' | 'Presencia' | 'Abundancia' | 'Protección' | 'Intensidad' | 'Estado general' | 'Separación' | 'Retraimiento' | 'Aislamiento' | 'Secuestro' | 'Integración' | 'Alineación' | 'Localización' | 'Otro'
type EstadoRevisionAspecto = 'Pendiente' | 'En revisión' | 'Revisado' | 'Revisado parcialmente' | 'No revisado' | 'No aplica' | 'Requiere seguimiento'

type RevisionAspecto = {
  id_revision_aspecto: string
  paciente_id: string
  caso_id: string
  revision_id: string
  revision_elemento_id: string
  elemento_caso_id: string
  orden_aspecto: number | null
  area_revision: AreaRevision
  aspecto_revisado: string
  metodo_revision: MetodoRevision
  tipo_medicion: TipoMedicion
  metrica_revision: MetricaRevision | null
  valor_porcentaje: number | null
  presencia_detectada: boolean | null
  tipo_detectado: string | null
  estado_revision_aspecto: EstadoRevisionAspecto
  resultado_aspecto: string | null
  requiere_seguimiento: boolean
  pendiente_revision: boolean
  motivo_pendiente: string | null
  informacion_canalizada: string | null
  observaciones: string | null
  notas_internas: string | null
  created_at: string
}

type FormularioDetalle = {
  paciente_id: string
  caso_id: string
  revision_id: string
  elemento_caso_id: string
  orden_aspecto: string
  area_revision: AreaRevision
  aspecto_revisado: string
  metodo_revision: MetodoRevision
  tipo_medicion: TipoMedicion
  metrica_revision: '' | MetricaRevision
  valor_porcentaje: string
  presencia_detectada: '' | 'true' | 'false'
  tipo_detectado: string
  estado_revision_aspecto: EstadoRevisionAspecto
  resultado_aspecto: string
  requiere_seguimiento: boolean
  pendiente_revision: boolean
  motivo_pendiente: string
  informacion_canalizada: string
  observaciones: string
  notas_internas: string
}

const ASPECTO_SELECT = [
  'id_revision_aspecto',
  'paciente_id',
  'caso_id',
  'revision_id',
  'revision_elemento_id',
  'elemento_caso_id',
  'orden_aspecto',
  'area_revision',
  'aspecto_revisado',
  'metodo_revision',
  'tipo_medicion',
  'metrica_revision',
  'valor_porcentaje',
  'presencia_detectada',
  'tipo_detectado',
  'estado_revision_aspecto',
  'resultado_aspecto',
  'requiere_seguimiento',
  'pendiente_revision',
  'motivo_pendiente',
  'informacion_canalizada',
  'observaciones',
  'notas_internas',
  'created_at',
].join(', ')

const REVISION_ELEMENTO_SELECT = [
  'id_revision_elemento',
  'paciente_id',
  'caso_id',
  'revision_id',
  'elemento_caso_id',
  'prioridad_revision',
  'estado_revision_elemento',
].join(', ')

const areasRevision: AreaRevision[] = [
  'Persona/Involucrado',
  'Hogar/Espacio',
  'Negocio/Lugar',
  'Objeto',
  'Vínculo',
  'Linaje',
  'Cuerpo físico',
  'Cuerpo energético',
  'Cuerpo emocional',
  'Cuerpo mental',
  'Cuerpo espiritual',
  'Cuerpos sutiles',
  'Campo energético',
  'Trauma energético',
  'Entidad/Presencia',
  'Trabajo/Bloqueo',
  'Protección',
  'Abundancia',
  'Otro',
]

const metodosRevision: MetodoRevision[] = ['Radiestesia', 'Canalización', 'Radiestesia y canalización', 'Tarot', 'Observación interna', 'Mixta', 'Otro']
const tiposMedicion: TipoMedicion[] = ['Porcentaje', 'Sí/No', 'Clasificación', 'Texto/Canalización', 'Mixto', 'No aplica']
const metricasRevision: MetricaRevision[] = ['Estabilidad', 'Bloqueo', 'Presencia', 'Abundancia', 'Protección', 'Intensidad', 'Estado general', 'Separación', 'Retraimiento', 'Aislamiento', 'Secuestro', 'Integración', 'Alineación', 'Localización', 'Otro']
const estadosAspecto: EstadoRevisionAspecto[] = ['Pendiente', 'En revisión', 'Revisado', 'Revisado parcialmente', 'No revisado', 'No aplica', 'Requiere seguimiento']

function crearFormularioInicial(): FormularioDetalle {
  return {
    paciente_id: '',
    caso_id: '',
    revision_id: '',
    elemento_caso_id: '',
    orden_aspecto: '',
    area_revision: 'Persona/Involucrado',
    aspecto_revisado: '',
    metodo_revision: 'Radiestesia',
    tipo_medicion: 'Porcentaje',
    metrica_revision: '',
    valor_porcentaje: '',
    presencia_detectada: '',
    tipo_detectado: '',
    estado_revision_aspecto: 'Pendiente',
    resultado_aspecto: '',
    requiere_seguimiento: false,
    pendiente_revision: false,
    motivo_pendiente: '',
    informacion_canalizada: '',
    observaciones: '',
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

function textoCorto(texto: string, largo = 120) {
  const limpio = texto.trim()
  return limpio.length > largo ? `${limpio.slice(0, largo - 1)}...` : limpio
}

function validarFormulario(formulario: FormularioDetalle, revisiones: Revision[], elementos: ElementoCaso[]) {
  if (revisiones.length === 0 || elementos.length === 0) {
    return 'Para crear detalle de revisión primero debes crear una revisión y un elemento asociado al caso.'
  }

  const revision = revisiones.find((item) => item.id_revision === formulario.revision_id)
  const elemento = elementos.find((item) => item.id_elemento_caso === formulario.elemento_caso_id)

  if (!revision) {
    return 'Selecciona la revisión asociada al detalle.'
  }

  if (!elemento) {
    return 'Selecciona el elemento del caso asociado al detalle.'
  }

  if (revision.caso_id !== elemento.caso_id || revision.paciente_id !== elemento.paciente_id) {
    return 'La revisión y el elemento deben pertenecer al mismo caso y paciente.'
  }

  if (!formulario.aspecto_revisado.trim()) {
    return 'Completa el aspecto revisado.'
  }

  if (formulario.orden_aspecto && Number(formulario.orden_aspecto) <= 0) {
    return 'El orden del aspecto debe ser mayor a cero.'
  }

  if (formulario.valor_porcentaje) {
    const valor = Number(formulario.valor_porcentaje)

    if (!Number.isInteger(valor) || valor < 0 || valor > 100) {
      return 'El porcentaje debe ser un entero entre 0 y 100.'
    }
  }

  return ''
}

function DetalleRevisionesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [casos, setCasos] = useState<Caso[]>([])
  const [revisiones, setRevisiones] = useState<Revision[]>([])
  const [elementos, setElementos] = useState<ElementoCaso[]>([])
  const [revisionElementos, setRevisionElementos] = useState<RevisionElemento[]>([])
  const [aspectos, setAspectos] = useState<RevisionAspecto[]>([])
  const [formulario, setFormulario] = useState<FormularioDetalle>(() => crearFormularioInicial())
  const [busqueda, setBusqueda] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)

  const pacientesPorId = useMemo(() => new Map(pacientes.map((paciente) => [paciente.id, paciente])), [pacientes])
  const casosPorId = useMemo(() => new Map(casos.map((caso) => [caso.id_caso, caso])), [casos])
  const revisionesPorId = useMemo(() => new Map(revisiones.map((revision) => [revision.id_revision, revision])), [revisiones])
  const elementosPorId = useMemo(() => new Map(elementos.map((elemento) => [elemento.id_elemento_caso, elemento])), [elementos])
  const revisionSeleccionada = revisionesPorId.get(formulario.revision_id)
  const elementosDisponibles = revisionSeleccionada
    ? elementos.filter((elemento) => elemento.caso_id === revisionSeleccionada.caso_id)
    : elementos

  const aspectosFiltrados = useMemo(() => {
    if (!busqueda.trim()) {
      return aspectos
    }

    const filtro = normalizarTexto(busqueda.trim())

    return aspectos.filter((aspecto) => {
      const revision = revisionesPorId.get(aspecto.revision_id)
      const caso = casosPorId.get(aspecto.caso_id)
      const elemento = elementosPorId.get(aspecto.elemento_caso_id)
      const texto = [
        aspecto.area_revision,
        aspecto.aspecto_revisado,
        aspecto.metodo_revision,
        aspecto.tipo_medicion,
        aspecto.metrica_revision || '',
        aspecto.estado_revision_aspecto,
        aspecto.resultado_aspecto || '',
        caso?.nombre_caso || '',
        elemento?.nombre_elemento || '',
        revision?.numero_revision || '',
      ].join(' ')

      return normalizarTexto(texto).includes(filtro)
    })
  }, [aspectos, busqueda, casosPorId, elementosPorId, revisionesPorId])

  const metricas = [
    { etiqueta: 'Total', valor: aspectos.length, detalle: 'Aspectos reales' },
    { etiqueta: 'Pendientes', valor: aspectos.filter((aspecto) => aspecto.estado_revision_aspecto === 'Pendiente').length, detalle: 'Por revisar' },
    { etiqueta: 'Seguimiento', valor: aspectos.filter((aspecto) => aspecto.requiere_seguimiento).length, detalle: 'Con acción pendiente' },
    { etiqueta: 'Presencia', valor: aspectos.filter((aspecto) => aspecto.presencia_detectada === true).length, detalle: 'Detectadas' },
  ]

  function actualizarFormulario(campo: keyof FormularioDetalle, valor: string | boolean) {
    setFormulario((actual) => ({ ...actual, [campo]: valor }))
  }

  function actualizarRevision(revisionId: string) {
    const revision = revisiones.find((item) => item.id_revision === revisionId)

    setFormulario((actual) => ({
      ...actual,
      revision_id: revisionId,
      paciente_id: revision?.paciente_id || '',
      caso_id: revision?.caso_id || '',
      elemento_caso_id: '',
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
      .select('id_caso, paciente_id, nombre_caso')
      .order('created_at', { ascending: false })

    if (casosError) {
      setMensaje(`Error al cargar casos: ${casosError.message}`)
      setCargando(false)
      return
    }

    const { data: revisionesData, error: revisionesError } = await supabase
      .from('revisiones')
      .select('id_revision, paciente_id, caso_id, fecha_revision, numero_revision, tipo_revision, estado_revision')
      .order('fecha_revision', { ascending: false })

    if (revisionesError) {
      setMensaje(`Error al cargar revisiones: ${revisionesError.message}`)
      setCargando(false)
      return
    }

    const { data: elementosData, error: elementosError } = await supabase
      .from('elementos_caso')
      .select('id_elemento_caso, paciente_id, caso_id, tipo_elemento, nombre_elemento, estado_elemento')
      .order('created_at', { ascending: false })

    if (elementosError) {
      setMensaje(`Error al cargar elementos: ${elementosError.message}`)
      setCargando(false)
      return
    }

    const { data: revisionElementosData, error: revisionElementosError } = await supabase
      .from('revision_elementos')
      .select(REVISION_ELEMENTO_SELECT)
      .order('created_at', { ascending: false })

    if (revisionElementosError) {
      setMensaje(`Error al cargar vínculos de revisión: ${revisionElementosError.message}`)
      setCargando(false)
      return
    }

    const { data: aspectosData, error: aspectosError } = await supabase
      .from('revision_aspectos')
      .select(ASPECTO_SELECT)
      .order('created_at', { ascending: false })

    if (aspectosError) {
      setMensaje(`Error al cargar detalle de revisiones: ${aspectosError.message}`)
      setCargando(false)
      return
    }

    setPacientes((pacientesData || []) as Paciente[])
    setCasos((casosData || []) as Caso[])
    setRevisiones((revisionesData || []) as Revision[])
    setElementos((elementosData || []) as ElementoCaso[])
    setRevisionElementos((revisionElementosData || []) as unknown as RevisionElemento[])
    setAspectos((aspectosData || []) as unknown as RevisionAspecto[])
    setCargando(false)
  }

  async function obtenerRevisionElemento(revision: Revision, elemento: ElementoCaso) {
    const existente = revisionElementos.find((item) => (
      item.revision_id === revision.id_revision
      && item.elemento_caso_id === elemento.id_elemento_caso
    ))

    if (existente) {
      return existente
    }

    const payload = {
      paciente_id: revision.paciente_id,
      caso_id: revision.caso_id,
      revision_id: revision.id_revision,
      elemento_caso_id: elemento.id_elemento_caso,
      prioridad_revision: 'Media',
      estado_revision_elemento: 'En revisión',
    }

    const { data, error } = await supabase
      .from('revision_elementos')
      .insert(payload)
      .select(REVISION_ELEMENTO_SELECT)
      .single()

    if (error) {
      throw new Error(error.message)
    }

    const creado = data as unknown as RevisionElemento
    setRevisionElementos((actuales) => [creado, ...actuales])
    return creado
  }

  async function guardarDetalle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const errorFormulario = validarFormulario(formulario, revisiones, elementos)

    if (errorFormulario) {
      setMensaje(`Error: ${errorFormulario}`)
      return
    }

    const revision = revisionesPorId.get(formulario.revision_id)
    const elemento = elementosPorId.get(formulario.elemento_caso_id)

    if (!revision || !elemento) {
      setMensaje('Error: No fue posible resolver la revisión o el elemento seleccionado.')
      return
    }

    setGuardando(true)
    setMensaje('Guardando detalle de revisión...')

    try {
      const revisionElemento = await obtenerRevisionElemento(revision, elemento)
      const payload = {
        paciente_id: revision.paciente_id,
        caso_id: revision.caso_id,
        revision_id: revision.id_revision,
        revision_elemento_id: revisionElemento.id_revision_elemento,
        elemento_caso_id: elemento.id_elemento_caso,
        orden_aspecto: formulario.orden_aspecto ? Number(formulario.orden_aspecto) : null,
        area_revision: formulario.area_revision,
        aspecto_revisado: formulario.aspecto_revisado.trim(),
        metodo_revision: formulario.metodo_revision,
        tipo_medicion: formulario.tipo_medicion,
        metrica_revision: formulario.metrica_revision || null,
        valor_porcentaje: formulario.valor_porcentaje ? Number(formulario.valor_porcentaje) : null,
        presencia_detectada: formulario.presencia_detectada === '' ? null : formulario.presencia_detectada === 'true',
        tipo_detectado: formulario.tipo_detectado.trim() || null,
        estado_revision_aspecto: formulario.estado_revision_aspecto,
        resultado_aspecto: formulario.resultado_aspecto.trim() || null,
        requiere_seguimiento: formulario.requiere_seguimiento,
        pendiente_revision: formulario.pendiente_revision,
        motivo_pendiente: formulario.motivo_pendiente.trim() || null,
        informacion_canalizada: formulario.informacion_canalizada.trim() || null,
        observaciones: formulario.observaciones.trim() || null,
        notas_internas: formulario.notas_internas.trim() || null,
      }

      const { data, error } = await supabase
        .from('revision_aspectos')
        .insert(payload)
        .select(ASPECTO_SELECT)
        .single()

      if (error) {
        setMensaje(`Error al guardar detalle de revisión: ${error.message}`)
        setGuardando(false)
        return
      }

      setAspectos((actuales) => [data as unknown as RevisionAspecto, ...actuales])
      setFormulario(crearFormularioInicial())
      setMensaje('Detalle de revisión guardado correctamente')
      setGuardando(false)
    } catch (error) {
      setMensaje(`Error al preparar vínculo de revisión: ${error instanceof Error ? error.message : 'error desconocido'}`)
      setGuardando(false)
    }
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
          <h1>Detalle de Revisiones</h1>
          <p>Detalle base sobre public.revision_aspectos, vinculado con revisión y elemento del caso.</p>
        </div>

        <section className="clinical-metrics" aria-label="Métricas de detalle de revisiones">
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
        <section className="clinical-panel" aria-label="Listado de detalle de revisiones">
          <div className="clinical-panel__header">
            <div>
              <span className="clinical-kicker">Listado</span>
              <h2>Aspectos revisados</h2>
              <p>Lectura real desde revision_aspectos.</p>
            </div>
            <span className="clinical-count">{aspectosFiltrados.length}</span>
          </div>

          <label className="clinical-search">
            <span>Buscar</span>
            <input
              className="clinical-input"
              placeholder="Caso, elemento, área, aspecto o resultado"
              type="search"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
            />
          </label>

          {aspectosFiltrados.length === 0 ? (
            <div className="clinical-empty">
              <strong>{cargando ? 'Cargando detalles' : 'Sin detalles registrados'}</strong>
              <p>{cargando ? 'Consultando Supabase local.' : 'Crea un detalle cuando existan revisión y elemento compatibles.'}</p>
            </div>
          ) : (
            <div className="clinical-list">
              {aspectosFiltrados.map((aspecto) => {
                const revision = revisionesPorId.get(aspecto.revision_id)
                const caso = casosPorId.get(aspecto.caso_id)
                const elemento = elementosPorId.get(aspecto.elemento_caso_id)

                return (
                  <article className="clinical-card" key={aspecto.id_revision_aspecto}>
                    <div className="clinical-card__top">
                      <div>
                        <h3>{aspecto.aspecto_revisado}</h3>
                        <small>{caso?.nombre_caso || 'Caso no encontrado'} · {elemento?.nombre_elemento || 'Elemento no encontrado'} · Rev. {revision?.numero_revision || '-'}</small>
                      </div>
                      <span className="clinical-badge">{aspecto.estado_revision_aspecto}</span>
                    </div>
                    <p>{textoCorto(aspecto.resultado_aspecto || aspecto.informacion_canalizada || 'Sin resultado registrado.')}</p>
                    <dl className="clinical-details">
                      <div>
                        <dt>Área</dt>
                        <dd>{aspecto.area_revision}</dd>
                      </div>
                      <div>
                        <dt>Medición</dt>
                        <dd>{aspecto.tipo_medicion}</dd>
                      </div>
                      <div>
                        <dt>Valor</dt>
                        <dd>{aspecto.valor_porcentaje ?? 'N/A'}</dd>
                      </div>
                    </dl>
                  </article>
                )
              })}
            </div>
          )}
        </section>

        <section className="clinical-form-panel" aria-label="Nuevo detalle de revisión">
          <div className="clinical-form-panel__header">
            <div>
              <span className="clinical-kicker">Formulario base</span>
              <h2>Nuevo detalle</h2>
              <p>Si no existe el vínculo revision_elementos, se crea con columnas reales mínimas.</p>
            </div>
          </div>

          {(revisiones.length === 0 || elementos.length === 0) && (
            <p className="clinical-note">Para crear detalle de revisión primero debes crear una revisión y un elemento asociado al caso.</p>
          )}

          <form className="clinical-form" onSubmit={guardarDetalle}>
            <label className="clinical-field">
              <span>Revisión *</span>
              <select
                className="clinical-select"
                disabled={guardando || revisiones.length === 0}
                value={formulario.revision_id}
                onChange={(event) => actualizarRevision(event.target.value)}
                required
              >
                <option value="">Seleccionar revisión</option>
                {revisiones.map((revision) => {
                  const caso = casosPorId.get(revision.caso_id)
                  return <option key={revision.id_revision} value={revision.id_revision}>{caso?.nombre_caso || 'Caso'} · revisión {revision.numero_revision}</option>
                })}
              </select>
            </label>

            <label className="clinical-field">
              <span>Elemento del caso *</span>
              <select
                className="clinical-select"
                disabled={guardando || elementosDisponibles.length === 0}
                value={formulario.elemento_caso_id}
                onChange={(event) => actualizarFormulario('elemento_caso_id', event.target.value)}
                required
              >
                <option value="">Seleccionar elemento</option>
                {elementosDisponibles.map((elemento) => (
                  <option key={elemento.id_elemento_caso} value={elemento.id_elemento_caso}>{elemento.nombre_elemento} · {elemento.tipo_elemento}</option>
                ))}
              </select>
            </label>

            {revisionSeleccionada && elementosDisponibles.length === 0 && (
              <p className="clinical-note">Para crear detalle de revisión primero debes crear un elemento asociado al caso.</p>
            )}

            <div className="clinical-grid">
              <label className="clinical-field">
                <span>Área *</span>
                <select className="clinical-select" disabled={guardando} value={formulario.area_revision} onChange={(event) => actualizarFormulario('area_revision', event.target.value as AreaRevision)} required>
                  {areasRevision.map((area) => <option key={area} value={area}>{area}</option>)}
                </select>
              </label>

              <label className="clinical-field">
                <span>Estado *</span>
                <select className="clinical-select" disabled={guardando} value={formulario.estado_revision_aspecto} onChange={(event) => actualizarFormulario('estado_revision_aspecto', event.target.value as EstadoRevisionAspecto)} required>
                  {estadosAspecto.map((estado) => <option key={estado} value={estado}>{estado}</option>)}
                </select>
              </label>
            </div>

            <label className="clinical-field">
              <span>Aspecto revisado *</span>
              <input className="clinical-input" disabled={guardando} value={formulario.aspecto_revisado} onChange={(event) => actualizarFormulario('aspecto_revisado', event.target.value)} required />
            </label>

            <div className="clinical-grid">
              <label className="clinical-field">
                <span>Método *</span>
                <select className="clinical-select" disabled={guardando} value={formulario.metodo_revision} onChange={(event) => actualizarFormulario('metodo_revision', event.target.value as MetodoRevision)} required>
                  {metodosRevision.map((metodo) => <option key={metodo} value={metodo}>{metodo}</option>)}
                </select>
              </label>

              <label className="clinical-field">
                <span>Tipo medición *</span>
                <select className="clinical-select" disabled={guardando} value={formulario.tipo_medicion} onChange={(event) => actualizarFormulario('tipo_medicion', event.target.value as TipoMedicion)} required>
                  {tiposMedicion.map((tipo) => <option key={tipo} value={tipo}>{tipo}</option>)}
                </select>
              </label>
            </div>

            <div className="clinical-grid">
              <label className="clinical-field">
                <span>Métrica</span>
                <select className="clinical-select" disabled={guardando} value={formulario.metrica_revision} onChange={(event) => actualizarFormulario('metrica_revision', event.target.value)}>
                  <option value="">Sin métrica</option>
                  {metricasRevision.map((metrica) => <option key={metrica} value={metrica}>{metrica}</option>)}
                </select>
              </label>

              <label className="clinical-field">
                <span>Valor %</span>
                <input className="clinical-input" disabled={guardando} max="100" min="0" type="number" value={formulario.valor_porcentaje} onChange={(event) => actualizarFormulario('valor_porcentaje', event.target.value)} />
              </label>
            </div>

            <div className="clinical-grid">
              <label className="clinical-field">
                <span>Presencia</span>
                <select className="clinical-select" disabled={guardando} value={formulario.presencia_detectada} onChange={(event) => actualizarFormulario('presencia_detectada', event.target.value)}>
                  <option value="">No aplica</option>
                  <option value="true">Detectada</option>
                  <option value="false">No detectada</option>
                </select>
              </label>

              <label className="clinical-field">
                <span>Orden</span>
                <input className="clinical-input" disabled={guardando} min="1" type="number" value={formulario.orden_aspecto} onChange={(event) => actualizarFormulario('orden_aspecto', event.target.value)} />
              </label>
            </div>

            <label className="clinical-field">
              <span>Tipo detectado</span>
              <input className="clinical-input" disabled={guardando} value={formulario.tipo_detectado} onChange={(event) => actualizarFormulario('tipo_detectado', event.target.value)} />
            </label>

            <label className="clinical-field">
              <span>Resultado</span>
              <textarea className="clinical-textarea" disabled={guardando} value={formulario.resultado_aspecto} onChange={(event) => actualizarFormulario('resultado_aspecto', event.target.value)} />
            </label>

            <label className="clinical-checkbox">
              <input checked={formulario.requiere_seguimiento} disabled={guardando} type="checkbox" onChange={(event) => actualizarFormulario('requiere_seguimiento', event.target.checked)} />
              <span>Requiere seguimiento</span>
            </label>

            <label className="clinical-checkbox">
              <input checked={formulario.pendiente_revision} disabled={guardando} type="checkbox" onChange={(event) => actualizarFormulario('pendiente_revision', event.target.checked)} />
              <span>Queda pendiente de revisión</span>
            </label>

            <label className="clinical-field">
              <span>Motivo pendiente</span>
              <textarea className="clinical-textarea" disabled={guardando} value={formulario.motivo_pendiente} onChange={(event) => actualizarFormulario('motivo_pendiente', event.target.value)} />
            </label>

            <label className="clinical-field">
              <span>Información canalizada</span>
              <textarea className="clinical-textarea" disabled={guardando} value={formulario.informacion_canalizada} onChange={(event) => actualizarFormulario('informacion_canalizada', event.target.value)} />
            </label>

            <label className="clinical-field">
              <span>Observaciones</span>
              <textarea className="clinical-textarea" disabled={guardando} value={formulario.observaciones} onChange={(event) => actualizarFormulario('observaciones', event.target.value)} />
            </label>

            <label className="clinical-field">
              <span>Notas internas</span>
              <textarea className="clinical-textarea" disabled={guardando} value={formulario.notas_internas} onChange={(event) => actualizarFormulario('notas_internas', event.target.value)} />
            </label>

            <button className="clinical-button" disabled={guardando || revisiones.length === 0 || elementos.length === 0} type="submit">
              {guardando ? 'Guardando...' : 'Guardar detalle'}
            </button>
          </form>

          <p className="clinical-note">
            Paciente: {nombrePaciente(pacientesPorId.get(formulario.paciente_id))}. Caso: {casosPorId.get(formulario.caso_id)?.nombre_caso || 'sin caso seleccionado'}.
          </p>

          {mensaje && <p className={mensaje.startsWith('Error') ? 'clinical-message clinical-message--error' : 'clinical-message'}>{mensaje}</p>}
        </section>
      </section>
    </main>
  )
}

export default DetalleRevisionesPage
