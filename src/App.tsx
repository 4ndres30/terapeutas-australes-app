import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import PacientesPage from './pages/PacientesPage'
import LoginPage from './pages/LoginPage'
import { supabase } from './lib/supabase'
import './App.css'

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

const rolesValidos: RolUsuario[] = ['admin', 'terapeuta', 'finanzas']

function esRolUsuario(rol: string): rol is RolUsuario {
  return rolesValidos.includes(rol as RolUsuario)
}

function rutaInicial(usuarioInterno: UsuarioInterno | null) {
  if (usuarioInterno?.rol === 'finanzas') {
    return '/finanzas'
  }

  return '/pacientes'
}

function PantallaCarga() {
  return (
    <main className="auth-shell">
      <section className="auth-card">
        <h1>Cargando sesión</h1>
        <p>Validando acceso interno...</p>
      </section>
    </main>
  )
}

function MensajeModuloFinanzas({ usuarioInterno, onCerrarSesion }: {
  usuarioInterno: UsuarioInterno
  onCerrarSesion: () => Promise<void>
}) {
  return (
    <main className="auth-shell">
      <section className="auth-card">
        <p className="auth-label">{usuarioInterno.nombre_completo}</p>
        <h1>Módulo financiero pendiente</h1>
        <p>Tu usuario puede iniciar sesión, pero el módulo financiero aún no está implementado.</p>
        <button type="button" onClick={() => void onCerrarSesion()}>
          Cerrar sesión
        </button>
      </section>
    </main>
  )
}

function AppPrivada({ usuarioInterno, onCerrarSesion }: {
  usuarioInterno: UsuarioInterno
  onCerrarSesion: () => Promise<void>
}) {
  return (
    <>
      <header className="app-header">
        <div>
          <strong>{usuarioInterno.nombre_completo}</strong>
          <span>{usuarioInterno.rol}</span>
        </div>
        <button type="button" onClick={() => void onCerrarSesion()}>
          Cerrar sesión
        </button>
      </header>
      <PacientesPage />
    </>
  )
}

function RutaProtegida({
  estadoAuth,
  usuarioInterno,
  rolesPermitidos,
  children,
}: {
  estadoAuth: EstadoAuth
  usuarioInterno: UsuarioInterno | null
  rolesPermitidos: RolUsuario[]
  children: React.ReactNode
}) {
  if (estadoAuth === 'cargando') {
    return <PantallaCarga />
  }

  if (estadoAuth !== 'autorizado' || !usuarioInterno) {
    return <Navigate to="/login" replace />
  }

  if (!rolesPermitidos.includes(usuarioInterno.rol)) {
    return <Navigate to={rutaInicial(usuarioInterno)} replace />
  }

  return children
}

function App() {
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
        setMensajeAuth(`Error al validar usuario interno: ${error.message}`)
        setEstadoAuth('error')
        return
      }

      if (!data) {
        setUsuarioInterno(null)
        setMensajeAuth('Usuario no autorizado. Solicita acceso a un administrador.')
        setEstadoAuth('sin_autorizacion')
        return
      }

      const usuario = data as UsuarioInternoRow

      if (!esRolUsuario(usuario.rol)) {
        setUsuarioInterno(null)
        setMensajeAuth('Usuario no autorizado. El rol interno no es válido.')
        setEstadoAuth('sin_autorizacion')
        return
      }

      if (!usuario.activo) {
        setUsuarioInterno(null)
        setMensajeAuth('Usuario desactivado. Contacta a un administrador.')
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
        setMensajeAuth(`Error al obtener sesión: ${error.message}`)
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

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            estadoAuth === 'autorizado'
              ? <Navigate to={rutaInicial(usuarioInterno)} replace />
              : (
                <LoginPage
                  estadoAuth={estadoAuth}
                  mensajeAuth={mensajeAuth}
                  session={session}
                  onCerrarSesion={cerrarSesion}
                />
              )
          }
        />
        <Route
          path="/pacientes"
          element={
            <RutaProtegida
              estadoAuth={estadoAuth}
              usuarioInterno={usuarioInterno}
              rolesPermitidos={['admin', 'terapeuta']}
            >
              <AppPrivada usuarioInterno={usuarioInterno!} onCerrarSesion={cerrarSesion} />
            </RutaProtegida>
          }
        />
        <Route
          path="/finanzas"
          element={
            <RutaProtegida
              estadoAuth={estadoAuth}
              usuarioInterno={usuarioInterno}
              rolesPermitidos={['finanzas']}
            >
              <MensajeModuloFinanzas usuarioInterno={usuarioInterno!} onCerrarSesion={cerrarSesion} />
            </RutaProtegida>
          }
        />
        <Route
          path="*"
          element={
            <Navigate
              to={estadoAuth === 'autorizado' ? rutaInicial(usuarioInterno) : '/login'}
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
