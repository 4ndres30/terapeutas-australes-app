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

type EstadoCaso = 'abierto' | 'en_revision' | 'pausado' | 'cerrado'

type CasoVista = {
  id: string
  codigo_caso: string
  paciente_id: string
  paciente_nombre: string
  titulo: string
  motivo: string
  area_principal: string
  estado: EstadoCaso
  prioridad: string
  seguimiento: string
  observaciones_generales: string
  fecha_apertura: string
}

type CasoRow = Record<string, unknown>

type FormularioCaso = {
  paciente_id: string
  titulo: string
  motivo: string
  area_principal: string
  prioridad: string
  estado: EstadoCaso
  seguimiento: string
  observaciones_generales: string
}

const formularioInicial: FormularioCaso = {
  paciente_id: '',
  titulo: '',
  motivo: '',
  area_principal: '',
  prioridad: 'normal',
  estado: 'abierto',
  seguimiento: 'pendiente',
  observaciones_generales: '',
}

const estadosCaso: { etiqueta: string; valor: EstadoCaso }[] = [
  { etiqueta: 'Abierto', valor: 'abierto' },
  { etiqueta: 'En revisión', valor: 'en_revision' },
  { etiqueta: 'Pausado', valor: 'pausado' },
  { etiqueta: 'Cerrado', valor: 'cerrado' },
]

const prioridadesCaso = ['baja', 'normal', 'alta', 'urgente']
const seguimientosCaso = ['pendiente', 'en seguimiento', 'requiere revisión', 'completado']

