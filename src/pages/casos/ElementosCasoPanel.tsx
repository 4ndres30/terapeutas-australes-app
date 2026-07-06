import type { FormEvent } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { formatearFecha, normalizarTexto, textoCorto } from '../../lib/format'
import { supabase } from '../../lib/supabase'
import '../ClinicalModuleBase.css'

type ElementosCasoPanelProps = {
  casoId: string
  pacienteId: string
  pacienteNombre?: string
}

type TipoElemento = 'Persona' | 'Hogar' | 'Negocio' | 'Lugar' | 'Objeto' | 'Mascota/Animal' | 'Organización' | 'Otro'
type RolElemento =
  | 'Consultante'
  | 'Foco principal'
  | 'Involucrado directo'
  | 'Involucrado secundario'
  | 'Elemento de contexto'
  | 'Posible origen'
  | 'Posible afectado'
  | 'Elemento en observación'
type PrioridadElemento = 'Baja' | 'Media' | 'Alta' | 'Urgente'
type FuenteInformacion = 'Consultante' | 'Evaluación' | 'Consulta' | 'Revisión previa' | 'Documento externo' | 'Observación interna' | 'Otro'
type NivelConfirmacion = 'Declarado por consultante' | 'Confirmado' | 'Por confirmar' | 'Referencial'
type EstadoElemento = 'Activo' | 'En observación' | 'Descartado' | 'Cerrado'
type TipoFotoElemento = 'Principal' | 'Referencia' | 'Evidencia' | 'Antes' | 'Después' | 'Seguimiento' | 'Otro'

type ElementoCaso = {
  id_elemento_caso: string
  paciente_id: string
  caso_id: string
  tipo_elemento: TipoElemento
  nombre_elemento: string
  vinculo_con_paciente: string | null
  rol_en_caso: RolElemento
  prioridad_elemento: PrioridadElemento
  orden_elemento: number | null
  fecha_nacimiento: string | null
  descripcion_referencia: string | null
  antecedentes_relevantes: string | null
  motivo_inclusion: string | null
  fuente_informacion: FuenteInformacion
  nivel_confirmacion: NivelConfirmacion
  estado_elemento: EstadoElemento
  notas_internas: string | null
  created_at: string
}

type FotoElementoCaso = {
  id_foto_elemento_caso: string
  paciente_id: string
  caso_id: string
  elemento_caso_id: string
  bucket_id: string
  storage_path: string
  nombre_archivo: string
  mime_type: string
  tamano_bytes: number | null
  descripcion: string | null
  tipo_foto: TipoFotoElemento
  es_principal: boolean
  estado_foto: string
  created_at: string
  signedUrl?: string
}

type FormularioElemento = {
  tipo_elemento: TipoElemento
  nombre_elemento: string
  vinculo_con_paciente: string
  rol_en_caso: RolElemento
  prioridad_elemento: PrioridadElemento
  orden_elemento: string
  fecha_nacimiento: string
  descripcion_referencia: string
  antecedentes_relevantes: string
  motivo_inclusion: string
  fuente_informacion: FuenteInformacion
  nivel_confirmacion: NivelConfirmacion
  estado_elemento: EstadoElemento
  notas_internas: string
}

type FormularioFoto = {
  elemento_caso_id: string
  descripcion: string
  tipo_foto: TipoFotoElemento
  es_principal: boolean
  archivo: File | null
}

const ELEMENTO_SELECT = [
  'id_elemento_caso',
  'paciente_id',
  'caso_id',
  'tipo_elemento',
  'nombre_elemento',
  'vinculo_con_paciente',
  'rol_en_caso',
  'prioridad_elemento',
  'orden_elemento',
  'fecha_nacimiento',
  'descripcion_referencia',
  'antecedentes_relevantes',
  'motivo_inclusion',
  'fuente_informacion',
  'nivel_confirmacion',
  'estado_elemento',
  'notas_internas',
  'created_at',
].join(', ')

