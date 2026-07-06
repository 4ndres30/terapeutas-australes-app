import { useCallback, useEffect, useMemo, useState } from 'react'
import { formatearFecha, normalizarTexto, textoCorto } from '../../lib/format'
import { supabase } from '../../lib/supabase'
import '../ClinicalModuleBase.css'

type TrabajosCasoPanelProps = {
  casoId: string
  pacienteId: string
}

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
  tipo_trabajo: string
  ambito_trabajo: string
  modalidad_ejecucion: string
  fase_actual: string
  alcance_trabajo: string
  metodo_principal: string
  objetivo_trabajo: string
  prioridad_trabajo: string
  porcentaje_avance_general: number
  requiere_seguimiento: boolean
  proxima_accion: string | null
  resultado_general: string | null
  estado_trabajo: string
  observaciones: string | null
  created_at: string
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

function TrabajosCasoPanel({ casoId, pacienteId }: TrabajosCasoPanelProps) {
  const [trabajos, setTrabajos] = useState<Trabajo[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(true)

  const trabajosFiltrados = useMemo(() => {
    if (!busqueda.trim()) {
      return trabajos
    }

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
    { etiqueta: 'Trabajos', valor: trabajos.length, detalle: 'Asociados al caso' },
    { etiqueta: 'Activos', valor: trabajos.filter((trabajo) => trabajo.estado_trabajo !== 'Cerrado' && trabajo.estado_trabajo !== 'Anulado').length, detalle: 'No cerrados' },
    { etiqueta: 'Seguimiento', valor: trabajos.filter((trabajo) => trabajo.requiere_seguimiento).length, detalle: 'Requieren acción' },
    { etiqueta: 'Avance prom.', valor: trabajos.length ? `${Math.round(trabajos.reduce((total, trabajo) => total + trabajo.porcentaje_avance_general, 0) / trabajos.length)}%` : '0%', detalle: 'Promedio simple' },
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
      setMensaje(`Error al cargar trabajos/intervenciones: ${error.message}`)
      setCargando(false)
      return
    }

    setTrabajos((data || []) as unknown as Trabajo[])
    setCargando(false)
  }, [casoId, pacienteId])

  useEffect(() => {
    const carga = window.setTimeout(() => {
      void cargarTrabajos()
    }, 0)

    return () => window.clearTimeout(carga)
  }, [cargarTrabajos])

  return (
    <section className="caso-detail-section" id="trabajos-intervenciones">
      <div className="caso-section-heading">
        <div>
          <span className="clinical-kicker">Trabajos / Intervenciones</span>
          <h2>Trabajos del caso</h2>
          <p>Lectura base desde `trabajos.caso_id`. La creación de trabajos queda pendiente para una pantalla operativa específica.</p>
        </div>
      </div>

      <section className="clinical-metrics caso-detail-metrics" aria-label="Métricas de trabajos del caso">
        {metricas.map((metrica) => (
          <article className="clinical-metric-card" key={metrica.etiqueta}>
            <strong>{metrica.valor}</strong>
            <span>{metrica.etiqueta}</span>
            <p>{metrica.detalle}</p>
          </article>
        ))}
      </section>

      <section className="clinical-panel" aria-label="Trabajos registrados en el caso">
        <div className="clinical-panel__header">
          <div>
            <span className="clinical-kicker">Listado</span>
            <h2>Intervenciones registradas</h2>
            <p>No se muestran trabajos de otros casos.</p>
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
            <strong>{cargando ? 'Cargando trabajos' : 'Sin trabajos/intervenciones registrados en este caso'}</strong>
            <p>{cargando ? 'Consultando Supabase local.' : 'La tabla existe, pero aún no hay registros para este caso.'}</p>
          </div>
        ) : (
          <div className="clinical-list">
            {trabajosFiltrados.map((trabajo) => (
              <article className="clinical-card" key={trabajo.id_trabajo}>
                <div className="clinical-card__top">
                  <div>
                    <h3>{trabajo.nombre_trabajo}</h3>
                    <small>Trabajo {trabajo.numero_trabajo} · inicio {formatearFecha(trabajo.fecha_inicio)}</small>
                  </div>
                  <span className="clinical-badge">{trabajo.estado_trabajo}</span>
                </div>
                <p>{textoCorto(trabajo.objetivo_trabajo, 128)}</p>
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
                    <dt>Avance</dt>
                    <dd>{trabajo.porcentaje_avance_general}%</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        )}

        {mensaje && <p className={mensaje.startsWith('Error') ? 'clinical-message clinical-message--error' : 'clinical-message'}>{mensaje}</p>}
      </section>
    </section>
  )
}

export default TrabajosCasoPanel
