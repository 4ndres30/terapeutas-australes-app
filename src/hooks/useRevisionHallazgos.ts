import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { CrearRevisionHallazgoPayload, RevisionHallazgo } from '../types/revisionHallazgos'

const HALLAZGO_SELECT = [
  'id_revision_hallazgo',
  'paciente_id',
  'caso_id',
  'revision_id',
  'revision_elemento_id',
  'revision_aspecto_id',
  'elemento_caso_id',
  'categoria_hallazgo',
  'tipo_hallazgo',
  'subtipo_hallazgo',
  'descripcion_hallazgo',
  'intensidad_hallazgo_porcentaje',
  'nivel_bloqueo_porcentaje',
  'origen_sugerido',
  'fuente_deteccion',
  'nivel_confirmacion',
  'requiere_seguimiento',
  'prioridad_hallazgo',
  'estado_hallazgo',
  'informacion_canalizada',
  'observaciones',
  'notas_internas',
  'created_at',
  'updated_at',
].join(', ')

type UseRevisionHallazgosParams = {
  casoId: string
  pacienteId: string
}

function validarPayload(payload: CrearRevisionHallazgoPayload) {
  const relacionesCriticas = [
    payload.paciente_id,
    payload.caso_id,
    payload.revision_id,
    payload.revision_elemento_id,
    payload.revision_aspecto_id,
    payload.elemento_caso_id,
  ]

  if (relacionesCriticas.some((valor) => !valor)) {
    return 'Faltan relaciones críticas para crear el hallazgo desde este aspecto.'
  }

  if (!payload.revision_aspecto_id) {
    return 'No se puede crear un hallazgo sin aspecto revisado asociado.'
  }

  if (!payload.descripcion_hallazgo.trim()) {
    return 'Completa la descripción del hallazgo.'
  }

  return ''
}

export function useRevisionHallazgos({ casoId, pacienteId }: UseRevisionHallazgosParams) {
  const [hallazgos, setHallazgos] = useState<RevisionHallazgo[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const hallazgosPorAspecto = useMemo(() => {
    const mapa = new Map<string, RevisionHallazgo[]>()

    hallazgos.forEach((hallazgo) => {
      const actuales = mapa.get(hallazgo.revision_aspecto_id) || []
      mapa.set(hallazgo.revision_aspecto_id, [...actuales, hallazgo])
    })

    return mapa
  }, [hallazgos])

  const refrescarHallazgos = useCallback(async () => {
    if (!casoId || !pacienteId) {
      setHallazgos([])
      setCargando(false)
      return
    }

    setCargando(true)
    setError('')

    const { data, error: hallazgosError } = await supabase
      .from('revision_hallazgos')
      .select(HALLAZGO_SELECT)
      .eq('caso_id', casoId)
      .eq('paciente_id', pacienteId)
      .order('created_at', { ascending: false })

    if (hallazgosError) {
      setError(`Error al cargar hallazgos: ${hallazgosError.message}`)
      setCargando(false)
      return
    }

    setHallazgos((data || []) as unknown as RevisionHallazgo[])
    setCargando(false)
  }, [casoId, pacienteId])

  const listarHallazgosPorRevision = useCallback((revisionId: string) => (
    hallazgos.filter((hallazgo) => hallazgo.revision_id === revisionId)
  ), [hallazgos])

  const listarHallazgosPorAspecto = useCallback((revisionAspectoId: string) => (
    hallazgosPorAspecto.get(revisionAspectoId) || []
  ), [hallazgosPorAspecto])

  const obtenerHallazgoPorAspecto = useCallback((revisionAspectoId: string) => (
    listarHallazgosPorAspecto(revisionAspectoId)[0] || null
  ), [listarHallazgosPorAspecto])

  const existeHallazgoParaAspecto = useCallback((revisionAspectoId: string) => (
    listarHallazgosPorAspecto(revisionAspectoId).length > 0
  ), [listarHallazgosPorAspecto])

  const crearHallazgoDesdeAspecto = useCallback(async (payload: CrearRevisionHallazgoPayload) => {
    const errorPayload = validarPayload(payload)

    if (errorPayload) {
      throw new Error(errorPayload)
    }

    const { data: existentes, error: duplicadoError } = await supabase
      .from('revision_hallazgos')
      .select(HALLAZGO_SELECT)
      .eq('revision_aspecto_id', payload.revision_aspecto_id)
      .limit(1)

    if (duplicadoError) {
      throw new Error(`Error al validar hallazgo existente: ${duplicadoError.message}`)
    }

    if ((existentes || []).length > 0) {
      const hallazgoExistente = (existentes || [])[0] as unknown as RevisionHallazgo
      setHallazgos((actuales) => {
        const yaExiste = actuales.some((hallazgo) => hallazgo.id_revision_hallazgo === hallazgoExistente.id_revision_hallazgo)
        return yaExiste ? actuales : [hallazgoExistente, ...actuales]
      })
      throw new Error('Ya existe un hallazgo asociado a este aspecto. Revisa el registro antes de crear uno nuevo.')
    }

    const { data, error: crearError } = await supabase
      .from('revision_hallazgos')
      .insert(payload)
      .select(HALLAZGO_SELECT)
      .single()

    if (crearError) {
      throw new Error(crearError.message)
    }

    const hallazgoCreado = data as unknown as RevisionHallazgo
    setHallazgos((actuales) => [hallazgoCreado, ...actuales])
    return hallazgoCreado
  }, [])

  useEffect(() => {
    const carga = window.setTimeout(() => {
      void refrescarHallazgos()
    }, 0)

    return () => window.clearTimeout(carga)
  }, [refrescarHallazgos])

  return {
    hallazgos,
    cargando,
    error,
    refrescarHallazgos,
    listarHallazgosPorRevision,
    listarHallazgosPorAspecto,
    obtenerHallazgoPorAspecto,
    existeHallazgoParaAspecto,
    crearHallazgoDesdeAspecto,
  }
}
