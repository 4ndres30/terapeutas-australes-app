import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { formatearFecha, normalizarTexto, textoCorto } from '../lib/format'
import './ClinicalModuleBase.css'

type Paciente = {
  id: string
  nombres: string
  apellidos: string
}

type TipoConsulta =
  | 'Primera consulta'
  | 'Seguimiento'
  | 'Evaluación inicial'
  | 'Revisión energética'
  | 'Canalización'
  | 'Tarot'
  | 'Limpieza energética'
  | 'Control posterior'
  | 'Urgencia'
  | 'Otro'

type ModalidadConsulta = 'Presencial' | 'Online' | 'WhatsApp' | 'Llamada telefónica' | 'Videollamada'
type EstadoConsulta = 'Agendada' | 'Realizada' | 'Pendiente' | 'Cancelada' | 'Reagendada' | 'No asistió'

type Consulta = {
  id_consulta: string
  paciente_id: string
  fecha_consulta: string
  hora_inicio: string | null
  hora_termino: string | null
  tipo_consulta: TipoConsulta
  modalidad: ModalidadConsulta
  estado_consulta: EstadoConsulta
  motivo_consulta: string
  resumen_consulta: string | null
  observaciones_internas: string | null
  created_at: string
}

type FormularioConsulta = {
  paciente_id: string
  fecha_consulta: string
  hora_inicio: string
  hora_termino: string
  tipo_consulta: TipoConsulta
  modalidad: ModalidadConsulta
  estado_consulta: EstadoConsulta
  motivo_consulta: string
  resumen_consulta: string
  observaciones_internas: string
}

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
  'created_at',
].join(', ')

const tiposConsulta: TipoConsulta[] = [
  'Primera consulta',
  'Seguimiento',
  'Evaluación inicial',
  'Revisión energética',
  'Canalización',
  'Tarot',
  'Limpieza energética',
  'Control posterior',
  'Urgencia',
  'Otro',
]

const modalidadesConsulta: ModalidadConsulta[] = ['Presencial', 'Online', 'WhatsApp', 'Llamada telefónica', 'Videollamada']
const estadosConsulta: EstadoConsulta[] = ['Agendada', 'Realizada', 'Pendiente', 'Cancelada', 'Reagendada', 'No asistió']

function fechaHoy() {
  return new Date().toISOString().slice(0, 10)
}

function crearFormularioInicial(): FormularioConsulta {
  return {
    paciente_id: '',
    fecha_consulta: fechaHoy(),
    hora_inicio: '',
    hora_termino: '',
    tipo_consulta: 'Primera consulta',
    modalidad: 'Presencial',
    estado_consulta: 'Agendada',
    motivo_consulta: '',
    resumen_consulta: '',
    observaciones_internas: '',
  }
}

async function obtenerPacientes(): Promise<Paciente[]> {
  const { data, error } = await supabase
    .from('pacientes')
    .select('id, nombres, apellidos')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Error al cargar pacientes: ${error.message}`)
  }

  return (data || []) as Paciente[]
}

async function obtenerConsultas(): Promise<Consulta[]> {
  const { data, error } = await supabase
    .from('consultas')
    .select(CONSULTA_SELECT)
    .order('fecha_consulta', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Error al cargar consultas: ${error.message}`)
  }

  return (data || []) as unknown as Consulta[]
}

function nombrePaciente(paciente?: Paciente) {
  if (!paciente) {
    return 'Paciente no encontrado'
  }

  return `${paciente.nombres} ${paciente.apellidos}`.trim() || 'Paciente sin nombre'
}

function validarFormulario(formulario: FormularioConsulta, pacientes: Paciente[]) {
  if (pacientes.length === 0) {
    return 'Primero debes crear un paciente antes de registrar una consulta.'
  }

  if (!formulario.paciente_id) {
    return 'Selecciona el paciente asociado a la consulta.'
  }

  if (!formulario.fecha_consulta) {
    return 'Selecciona la fecha de consulta.'
  }

  if (!formulario.tipo_consulta || !formulario.modalidad || !formulario.estado_consulta) {
    return 'Selecciona tipo, modalidad y estado de la consulta.'
  }

  if (!formulario.motivo_consulta.trim()) {
    return 'Describe el motivo de consulta.'
  }

  if (formulario.hora_inicio && formulario.hora_termino && formulario.hora_termino < formulario.hora_inicio) {
    return 'La hora de término no puede ser anterior a la hora de inicio.'
  }

  return ''
}