const FOTO_SELECT = [
  'id_foto_elemento_caso',
  'paciente_id',
  'caso_id',
  'elemento_caso_id',
  'bucket_id',
  'storage_path',
  'nombre_archivo',
  'mime_type',
  'tamano_bytes',
  'descripcion',
  'tipo_foto',
  'es_principal',
  'estado_foto',
  'created_at',
].join(', ')

const FOTOS_BUCKET = 'elementos-caso'
const FOTO_MAX_BYTES = 5 * 1024 * 1024
const FOTO_SIGNED_URL_SECONDS = 60 * 10
const mimeTypesFotosPermitidos = ['image/jpeg', 'image/png', 'image/webp']
const tiposElemento: TipoElemento[] = ['Persona', 'Hogar', 'Negocio', 'Lugar', 'Objeto', 'Mascota/Animal', 'Organización', 'Otro']
const rolesElemento: RolElemento[] = [
  'Consultante',
  'Foco principal',
  'Involucrado directo',
  'Involucrado secundario',
  'Elemento de contexto',
  'Posible origen',
  'Posible afectado',
  'Elemento en observación',
]
const prioridadesElemento: PrioridadElemento[] = ['Baja', 'Media', 'Alta', 'Urgente']
const fuentesInformacion: FuenteInformacion[] = ['Consultante', 'Evaluación', 'Consulta', 'Revisión previa', 'Documento externo', 'Observación interna', 'Otro']
const nivelesConfirmacion: NivelConfirmacion[] = ['Declarado por consultante', 'Confirmado', 'Por confirmar', 'Referencial']
const estadosElemento: EstadoElemento[] = ['Activo', 'En observación', 'Descartado', 'Cerrado']
const tiposFotoElemento: TipoFotoElemento[] = ['Principal', 'Referencia', 'Evidencia', 'Antes', 'Después', 'Seguimiento', 'Otro']

function crearFormularioInicial(): FormularioElemento {
  return {
    tipo_elemento: 'Persona',
    nombre_elemento: '',
    vinculo_con_paciente: '',
    rol_en_caso: 'Foco principal',
    prioridad_elemento: 'Media',
    orden_elemento: '',
    fecha_nacimiento: '',
    descripcion_referencia: '',
    antecedentes_relevantes: '',
    motivo_inclusion: '',
    fuente_informacion: 'Consultante',
    nivel_confirmacion: 'Declarado por consultante',
    estado_elemento: 'Activo',
    notas_internas: '',
  }
}

function crearFormularioFotoInicial(elemento_caso_id = ''): FormularioFoto {
  return {
    elemento_caso_id,
    descripcion: '',
    tipo_foto: 'Referencia',
    es_principal: false,
    archivo: null,
  }
}

function normalizarNombreArchivo(nombreArchivo: string) {
  const limpio = normalizarTexto(nombreArchivo)
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  return limpio || 'foto-elemento'
}

function validarFormulario(formulario: FormularioElemento, casoId: string, pacienteId: string) {
  if (!casoId || !pacienteId) {
    return 'No hay caso o paciente resuelto para asociar el elemento.'
  }

  if (!formulario.nombre_elemento.trim()) {
    return 'Completa el nombre del elemento del caso.'
  }

  if (formulario.orden_elemento && Number(formulario.orden_elemento) <= 0) {
    return 'El orden del elemento debe ser mayor a cero.'
  }

  return ''
}

function validarArchivoFoto(archivo: File | null) {
  if (!archivo) {
    return 'Selecciona una imagen para subir.'
  }

  if (!mimeTypesFotosPermitidos.includes(archivo.type)) {
    return 'La imagen debe ser JPG, PNG o WebP.'
  }

  if (archivo.size > FOTO_MAX_BYTES) {
    return 'La imagen no puede superar 5 MB.'
  }

  return ''
}

