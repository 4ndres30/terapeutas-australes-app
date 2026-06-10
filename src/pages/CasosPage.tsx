import type { FormEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

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
  paciente_id: string
  paciente_nombre: string
  titulo: string
  motivo: string
  area_principal: string
  estado: EstadoCaso
  prioridad: string
  fecha_apertura: string
}

type FormularioCaso = {
  paciente_id: string
  titulo: string
  motivo: string
  area_principal: string
  prioridad: string
  estado: EstadoCaso
}

const formularioInicial: FormularioCaso = {
  paciente_id: '',
  titulo: '',
  motivo: '',
  area_principal: '',
  prioridad: 'normal',
  estado: 'abierto',
}

const estadosCaso: { etiqueta: string; valor: EstadoCaso }[] = [
  { etiqueta: 'Abierto', valor: 'abierto' },
  { etiqueta: 'En revisión', valor: 'en_revision' },
  { etiqueta: 'Pausado', valor: 'pausado' },
  { etiqueta: 'Cerrado', valor: 'cerrado' },
]

const prioridadesCaso = ['baja', 'normal', 'alta', 'urgente']

function normalizarTexto(texto: string) {
  return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function obtenerNombrePaciente(paciente?: Paciente) {
  if (!paciente) return 'Paciente sin seleccionar'
  return `${paciente.nombres} ${paciente.apellidos}`.trim()
}

function obtenerEtiquetaEstado(estado: EstadoCaso) {
  return estadosCaso.find((opcion) => opcion.valor === estado)?.etiqueta || estado
}

function formatearFecha(fecha: string) {
  if (!fecha) return 'Sin fecha'

  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(fecha))
}

function CasosPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [casos, setCasos] = useState<CasoVista[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [formulario, setFormulario] = useState<FormularioCaso>(formularioInicial)
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(true)

  const pacienteSeleccionado = pacientes.find((paciente) => paciente.id === formulario.paciente_id)

  const casosFiltrados = useMemo(() => {
    if (!busqueda.trim()) return casos

    const filtro = normalizarTexto(busqueda)
    return casos.filter((caso) => normalizarTexto([
      caso.paciente_nombre,
      caso.titulo,
      caso.motivo,
      caso.area_principal,
      caso.estado,
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

  function guardarCaso(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!formulario.paciente_id || !formulario.titulo.trim() || !formulario.motivo.trim() || !formulario.area_principal.trim()) {
      setMensaje('Error: completa paciente, título, motivo y área principal.')
      return
    }

    const paciente = pacientes.find((item) => item.id === formulario.paciente_id)
    const nuevoCaso: CasoVista = {
      id: crypto.randomUUID(),
      paciente_id: formulario.paciente_id,
      paciente_nombre: obtenerNombrePaciente(paciente),
      titulo: formulario.titulo.trim(),
      motivo: formulario.motivo.trim(),
      area_principal: formulario.area_principal.trim(),
      estado: formulario.estado,
      prioridad: formulario.prioridad,
      fecha_apertura: new Date().toISOString(),
    }

    const duplicado = casos.some((caso) => (
      caso.paciente_id === nuevoCaso.paciente_id
      && normalizarTexto(caso.titulo) === normalizarTexto(nuevoCaso.titulo)
      && caso.estado !== 'cerrado'
    ))

    if (duplicado) {
      setMensaje('Error: ya existe un caso abierto o en curso con ese título para este paciente.')
      return
    }

    setCasos((actuales) => [nuevoCaso, ...actuales])
    setFormulario(formularioInicial)
    setMensaje('Caso preparado correctamente. La persistencia se conectará cuando validemos la tabla casos.')
  }

  useEffect(() => {
    let activo = true

    async function cargarPacientes() {
      setCargando(true)
      const { data, error } = await supabase
        .from('pacientes')
        .select('id, nombres, apellidos, telefono, email')
        .order('created_at', { ascending: false })

      if (!activo) return

      if (error) {
        setMensaje(`Error al cargar pacientes: ${error.message}`)
        setCargando(false)
        return
      }

      setPacientes(data || [])
      setCargando(false)
    }

    void cargarPacientes()

    return () => {
      activo = false
    }
  }, [])

  return (
    <main className="pacientes-shell pacientes-shell--command">
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
              <strong>{cargando ? 'Cargando pacientes' : 'Aún no hay casos en esta vista'}</strong>
              <p>{cargando ? 'Preparando selector de pacientes.' : 'Crea el primer caso desde el formulario de ingreso.'}</p>
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
                        <p className="paciente-card__contact-line">{caso.paciente_nombre}</p>
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
            <button className="guardar-paciente" form="caso-form" type="submit">Guardar caso</button>
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
                </div>
                <label>
                  Motivo de apertura *
                  <textarea value={formulario.motivo} onChange={(event) => actualizarFormulario('motivo', event.target.value)} placeholder="Describe el motivo inicial del caso." required />
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
