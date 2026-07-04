/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type ReactNode, type Dispatch, type SetStateAction } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { RolUsuario, UsuarioInterno, UsuarioInternoRow, EstadoAuth } from './authTypes'

type AuthContextType = {
  estadoAuth: EstadoAuth
  session: Session | null
  usuarioInterno: UsuarioInterno | null
  mensajeAuth: string
  setEstadoAuth: Dispatch<SetStateAction<EstadoAuth>>
  setSession: Dispatch<SetStateAction<Session | null>>
  setUsuarioInterno: Dispatch<SetStateAction<UsuarioInterno | null>>
  setMensajeAuth: Dispatch<SetStateAction<string>>
  cerrarSesion: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

const rolesValidos: RolUsuario[] = ['admin', 'terapeuta', 'finanzas']

const mensajeAccesoInternoNoHabilitado =
  'Acceso interno no habilitado. Solicita revisión a un administrador.'
const mensajeValidacionAcceso =
  'No se pudo validar el acceso interno. Intenta nuevamente o contacta a un administrador.'
const mensajeSesionNoValidada =
  'No se pudo validar la sesión. Intenta iniciar sesión nuevamente.'

function esRolUsuario(rol: string): rol is RolUsuario {
  return rolesValidos.includes(rol as RolUsuario)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [estadoAuth, setEstadoAuth] = useState<EstadoAuth>('cargando')
  const [session, setSession] = useState<Session | null>(null)
  const [usuarioInterno, setUsuarioInterno] = useState<UsuarioInterno | null>(null)
  const [mensajeAuth, setMensajeAuth] = useState('')

  async function cerrarSesion() {
    await supabase.auth.signOut()
  }

  useEffect(() => {
    let componenteActivo = true

    async function aplicarSesion(sesionActual: Session | null) {
      if (!componenteActivo) {
        return
      }

      setSession(sesionActual)

      if (!sesionActual) {
        setUsuarioInterno(null)
        setMensajeAuth('')
        setEstadoAuth('sin_sesion')
        return
      }

      const { data, error } = await supabase
        .from('usuarios_internos')
        .select('id, email, nombre_completo, rol, activo')
        .eq('id', sesionActual.user.id)
        .maybeSingle()

      if (!componenteActivo) {
        return
      }

      if (error) {
        setUsuarioInterno(null)
        setMensajeAuth(mensajeValidacionAcceso)
        setEstadoAuth('error')
        return
      }

      if (!data) {
        setUsuarioInterno(null)
        setMensajeAuth(mensajeAccesoInternoNoHabilitado)
        setEstadoAuth('sin_autorizacion')
        return
      }

      const usuario = data as UsuarioInternoRow

      if (!esRolUsuario(usuario.rol)) {
        setUsuarioInterno(null)
        setMensajeAuth(mensajeAccesoInternoNoHabilitado)
        setEstadoAuth('sin_autorizacion')
        return
      }

      if (!usuario.activo) {
        setUsuarioInterno(null)
        setMensajeAuth(mensajeAccesoInternoNoHabilitado)
        setEstadoAuth('inactivo')
        return
      }

      setUsuarioInterno({ ...usuario, rol: usuario.rol })
      setMensajeAuth('')
      setEstadoAuth('autorizado')
    }

    async function cargarSesionInicial() {
      const { data, error } = await supabase.auth.getSession()

      if (!componenteActivo) {
        return
      }

      if (error) {
        setSession(null)
        setUsuarioInterno(null)
        setMensajeAuth(mensajeSesionNoValidada)
        setEstadoAuth('error')
        return
      }

      await aplicarSesion(data.session)
    }

    void cargarSesionInicial()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, sesionActual) => {
      void aplicarSesion(sesionActual)
    })

    return () => {
      componenteActivo = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const value: AuthContextType = {
    estadoAuth,
    session,
    usuarioInterno,
    mensajeAuth,
    setEstadoAuth,
    setSession,
    setUsuarioInterno,
    setMensajeAuth,
    cerrarSesion,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider')
  }
  return context
}
