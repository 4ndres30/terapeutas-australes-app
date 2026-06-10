import type { FormEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import './PacientesPage.css'

type Paciente = {
  id: string
  nombres: string
  apellidos: string
  fecha_nacimiento: string
  sexo: string
  telefono: string
  email: string
  comuna: string
  region: string
  estado: string
  created_at: string
}

type FiltroEstado = 'todos' | 'activos' | 'inactivos'
type TipoMetrica = 'total' | 'activos' | 'inactivos' | 'ultimo'
type PasoFicha = 'identidad' | 'contacto' | 'ubicacion' | 'estado'

type FormularioPaciente = {
  nombres: string
  apellidos: string
  fecha_nacimiento: string
  sexo: string
  telefono: string
  email: string
  comuna: string
  region: string
  estado: string
}

type OpcionFormulario = {
  etiqueta: string
  valor: string
}

type PasoFichaConfig = {
  clave: PasoFicha
  numero: string
  etiqueta: string
  titulo: string
  descripcion: string
  tono: string
}

const formularioInicial: FormularioPaciente = {
  nombres: '',
  apellidos: '',
  fecha_nacimiento: '',
  sexo: '',
  telefono: '',
  email: '',
  comuna: '',
  region: '',
  estado: 'activo',
}

const filtrosEstado: { etiqueta: string; valor: FiltroEstado }[] = [
  { etiqueta: 'Todos', valor: 'todos' },
  { etiqueta: 'Activos', valor: 'activos' },
  { etiqueta: 'Inactivos', valor: 'inactivos' },
]

const opcionesSexo: OpcionFormulario[] = [
  { etiqueta: 'Femenino', valor: 'femenino' },
  { etiqueta: 'Masculino', valor: 'masculino' },
  { etiqueta: 'Otro', valor: 'otro' },
  { etiqueta: 'Prefiere no decir', valor: 'prefiere_no_decir' },
]

const opcionesEstado: OpcionFormulario[] = [
  { etiqueta: 'Activo', valor: 'activo' },
  { etiqueta: 'Inactivo', valor: 'inactivo' },
]

const pasosFicha: PasoFichaConfig[] = [
  {
    clave: 'identidad',
    numero: '1',
    etiqueta: 'Identidad',
    titulo: 'Identidad personal',
    descripcion: 'Datos base para reconocer la ficha clínica.',
    tono: 'violeta',
  },
  {
    clave: 'contacto',
    numero: '2',
    etiqueta: 'Contacto',
    titulo: 'Contacto',
    descripcion: 'Información de contacto y comunicación.',
    tono: 'azul',
  },
  {
    clave: 'ubicacion',
    numero: '3',
    etiqueta: 'Ubicación',
    titulo: 'Ubicación',
    descripcion: 'Comuna y región de residencia.',
    tono: 'dorado',
  },
  {
    clave: 'estado',
    numero: '4',
    etiqueta: 'Estado',
    titulo: 'Estado',
    descripcion: 'Estado actual del paciente.',
    tono: 'verde',
  },
]

async function obtenerPacientes() {
  return supabase
    .from('pacientes')
    .select('*')
    .order('created_at', { ascending: false })
}

function normalizarTexto(texto: string) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function obtenerIniciales(nombres: string, apellidos: string) {
  const inicialNombre = nombres.trim().charAt(0)
  const inicialApellido = apellidos.trim().charAt(0)
  const iniciales = `${inicialNombre}${inicialApellido}`.trim()

  return iniciales ? iniciales.toUpperCase() : 'TA'
}

function crearFechaLocal(fecha: string) {
  const [fechaBase] = fecha.split('T')
  const [anio, mes, dia] = fechaBase.split('-').map(Number)

  if (anio && mes && dia) {
    return new Date(anio, mes - 1, dia)
  }

  return new Date(fecha)
}

function formatearFecha(fecha: string) {
  if (!fecha) {
    return 'Sin fecha'
  }

  const fechaLocal = crearFechaLocal(fecha)

  if (Number.isNaN(fechaLocal.getTime())) {
    return 'Sin fecha'
  }

  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(fechaLocal)
}

function obtenerEtiqueta(opciones: OpcionFormulario[], valor: string) {
  return opciones.find((opcion) => opcion.valor === valor)?.etiqueta || ''
}

function mostrarDato(valor: string, respaldo = 'Pendiente') {
  return valor.trim() || respaldo
}

function prepararPacienteParaGuardar(formulario: FormularioPaciente) {
  return {
    nombres: formulario.nombres.trim(),
    apellidos: formulario.apellidos.trim(),
    fecha_nacimiento: formulario.fecha_nacimiento,
    sexo: formulario.sexo,
    telefono: formulario.telefono.trim(),
    email: formulario.email.trim().toLowerCase(),
    comuna: formulario.comuna.trim(),
    region: formulario.region.trim(),
    estado: formulario.estado,
  }
}

function coincideConBusqueda(paciente: Paciente, busqueda: string) {
  if (!busqueda.trim()) {
    return true
  }

  const textoPaciente = normalizarTexto([
    paciente.nombres,
    paciente.apellidos,
    paciente.email,
    paciente.telefono,
    paciente.comuna,
    paciente.region,
  ].join(' '))

  return textoPaciente.includes(normalizarTexto(busqueda.trim()))
}

function coincideConFiltroEstado(paciente: Paciente, filtroEstado: FiltroEstado) {
  if (filtroEstado === 'activos') {
    return paciente.estado === 'activo'
  }

  if (filtroEstado === 'inactivos') {
    return paciente.estado === 'inactivo'
  }

  return true
}

function obtenerResumenPaso(paso: PasoFicha, formulario: FormularioPaciente) {
  if (paso === 'identidad') {
    const nombre = `${formulario.nombres} ${formulario.apellidos}`.trim()
    return nombre || 'Nombre, nacimiento y sexo del paciente.'
  }

  if (paso === 'contacto') {
    const contacto = [formulario.telefono, formulario.email].filter(Boolean).join(' · ')
    return contacto || 'Teléfono y correo principal.'
  }

  if (paso === 'ubicacion') {
    const ubicacion = [formulario.comuna, formulario.region].filter(Boolean).join(', ')
    return ubicacion || 'Comuna y región de residencia.'
  }

  return obtenerEtiqueta(opcionesEstado, formulario.estado) || 'Estado actual del paciente.'
}

function validarFormularioPaciente(formulario: FormularioPaciente): { paso: PasoFicha; mensaje: string } | null {
  if (!formulario.nombres.trim() || !formulario.apellidos.trim() || !formulario.fecha_nacimiento || !formulario.sexo) {
    return { paso: 'identidad', mensaje: 'Completa nombres, apellidos, fecha de nacimiento y sexo.' }
  }

  if (!formulario.telefono.trim()) {
    return { paso: 'contacto', mensaje: 'Ingresa un teléfono de contacto.' }
  }

  if (!/^\S+@\S+\.\S+$/.test(formulario.email.trim())) {
    return { paso: 'contacto', mensaje: 'Ingresa un email válido.' }
  }

  if (!formulario.comuna.trim() || !formulario.region.trim()) {
    return { paso: 'ubicacion', mensaje: 'Completa comuna y región.' }
  }

  if (!formulario.estado) {
    return { paso: 'estado', mensaje: 'Selecciona el estado del paciente.' }
  }

  return null
}

function MetricaIcon({ tipo }: { tipo: TipoMetrica }) {
  if (tipo === 'activos') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
        <path d="M2.5 21a6.5 6.5 0 0 1 11 0" />
        <path d="M17 8v7" />
        <path d="M13.5 11.5H20.5" />
      </svg>
    )
  }

  if (tipo === 'inactivos') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
        <path d="M2.5 21a6.5 6.5 0 0 1 11 0" />
        <path d="M15 9l6 6" />
        <path d="M21 9l-6 6" />
      </svg>
    )
  }

  if (tipo === 'ultimo') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M6 3v4" />
        <path d="M18 3v4" />
        <path d="M4 8h16" />
        <path d="M5 5h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
        <path d="M9 13h6" />
        <path d="M9 17h3" />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="M16 12a3.5 3.5 0 1 0 0-7" />
      <path d="M2.5 21a6.5 6.5 0 0 1 11 0" />
      <path d="M14 17a5.5 5.5 0 0 1 7.5 4" />
    </svg>
  )
}

