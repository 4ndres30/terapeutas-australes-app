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

const opcionesSexo = [
  { etiqueta: 'Femenino', valor: 'femenino' },
  { etiqueta: 'Masculino', valor: 'masculino' },
  { etiqueta: 'Otro', valor: 'otro' },
  { etiqueta: 'Prefiere no decir', valor: 'prefiere_no_decir' },
]

const opcionesEstado = [
  { etiqueta: 'Activo', valor: 'activo' },
  { etiqueta: 'Inactivo', valor: 'inactivo' },
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

function formatearFecha(fecha: string) {
  if (!fecha) {
    return 'Sin fecha'
  }

  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(fecha))
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

function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>('todos')
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
  const mensajeEsError = mensaje.toLowerCase().startsWith('error')

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
    setGuardando(true)
    setMensaje('Guardando paciente...')

    const { error } = await supabase.from('pacientes').insert({
      nombres: formulario.nombres,
      apellidos: formulario.apellidos,
      fecha_nacimiento: formulario.fecha_nacimiento,
      sexo: formulario.sexo,
      telefono: formulario.telefono,
      email: formulario.email,
      comuna: formulario.comuna,
      region: formulario.region,
      estado: formulario.estado,
    })

    if (error) {
      setMensaje(`Error al guardar: ${error.message}`)
      setGuardando(false)
      return
    }

    setMensaje('Paciente guardado correctamente')
    setFormulario(formularioInicial)

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

  const metricas = [
    { etiqueta: 'Total pacientes', valor: totalPacientes, detalle: 'Registros clínicos', icono: 'T' },
    { etiqueta: 'Activos', valor: pacientesActivos, detalle: 'Disponibles para seguimiento', icono: 'A' },
    { etiqueta: 'Inactivos', valor: pacientesInactivos, detalle: 'Archivados temporalmente', icono: 'I' },
    { etiqueta: 'Último registro', valor: ultimoRegistro ? formatearFecha(ultimoRegistro) : 'Sin registros', detalle: 'Ingreso más reciente', icono: 'R' },
  ]

  return (
    <main className="pacientes-shell">
      <section className="pacientes-dashboard-header">
        <div>
          <span className="modulo-badge">Módulo clínico</span>
          <h1>Pacientes</h1>
          <p>Gestiona, registra y revisa la información esencial de tus pacientes.</p>
        </div>
      </section>

      <section className="metricas-dashboard" aria-label="Métricas de pacientes">
        {metricas.map((metrica) => (
          <article className="metrica-dashboard-card" key={metrica.etiqueta}>
            <span className="metrica-icon" aria-hidden="true">{metrica.icono}</span>
            <div>
              <strong>{metrica.valor}</strong>
              <span>{metrica.etiqueta}</span>
              <p>{metrica.detalle}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="pacientes-workspace">
        <aside className="pacientes-list-panel" aria-label="Listado de pacientes">
          <div className="panel-heading">
            <div>
              <span className="panel-kicker">Directorio</span>
              <h2>Pacientes registrados</h2>
            </div>
            <strong>{pacientesFiltrados.length}</strong>
          </div>

          <label className="buscador-pacientes">
            <span>Buscar</span>
            <input
              placeholder="Nombre, apellido, email, teléfono, comuna o región"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
            />
          </label>

          <div className="filtros-rapidos" aria-label="Filtros rápidos de pacientes">
            {filtrosEstado.map((filtro) => (
              <button
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
            <div className="pacientes-cards" aria-live="polite">
              {pacientesFiltrados.map((paciente) => (
                <article className="paciente-card" key={paciente.id}>
                  <div className="paciente-avatar" aria-hidden="true">
                    {obtenerIniciales(paciente.nombres, paciente.apellidos)}
                  </div>

                  <div className="paciente-card__body">
                    <div className="paciente-card__topline">
                      <div>
                        <h3>{paciente.nombres} {paciente.apellidos}</h3>
                        <span>Registrado el {formatearFecha(paciente.created_at)}</span>
                      </div>
                      <span className={`estado-badge estado-badge--${paciente.estado}`}>
                        {paciente.estado}
                      </span>
                    </div>

                    <dl className="paciente-card__details">
                      <div>
                        <dt>Teléfono</dt>
                        <dd>{paciente.telefono}</dd>
                      </div>
                      <div>
                        <dt>Email</dt>
                        <dd>{paciente.email}</dd>
                      </div>
                      <div>
                        <dt>Ubicación</dt>
                        <dd>{paciente.comuna}, {paciente.region}</dd>
                      </div>
                    </dl>
                  </div>
                </article>
              ))}
            </div>
          )}
        </aside>

        <section className="pacientes-form-panel" aria-label="Nuevo paciente">
          <div className="form-panel-header">
            <div className="form-panel-title">
              <span className="form-panel-icon" aria-hidden="true">N</span>
              <div>
                <span className="panel-kicker">Ficha inteligente</span>
                <h2>Nuevo paciente</h2>
              </div>
            </div>

            <button className="guardar-paciente" disabled={guardando} form="paciente-form" type="submit">
              {guardando ? 'Guardando...' : 'Guardar paciente'}
            </button>
          </div>

          <div className="form-panel-grid">
            <form className="formulario-ficha" id="paciente-form" onSubmit={guardarPaciente}>
              <section className="form-section form-section--identidad">
                <div className="form-section__header">
                  <span>01</span>
                  <div>
                    <h3>Identidad</h3>
                    <p>Datos base para reconocer la ficha clínica.</p>
                  </div>
                </div>

                <div className="form-grid">
                  <label>
                    Nombres *
                    <input
                      placeholder="Ej: Catalina Belén"
                      value={formulario.nombres}
                      onChange={(event) => actualizarFormulario('nombres', event.target.value)}
                      required
                    />
                  </label>

                  <label>
                    Apellidos *
                    <input
                      placeholder="Ej: Troncoso Caro"
                      value={formulario.apellidos}
                      onChange={(event) => actualizarFormulario('apellidos', event.target.value)}
                      required
                    />
                  </label>

                  <label>
                    Fecha de nacimiento *
                    <input
                      type="date"
                      value={formulario.fecha_nacimiento}
                      onChange={(event) => actualizarFormulario('fecha_nacimiento', event.target.value)}
                      required
                    />
                  </label>
                </div>

                <div className="chip-field">
                  <span>Sexo *</span>
                  <div className="selector-chips">
                    {opcionesSexo.map((opcion) => (
                      <label
                        className={formulario.sexo === opcion.valor ? 'selector-chip selector-chip--activo' : 'selector-chip'}
                        key={opcion.valor}
                      >
                        <input
                          checked={formulario.sexo === opcion.valor}
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
              </section>

              <section className="form-section form-section--contacto">
                <div className="form-section__header">
                  <span>02</span>
                  <div>
                    <h3>Contacto</h3>
                    <p>Canales principales para coordinación.</p>
                  </div>
                </div>

                <div className="form-grid">
                  <label>
                    Teléfono *
                    <input
                      placeholder="Ej: +56 9 1234 5678"
                      value={formulario.telefono}
                      onChange={(event) => actualizarFormulario('telefono', event.target.value)}
                      required
                    />
                  </label>

                  <label>
                    Email *
                    <input
                      placeholder="Ej: paciente@correo.cl"
                      type="email"
                      value={formulario.email}
                      onChange={(event) => actualizarFormulario('email', event.target.value)}
                      required
                    />
                  </label>
                </div>
              </section>

              <section className="form-section form-section--ubicacion">
                <div className="form-section__header">
                  <span>03</span>
                  <div>
                    <h3>Ubicación</h3>
                    <p>Contexto territorial del paciente.</p>
                  </div>
                </div>

                <div className="form-grid">
                  <label>
                    Comuna *
                    <input
                      placeholder="Ej: Castro"
                      value={formulario.comuna}
                      onChange={(event) => actualizarFormulario('comuna', event.target.value)}
                      required
                    />
                  </label>

                  <label>
                    Región *
                    <input
                      placeholder="Ej: Los Lagos"
                      value={formulario.region}
                      onChange={(event) => actualizarFormulario('region', event.target.value)}
                      required
                    />
                  </label>
                </div>
              </section>

              <section className="form-section form-section--estado">
                <div className="form-section__header">
                  <span>04</span>
                  <div>
                    <h3>Estado</h3>
                    <p>Define si queda disponible para seguimiento.</p>
                  </div>
                </div>

                <div className="selector-chips selector-chips--estado">
                  {opcionesEstado.map((opcion) => (
                    <label
                      className={formulario.estado === opcion.valor ? 'selector-chip selector-chip--activo' : 'selector-chip'}
                      key={opcion.valor}
                    >
                      <input
                        checked={formulario.estado === opcion.valor}
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
              </section>
            </form>

            <aside className="preview-paciente" aria-label="Preview del nuevo paciente">
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
                {formulario.estado}
              </span>

              <div className="preview-data">
                <p><strong>Tel.</strong> {formulario.telefono || 'Pendiente'}</p>
                <p><strong>Email</strong> {formulario.email || 'Pendiente'}</p>
                <p><strong>Zona</strong> {ubicacionPreview || 'Pendiente'}</p>
                <p><strong>Nacimiento</strong> {formulario.fecha_nacimiento || 'Pendiente'}</p>
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