function ConsultasPage() {
  const queryClient = useQueryClient()

  const {
    data: pacientes = [],
    isLoading: cargandoPacientes,
    error: errorPacientes,
  } = useQuery({
    queryKey: ['pacientes'],
    queryFn: obtenerPacientes,
  })

  const {
    data: consultas = [],
    isLoading: cargandoConsultas,
    error: errorConsultas,
  } = useQuery({
    queryKey: ['consultas'],
    queryFn: obtenerConsultas,
  })

  const cargando = cargandoPacientes || cargandoConsultas
  const errorCarga = errorPacientes || errorConsultas

  const [formulario, setFormulario] = useState<FormularioConsulta>(() => crearFormularioInicial())
  const [busqueda, setBusqueda] = useState('')
  const [mensajeGuardado, setMensajeGuardado] = useState('')
  const [guardando, setGuardando] = useState(false)

  const mensaje = mensajeGuardado || (errorCarga ? errorCarga.message : '')

  const pacientesPorId = useMemo(() => new Map(pacientes.map((paciente) => [paciente.id, paciente])), [pacientes])
  const pacienteSeleccionado = pacientesPorId.get(formulario.paciente_id)

  const consultasFiltradas = useMemo(() => {
    if (!busqueda.trim()) {
      return consultas
    }

    const filtro = normalizarTexto(busqueda.trim())

    return consultas.filter((consulta) => {
      const texto = [
        nombrePaciente(pacientesPorId.get(consulta.paciente_id)),
        consulta.tipo_consulta,
        consulta.modalidad,
        consulta.estado_consulta,
        consulta.motivo_consulta,
        consulta.resumen_consulta || '',
      ].join(' ')

      return normalizarTexto(texto).includes(filtro)
    })
  }, [busqueda, consultas, pacientesPorId])

  const metricas = [
    { etiqueta: 'Total', valor: consultas.length, detalle: 'Consultas reales' },
    { etiqueta: 'Agendadas', valor: consultas.filter((consulta) => consulta.estado_consulta === 'Agendada').length, detalle: 'Pendientes de fecha' },
    { etiqueta: 'Realizadas', valor: consultas.filter((consulta) => consulta.estado_consulta === 'Realizada').length, detalle: 'Con atención registrada' },
    { etiqueta: 'Pendientes', valor: consultas.filter((consulta) => consulta.estado_consulta === 'Pendiente').length, detalle: 'Requieren gestión' },
  ]

  function actualizarFormulario(campo: keyof FormularioConsulta, valor: string) {
    setFormulario((actual) => ({ ...actual, [campo]: valor }))
  }

  async function guardarConsulta(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const errorFormulario = validarFormulario(formulario, pacientes)

    if (errorFormulario) {
      setMensajeGuardado(`Error: ${errorFormulario}`)
      return
    }

    setGuardando(true)
    setMensajeGuardado('Guardando consulta...')

    const payload = {
      paciente_id: formulario.paciente_id,
      fecha_consulta: formulario.fecha_consulta,
      hora_inicio: formulario.hora_inicio || null,
      hora_termino: formulario.hora_termino || null,
      tipo_consulta: formulario.tipo_consulta,
      modalidad: formulario.modalidad,
      estado_consulta: formulario.estado_consulta,
      motivo_consulta: formulario.motivo_consulta.trim(),
      resumen_consulta: formulario.resumen_consulta.trim() || null,
      observaciones_internas: formulario.observaciones_internas.trim() || null,
    }

    const { error } = await supabase
      .from('consultas')
      .insert(payload)
      .select(CONSULTA_SELECT)
      .single()

    if (error) {
      setMensajeGuardado(`Error al guardar consulta: ${error.message}`)
      setGuardando(false)
      return
    }

    await queryClient.invalidateQueries({ queryKey: ['consultas'] })
    setFormulario(crearFormularioInicial())
    setMensajeGuardado('Consulta guardada correctamente')
    setGuardando(false)
  }

  return (
    <main className="clinical-module-page">
      <section className="clinical-hero">
        <div className="clinical-hero__copy">
          <span className="clinical-kicker">Módulo clínico</span>
          <h1>Consultas</h1>
          <p>Registro base conectado a public.consultas, vinculado con pacientes reales.</p>
        </div>

        <section className="clinical-metrics" aria-label="Métricas de consultas">
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
        <section className="clinical-panel" aria-label="Directorio de consultas">
          <div className="clinical-panel__header">
            <div>
              <span className="clinical-kicker">Directorio</span>
              <h2>Consultas registradas</h2>
              <p>Lectura directa desde la tabla real.</p>
            </div>
            <span className="clinical-count">{consultasFiltradas.length}</span>
          </div>

          <label className="clinical-search">
            <span>Buscar</span>
            <input
              className="clinical-input"
              placeholder="Paciente, tipo, modalidad, estado o motivo"
              type="search"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
            />
          </label>

          {consultasFiltradas.length === 0 ? (
            <div className="clinical-empty">
              <strong>{cargando ? 'Cargando consultas' : 'Sin consultas registradas'}</strong>
              <p>{cargando ? 'Consultando Supabase local.' : 'Crea una consulta usando el formulario base.'}</p>
            </div>
          ) : (
            <div className="clinical-list">
              {consultasFiltradas.map((consulta) => (
                <article className="clinical-card" key={consulta.id_consulta}>
                  <div className="clinical-card__top">
                    <div>
                      <h3>{consulta.tipo_consulta}</h3>
                      <small>{nombrePaciente(pacientesPorId.get(consulta.paciente_id))} · {formatearFecha(consulta.fecha_consulta)}</small>
                    </div>
                    <span className="clinical-badge">{consulta.estado_consulta}</span>
                  </div>
                  <p>{textoCorto(consulta.motivo_consulta)}</p>
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
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="clinical-form-panel" aria-label="Nueva consulta">
          <div className="clinical-form-panel__header">
            <div>
              <span className="clinical-kicker">Formulario base</span>
              <h2>Nueva consulta</h2>
              <p>Usa solo columnas reales de public.consultas.</p>
            </div>
          </div>

          {pacientes.length === 0 && (
            <p className="clinical-note">Primero debes crear un paciente antes de registrar una consulta.</p>
          )}

          <form className="clinical-form" onSubmit={guardarConsulta}>
            <label className="clinical-field">
              <span>Paciente *</span>
              <select
                className="clinical-select"
                disabled={guardando || pacientes.length === 0}
                value={formulario.paciente_id}
                onChange={(event) => actualizarFormulario('paciente_id', event.target.value)}
                required
              >
                <option value="">Seleccionar paciente</option>
                {pacientes.map((paciente) => (
                  <option key={paciente.id} value={paciente.id}>{nombrePaciente(paciente)}</option>
                ))}
              </select>
            </label>

            <div className="clinical-grid">
              <label className="clinical-field">
                <span>Fecha *</span>
                <input
                  className="clinical-input"
                  disabled={guardando}
                  type="date"
                  value={formulario.fecha_consulta}
                  onChange={(event) => actualizarFormulario('fecha_consulta', event.target.value)}
                  required
                />
              </label>

              <label className="clinical-field">
                <span>Estado *</span>
                <select
                  className="clinical-select"
                  disabled={guardando}
                  value={formulario.estado_consulta}
                  onChange={(event) => actualizarFormulario('estado_consulta', event.target.value as EstadoConsulta)}
                  required
                >
                  {estadosConsulta.map((estado) => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="clinical-grid">
              <label className="clinical-field">
                <span>Tipo *</span>
                <select
                  className="clinical-select"
                  disabled={guardando}
                  value={formulario.tipo_consulta}
                  onChange={(event) => actualizarFormulario('tipo_consulta', event.target.value as TipoConsulta)}
                  required
                >
                  {tiposConsulta.map((tipo) => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </label>

              <label className="clinical-field">
                <span>Modalidad *</span>
                <select
                  className="clinical-select"
                  disabled={guardando}
                  value={formulario.modalidad}
                  onChange={(event) => actualizarFormulario('modalidad', event.target.value as ModalidadConsulta)}
                  required
                >
                  {modalidadesConsulta.map((modalidad) => (
                    <option key={modalidad} value={modalidad}>{modalidad}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="clinical-grid">
              <label className="clinical-field">
                <span>Hora inicio</span>
                <input
                  className="clinical-input"
                  disabled={guardando}
                  type="time"
                  value={formulario.hora_inicio}
                  onChange={(event) => actualizarFormulario('hora_inicio', event.target.value)}
                />
              </label>

              <label className="clinical-field">
                <span>Hora término</span>
                <input
                  className="clinical-input"
                  disabled={guardando}
                  type="time"
                  value={formulario.hora_termino}
                  onChange={(event) => actualizarFormulario('hora_termino', event.target.value)}
                />
              </label>
            </div>

            <label className="clinical-field">
              <span>Motivo *</span>
              <textarea
                className="clinical-textarea"
                disabled={guardando}
                value={formulario.motivo_consulta}
                onChange={(event) => actualizarFormulario('motivo_consulta', event.target.value)}
                placeholder="Motivo declarado para la consulta."
                required
              />
            </label>

            <label className="clinical-field">
              <span>Resumen</span>
              <textarea
                className="clinical-textarea"
                disabled={guardando}
                value={formulario.resumen_consulta}
                onChange={(event) => actualizarFormulario('resumen_consulta', event.target.value)}
                placeholder="Resumen clínico opcional."
              />
            </label>

            <label className="clinical-field">
              <span>Observaciones internas</span>
              <textarea
                className="clinical-textarea"
                disabled={guardando}
                value={formulario.observaciones_internas}
                onChange={(event) => actualizarFormulario('observaciones_internas', event.target.value)}
                placeholder="Notas internas opcionales."
              />
            </label>

            <button className="clinical-button" disabled={guardando || pacientes.length === 0} type="submit">
              {guardando ? 'Guardando...' : 'Guardar consulta'}
            </button>
          </form>

          <p className="clinical-note">
            Preview: {nombrePaciente(pacienteSeleccionado)} · {formulario.tipo_consulta} · {formatearFecha(formulario.fecha_consulta)}
          </p>

          {mensaje && <p className={mensaje.startsWith('Error') ? 'clinical-message clinical-message--error' : 'clinical-message'}>{mensaje}</p>}
        </section>
      </section>
    </main>
  )
}

export default ConsultasPage