function normalizarTexto(texto: string) {
  return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function obtenerString(valor: unknown, respaldo = '') {
  return typeof valor === 'string' && valor.trim() ? valor.trim() : respaldo
}

function obtenerNombrePaciente(paciente?: Paciente) {
  if (!paciente) return 'Paciente sin seleccionar'
  return `${paciente.nombres} ${paciente.apellidos}`.trim()
}

function obtenerEtiquetaEstado(estado: EstadoCaso) {
  return estadosCaso.find((opcion) => opcion.valor === estado)?.etiqueta || estado
}

function normalizarEstadoCaso(valor: unknown): EstadoCaso {
  const texto = normalizarTexto(obtenerString(valor, 'abierto'))

  if (texto.includes('cerr')) return 'cerrado'
  if (texto.includes('paus')) return 'pausado'
  if (texto.includes('revision') || texto.includes('revisión')) return 'en_revision'

  return 'abierto'
}

function formatearFecha(fecha: string) {
  if (!fecha) return 'Sin fecha'

  const fechaCaso = new Date(fecha)

  if (Number.isNaN(fechaCaso.getTime())) return 'Sin fecha'

  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(fechaCaso)
}

function generarCodigoCaso() {
  const fecha = new Date()
  const fechaTexto = fecha.toISOString().slice(0, 10).replace(/-/g, '')
  const sufijo = crypto.randomUUID().slice(0, 6).toUpperCase()
  return `CASO-${fechaTexto}-${sufijo}`
}

function obtenerPacienteDesdeObservacion(observaciones: string) {
  const coincidencia = observaciones.match(/Paciente asociado:\s*([^|]+)/i)
  return coincidencia?.[1]?.trim() || ''
}

function mapearCasoDesdeSupabase(row: CasoRow, pacientes: Paciente[]): CasoVista {
  const observaciones = obtenerString(row.observaciones_generales ?? row.observaciones)
  const pacienteId = obtenerString(row.paciente_id)
  const paciente = pacientes.find((item) => item.id === pacienteId)
  const pacienteNombre = obtenerNombrePaciente(paciente) !== 'Paciente sin seleccionar'
    ? obtenerNombrePaciente(paciente)
    : obtenerPacienteDesdeObservacion(observaciones) || 'Paciente no asociado'

  return {
    id: obtenerString(row.id, crypto.randomUUID()),
    codigo_caso: obtenerString(row.codigo_caso, obtenerString(row.codigo, 'Sin código')),
    paciente_id: pacienteId,
    paciente_nombre: pacienteNombre,
    titulo: obtenerString(row.nombre_caso ?? row.titulo, 'Caso sin título'),
    motivo: obtenerString(row.motivo_principal ?? row.motivo, 'Sin motivo registrado'),
    area_principal: obtenerString(row.tipo_caso ?? row.area_principal, 'Sin área'),
    estado: normalizarEstadoCaso(row.estado_caso ?? row.estado),
    prioridad: obtenerString(row.prioridad, 'normal'),
    seguimiento: obtenerString(row.seguimiento, 'pendiente'),
    observaciones_generales: observaciones,
    fecha_apertura: obtenerString(row.fecha_apertura ?? row.created_at, ''),
  }
}

function crearPayloadsCaso(formulario: FormularioCaso, paciente?: Paciente) {
  const codigoCaso = generarCodigoCaso()
  const pacienteNombre = obtenerNombrePaciente(paciente)
  const fechaApertura = new Date().toISOString()
  const observaciones = [
    `Paciente asociado: ${pacienteNombre}`,
    formulario.observaciones_generales.trim(),
  ].filter(Boolean).join(' | ')

  return [
    {
      codigo_caso: codigoCaso,
      nombre_caso: formulario.titulo.trim(),
      fecha_apertura: fechaApertura,
      motivo_principal: formulario.motivo.trim(),
      tipo_caso: formulario.area_principal.trim(),
      estado_caso: formulario.estado,
      prioridad: formulario.prioridad,
      seguimiento: formulario.seguimiento,
      observaciones_generales: observaciones,
    },
    {
      paciente_id: formulario.paciente_id,
      titulo: formulario.titulo.trim(),
      fecha_apertura: fechaApertura,
      motivo: formulario.motivo.trim(),
      area_principal: formulario.area_principal.trim(),
      estado: formulario.estado,
      prioridad: formulario.prioridad,
      seguimiento: formulario.seguimiento,
      observaciones: observaciones,
    },
  ]
}

function errorEsPorColumnas(error: { code?: string; message?: string } | null) {
  const mensaje = error?.message?.toLowerCase() || ''
  return error?.code === 'PGRST204' || mensaje.includes('column') || mensaje.includes('columna')
}

async function insertarCasoConCompatibilidad(payloads: CasoRow[]) {
  let ultimoError: { message?: string; code?: string } | null = null

  for (const payload of payloads) {
    const { data, error } = await supabase
      .from('casos')
      .insert(payload)
      .select('*')
      .single()

    if (!error) {
      return data as CasoRow
    }

    ultimoError = error

    if (!errorEsPorColumnas(error)) {
      break
    }
  }

  throw new Error(ultimoError?.message || 'No se pudo guardar el caso.')
}

function CasosPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [casos, setCasos] = useState<CasoVista[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [formulario, setFormulario] = useState<FormularioCaso>(formularioInicial)
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)

  const pacienteSeleccionado = pacientes.find((paciente) => paciente.id === formulario.paciente_id)

  const casosFiltrados = useMemo(() => {
    if (!busqueda.trim()) return casos

    const filtro = normalizarTexto(busqueda)
    return casos.filter((caso) => normalizarTexto([
      caso.codigo_caso,
      caso.paciente_nombre,
      caso.titulo,
      caso.motivo,
      caso.area_principal,
      caso.estado,
      caso.prioridad,
      caso.seguimiento,
    ].join(' ')).includes(filtro))
  }, [busqueda, casos])

  const metricas = [
    { etiqueta: 'Total', valor: casos.length, detalle: 'Casos registrados' },
    { etiqueta: 'Abiertos', valor: casos.filter((caso) => caso.estado === 'abierto').length, detalle: 'En curso' },
    { etiqueta: 'Revisión', valor: casos.filter((caso) => caso.estado === 'en_revision').length, detalle: 'Seguimiento' },
    { etiqueta: 'Cerrados', valor: casos.filter((caso) => caso.estado === 'cerrado').length, detalle: 'Finalizados' },
  ]

  function actualizarFormulario(campo: keyof FormularioCaso, valor: string) {
    setFormulario((actual) => ({ ...actual, [campo]: valor }))
  }

  async function cargarBaseCasos() {
    setCargando(true)

    const { data: pacientesData, error: pacientesError } = await supabase
      .from('pacientes')
      .select('id, nombres, apellidos, telefono, email')
      .order('created_at', { ascending: false })

    if (pacientesError) {
      setMensaje(`Error al cargar pacientes: ${pacientesError.message}`)
      setCargando(false)
      return
    }

    const pacientesCargados = pacientesData || []
    setPacientes(pacientesCargados)

    const { data: casosData, error: casosError } = await supabase
      .from('casos')
      .select('*')

    if (casosError) {
      setMensaje(`Error al cargar casos: ${casosError.message}`)
      setCasos([])
      setCargando(false)
      return
    }

    const casosMapeados = (casosData || [])
      .map((row) => mapearCasoDesdeSupabase(row as CasoRow, pacientesCargados))
      .sort((a, b) => new Date(b.fecha_apertura).getTime() - new Date(a.fecha_apertura).getTime())

    setCasos(casosMapeados)
    setCargando(false)
  }

  async function guardarCaso(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!formulario.paciente_id || !formulario.titulo.trim() || !formulario.motivo.trim() || !formulario.area_principal.trim()) {
      setMensaje('Error: completa paciente, título, motivo y área principal.')
      return
    }

    const duplicado = casos.some((caso) => (
      caso.paciente_id === formulario.paciente_id
      && normalizarTexto(caso.titulo) === normalizarTexto(formulario.titulo.trim())
      && caso.estado !== 'cerrado'
    ))

    if (duplicado) {
      setMensaje('Error: ya existe un caso abierto o en curso con ese título para este paciente.')
      return
    }

    setGuardando(true)
    setMensaje('Guardando caso...')

    try {
      const payloads = crearPayloadsCaso(formulario, pacienteSeleccionado)
      const casoGuardado = await insertarCasoConCompatibilidad(payloads)
      const casoMapeado = mapearCasoDesdeSupabase(casoGuardado, pacientes)

      setCasos((actuales) => [casoMapeado, ...actuales])
      setFormulario(formularioInicial)
      setMensaje('Caso guardado correctamente')
    } catch (error) {
      setMensaje(`Error al guardar caso: ${error instanceof Error ? error.message : 'error desconocido'}`)
    } finally {
      setGuardando(false)
    }
  }

  useEffect(() => {
    void cargarBaseCasos()
  }, [])

  return (
    <main className="pacientes-shell pacientes-shell--command casos-page">
      <section className="pacientes-command-topbar">
        <div className="pacientes-command-title">
          <span className="modulo-badge">Módulo clínico</span>
          <h1>Casos</h1>
          <p>Base inicial para abrir, revisar y seguir casos asociados a pacientes.</p>
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

          <div className="directory-search-row">
            <label className="buscador-pacientes buscador-pacientes--compact">
              <span>Buscar</span>
              <input
                placeholder="Paciente, título, motivo, área o estado"
                type="search"
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
              />
            </label>
            <button className="directory-filter-button" type="button" aria-label="Filtros de casos">≡</button>
          </div>

          {casosFiltrados.length === 0 ? (
            <div className="estado-listado estado-listado--vacio">
              <strong>{cargando ? 'Cargando casos' : 'Aún no hay casos en esta vista'}</strong>
              <p>{cargando ? 'Preparando casos y selector de pacientes.' : 'Crea el primer caso desde el formulario de ingreso.'}</p>
            </div>
          ) : (
            <div className="pacientes-cards pacientes-cards--compact">
              {casosFiltrados.map((caso) => (
                <article className="paciente-card paciente-card--compact" key={caso.id}>
                  <div className="paciente-avatar" aria-hidden="true">C</div>
                  <div className="paciente-card__body">
                    <div className="paciente-card__topline">
                      <div>
                        <h3>{caso.titulo}</h3>
                        <p className="paciente-card__contact-line">{caso.paciente_nombre} · {caso.codigo_caso}</p>
                      </div>
                      <span className={`estado-badge estado-badge--${caso.estado === 'cerrado' ? 'inactivo' : 'activo'}`}>
                        {obtenerEtiquetaEstado(caso.estado)}
                      </span>
                    </div>
                    <div className="paciente-card__footer-line">
                      <span>{caso.area_principal} · prioridad {caso.prioridad}</span>
                      <time dateTime={caso.fecha_apertura}>{formatearFecha(caso.fecha_apertura)}</time>
                    </div>
                  </div>
                </article>
              ))}
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
                <p>Apertura inicial vinculada a un paciente existente.</p>
              </div>
            </div>
            <button className="guardar-paciente" disabled={guardando} form="caso-form" type="submit">
              {guardando ? 'Guardando...' : 'Guardar caso'}
            </button>
          </div>

          <div className="intake-command-layout">
            <form className="formulario-ficha formulario-ficha--command" id="caso-form" onSubmit={guardarCaso}>
              <section className="form-section form-section--active">
                <div className="form-section__header">
                  <span>01</span>
                  <div>
                    <h3>Paciente asociado</h3>
                    <p>Selecciona el paciente al que pertenece el caso.</p>
                  </div>
                </div>
                <div className="form-grid form-grid--command">
                  <label>
                    Paciente *
                    <select value={formulario.paciente_id} onChange={(event) => actualizarFormulario('paciente_id', event.target.value)} required>
                      <option value="">Seleccionar paciente</option>
                      {pacientes.map((paciente) => (
                        <option key={paciente.id} value={paciente.id}>{obtenerNombrePaciente(paciente)}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Estado *
                    <select value={formulario.estado} onChange={(event) => actualizarFormulario('estado', event.target.value as EstadoCaso)} required>
                      {estadosCaso.map((estado) => (
                        <option key={estado.valor} value={estado.valor}>{estado.etiqueta}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </section>

              <section className="form-section form-section--active">
                <div className="form-section__header">
                  <span>02</span>
                  <div>
                    <h3>Identificación del caso</h3>
                    <p>Registra el motivo y el área principal de revisión.</p>
                  </div>
                </div>
                <div className="form-grid form-grid--command">
                  <label>
                    Título del caso *
                    <input value={formulario.titulo} onChange={(event) => actualizarFormulario('titulo', event.target.value)} placeholder="Ej: Bloqueo familiar recurrente" required />
                  </label>
                  <label>
                    Área principal *
                    <input value={formulario.area_principal} onChange={(event) => actualizarFormulario('area_principal', event.target.value)} placeholder="Ej: Linaje energético" required />
                  </label>
                  <label>
                    Prioridad *
                    <select value={formulario.prioridad} onChange={(event) => actualizarFormulario('prioridad', event.target.value)} required>
                      {prioridadesCaso.map((prioridad) => (
                        <option key={prioridad} value={prioridad}>{prioridad}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Seguimiento *
                    <select value={formulario.seguimiento} onChange={(event) => actualizarFormulario('seguimiento', event.target.value)} required>
                      {seguimientosCaso.map((seguimiento) => (
                        <option key={seguimiento} value={seguimiento}>{seguimiento}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <label>
                  Motivo de apertura *
                  <textarea value={formulario.motivo} onChange={(event) => actualizarFormulario('motivo', event.target.value)} placeholder="Describe el motivo inicial del caso." required />
                </label>
                <label>
                  Observaciones generales
                  <textarea value={formulario.observaciones_generales} onChange={(event) => actualizarFormulario('observaciones_generales', event.target.value)} placeholder="Antecedentes adicionales del caso." />
                </label>
              </section>
            </form>

            <aside className="preview-paciente preview-paciente--command" aria-label="Preview del caso">
              <div className="preview-avatar" aria-hidden="true">C</div>
              <div className="preview-heading">
                <span>Preview vivo</span>
                <h3>{formulario.titulo || 'Nuevo caso'}</h3>
                <p>{obtenerNombrePaciente(pacienteSeleccionado)}</p>
              </div>
              <span className={`estado-badge estado-badge--${formulario.estado === 'cerrado' ? 'inactivo' : 'activo'}`}>
                {obtenerEtiquetaEstado(formulario.estado)}
              </span>
              <div className="preview-data preview-data--command">
                <p><strong>Área</strong> <span>{formulario.area_principal || 'Pendiente'}</span></p>
                <p><strong>Prioridad</strong> <span>{formulario.prioridad}</span></p>
                <p><strong>Seguimiento</strong> <span>{formulario.seguimiento}</span></p>
                <p><strong>Motivo</strong> <span>{formulario.motivo || 'Pendiente'}</span></p>
              </div>
              <div className="preview-help">Esta tarjeta resume el caso antes de conectarlo a revisiones y elementos del caso.</div>
            </aside>
          </div>

          {mensaje && <p className={mensaje.startsWith('Error') ? 'mensaje mensaje--error' : 'mensaje'}>{mensaje}</p>}
        </section>
      </section>
    </main>
  )
}

export default CasosPage