function ElementosCasoPanel({ casoId, pacienteId, pacienteNombre }: ElementosCasoPanelProps) {
  const [elementos, setElementos] = useState<ElementoCaso[]>([])
  const [fotos, setFotos] = useState<FotoElementoCaso[]>([])
  const [formulario, setFormulario] = useState<FormularioElemento>(() => crearFormularioInicial())
  const [formularioFoto, setFormularioFoto] = useState<FormularioFoto>(() => crearFormularioFotoInicial())
  const [busqueda, setBusqueda] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [mensajeFoto, setMensajeFoto] = useState('')
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [subiendoFoto, setSubiendoFoto] = useState(false)
  const [fotoInputKey, setFotoInputKey] = useState(0)

  const elementosFiltrados = useMemo(() => {
    if (!busqueda.trim()) {
      return elementos
    }

    const filtro = normalizarTexto(busqueda.trim())

    return elementos.filter((elemento) => {
      const texto = [
        elemento.nombre_elemento,
        elemento.tipo_elemento,
        elemento.rol_en_caso,
        elemento.prioridad_elemento,
        elemento.estado_elemento,
        elemento.vinculo_con_paciente || '',
        elemento.motivo_inclusion || '',
        elemento.descripcion_referencia || '',
      ].join(' ')

      return normalizarTexto(texto).includes(filtro)
    })
  }, [busqueda, elementos])

  const fotosPorElemento = useMemo(() => {
    return fotos.reduce<Record<string, FotoElementoCaso[]>>((acumulador, foto) => {
      const actuales = acumulador[foto.elemento_caso_id] || []
      acumulador[foto.elemento_caso_id] = [...actuales, foto]
      return acumulador
    }, {})
  }, [fotos])

  const metricas = [
    { etiqueta: 'Total', valor: elementos.length, detalle: 'Elementos de este caso' },
    { etiqueta: 'Activos', valor: elementos.filter((elemento) => elemento.estado_elemento === 'Activo').length, detalle: 'Disponibles para revisión' },
    { etiqueta: 'Alta/Urgente', valor: elementos.filter((elemento) => elemento.prioridad_elemento === 'Alta' || elemento.prioridad_elemento === 'Urgente').length, detalle: 'Priorizados' },
    { etiqueta: 'Por confirmar', valor: elementos.filter((elemento) => elemento.nivel_confirmacion === 'Por confirmar').length, detalle: 'Requieren validación' },
    { etiqueta: 'Fotos', valor: fotos.length, detalle: 'Asociadas a elementos' },
  ]

  function actualizarFormulario(campo: keyof FormularioElemento, valor: string) {
    setFormulario((actual) => ({ ...actual, [campo]: valor }))
  }

  function actualizarFormularioFoto(campo: 'elemento_caso_id' | 'descripcion' | 'tipo_foto', valor: string) {
    setFormularioFoto((actual) => {
      if (campo === 'tipo_foto') {
        return { ...actual, tipo_foto: valor as TipoFotoElemento }
      }

      return { ...actual, [campo]: valor }
    })
  }

  const cargarFotosElementos = useCallback(async () => {
    if (!casoId || !pacienteId) {
      setFotos([])
      return
    }

    const { data, error } = await supabase
      .from('fotos_elementos_caso')
      .select(FOTO_SELECT)
      .eq('caso_id', casoId)
      .eq('paciente_id', pacienteId)
      .eq('estado_foto', 'Activa')
      .order('created_at', { ascending: false })

    if (error) {
      setMensajeFoto(`Error al cargar fotos de elementos: ${error.message}`)
      setFotos([])
      return
    }

    let erroresFirmas = 0

    const fotosConUrl = await Promise.all(
      ((data || []) as unknown as FotoElementoCaso[]).map(async (foto) => {
        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
          .from(FOTOS_BUCKET)
          .createSignedUrl(foto.storage_path, FOTO_SIGNED_URL_SECONDS)

        if (signedUrlError) {
          erroresFirmas += 1
          return foto
        }

        return {
          ...foto,
          signedUrl: signedUrlData.signedUrl,
        }
      }),
    )

    if (erroresFirmas > 0) {
      setMensajeFoto('Algunas fotos no pudieron preparar vista temporal. Intenta recargar el caso.')
    } else {
      setMensajeFoto((actual) => {
        if (actual.startsWith('Error al cargar fotos') || actual.includes('vista temporal')) {
          return ''
        }

        return actual
      })
    }

    setFotos(fotosConUrl)
  }, [casoId, pacienteId])

  const cargarElementos = useCallback(async () => {
    setCargando(true)
    setMensaje('')

    const { data, error } = await supabase
      .from('elementos_caso')
      .select(ELEMENTO_SELECT)
      .eq('caso_id', casoId)
      .eq('paciente_id', pacienteId)
      .order('created_at', { ascending: false })

    if (error) {
      setMensaje(`Error al cargar elementos del caso: ${error.message}`)
      setCargando(false)
      return
    }

    const elementosCargados = (data || []) as unknown as ElementoCaso[]
    setElementos(elementosCargados)
    setFormularioFoto((actual) => {
      if (actual.elemento_caso_id || elementosCargados.length === 0) {
        return actual
      }

      return { ...actual, elemento_caso_id: elementosCargados[0].id_elemento_caso }
    })
    await cargarFotosElementos()
    setCargando(false)
  }, [casoId, cargarFotosElementos, pacienteId])

  async function guardarElemento(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const errorFormulario = validarFormulario(formulario, casoId, pacienteId)

    if (errorFormulario) {
      setMensaje(`Error: ${errorFormulario}`)
      return
    }

    setGuardando(true)
    setMensaje('Guardando elemento...')

    const payload = {
      paciente_id: pacienteId,
      caso_id: casoId,
      tipo_elemento: formulario.tipo_elemento,
      nombre_elemento: formulario.nombre_elemento.trim(),
      vinculo_con_paciente: formulario.vinculo_con_paciente.trim() || null,
      rol_en_caso: formulario.rol_en_caso,
      prioridad_elemento: formulario.prioridad_elemento,
      orden_elemento: formulario.orden_elemento ? Number(formulario.orden_elemento) : null,
      fecha_nacimiento: formulario.fecha_nacimiento || null,
      descripcion_referencia: formulario.descripcion_referencia.trim() || null,
      antecedentes_relevantes: formulario.antecedentes_relevantes.trim() || null,
      motivo_inclusion: formulario.motivo_inclusion.trim() || null,
      fuente_informacion: formulario.fuente_informacion,
      nivel_confirmacion: formulario.nivel_confirmacion,
      estado_elemento: formulario.estado_elemento,
      notas_internas: formulario.notas_internas.trim() || null,
    }

    const { data, error } = await supabase
      .from('elementos_caso')
      .insert(payload)
      .select(ELEMENTO_SELECT)
      .single()

    if (error) {
      setMensaje(`Error al guardar elemento: ${error.message}`)
      setGuardando(false)
      return
    }

    setElementos((actuales) => [data as unknown as ElementoCaso, ...actuales])
    setFormularioFoto((actual) => actual.elemento_caso_id ? actual : { ...actual, elemento_caso_id: (data as unknown as ElementoCaso).id_elemento_caso })
    setFormulario(crearFormularioInicial())
    setMensaje('Elemento guardado correctamente en este caso')
    setGuardando(false)
  }

  async function subirFotoElemento(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!formularioFoto.elemento_caso_id) {
      setMensajeFoto('Error: selecciona un elemento existente para asociar la foto.')
      return
    }

    const elemento = elementos.find((item) => item.id_elemento_caso === formularioFoto.elemento_caso_id)

    if (!elemento) {
      setMensajeFoto('Error: el elemento seleccionado ya no está disponible en este caso.')
      return
    }

    const errorArchivo = validarArchivoFoto(formularioFoto.archivo)

    if (errorArchivo) {
      setMensajeFoto(`Error: ${errorArchivo}`)
      return
    }

    const archivo = formularioFoto.archivo as File
    const nombreArchivo = normalizarNombreArchivo(archivo.name)
    const storagePath = `casos/${casoId}/elementos/${elemento.id_elemento_caso}/${Date.now()}-${nombreArchivo}`

    setSubiendoFoto(true)
    setMensajeFoto('Subiendo imagen...')

    const { error: uploadError } = await supabase.storage
      .from(FOTOS_BUCKET)
      .upload(storagePath, archivo, {
        cacheControl: '3600',
        contentType: archivo.type,
        upsert: false,
      })

    if (uploadError) {
      setMensajeFoto(`Error al subir imagen: ${uploadError.message}`)
      setSubiendoFoto(false)
      return
    }

    setMensajeFoto('Imagen subida. Registrando metadatos...')

    const payload = {
      paciente_id: pacienteId,
      caso_id: casoId,
      elemento_caso_id: elemento.id_elemento_caso,
      bucket_id: FOTOS_BUCKET,
      storage_path: storagePath,
      nombre_archivo: archivo.name,
      mime_type: archivo.type,
      tamano_bytes: archivo.size,
      descripcion: formularioFoto.descripcion.trim() || null,
      tipo_foto: formularioFoto.es_principal ? 'Principal' : formularioFoto.tipo_foto,
      es_principal: formularioFoto.es_principal,
      estado_foto: 'Activa',
    }

    const { error: insertError } = await supabase
      .from('fotos_elementos_caso')
      .insert(payload)

    if (insertError) {
      setMensajeFoto(`Error al registrar metadatos: ${insertError.message}. La imagen quedó en Storage y debe revisarse manualmente.`)
      setSubiendoFoto(false)
      return
    }

    setFormularioFoto(crearFormularioFotoInicial(elemento.id_elemento_caso))
    setFotoInputKey((actual) => actual + 1)
    setMensajeFoto('Foto guardada correctamente.')
    await cargarFotosElementos()
    setSubiendoFoto(false)
  }

  useEffect(() => {
    const carga = window.setTimeout(() => {
      setFormulario(crearFormularioInicial())
      void cargarElementos()
    }, 0)

    return () => window.clearTimeout(carga)
  }, [cargarElementos])

  return (
    <section className="caso-detail-section" id="elementos-caso">
      <div className="caso-section-heading">
        <div>
          <span className="clinical-kicker">Elementos del caso</span>
          <h2>Elementos vinculados</h2>
          <p>Filtrados por el caso actual. No se muestran elementos de otros casos.</p>
        </div>
      </div>

      <section className="clinical-metrics caso-detail-metrics" aria-label="Métricas de elementos del caso">
        {metricas.map((metrica) => (
          <article className="clinical-metric-card" key={metrica.etiqueta}>
            <strong>{metrica.valor}</strong>
            <span>{metrica.etiqueta}</span>
            <p>{metrica.detalle}</p>
          </article>
        ))}
      </section>

      <section className="clinical-layout caso-panel-layout">
        <section className="clinical-panel" aria-label="Elementos registrados en el caso">
          <div className="clinical-panel__header">
            <div>
              <span className="clinical-kicker">Listado</span>
              <h2>Registrados</h2>
              <p>Paciente asociado: {pacienteNombre || pacienteId}</p>
            </div>
            <span className="clinical-count">{elementosFiltrados.length}</span>
          </div>

          <label className="clinical-search">
            <span>Buscar</span>
            <input
              className="clinical-input"
              placeholder="Elemento, rol, prioridad o estado"
              type="search"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
            />
          </label>

          {elementosFiltrados.length === 0 ? (
            <div className="clinical-empty">
              <strong>{cargando ? 'Cargando elementos' : 'Sin elementos registrados en este caso'}</strong>
              <p>{cargando ? 'Consultando Supabase local.' : 'Registra el primer elemento desde el formulario de esta ficha.'}</p>
            </div>
          ) : (
            <div className="clinical-list">
              {elementosFiltrados.map((elemento) => {
                const fotosElemento = fotosPorElemento[elemento.id_elemento_caso] || []

                return (
                  <article className="clinical-card" key={elemento.id_elemento_caso}>
                    <div className="clinical-card__top">
                      <div>
                        <h3>{elemento.nombre_elemento}</h3>
                        <small>{elemento.tipo_elemento} · {elemento.rol_en_caso}</small>
                      </div>
                      <span className="clinical-badge">{elemento.estado_elemento}</span>
                    </div>
                    <p>{textoCorto(elemento.descripcion_referencia || elemento.motivo_inclusion || 'Sin descripción registrada.')}</p>
                    <dl className="clinical-details">
                      <div>
                        <dt>Prioridad</dt>
                        <dd>{elemento.prioridad_elemento}</dd>
                      </div>
                      <div>
                        <dt>Confirmación</dt>
                        <dd>{elemento.nivel_confirmacion}</dd>
                      </div>
                      <div>
                        <dt>Nacimiento</dt>
                        <dd>{formatearFecha(elemento.fecha_nacimiento)}</dd>
                      </div>
                      <div>
                        <dt>Fotos</dt>
                        <dd>{fotosElemento.length}</dd>
                      </div>
                    </dl>

                    {fotosElemento.length > 0 ? (
                      <div className="clinical-grid" aria-label={`Fotos asociadas a ${elemento.nombre_elemento}`}>
                        {fotosElemento.map((foto) => (
                          <div className="clinical-field" key={foto.id_foto_elemento_caso}>
                            {foto.signedUrl ? (
                              <a href={foto.signedUrl} rel="noreferrer" target="_blank" aria-label={`Abrir foto ${foto.nombre_archivo}`}>
                                <img
                                  alt={foto.descripcion || `Foto de ${elemento.nombre_elemento}`}
                                  src={foto.signedUrl}
                                  style={{ aspectRatio: '4 / 3', borderRadius: 8, objectFit: 'cover', width: '100%' }}
                                />
                              </a>
                            ) : (
                              <div className="clinical-empty">
                                <strong>Vista temporal no disponible</strong>
                              </div>
                            )}
                            <small>{foto.es_principal ? 'Principal' : foto.tipo_foto} · {formatearFecha(foto.created_at)}</small>
                            {foto.descripcion && <p>{textoCorto(foto.descripcion, 90)}</p>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="clinical-note">Sin fotos asociadas.</p>
                    )}
                  </article>
                )
              })}
            </div>
          )}
        </section>

        <section className="clinical-form-panel" aria-label="Nuevo elemento del caso">
          <div className="clinical-form-panel__header">
            <div>
              <span className="clinical-kicker">Formulario</span>
              <h2>Nuevo elemento</h2>
              <p>Se guardará con `caso_id` y `paciente_id` del caso abierto.</p>
            </div>
          </div>

          <p className="clinical-note">Paciente asociado: {pacienteNombre || pacienteId}</p>

          <form className="clinical-form" onSubmit={guardarElemento}>
            <div className="clinical-grid">
              <label className="clinical-field">
                <span>Tipo *</span>
                <select className="clinical-select" disabled={guardando} value={formulario.tipo_elemento} onChange={(event) => actualizarFormulario('tipo_elemento', event.target.value as TipoElemento)} required>
                  {tiposElemento.map((tipo) => <option key={tipo} value={tipo}>{tipo}</option>)}
                </select>
              </label>

              <label className="clinical-field">
                <span>Nombre *</span>
                <input className="clinical-input" disabled={guardando} value={formulario.nombre_elemento} onChange={(event) => actualizarFormulario('nombre_elemento', event.target.value)} required />
              </label>
            </div>

            <div className="clinical-grid">
              <label className="clinical-field">
                <span>Rol *</span>
                <select className="clinical-select" disabled={guardando} value={formulario.rol_en_caso} onChange={(event) => actualizarFormulario('rol_en_caso', event.target.value as RolElemento)} required>
                  {rolesElemento.map((rol) => <option key={rol} value={rol}>{rol}</option>)}
                </select>
              </label>

              <label className="clinical-field">
                <span>Prioridad *</span>
                <select className="clinical-select" disabled={guardando} value={formulario.prioridad_elemento} onChange={(event) => actualizarFormulario('prioridad_elemento', event.target.value as PrioridadElemento)} required>
                  {prioridadesElemento.map((prioridad) => <option key={prioridad} value={prioridad}>{prioridad}</option>)}
                </select>
              </label>
            </div>

            <div className="clinical-grid">
              <label className="clinical-field">
                <span>Fuente *</span>
                <select className="clinical-select" disabled={guardando} value={formulario.fuente_informacion} onChange={(event) => actualizarFormulario('fuente_informacion', event.target.value as FuenteInformacion)} required>
                  {fuentesInformacion.map((fuente) => <option key={fuente} value={fuente}>{fuente}</option>)}
                </select>
              </label>

              <label className="clinical-field">
                <span>Confirmación *</span>
                <select className="clinical-select" disabled={guardando} value={formulario.nivel_confirmacion} onChange={(event) => actualizarFormulario('nivel_confirmacion', event.target.value as NivelConfirmacion)} required>
                  {nivelesConfirmacion.map((nivel) => <option key={nivel} value={nivel}>{nivel}</option>)}
                </select>
              </label>
            </div>

            <div className="clinical-grid">
              <label className="clinical-field">
                <span>Estado *</span>
                <select className="clinical-select" disabled={guardando} value={formulario.estado_elemento} onChange={(event) => actualizarFormulario('estado_elemento', event.target.value as EstadoElemento)} required>
                  {estadosElemento.map((estado) => <option key={estado} value={estado}>{estado}</option>)}
                </select>
              </label>

              <label className="clinical-field">
                <span>Orden</span>
                <input className="clinical-input" disabled={guardando} min="1" type="number" value={formulario.orden_elemento} onChange={(event) => actualizarFormulario('orden_elemento', event.target.value)} />
              </label>
            </div>

            <div className="clinical-grid">
              <label className="clinical-field">
                <span>Vínculo</span>
                <input className="clinical-input" disabled={guardando} value={formulario.vinculo_con_paciente} onChange={(event) => actualizarFormulario('vinculo_con_paciente', event.target.value)} />
              </label>

              <label className="clinical-field">
                <span>Fecha nacimiento</span>
                <input className="clinical-input" disabled={guardando} max={new Date().toISOString().slice(0, 10)} type="date" value={formulario.fecha_nacimiento} onChange={(event) => actualizarFormulario('fecha_nacimiento', event.target.value)} />
              </label>
            </div>

            <label className="clinical-field">
              <span>Descripción referencia</span>
              <textarea className="clinical-textarea" disabled={guardando} value={formulario.descripcion_referencia} onChange={(event) => actualizarFormulario('descripcion_referencia', event.target.value)} />
            </label>

            <label className="clinical-field">
              <span>Antecedentes relevantes</span>
              <textarea className="clinical-textarea" disabled={guardando} value={formulario.antecedentes_relevantes} onChange={(event) => actualizarFormulario('antecedentes_relevantes', event.target.value)} />
            </label>

            <label className="clinical-field">
              <span>Motivo inclusión</span>
              <textarea className="clinical-textarea" disabled={guardando} value={formulario.motivo_inclusion} onChange={(event) => actualizarFormulario('motivo_inclusion', event.target.value)} />
            </label>

            <label className="clinical-field">
              <span>Notas internas</span>
              <textarea className="clinical-textarea" disabled={guardando} value={formulario.notas_internas} onChange={(event) => actualizarFormulario('notas_internas', event.target.value)} />
            </label>

            <button className="clinical-button" disabled={guardando} type="submit">
              {guardando ? 'Guardando...' : 'Guardar elemento'}
            </button>
          </form>

          <p className="clinical-note">Preview: {formulario.nombre_elemento || 'Nuevo elemento'} · {formulario.tipo_elemento} · nacimiento {formatearFecha(formulario.fecha_nacimiento || null)}</p>
          {mensaje && <p className={mensaje.startsWith('Error') ? 'clinical-message clinical-message--error' : 'clinical-message'}>{mensaje}</p>}

          <div className="clinical-form-panel__header">
            <div>
              <span className="clinical-kicker">Fotos</span>
              <h2>Foto de elemento</h2>
              <p>Sube imágenes demo asociadas a elementos existentes del caso.</p>
            </div>
          </div>

          <form className="clinical-form" onSubmit={subirFotoElemento}>
            <label className="clinical-field">
              <span>Elemento del caso *</span>
              <select
                className="clinical-select"
                disabled={subiendoFoto || elementos.length === 0}
                value={formularioFoto.elemento_caso_id}
                onChange={(event) => actualizarFormularioFoto('elemento_caso_id', event.target.value)}
                required
              >
                <option value="">Selecciona un elemento</option>
                {elementos.map((elemento) => (
                  <option key={elemento.id_elemento_caso} value={elemento.id_elemento_caso}>
                    {elemento.nombre_elemento} · {elemento.tipo_elemento}
                  </option>
                ))}
              </select>
            </label>

            <label className="clinical-field">
              <span>Imagen JPG, PNG o WebP *</span>
              <input
                key={fotoInputKey}
                accept="image/jpeg,image/png,image/webp"
                className="clinical-input"
                disabled={subiendoFoto || elementos.length === 0}
                type="file"
                onChange={(event) => setFormularioFoto((actual) => ({ ...actual, archivo: event.target.files?.[0] || null }))}
                required
              />
            </label>

            <div className="clinical-grid">
              <label className="clinical-field">
                <span>Tipo de foto</span>
                <select
                  className="clinical-select"
                  disabled={subiendoFoto}
                  value={formularioFoto.tipo_foto}
                  onChange={(event) => actualizarFormularioFoto('tipo_foto', event.target.value)}
                >
                  {tiposFotoElemento.map((tipo) => <option key={tipo} value={tipo}>{tipo}</option>)}
                </select>
              </label>

              <label className="clinical-field">
                <span>Principal</span>
                <input
                  checked={formularioFoto.es_principal}
                  disabled={subiendoFoto}
                  type="checkbox"
                  onChange={(event) => setFormularioFoto((actual) => ({ ...actual, es_principal: event.target.checked }))}
                />
              </label>
            </div>

            <label className="clinical-field">
              <span>Descripción opcional</span>
              <textarea
                className="clinical-textarea"
                disabled={subiendoFoto}
                value={formularioFoto.descripcion}
                onChange={(event) => actualizarFormularioFoto('descripcion', event.target.value)}
              />
            </label>

            <button className="clinical-button" disabled={subiendoFoto || elementos.length === 0} type="submit">
              {subiendoFoto ? 'Subiendo imagen...' : 'Subir foto'}
            </button>
          </form>

          {mensajeFoto && <p className={mensajeFoto.startsWith('Error') ? 'clinical-message clinical-message--error' : 'clinical-message'}>{mensajeFoto}</p>}
        </section>
      </section>
    </section>
  )
}

export default ElementosCasoPanel
