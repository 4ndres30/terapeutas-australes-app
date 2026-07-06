type RolUsuario = 'admin' | 'terapeuta' | 'finanzas'

type UsuarioInterno = {
  id: string
  email: string
  nombre_completo: string
  rol: RolUsuario
  activo: boolean
}

type UsuarioInternoRow = Omit<UsuarioInterno, 'rol'> & {
  rol: string
}

type EstadoAuth = 'cargando' | 'sin_sesion' | 'autorizado' | 'sin_autorizacion' | 'inactivo' | 'error'

export type { RolUsuario, UsuarioInterno, UsuarioInternoRow, EstadoAuth }
