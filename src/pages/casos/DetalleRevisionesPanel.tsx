import type { FormEvent } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRevisionHallazgos } from '../../hooks/useRevisionHallazgos'
import { supabase } from '../../lib/supabase'
import {
  categoriasHallazgo,
  estadosHallazgo,
  fuentesDeteccion,
  nivelesConfirmacion,
  prioridadesHallazgo,
  type CategoriaHallazgo,
  type CrearRevisionHallazgoPayload,
  type EstadoHallazgo,
  type FuenteDeteccion,
  type NivelConfirmacion,
  type PrioridadHallazgo,
  type RevisionHallazgo,
} from '../../types/revisionHallazgos'
import '../ClinicalModuleBase.css'

type DetalleRevisionesPanelProps = {
  casoId: string
  pacienteId: string
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

type FormularioHallazgo = {
  categoria_hallazgo: CategoriaHallazgo
  tipo_hallazgo: string
  subtipo_hallazgo: string
  descripcion_hallazgo: string
  intensidad_hallazgo_porcentaje: string
  nivel_bloqueo_porcentaje: string
  origen_sugerido: string
  fuente_deteccion: FuenteDeteccion
  nivel_confirmacion: NivelConfirmacion
  requiere_seguimiento: boolean
  prioridad_hallazgo: '' | PrioridadHallazgo
  estado_hallazgo: EstadoHallazgo
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

function crearFormularioHallazgoInicial(): FormularioHallazgo {
  return {
    categoria_hallazgo: 'Otro',
    tipo_hallazgo: '',
    subtipo_hallazgo: '',
    descripcion_hallazgo: '',
    intensidad_hallazgo_porcentaje: '',
    nivel_bloqueo_porcentaje: '',
    origen_sugerido: '',
    fuente_deteccion: 'Radiestesia',
    nivel_confirmacion: 'Detectado',
    requiere_seguimiento: false,
    prioridad_hallazgo: '',
    estado_hallazgo: 'Activo',
    informacion_canalizada: '',
    observaciones: '',
    notas_internas: '',
  }
}

function normalizarTexto(texto: string) {
  return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
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

function validarFormulario(formulario: FormularioDetalle, revisiones: Revision[], elementos: ElementoCaso[], casoId: string, pacienteId: string) {
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

  if (revision.caso_id !== casoId || elemento.caso_id !== casoId || revision.paciente_id !== pacienteId || elemento.paciente_id !== pacienteId) {
    return 'La revisión y el elemento deben pertenecer al caso y paciente abiertos.'
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

function validarPorcentajeHallazgo(valor: string, etiqueta: string) {
  if (!valor.trim()) {
    return ''
  }

  const numero = Number(valor)

  if (!Number.isInteger(numero) || numero < 0 || numero > 100) {
    return `${etiqueta} debe ser un entero entre 0 y 100.`
  }

  return ''
}

function obtenerPorcentajeHallazgo(valor: string) {
  return valor.trim() ? Number(valor) : null
}

function validarFormularioHallazgo(aspecto: RevisionAspecto | null, formulario: FormularioHallazgo) {
  if (!aspecto) {
    return 'Selecciona un aspecto revisado para crear el hallazgo.'
  }

  if (!aspecto.id_revision_aspecto) {
    return 'No se puede crear un hallazgo sin aspecto revisado asociado.'
  }

  if (!aspecto.paciente_id || !aspecto.caso_id || !aspecto.revision_id || !aspecto.revision_elemento_id || !aspecto.elemento_caso_id) {
    return 'Faltan relaciones críticas del aspecto para crear el hallazgo.'
  }

  if (!formulario.descripcion_hallazgo.trim()) {
    return 'Completa la descripción del hallazgo.'
  }

  return validarPorcentajeHallazgo(formulario.intensidad_hallazgo_porcentaje, 'La intensidad del hallazgo')
    || validarPorcentajeHallazgo(formulario.nivel_bloqueo_porcentaje, 'El nivel de bloqueo')
}

function DetalleRevisionesPanel({ casoId, pacienteId }: DetalleRevisionesPanelProps) {
  const [revisiones, setRevisiones] = useState<Revision[]>([])
  const [elementos, setElementos] = useState<ElementoCaso[]>([])
  const [revisionElementos, setRevisionElementos] = useState<RevisionElemento[]>([])
  const [aspectos, setAspectos] = useState<RevisionAspecto[]>([])
  const [formulario, setFormulario] = useState<FormularioDetalle>(() => crearFormularioInicial())
  const [busqueda, setBusqueda] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [revisionHallazgosId, setRevisionHallazgosId] = useState('')
  const [aspectoHallazgoActivo, setAspectoHallazgoActivo] = useState<RevisionAspecto | null>(null)
  const [hallazgoEnVista, setHallazgoEnVista] = useState<RevisionHallazgo | null>(null)
  const [formularioHallazgo, setFormularioHallazgo] = useState<FormularioHallazgo>(() => crearFormularioHallazgoInicial())
  const [mensajeHallazgos, setMensajeHallazgos] = useState('')
  const [guardandoHallazgo, setGuardandoHallazgo] = useState(false)
  const {
    hallazgos,
    cargando: cargandoHallazgos,
    error: errorHallazgos,
    refrescarHallazgos,
    listarHallazgosPorRevision,
    listarHallazgosPorAspecto,
    obtenerHallazgoPorAspecto,
    existeHallazgoParaAspecto,
    crearHallazgoDesdeAspecto,
  } = useRevisionHallazgos({ casoId, pacienteId })

  const revisionesPorId = useMemo(() => new Map(revisiones.map((revision) => [revision.id_revision, revision])), [revisiones])
  const elementosPorId = useMemo(() => new Map(elementos.map((elemento) => [elemento.id_elemento_caso, elemento])), [elementos])
  const revisionSeleccionada = revisionesPorId.get(formulario.revision_id)
  const revisionHallazgosSeleccionadaId = revisionHallazgosId && revisionesPorId.has(revisionHallazgosId)
    ? revisionHallazgosId
    : revisiones[0]?.id_revision || ''
  const revisionHallazgosSeleccionada = revisionesPorId.get(revisionHallazgosSeleccionadaId)
  const hallazgosRevisionSeleccionada = useMemo(() => (
    revisionHallazgosSeleccionadaId ? listarHallazgosPorRevision(revisionHallazgosSeleccionadaId) : []
  ), [listarHallazgosPorRevision, revisionHallazgosSeleccionadaId])

  const aspectosFiltrados = useMemo(() => {
    if (!busqueda.trim()) {
      return aspectos
    }

    const filtro = normalizarTexto(busqueda.trim())

    return aspectos.filter((aspecto) => {
      const revision = revisionesPorId.get(aspecto.revision_id)
      const elemento = elementosPorId.get(aspecto.elemento_caso_id)
      const texto = [
        aspecto.area_revision,
        aspecto.aspecto_revisado,
        aspecto.metodo_revision,
        aspecto.tipo_medicion,
        aspecto.metrica_revision || '',
        aspecto.estado_revision_aspecto,
        aspecto.resultado_aspecto || '',
        elemento?.nombre_elemento || '',
        revision?.numero_revision || '',
      ].join(' ')

      return normalizarTexto(texto).includes(filtro)
    })
  }, [aspectos, busqueda, elementosPorId, revisionesPorId])

  const metricas = [
    { etiqueta: 'Total', valor: aspectos.length, detalle: 'Aspectos del caso' },
    { etiqueta: 'Pendientes', valor: aspectos.filter((aspecto) => aspecto.estado_revision_aspecto === 'Pendiente').length, detalle: 'Por revisar' },
    { etiqueta: 'Seguimiento', valor: aspectos.filter((aspecto) => aspecto.requiere_seguimiento).length, detalle: 'Con acción pendiente' },
    { etiqueta: 'Presencia', valor: aspectos.filter((aspecto) => aspecto.presencia_detectada === true).length, detalle: 'Detectadas' },
    { etiqueta: 'Hallazgos', valor: hallazgos.length, detalle: 'Registrados' },
  ]

  function actualizarFormulario(campo: keyof FormularioDetalle, valor: string | boolean) {
    setFormulario((actual) => ({ ...actual, [campo]: valor }))
  }

  function actualizarFormularioHallazgo(campo: keyof FormularioHallazgo, valor: string | boolean) {
    setFormularioHallazgo((actual) => ({ ...actual, [campo]: valor }))
  }

  function actualizarRevision(revisionId: string) {
    setFormulario((actual) => ({
      ...actual,
      revision_id: revisionId,
      elemento_caso_id: '',
    }))
  }

  function abrirFormularioHallazgo(aspecto: RevisionAspecto) {
    const hallazgoExistente = obtenerHallazgoPorAspecto(aspecto.id_revision_aspecto)

    if (hallazgoExistente) {
      setHallazgoEnVista(hallazgoExistente)
      setMensajeHallazgos('Ya existe un hallazgo asociado a este aspecto. Revisa el registro antes de crear uno nuevo.')
      return
    }

    setAspectoHallazgoActivo(aspecto)
    setFormularioHallazgo(crearFormularioHallazgoInicial())
    setMensajeHallazgos('')
  }

  function cerrarFormularioHallazgo() {
    if (guardandoHallazgo) {
      return
    }

    setAspectoHallazgoActivo(null)
    setFormularioHallazgo(crearFormularioHallazgoInicial())
  }

  function verHallazgo(hallazgo: RevisionHallazgo) {
    setHallazgoEnVista(hallazgo)
    setMensajeHallazgos('')
  }

  async function guardarHallazgo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const errorFormulario = validarFormularioHallazgo(aspectoHallazgoActivo, formularioHallazgo)

    if (errorFormulario) {
      setMensajeHallazgos(`Error: ${errorFormulario}`)
      return
    }

    if (!aspectoHallazgoActivo) {
      setMensajeHallazgos('Error: No fue posible resolver el aspecto revisado.')
      return
    }

    setGuardandoHallazgo(true)
    setMensajeHallazgos('Guardando hallazgo...')

    const payload: CrearRevisionHallazgoPayload = {
      paciente_id: aspectoHallazgoActivo.paciente_id,
      caso_id: aspectoHallazgoActivo.caso_id,
      revision_id: aspectoHallazgoActivo.revision_id,
      revision_elemento_id: aspectoHallazgoActivo.revision_elemento_id,
      revision_aspecto_id: aspectoHallazgoActivo.id_revision_aspecto,
      elemento_caso_id: aspectoHallazgoActivo.elemento_caso_id,
      categoria_hallazgo: formularioHallazgo.categoria_hallazgo,
      tipo_hallazgo: formularioHallazgo.tipo_hallazgo.trim() || null,
      subtipo_hallazgo: formularioHallazgo.subtipo_hallazgo.trim() || null,
      descripcion_hallazgo: formularioHallazgo.descripcion_hallazgo.trim(),
      intensidad_hallazgo_porcentaje: obtenerPorcentajeHallazgo(formularioHallazgo.intensidad_hallazgo_porcentaje),
      nivel_bloqueo_porcentaje: obtenerPorcentajeHallazgo(formularioHallazgo.nivel_bloqueo_porcentaje),
      origen_sugerido: formularioHallazgo.origen_sugerido.trim() || null,
      fuente_deteccion: formularioHallazgo.fuente_deteccion,
      nivel_confirmacion: formularioHallazgo.nivel_confirmacion,
      requiere_seguimiento: formularioHallazgo.requiere_seguimiento,
      prioridad_hallazgo: formularioHallazgo.prioridad_hallazgo || null,
      estado_hallazgo: formularioHallazgo.estado_hallazgo,
      informacion_canalizada: formularioHallazgo.informacion_canalizada.trim() || null,
      observaciones: formularioHallazgo.observaciones.trim() || null,
      notas_internas: formularioHallazgo.notas_internas.trim() || null,
    }

    try {
      const hallazgoCreado = await crearHallazgoDesdeAspecto(payload)
      await refrescarHallazgos()
      setRevisionHallazgosId(hallazgoCreado.revision_id)
      setAspectoHallazgoActivo(null)
      setFormularioHallazgo(crearFormularioHallazgoInicial())
      setMensajeHallazgos('Hallazgo guardado correctamente en esta revisión')
    } catch (error) {
      setMensajeHallazgos(`Error al guardar hallazgo: ${error instanceof Error ? error.message : 'error desconocido'}`)
    } finally {
      setGuardandoHallazgo(false)
    }
  }

  const cargarDatos = useCallback(async () => {
    setCargando(true)
    setMensaje('')

    const { data: revisionesData, error: revisionesError } = await supabase
      .from('revisiones')
      .select('id_revision, paciente_id, caso_id, fecha_revision, numero_revision, tipo_revision, estado_revision')
      .eq('caso_id', casoId)
      .eq('paciente_id', pacienteId)
      .order('fecha_revision', { ascending: false })

    if (revisionesError) {
      setMensaje(`Error al cargar revisiones: ${revisionesError.message}`)
      setCargando(false)
      return
    }

    const { data: elementosData, error: elementosError } = await supabase
      .from('elementos_caso')
      .select('id_elemento_caso, paciente_id, caso_id, tipo_elemento, nombre_elemento, estado_elemento')
      .eq('caso_id', casoId)
      .eq('paciente_id', pacienteId)
      .order('created_at', { ascending: false })

    if (elementosError) {
      setMensaje(`Error al cargar elementos: ${elementosError.message}`)
      setCargando(false)
      return
    }

    const { data: revisionElementosData, error: revisionElementosError } = await supabase
      .from('revision_elementos')
      .select(REVISION_ELEMENTO_SELECT)
      .eq('caso_id', casoId)
      .eq('paciente_id', pacienteId)
      .order('created_at', { ascending: false })

    if (revisionElementosError) {
      setMensaje(`Error al cargar vínculos de revisión: ${revisionElementosError.message}`)
      setCargando(false)
      return
    }

    const { data: aspectosData, error: aspectosError } = await supabase
      .from('revision_aspectos')
      .select(ASPECTO_SELECT)
      .eq('caso_id', casoId)
      .eq('paciente_id', pacienteId)
      .order('created_at', { ascending: false })

    if (aspectosError) {
      setMensaje(`Error al cargar detalle de revisiones: ${aspectosError.message}`)
      setCargando(false)
      return
    }

    setRevisiones((revisionesData || []) as Revision[])
    setElementos((elementosData || []) as ElementoCaso[])
    setRevisionElementos((revisionElementosData || []) as unknown as RevisionElemento[])
    setAspectos((aspectosData || []) as unknown as RevisionAspecto[])
    setFormulario(crearFormularioInicial())
    setCargando(false)
  }, [casoId, pacienteId])

  async function obtenerRevisionElemento(revision: Revision, elemento: ElementoCaso) {
    const existente = revisionElementos.find((item) => (
      item.revision_id === revision.id_revision
      && item.elemento_caso_id === elemento.id_elemento_caso
    ))

    if (existente) {
      return existente
    }

    const payload = {
      paciente_id: pacienteId,
      caso_id: casoId,
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

    const errorFormulario = validarFormulario(formulario, revisiones, elementos, casoId, pacienteId)

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
        paciente_id: pacienteId,
        caso_id: casoId,
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
      setMensaje('Detalle de revisión guardado correctamente en este caso')
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
  }, [cargarDatos])

  const revisionOrigenHallazgo = aspectoHallazgoActivo ? revisionesPorId.get(aspectoHallazgoActivo.revision_id) : null
  const elementoOrigenHallazgo = aspectoHallazgoActivo ? elementosPorId.get(aspectoHallazgoActivo.elemento_caso_id) : null
  const aspectoOrigenVista = hallazgoEnVista ? aspectos.find((aspecto) => aspecto.id_revision_aspecto === hallazgoEnVista.revision_aspecto_id) : null
  const revisionVista = hallazgoEnVista ? revisionesPorId.get(hallazgoEnVista.revision_id) : null
  const elementoVista = hallazgoEnVista ? elementosPorId.get(hallazgoEnVista.elemento_caso_id) : null

  return (
    <section className="caso-detail-section" id="detalle-revisiones">
      <div className="caso-section-heading">
        <div>
          <span className="clinical-kicker">Detalle de revisiones</span>
          <h2>Aspectos revisados</h2>
          <p>Filtrado por `revision_aspectos.caso_id`; cada detalle se asocia a una revisión y un elemento reales del caso.</p>
        </div>
      </div>

      <section className="clinical-metrics caso-detail-metrics" aria-label="Métricas de detalle de revisiones">
        {metricas.map((metrica) => (
          <article className="clinical-metric-card" key={metrica.etiqueta}>
            <strong>{metrica.valor}</strong>
            <span>{metrica.etiqueta}</span>
            <p>{metrica.detalle}</p>
          </article>
        ))}
      </section>

      <section className="clinical-layout caso-panel-layout">
        <section className="clinical-panel" aria-label="Aspectos revisados en el caso">
          <div className="clinical-panel__header">
            <div>
              <span className="clinical-kicker">Listado</span>
              <h2>Aspectos</h2>
              <p>Requiere revisiones y elementos del caso para crear nuevos detalles.</p>
            </div>
            <span className="clinical-count">{aspectosFiltrados.length}</span>
          </div>

          <label className="clinical-search">
            <span>Buscar</span>
            <input
              className="clinical-input"
              placeholder="Elemento, área, aspecto, medición o resultado"
              type="search"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
            />
          </label>

          {aspectosFiltrados.length === 0 ? (
            <div className="clinical-empty">
              <strong>{cargando ? 'Cargando detalles' : 'Sin detalles registrados en este caso'}</strong>
              <p>{cargando ? 'Consultando Supabase local.' : 'Crea un detalle cuando existan revisión y elemento compatibles.'}</p>
            </div>
          ) : (
            <div className="clinical-list">
              {aspectosFiltrados.map((aspecto) => {
                const revision = revisionesPorId.get(aspecto.revision_id)
                const elemento = elementosPorId.get(aspecto.elemento_caso_id)
                const hallazgosDelAspecto = listarHallazgosPorAspecto(aspecto.id_revision_aspecto)
                const hallazgoPrincipal = hallazgosDelAspecto[0] || null
                const tieneRelacionesHallazgo = Boolean(
                  aspecto.paciente_id
                  && aspecto.caso_id
                  && aspecto.revision_id
                  && aspecto.revision_elemento_id
                  && aspecto.id_revision_aspecto
                  && aspecto.elemento_caso_id,
                )

                return (
                  <article className="clinical-card" key={aspecto.id_revision_aspecto}>
                    <div className="clinical-card__top">
                      <div>
                        <h3>{aspecto.aspecto_revisado}</h3>
                        <small>{elemento?.nombre_elemento || 'Elemento no encontrado'} · Rev. {revision?.numero_revision || '-'}</small>
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

                    <div className="clinical-hallazgo-context">
                      {hallazgoPrincipal ? (
                        <>
                          <div className="clinical-hallazgo-context__header">
                            <span className="clinical-badge">Hallazgo registrado</span>
                            {hallazgoPrincipal.prioridad_hallazgo && <span className="clinical-badge clinical-badge--muted">{hallazgoPrincipal.prioridad_hallazgo}</span>}
                            <span className="clinical-badge clinical-badge--muted">{hallazgoPrincipal.estado_hallazgo}</span>
                          </div>
                          <p>{textoCorto(hallazgoPrincipal.descripcion_hallazgo, 140)}</p>
                          <div className="clinical-actions">
                            <button className="clinical-button clinical-button--secondary clinical-button--compact" type="button" onClick={() => verHallazgo(hallazgoPrincipal)}>
                              Ver hallazgo
                            </button>
                            <button className="clinical-button clinical-button--ghost clinical-button--compact" disabled type="button">
                              Evaluar trabajo próximamente
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <p>Si este resultado es clínicamente relevante, puedes registrarlo como hallazgo.</p>
                          <button
                            className="clinical-button clinical-button--secondary clinical-button--compact"
                            disabled={!tieneRelacionesHallazgo || cargandoHallazgos || guardandoHallazgo || existeHallazgoParaAspecto(aspecto.id_revision_aspecto)}
                            type="button"
                            onClick={() => abrirFormularioHallazgo(aspecto)}
                          >
                            Crear hallazgo
                          </button>
                        </>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          )}

          <section className="clinical-hallazgos-panel" aria-label="Hallazgos de esta revisión">
            <div className="clinical-hallazgos-panel__header">
              <div>
                <span className="clinical-kicker">Hallazgos</span>
                <h3>Hallazgos de esta revisión</h3>
                <p>Un aspecto revisado registra lo observado o medido; un hallazgo guarda solo aquello que necesita destacarse, seguirse o evaluarse.</p>
              </div>
              <span className="clinical-count">{hallazgosRevisionSeleccionada.length}</span>
            </div>

            <label className="clinical-field">
              <span>Revisión</span>
              <select className="clinical-select" disabled={revisiones.length === 0} value={revisionHallazgosSeleccionadaId} onChange={(event) => setRevisionHallazgosId(event.target.value)}>
                <option value="">Seleccionar revisión</option>
                {revisiones.map((revision) => (
                  <option key={revision.id_revision} value={revision.id_revision}>Revisión {revision.numero_revision} · {formatearFecha(revision.fecha_revision)}</option>
                ))}
              </select>
            </label>

            {errorHallazgos && <p className="clinical-message clinical-message--error">{errorHallazgos}</p>}

            {cargandoHallazgos ? (
              <div className="clinical-empty">
                <strong>Cargando hallazgos</strong>
                <p>Consultando hallazgos asociados al caso.</p>
              </div>
            ) : hallazgosRevisionSeleccionada.length === 0 ? (
              <div className="clinical-empty">
                <strong>{revisionHallazgosSeleccionada ? `Revisión ${revisionHallazgosSeleccionada.numero_revision} sin hallazgos` : 'Sin revisión seleccionada'}</strong>
                <p>Aún no hay hallazgos registrados en esta revisión. Los hallazgos se crean desde un aspecto revisado cuando el resultado requiere seguimiento, prioridad o posible intervención.</p>
              </div>
            ) : (
              <div className="clinical-list">
                {hallazgosRevisionSeleccionada.map((hallazgo) => {
                  const aspectoOrigen = aspectos.find((aspecto) => aspecto.id_revision_aspecto === hallazgo.revision_aspecto_id)
                  const elementoOrigen = elementosPorId.get(hallazgo.elemento_caso_id)

                  return (
                    <article className="clinical-hallazgo-item" key={hallazgo.id_revision_hallazgo}>
                      <div className="clinical-card__top">
                        <div>
                          <h4>{hallazgo.categoria_hallazgo}</h4>
                          <small>{elementoOrigen?.nombre_elemento || 'Elemento no encontrado'} · {aspectoOrigen?.aspecto_revisado || 'Aspecto no encontrado'}</small>
                        </div>
                        <span className="clinical-badge">{hallazgo.estado_hallazgo}</span>
                      </div>
                      <p>{textoCorto(hallazgo.descripcion_hallazgo, 150)}</p>
                      <dl className="clinical-details">
                        <div>
                          <dt>Prioridad</dt>
                          <dd>{hallazgo.prioridad_hallazgo || 'Sin prioridad'}</dd>
                        </div>
                        <div>
                          <dt>Seguimiento</dt>
                          <dd>{hallazgo.requiere_seguimiento ? 'Sí' : 'No'}</dd>
                        </div>
                        <div>
                          <dt>Fuente</dt>
                          <dd>{hallazgo.fuente_deteccion}</dd>
                        </div>
                      </dl>
                      <div className="clinical-actions">
                        <button className="clinical-button clinical-button--secondary clinical-button--compact" type="button" onClick={() => verHallazgo(hallazgo)}>
                          Ver hallazgo
                        </button>
                        <button className="clinical-button clinical-button--ghost clinical-button--compact" disabled type="button">
                          Evaluar trabajo próximamente
                        </button>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </section>

          {mensajeHallazgos && (
            <p className={mensajeHallazgos.startsWith('Error') ? 'clinical-message clinical-message--error' : 'clinical-message'}>
              {mensajeHallazgos}
            </p>
          )}
        </section>

        <section className="clinical-form-panel" aria-label="Nuevo detalle de revisión del caso">
          <div className="clinical-form-panel__header">
            <div>
              <span className="clinical-kicker">Formulario</span>
              <h2>Nuevo detalle</h2>
              <p>Si falta el vínculo `revision_elementos`, se crea para esta revisión y este elemento.</p>
            </div>
          </div>

          {(revisiones.length === 0 || elementos.length === 0) && (
            <p className="clinical-note">Para crear detalle de revisión primero debes crear una revisión y un elemento asociado al caso.</p>
          )}

          <form className="clinical-form" onSubmit={guardarDetalle}>
            <label className="clinical-field">
              <span>Revisión *</span>
              <select className="clinical-select" disabled={guardando || revisiones.length === 0} value={formulario.revision_id} onChange={(event) => actualizarRevision(event.target.value)} required>
                <option value="">Seleccionar revisión</option>
                {revisiones.map((revision) => (
                  <option key={revision.id_revision} value={revision.id_revision}>Revisión {revision.numero_revision} · {formatearFecha(revision.fecha_revision)}</option>
                ))}
              </select>
            </label>

            <label className="clinical-field">
              <span>Elemento del caso *</span>
              <select className="clinical-select" disabled={guardando || !revisionSeleccionada || elementos.length === 0} value={formulario.elemento_caso_id} onChange={(event) => actualizarFormulario('elemento_caso_id', event.target.value)} required>
                <option value="">Seleccionar elemento</option>
                {elementos.map((elemento) => (
                  <option key={elemento.id_elemento_caso} value={elemento.id_elemento_caso}>{elemento.nombre_elemento} · {elemento.tipo_elemento}</option>
                ))}
              </select>
            </label>

            {revisionSeleccionada && elementos.length === 0 && (
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

          {mensaje && <p className={mensaje.startsWith('Error') ? 'clinical-message clinical-message--error' : 'clinical-message'}>{mensaje}</p>}
        </section>
      </section>

      {aspectoHallazgoActivo && (
        <div className="clinical-modal-backdrop">
          <section className="clinical-modal" role="dialog" aria-modal="true" aria-labelledby="crear-hallazgo-titulo">
            <div className="clinical-modal__header">
              <div>
                <span className="clinical-kicker">Hallazgo operativo</span>
                <h2 id="crear-hallazgo-titulo">Crear hallazgo desde aspecto revisado</h2>
                <p>Describe solo lo clínicamente relevante. El contexto del caso, revisión, elemento y aspecto se hereda automáticamente.</p>
              </div>
              <button className="clinical-icon-button" disabled={guardandoHallazgo} type="button" aria-label="Cerrar formulario de hallazgo" onClick={cerrarFormularioHallazgo}>
                ×
              </button>
            </div>

            <div className="clinical-origin-summary">
              <span>Origen</span>
              <strong>Revisión {revisionOrigenHallazgo?.numero_revision || '-'} · {elementoOrigenHallazgo?.nombre_elemento || 'Elemento no encontrado'}</strong>
              <p>{aspectoHallazgoActivo.aspecto_revisado}</p>
              <small>{aspectoHallazgoActivo.area_revision} · {aspectoHallazgoActivo.tipo_medicion}{aspectoHallazgoActivo.valor_porcentaje !== null ? ` · ${aspectoHallazgoActivo.valor_porcentaje}%` : ''}</small>
            </div>

            <form className="clinical-form" onSubmit={guardarHallazgo}>
              <div className="clinical-grid">
                <label className="clinical-field">
                  <span>Categoría *</span>
                  <select className="clinical-select" disabled={guardandoHallazgo} value={formularioHallazgo.categoria_hallazgo} onChange={(event) => actualizarFormularioHallazgo('categoria_hallazgo', event.target.value as CategoriaHallazgo)} required>
                    {categoriasHallazgo.map((categoria) => <option key={categoria} value={categoria}>{categoria}</option>)}
                  </select>
                </label>

                <label className="clinical-field">
                  <span>Estado *</span>
                  <select className="clinical-select" disabled={guardandoHallazgo} value={formularioHallazgo.estado_hallazgo} onChange={(event) => actualizarFormularioHallazgo('estado_hallazgo', event.target.value as EstadoHallazgo)} required>
                    {estadosHallazgo.map((estado) => <option key={estado} value={estado}>{estado}</option>)}
                  </select>
                </label>
              </div>

              <label className="clinical-field">
                <span>Descripción del hallazgo *</span>
                <textarea className="clinical-textarea" disabled={guardandoHallazgo} value={formularioHallazgo.descripcion_hallazgo} onChange={(event) => actualizarFormularioHallazgo('descripcion_hallazgo', event.target.value)} required />
              </label>

              <div className="clinical-grid">
                <label className="clinical-field">
                  <span>Prioridad</span>
                  <select className="clinical-select" disabled={guardandoHallazgo} value={formularioHallazgo.prioridad_hallazgo} onChange={(event) => actualizarFormularioHallazgo('prioridad_hallazgo', event.target.value as '' | PrioridadHallazgo)}>
                    <option value="">Sin prioridad</option>
                    {prioridadesHallazgo.map((prioridad) => <option key={prioridad} value={prioridad}>{prioridad}</option>)}
                  </select>
                </label>

                <label className="clinical-field">
                  <span>Fuente</span>
                  <select className="clinical-select" disabled={guardandoHallazgo} value={formularioHallazgo.fuente_deteccion} onChange={(event) => actualizarFormularioHallazgo('fuente_deteccion', event.target.value as FuenteDeteccion)}>
                    {fuentesDeteccion.map((fuente) => <option key={fuente} value={fuente}>{fuente}</option>)}
                  </select>
                </label>
              </div>

              <label className="clinical-checkbox">
                <input checked={formularioHallazgo.requiere_seguimiento} disabled={guardandoHallazgo} type="checkbox" onChange={(event) => actualizarFormularioHallazgo('requiere_seguimiento', event.target.checked)} />
                <span>Requiere seguimiento</span>
              </label>

              <label className="clinical-field">
                <span>Observaciones</span>
                <textarea className="clinical-textarea" disabled={guardandoHallazgo} value={formularioHallazgo.observaciones} onChange={(event) => actualizarFormularioHallazgo('observaciones', event.target.value)} />
              </label>

              <details className="clinical-disclosure">
                <summary>Más detalle</summary>
                <div className="clinical-form clinical-form--nested">
                  <div className="clinical-grid">
                    <label className="clinical-field">
                      <span>Tipo hallazgo</span>
                      <input className="clinical-input" disabled={guardandoHallazgo} value={formularioHallazgo.tipo_hallazgo} onChange={(event) => actualizarFormularioHallazgo('tipo_hallazgo', event.target.value)} />
                    </label>

                    <label className="clinical-field">
                      <span>Subtipo</span>
                      <input className="clinical-input" disabled={guardandoHallazgo} value={formularioHallazgo.subtipo_hallazgo} onChange={(event) => actualizarFormularioHallazgo('subtipo_hallazgo', event.target.value)} />
                    </label>
                  </div>

                  <div className="clinical-grid">
                    <label className="clinical-field">
                      <span>Intensidad %</span>
                      <input className="clinical-input" disabled={guardandoHallazgo} max="100" min="0" type="number" value={formularioHallazgo.intensidad_hallazgo_porcentaje} onChange={(event) => actualizarFormularioHallazgo('intensidad_hallazgo_porcentaje', event.target.value)} />
                    </label>

                    <label className="clinical-field">
                      <span>Nivel bloqueo %</span>
                      <input className="clinical-input" disabled={guardandoHallazgo} max="100" min="0" type="number" value={formularioHallazgo.nivel_bloqueo_porcentaje} onChange={(event) => actualizarFormularioHallazgo('nivel_bloqueo_porcentaje', event.target.value)} />
                    </label>
                  </div>

                  <div className="clinical-grid">
                    <label className="clinical-field">
                      <span>Origen sugerido</span>
                      <input className="clinical-input" disabled={guardandoHallazgo} value={formularioHallazgo.origen_sugerido} onChange={(event) => actualizarFormularioHallazgo('origen_sugerido', event.target.value)} />
                    </label>

                    <label className="clinical-field">
                      <span>Confirmación</span>
                      <select className="clinical-select" disabled={guardandoHallazgo} value={formularioHallazgo.nivel_confirmacion} onChange={(event) => actualizarFormularioHallazgo('nivel_confirmacion', event.target.value as NivelConfirmacion)}>
                        {nivelesConfirmacion.map((nivel) => <option key={nivel} value={nivel}>{nivel}</option>)}
                      </select>
                    </label>
                  </div>

                  <label className="clinical-field">
                    <span>Información canalizada</span>
                    <textarea className="clinical-textarea" disabled={guardandoHallazgo} value={formularioHallazgo.informacion_canalizada} onChange={(event) => actualizarFormularioHallazgo('informacion_canalizada', event.target.value)} />
                  </label>

                  <label className="clinical-field">
                    <span>Notas internas</span>
                    <textarea className="clinical-textarea" disabled={guardandoHallazgo} value={formularioHallazgo.notas_internas} onChange={(event) => actualizarFormularioHallazgo('notas_internas', event.target.value)} />
                  </label>
                </div>
              </details>

              <div className="clinical-actions clinical-actions--end">
                <button className="clinical-button clinical-button--secondary" disabled={guardandoHallazgo} type="button" onClick={cerrarFormularioHallazgo}>
                  Cancelar
                </button>
                <button className="clinical-button" disabled={guardandoHallazgo} type="submit">
                  {guardandoHallazgo ? 'Guardando...' : 'Guardar hallazgo'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {hallazgoEnVista && (
        <div className="clinical-modal-backdrop">
          <section className="clinical-modal clinical-modal--compact" role="dialog" aria-modal="true" aria-labelledby="ver-hallazgo-titulo">
            <div className="clinical-modal__header">
              <div>
                <span className="clinical-kicker">Hallazgo registrado</span>
                <h2 id="ver-hallazgo-titulo">{hallazgoEnVista.categoria_hallazgo}</h2>
                <p>{hallazgoEnVista.descripcion_hallazgo}</p>
              </div>
              <button className="clinical-icon-button" type="button" aria-label="Cerrar hallazgo" onClick={() => setHallazgoEnVista(null)}>
                ×
              </button>
            </div>

            <dl className="clinical-details clinical-details--modal">
              <div>
                <dt>Revisión</dt>
                <dd>{revisionVista ? `Revisión ${revisionVista.numero_revision}` : 'No encontrada'}</dd>
              </div>
              <div>
                <dt>Elemento</dt>
                <dd>{elementoVista?.nombre_elemento || 'No encontrado'}</dd>
              </div>
              <div>
                <dt>Aspecto</dt>
                <dd>{aspectoOrigenVista?.aspecto_revisado || 'No encontrado'}</dd>
              </div>
              <div>
                <dt>Prioridad</dt>
                <dd>{hallazgoEnVista.prioridad_hallazgo || 'Sin prioridad'}</dd>
              </div>
              <div>
                <dt>Estado</dt>
                <dd>{hallazgoEnVista.estado_hallazgo}</dd>
              </div>
              <div>
                <dt>Seguimiento</dt>
                <dd>{hallazgoEnVista.requiere_seguimiento ? 'Sí' : 'No'}</dd>
              </div>
            </dl>

            {(hallazgoEnVista.observaciones || hallazgoEnVista.informacion_canalizada || hallazgoEnVista.notas_internas) && (
              <div className="clinical-readonly-stack">
                {hallazgoEnVista.informacion_canalizada && (
                  <article>
                    <span>Información canalizada</span>
                    <p>{hallazgoEnVista.informacion_canalizada}</p>
                  </article>
                )}
                {hallazgoEnVista.observaciones && (
                  <article>
                    <span>Observaciones</span>
                    <p>{hallazgoEnVista.observaciones}</p>
                  </article>
                )}
                {hallazgoEnVista.notas_internas && (
                  <article>
                    <span>Notas internas</span>
                    <p>{hallazgoEnVista.notas_internas}</p>
                  </article>
                )}
              </div>
            )}

            <p className="clinical-note">Un hallazgo no crea un trabajo automáticamente. Primero debe evaluarse si requiere intervención.</p>

            <div className="clinical-actions clinical-actions--end">
              <button className="clinical-button clinical-button--ghost" disabled type="button">
                Evaluar trabajo próximamente
              </button>
              <button className="clinical-button" type="button" onClick={() => setHallazgoEnVista(null)}>
                Cerrar
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  )
}

export default DetalleRevisionesPanel
