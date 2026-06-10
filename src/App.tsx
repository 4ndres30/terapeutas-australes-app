import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import PacientesPage from './pages/PacientesPage'
import LoginPage from './pages/LoginPage'
import { supabase } from './lib/supabase'
import './App.css'
import './DashboardPremium.css'
import './TypographyElegant.css'
import './ReferencePolish.css'
import './ReferenceFinalPass.css'

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

type NavegacionLateral = {
  etiqueta: string
  icono: string
  estado?: 'activo' | 'pronto'
}

const rolesValidos: RolUsuario[] = ['admin', 'terapeuta', 'finanzas']

const navegacionPrincipal: NavegacionLateral[] = [
  { etiqueta: 'Inicio', icono: '⌂', estado: 'pronto' },
  { etiqueta: 'Pacientes', icono: '♙', estado: 'activo' },
  { etiqueta: 'Consultas', icono: '✧', estado: 'pronto' },
  { etiqueta: 'Evaluaciones', icono: '□', estado: 'pronto' },
  { etiqueta: 'Casos', icono: '◇', estado: 'pronto' },
  { etiqueta: 'Trabajos', icono: '◈', estado: 'pronto' },
  { etiqueta: 'Cobros', icono: '$', estado: 'pronto' },
  { etiqueta: 'Agenda', icono: '☷', estado: 'pronto' },
  { etiqueta: 'Reportes', icono: '↗', estado: 'pronto' },
  { etiqueta: 'Configuración', icono: '⚙', estado: 'pronto' },
]

function esRolUsuario(rol: string): rol is RolUsuario {
  return rolesValidos.includes(rol as RolUsuario)
}

function rutaInicial(usuarioInterno: UsuarioInterno | null) {
  if (usuarioInterno?.rol === 'finanzas') {
    return '/finanzas'
  }

  return '/pacientes'
}

function obtenerInicialesUsuario(nombreCompleto: string) {
  const iniciales = nombreCompleto
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte.charAt(0))
    .join('')
    .toUpperCase()

  return iniciales || 'TA'
}

function formatearRol(rol: RolUsuario) {
  if (rol === 'admin') {
    return 'Administrador'
  }

  if (rol === 'finanzas') {
    return 'Finanzas'
  }

  return 'Terapeuta'
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

function DashboardShell({ usuarioInterno, onCerrarSesion, children }: {
  usuarioInterno: UsuarioInterno
  onCerrarSesion: () => Promise<void>
  children: ReactNode
}) {
  const inicialesUsuario = obtenerInicialesUsuario(usuarioInterno.nombre_completo)
  const rolVisible = formatearRol(usuarioInterno.rol)

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar" aria-label="Panel principal">
        <div className="sidebar-brand">
          <div className="sidebar-logo" aria-hidden="true">✦</div>
          <div>
            <strong>Terapeutas Australes</strong>
            <span>Gestión profesional</span>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Módulos disponibles">
          {navegacionPrincipal.map((item) => (
            <span
              className={item.estado === 'activo' ? 'sidebar-nav-item sidebar-nav-item--active' : 'sidebar-nav-item sidebar-nav-item--soon'}
              key={item.etiqueta}
            >
              <span className="sidebar-nav-icon" aria-hidden="true">{item.icono}</span>
              {item.etiqueta}
            </span>
          ))}
        </nav>

        <div className="sidebar-quote" aria-label="Mensaje institucional">
          <span aria-hidden="true">“</span>
          <p>Cada persona que acompañamos es una historia única.</p>
        </div>

        <div className="sidebar-footer">
          <span>v1.0.0</span>
          <div className="sidebar-status">
            <span aria-hidden="true" />
            En línea
          </div>
        </div>

        <button className="sidebar-logout" type="button" onClick={() => void onCerrarSesion()}>
          Cerrar sesión
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar" aria-label="Barra superior">
          <div>
            <span className="dashboard-eyebrow">Centro clínico</span>
            <p>Gestión interna de Terapeutas Australes</p>
          </div>

          <div className="dashboard-userbar">
            <button className="dashboard-notification" aria-label="Notificaciones" type="button">
              <span aria-hidden="true">⌁</span>
              <strong>3</strong>
            </button>
            <div className="dashboard-userbar__avatar" aria-hidden="true">{inicialesUsuario}</div>
            <div className="dashboard-userbar__meta">
              <strong>{usuarioInterno.nombre_completo}</strong>
              <span>{rolVisible}</span>
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  )
}

function MensajeModuloFinanzas() {
  return (
    <section className="dashboard-placeholder-card">
      <span>Módulo financiero</span>
      <h1>Finanzas aún no está implementado</h1>
      <p>Tu usuario puede iniciar sesión, pero este módulo se activará en una etapa posterior.</p>
    </section>
  )
}

function AppPrivada({ usuarioInterno, onCerrarSesion }: {
  usuarioInterno: UsuarioInterno
  onCerrarSesion: () => Promise<void>
}) {
  return (
    <DashboardShell usuarioInterno={usuarioInterno} onCerrarSesion={onCerrarSesion}>
      <PacientesPage />
    </DashboardShell>
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
  children: ReactNode
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
              <DashboardShell usuarioInterno={usuarioInterno!} onCerrarSesion={cerrarSesion}>
                <MensajeModuloFinanzas />
              </DashboardShell>
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