function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>('todos')
  const [pasoActivo, setPasoActivo] = useState<PasoFicha>('identidad')
  const [formulario, setFormulario] = useState<FormularioPaciente>(formularioInicial)

  const totalPacientes = pacientes.length
  const pacientesActivos = pacientes.filter((paciente) => paciente.estado === 'activo').length
  const pacientesInactivos = pacientes.filter((paciente) => paciente.estado === 'inactivo').length
  const ultimoRegistro = pacientes[0]?.created_at

  const pacientesFiltrados = useMemo(() => (
    pacientes.filter((paciente) => (
      coincideConBusqueda(paciente, busqueda)
      && coincideConFiltroEstado(paciente, filtroEstado)
    ))
  ), [busqueda, filtroEstado, pacientes])

  const formularioTieneDatos = Object.entries(formulario).some(([campo, valor]) => (
    campo === 'estado' ? valor !== 'activo' : Boolean(valor.trim())
  ))

  const nombrePreview = `${formulario.nombres} ${formulario.apellidos}`.trim()
  const ubicacionPreview = [formulario.comuna, formulario.region].filter(Boolean).join(', ')
  const sexoPreview = obtenerEtiqueta(opcionesSexo, formulario.sexo)
  const fechaNacimientoPreview = formulario.fecha_nacimiento ? formatearFecha(formulario.fecha_nacimiento) : 'Pendiente'
  const mensajeEsError = mensaje.toLowerCase().startsWith('error')
  const cantidadVisible = pacientesFiltrados.length

  function actualizarFormulario(campo: keyof FormularioPaciente, valor: string) {
    setFormulario((formularioActual) => ({
      ...formularioActual,
      [campo]: valor,
    }))
  }

  async function cargarPacientes() {
    setCargando(true)

    const { data, error } = await obtenerPacientes()

    if (error) {
      setMensaje(`Error al cargar pacientes: ${error.message}`)
      setCargando(false)
      return
    }

    setPacientes(data || [])
    setCargando(false)
  }

  async function guardarPaciente(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const validacion = validarFormularioPaciente(formulario)

    if (validacion) {
      setPasoActivo(validacion.paso)
      setMensaje(`Error: ${validacion.mensaje}`)
      return
    }

    setGuardando(true)
    setMensaje('Guardando paciente...')

    const pacienteParaGuardar = prepararPacienteParaGuardar(formulario)
    const { error } = await supabase.from('pacientes').insert(pacienteParaGuardar)

    if (error) {
      setMensaje(`Error al guardar: ${error.message}`)
      setGuardando(false)
      return
    }

    setMensaje('Paciente guardado correctamente')
    setFormulario(formularioInicial)
    setPasoActivo('identidad')

    await cargarPacientes()
    setGuardando(false)
  }

  useEffect(() => {
    let componenteActivo = true

    async function cargarPacientesIniciales() {
      const { data, error } = await obtenerPacientes()

      if (!componenteActivo) {
        return
      }

      if (error) {
        setMensaje(`Error al cargar pacientes: ${error.message}`)
        setCargando(false)
        return
      }

      setPacientes(data || [])
      setCargando(false)
    }

    void cargarPacientesIniciales()

    return () => {
      componenteActivo = false
    }
  }, [])

  const metricas: { etiqueta: string; valor: number | string; detalle: string; tipo: TipoMetrica }[] = [
    { etiqueta: 'Total', valor: totalPacientes, detalle: 'Pacientes', tipo: 'total' },
    { etiqueta: 'Activos', valor: pacientesActivos, detalle: 'Seguimiento', tipo: 'activos' },
    { etiqueta: 'Inactivos', valor: pacientesInactivos, detalle: 'Archivados', tipo: 'inactivos' },
    { etiqueta: 'Último', valor: ultimoRegistro ? formatearFecha(ultimoRegistro) : 'Sin registros', detalle: 'Registro', tipo: 'ultimo' },
  ]

  function renderCamposPaso(paso: PasoFicha) {
    if (paso === 'identidad') {
      return (
        <>
          <div className="form-grid form-grid--command">
            <label>
              Nombres *
              <input
                autoComplete="given-name"
                disabled={guardando}
                placeholder="Ej: Catalina Belén"
                value={formulario.nombres}
                onChange={(event) => actualizarFormulario('nombres', event.target.value)}
                required
              />
            </label>

            <label>
              Apellidos *
              <input
                autoComplete="family-name"
                disabled={guardando}
                placeholder="Ej: Troncoso Caro"
                value={formulario.apellidos}
                onChange={(event) => actualizarFormulario('apellidos', event.target.value)}
                required
              />
            </label>

            <label>
              Fecha de nacimiento *
              <input
                disabled={guardando}
                type="date"
                value={formulario.fecha_nacimiento}
                onChange={(event) => actualizarFormulario('fecha_nacimiento', event.target.value)}
                required
              />
            </label>
          </div>

          <div className="chip-field">
            <span>Sexo *</span>
            <div className="selector-chips selector-chips--command">
              {opcionesSexo.map((opcion) => (
                <label
                  className={formulario.sexo === opcion.valor ? 'selector-chip selector-chip--activo' : 'selector-chip'}
                  key={opcion.valor}
                >
                  <input
                    checked={formulario.sexo === opcion.valor}
                    disabled={guardando}
                    name="sexo"
                    onChange={(event) => actualizarFormulario('sexo', event.target.value)}
                    required
                    type="radio"
                    value={opcion.valor}
                  />
                  {opcion.etiqueta}
                </label>
              ))}
            </div>
          </div>
        </>
      )
    }

    if (paso === 'contacto') {
      return (
        <div className="form-grid form-grid--command">
          <label>
            Teléfono *
            <input
              autoComplete="tel"
              disabled={guardando}
              placeholder="Ej: +56 9 1234 5678"
              type="tel"
              value={formulario.telefono}
              onChange={(event) => actualizarFormulario('telefono', event.target.value)}
              required
            />
          </label>

          <label>
            Email *
            <input
              autoComplete="email"
              disabled={guardando}
              placeholder="Ej: paciente@correo.cl"
              type="email"
              value={formulario.email}
              onChange={(event) => actualizarFormulario('email', event.target.value)}
              required
            />
          </label>
        </div>
      )
    }

    if (paso === 'ubicacion') {
      return (
        <div className="form-grid form-grid--command">
          <label>
            Comuna *
            <input
              autoComplete="address-level2"
              disabled={guardando}
              placeholder="Ej: Castro"
              value={formulario.comuna}
              onChange={(event) => actualizarFormulario('comuna', event.target.value)}
              required
            />
          </label>

          <label>
            Región *
            <input
              autoComplete="address-level1"
              disabled={guardando}
              placeholder="Ej: Los Lagos"
              value={formulario.region}
              onChange={(event) => actualizarFormulario('region', event.target.value)}
              required
            />
          </label>
        </div>
      )
    }

    return (
      <div className="selector-chips selector-chips--estado selector-chips--command">
        {opcionesEstado.map((opcion) => (
          <label
            className={formulario.estado === opcion.valor ? 'selector-chip selector-chip--activo' : 'selector-chip'}
            key={opcion.valor}
          >
            <input
              checked={formulario.estado === opcion.valor}
              disabled={guardando}
              name="estado"
              onChange={(event) => actualizarFormulario('estado', event.target.value)}
              required
              type="radio"
              value={opcion.valor}
            />
            {opcion.etiqueta}
          </label>
        ))}
      </div>
    )
  }

  function renderPasoFormulario(paso: PasoFichaConfig) {
    const estaActivo = pasoActivo === paso.clave

    if (!estaActivo) {
      return (
        <button
          className={`form-section form-section--summary form-section--summary-${paso.tono}`}
          key={paso.clave}
          onClick={() => setPasoActivo(paso.clave)}
          type="button"
        >
          <div className="form-section__header">
            <span>{paso.numero.padStart(2, '0')}</span>
            <div>
              <h3>{paso.titulo}</h3>
              <p>{obtenerResumenPaso(paso.clave, formulario)}</p>
            </div>
          </div>
          <span className="form-section__chevron" aria-hidden="true">⌄</span>
        </button>
      )
    }

    return (
      <section className={`form-section form-section--${paso.clave} form-section--active`} key={paso.clave}>
        <div className="form-section__header">
          <span>{paso.numero.padStart(2, '0')}</span>
          <div>
            <h3>{paso.titulo}</h3>
            <p>{paso.descripcion}</p>
          </div>
        </div>

        {renderCamposPaso(paso.clave)}
      </section>
    )
  }

  return (
    <main className="pacientes-shell pacientes-shell--command">
      <section className="pacientes-command-topbar">
        <div className="pacientes-command-title">
          <span className="modulo-badge">Módulo clínico</span>
          <h1>Pacientes</h1>
          <p>Centro de control para registrar, buscar y revisar fichas clínicas iniciales.</p>
        </div>

        <section className="pacientes-metricas-rail" aria-label="Métricas de pacientes">
          {metricas.map((metrica) => (
            <article className={`metrica-rail-card metrica-rail-card--${metrica.tipo}`} key={metrica.etiqueta}>
              <span className="metrica-icon" aria-hidden="true"><MetricaIcon tipo={metrica.tipo} /></span>
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
        <aside className="pacientes-directory-panel" aria-label="Listado de pacientes">
          <div className="panel-heading panel-heading--compact">
            <div>
              <span className="panel-kicker">Directorio</span>
              <h2>Pacientes registrados</h2>
            </div>
            <strong>{cantidadVisible}</strong>
          </div>

          <div className="directory-search-row">
            <label className="buscador-pacientes buscador-pacientes--compact">
              <span>Buscar</span>
              <input
                autoComplete="off"
                placeholder="Nombre, email, teléfono, comuna o región"
                type="search"
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
              />
            </label>
            <button className="directory-filter-button" type="button" aria-label="Abrir filtros avanzados">
              ≡
            </button>
          </div>

          <div className="filtros-rapidos filtros-rapidos--compact" aria-label="Filtros rápidos de pacientes">
            {filtrosEstado.map((filtro) => (
              <button
                aria-pressed={filtroEstado === filtro.valor}
                className={filtroEstado === filtro.valor ? 'chip chip--activo' : 'chip'}
                key={filtro.valor}
                onClick={() => setFiltroEstado(filtro.valor)}
                type="button"
              >
                {filtro.etiqueta}
              </button>
            ))}
          </div>

          {cargando ? (
            <div className="estado-listado">
              <strong>Cargando pacientes</strong>
              <p>Preparando el directorio clínico local.</p>
            </div>
          ) : pacientes.length === 0 ? (
            <div className="estado-listado estado-listado--vacio">
              <strong>Aún no hay pacientes registrados</strong>
              <p>Completa la ficha de ingreso para crear el primer registro.</p>
            </div>
          ) : pacientesFiltrados.length === 0 ? (
            <div className="estado-listado estado-listado--vacio">
              <strong>No hay resultados</strong>
              <p>Ajusta la búsqueda o cambia el filtro de estado.</p>
            </div>
          ) : (
            <>
              <div className="pacientes-cards pacientes-cards--compact" aria-live="polite">
                {pacientesFiltrados.map((paciente) => {
                  const ubicacionPaciente = [paciente.comuna, paciente.region].filter(Boolean).join(', ')

                  return (
                    <article className="paciente-card paciente-card--compact" key={paciente.id}>
                      <div className="paciente-avatar" aria-hidden="true">
                        {obtenerIniciales(paciente.nombres, paciente.apellidos)}
                      </div>

                      <div className="paciente-card__body">
                        <div className="paciente-card__topline">
                          <div>
                            <h3>{paciente.nombres} {paciente.apellidos}</h3>
                            <p className="paciente-card__contact-line">
                              <span>{mostrarDato(paciente.telefono, 'Sin teléfono')}</span>
                              <span aria-hidden="true">·</span>
                              <span>{mostrarDato(paciente.email, 'Sin email')}</span>
                            </p>
                          </div>
                          <span className={`estado-badge estado-badge--${paciente.estado}`}>
                            {obtenerEtiqueta(opcionesEstado, paciente.estado) || paciente.estado}
                          </span>
                        </div>

                        <div className="paciente-card__footer-line">
                          <span>{mostrarDato(ubicacionPaciente, 'Sin ubicación')}</span>
                          <time dateTime={paciente.created_at}>{formatearFecha(paciente.created_at)}</time>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>

              <div className="directory-pagination">
                <span>Mostrando 1 a {cantidadVisible} de {totalPacientes} pacientes</span>
                <div aria-hidden="true">
                  <button type="button">‹</button>
                  <strong>1</strong>
                  <button type="button">›</button>
                </div>
              </div>
            </>
          )}
        </aside>

        <section className="pacientes-intake-panel" aria-label="Nuevo paciente">
          <div className="form-panel-header form-panel-header--command">
            <div className="form-panel-title">
              <span className="form-panel-icon" aria-hidden="true">N</span>
              <div>
                <span className="panel-kicker">Ficha inteligente</span>
                <h2>Nuevo paciente</h2>
                <p>Ingreso inicial con preview en vivo antes de guardar.</p>
              </div>
            </div>

            <button className="guardar-paciente" disabled={guardando} form="paciente-form" type="submit">
              {guardando ? 'Guardando...' : 'Guardar paciente'}
            </button>
          </div>

          <div className="form-stepper" aria-label="Etapas de la ficha de paciente">
            {pasosFicha.map((paso) => (
              <button
                aria-current={pasoActivo === paso.clave ? 'step' : undefined}
                className={pasoActivo === paso.clave ? 'form-stepper__item form-stepper__item--activo' : 'form-stepper__item'}
                key={paso.numero}
                onClick={() => setPasoActivo(paso.clave)}
                type="button"
              >
                <strong>{paso.numero}</strong>
                {paso.etiqueta}
              </button>
            ))}
          </div>

          <div className="intake-command-layout">
            <form className="formulario-ficha formulario-ficha--command" id="paciente-form" onSubmit={guardarPaciente}>
              {pasosFicha.map(renderPasoFormulario)}
            </form>

            <aside className="preview-paciente preview-paciente--command" aria-label="Preview del nuevo paciente">
              <div className="preview-avatar" aria-hidden="true">
                {obtenerIniciales(formulario.nombres, formulario.apellidos)}
              </div>

              <div className="preview-heading">
                <span>Preview vivo</span>
                <h3>{nombrePreview || 'Nuevo paciente'}</h3>
                <p>
                  {formularioTieneDatos
                    ? 'Así se verá la ficha inicial antes de guardarla.'
                    : 'Completa la ficha para construir el resumen clínico.'}
                </p>
              </div>

              <span className={`estado-badge estado-badge--${formulario.estado}`}>
                {obtenerEtiqueta(opcionesEstado, formulario.estado) || formulario.estado}
              </span>

              <div className="preview-data preview-data--command">
                <p><strong>Tel.</strong> <span>{mostrarDato(formulario.telefono)}</span></p>
                <p><strong>Email</strong> <span>{mostrarDato(formulario.email)}</span></p>
                <p><strong>Zona</strong> <span>{mostrarDato(ubicacionPreview)}</span></p>
                <p><strong>Sexo</strong> <span>{sexoPreview || 'Pendiente'}</span></p>
                <p><strong>Nacimiento</strong> <span>{fechaNacimientoPreview}</span></p>
              </div>

              <div className="preview-help">
                Esta tarjeta se actualiza mientras completas el ingreso, sin guardar cambios hasta confirmar.
              </div>
            </aside>
          </div>

          {mensaje && (
            <p className={mensajeEsError ? 'mensaje mensaje--error' : 'mensaje'}>
              {mensaje}
            </p>
          )}
        </section>
      </section>
    </main>
  )
}

export default PacientesPage
