import { useState, useEffect, type ReactNode } from 'react'
import { Menu, ShieldAlert, X } from 'lucide-react'
import { BrowserRouter, Navigate, NavLink, Route, Routes } from 'react-router-dom'
import PacientesPage from './pages/PacientesPage'
import ConsultasPage from './pages/ConsultasPage'
import EvaluacionesPage from './pages/EvaluacionesPage'
import CasosPage from './pages/CasosPage'
import CasoDetallePage from './pages/CasoDetallePage'
import FinanzasPage from './pages/FinanzasPage'
import AgendaPage from './pages/AgendaPage'
import ReportesPage from './pages/ReportesPage'
import LoginPage from './pages/LoginPage'
import { AuthProvider, useAuth } from './context/AuthContext'
import type { RolUsuario, UsuarioInterno } from './context/authTypes'
import './App.css'
import './DashboardPremium.css'
import './TypographyElegant.css'
import './ReferencePolish.css'
import './ReferenceFinalPass.css'

type AmbienteApp = 'LOCAL' | 'DEMO' | 'STAGING' | 'PRODUCCION' | 'DESCONOCIDO'

type NivelAmbiente = 'informativo' | 'advertencia' | 'bloqueado'

type ConfiguracionAmbiente = {
  ambiente: AmbienteApp
  clase: string
  etiqueta: string
  detalle: string
  nivel: NivelAmbiente
  bloqueaUso: boolean
}

type NavegacionLateral = {
  etiqueta: string
  icono: string
  ruta?: string
  estado?: 'activo' | 'pronto'
  rolesPermitidos?: RolUsuario[]
}

const rolesValidos: RolUsuario[] = ['admin', 'terapeuta', 'finanzas']

const valoresVerdaderos = ['1', 'true', 'yes', 'habilitada']

function normalizarAmbiente(valor?: string) {
  if (!valor) {
    return import.meta.env.DEV ? 'LOCAL' : 'DESCONOCIDO'
  }

  const ambiente = valor.trim().toUpperCase().replace(/[\s-]+/g, '_')

  if (ambiente === 'LOCAL') {
    return 'LOCAL'
  }

  if (ambiente === 'DEMO') {
    return 'DEMO'
  }

  if (ambiente === 'STAGING') {
    return 'STAGING'
  }

  if (ambiente === 'PRODUCCION' || ambiente === 'PRODUCTION' || ambiente === 'PROD') {
    return 'PRODUCCION'
  }

  return 'DESCONOCIDO'
}

function obtenerConfiguracionAmbiente(): ConfiguracionAmbiente {
  const ambiente = normalizarAmbiente(import.meta.env.VITE_APP_AMBIENTE)
  const produccionHabilitada = valoresVerdaderos.includes(
    String(import.meta.env.VITE_PRODUCCION_HABILITADA ?? '').trim().toLowerCase(),
  )

  if (ambiente === 'LOCAL') {
    return {
      ambiente,
      clase: 'local',
      etiqueta: 'LOCAL - datos ficticios',
      detalle: 'Ambiente local habilitado solo para pruebas internas.',
      nivel: 'informativo',
      bloqueaUso: false,
    }
  }

  if (ambiente === 'DEMO') {
    return {
      ambiente,
      clase: 'demo',
      etiqueta: 'DEMO - datos ficticios',
      detalle: 'Ambiente demo habilitado solo para QA y demostraciones.',
      nivel: 'informativo',
      bloqueaUso: false,
    }
  }

  if (ambiente === 'STAGING') {
    return {
      ambiente,
      clase: 'staging',
      etiqueta: 'STAGING - validacion',
      detalle: 'Ambiente de validacion aislada. No cargar datos reales sin aprobacion.',
      nivel: 'advertencia',
      bloqueaUso: false,
    }
  }

  if (ambiente === 'PRODUCCION' && produccionHabilitada) {
    return {
      ambiente,
      clase: 'produccion',
      etiqueta: 'PRODUCCION - habilitada',
      detalle: 'Ambiente productivo habilitado por configuracion explicita.',
      nivel: 'advertencia',
      bloqueaUso: false,
    }
  }

  if (ambiente === 'PRODUCCION') {
    return {
      ambiente,
      clase: 'bloqueado',
      etiqueta: 'PRODUCCION NO HABILITADA',
      detalle: 'PROD-001 sigue abierto. Este ambiente no puede operar con datos reales.',
      nivel: 'bloqueado',
      bloqueaUso: true,
    }
  }

  return {
    ambiente: 'DESCONOCIDO',
    clase: 'desconocido',
    etiqueta: 'AMBIENTE NO IDENTIFICADO',
    detalle: 'No se pudo validar el ambiente activo. No usar datos reales.',
    nivel: 'bloqueado',
    bloqueaUso: true,
  }
}

const configuracionAmbiente = obtenerConfiguracionAmbiente()

const navegacionPrincipal: NavegacionLateral[] = [
  { etiqueta: 'Inicio', icono: '⌂', estado: 'pronto', rolesPermitidos: rolesValidos },
  { etiqueta: 'Pacientes', icono: '♙', ruta: '/pacientes', estado: 'activo', rolesPermitidos: ['admin', 'terapeuta'] },
  { etiqueta: 'Consultas', icono: '✧', ruta: '/consultas', estado: 'activo', rolesPermitidos: ['admin', 'terapeuta'] },
  { etiqueta: 'Evaluaciones', icono: '□', ruta: '/evaluaciones', estado: 'activo', rolesPermitidos: ['admin', 'terapeuta'] },
  { etiqueta: 'Casos', icono: '◇', ruta: '/casos', estado: 'activo', rolesPermitidos: ['admin', 'terapeuta'] },
  { etiqueta: 'Agenda', icono: '☷', ruta: '/agenda', estado: 'activo', rolesPermitidos: ['admin', 'terapeuta'] },
  { etiqueta: 'Finanzas / Pagos', icono: '$', ruta: '/finanzas', estado: 'activo', rolesPermitidos: ['admin', 'finanzas'] },
  { etiqueta: 'Reportes', icono: '↗', ruta: '/reportes', estado: 'activo', rolesPermitidos: rolesValidos },
  { etiqueta: 'Configuración', icono: '⚙', estado: 'pronto', rolesPermitidos: ['admin'] },
]


function rutaInicial(usuarioInterno: UsuarioInterno | null) {
  if (usuarioInterno?.rol === 'finanzas') {
    return '/finanzas'
  }

  return '/pacientes'
}

function obtenerNavegacionPorRol(rol: RolUsuario) {
  return navegacionPrincipal.filter((item) => (
    !item.rolesPermitidos || item.rolesPermitidos.includes(rol)
  ))
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

function IndicadorAmbiente({ configuracion }: { configuracion: ConfiguracionAmbiente }) {
  return (
    <div
      aria-label={`Ambiente activo: ${configuracion.etiqueta}`}
      className={`dashboard-environment-badge dashboard-environment-badge--${configuracion.clase}`}
      title={configuracion.detalle}
    >
      <span className="dashboard-environment-badge__dot" aria-hidden="true" />
      <span>{configuracion.etiqueta}</span>
    </div>
  )
}

function BloqueoAmbiente({
  configuracion,
}: {
  configuracion: ConfiguracionAmbiente
}) {
  const { cerrarSesion } = useAuth()

  return (
    <section className="dashboard-environment-lock" role="alert" aria-live="assertive">
      <div className="dashboard-environment-lock__icon" aria-hidden="true">
        <ShieldAlert />
      </div>

      <div className="dashboard-environment-lock__content">
        <span>Control de ambiente</span>
        <h1>{configuracion.etiqueta}</h1>
        <p>{configuracion.detalle}</p>
        <p>
          Deten el uso interno y contacta a Control de Desarrollo antes de operar pacientes,
          fotos, pagos o datos reales.
        </p>
      </div>

      <button
        className="dashboard-environment-lock__action"
        onClick={() => void cerrarSesion()}
        type="button"
      >
        Cerrar sesion
      </button>
    </section>
  )
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

function DashboardShell({ children }: {
  children: ReactNode
}) {
  const { usuarioInterno, cerrarSesion } = useAuth()
  const inicialesUsuario = usuarioInterno ? obtenerInicialesUsuario(usuarioInterno.nombre_completo) : ''
  const rolVisible = usuarioInterno ? formatearRol(usuarioInterno.rol) : ''
  const navegacionVisible = usuarioInterno ? obtenerNavegacionPorRol(usuarioInterno.rol) : []
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('dashboard-menu-open', menuMovilAbierto)

    return () => {
      document.body.classList.remove('dashboard-menu-open')
    }
  }, [menuMovilAbierto])

  useEffect(() => {
    if (!menuMovilAbierto) {
      return
    }

    const cerrarConEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuMovilAbierto(false)
      }
    }

    window.addEventListener('keydown', cerrarConEscape)

    return () => {
      window.removeEventListener('keydown', cerrarConEscape)
    }
  }, [menuMovilAbierto])

  return (
    <div className={menuMovilAbierto ? 'dashboard-shell dashboard-shell--menu-open' : 'dashboard-shell'}>
      <button
        aria-label="Cerrar panel de navegación"
        className="dashboard-menu-backdrop"
        onClick={() => setMenuMovilAbierto(false)}
        type="button"
      />

      <aside className="dashboard-sidebar" id="dashboard-sidebar" aria-label="Panel principal">
        <div className="sidebar-mobile-header">
          <div className="sidebar-brand">
            <div className="sidebar-logo" aria-hidden="true">✦</div>
            <div>
              <strong>Terapeutas Australes</strong>
              <span>Gestión profesional</span>
            </div>
          </div>

          <button
            aria-label="Cerrar menú lateral"
            className="dashboard-menu-close"
            onClick={() => setMenuMovilAbierto(false)}
            type="button"
          >
            <X aria-hidden="true" />
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Módulos disponibles">
          {navegacionVisible.map((item) => (
            item.ruta ? (
              <NavLink
                className={({ isActive }) => (
                  isActive ? 'sidebar-nav-item sidebar-nav-item--active' : 'sidebar-nav-item sidebar-nav-item--soon'
                )}
                key={item.etiqueta}
                onClick={() => setMenuMovilAbierto(false)}
                to={item.ruta}
              >
                <span className="sidebar-nav-icon" aria-hidden="true">{item.icono}</span>
                {item.etiqueta}
              </NavLink>
            ) : (
              <span className="sidebar-nav-item sidebar-nav-item--soon" key={item.etiqueta}>
                <span className="sidebar-nav-icon" aria-hidden="true">{item.icono}</span>
                {item.etiqueta}
              </span>
            )
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

        <button className="sidebar-logout" type="button" onClick={() => void cerrarSesion()}>
          Cerrar sesión
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar" aria-label="Barra superior">
          <button
            aria-controls="dashboard-sidebar"
            aria-expanded={menuMovilAbierto}
            aria-label={menuMovilAbierto ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
            className="dashboard-menu-toggle"
            onClick={() => setMenuMovilAbierto((abierto) => !abierto)}
            type="button"
          >
            {menuMovilAbierto ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>

          <div className="dashboard-topbar-copy">
            <span className="dashboard-eyebrow">Centro clínico</span>
            <p>Gestión interna de Terapeutas Australes</p>
          </div>

          <IndicadorAmbiente configuracion={configuracionAmbiente} />

          <div className="dashboard-userbar">
            <button className="dashboard-notification" aria-label="Notificaciones" type="button">
              <span aria-hidden="true">⌁</span>
              <strong>3</strong>
            </button>
            <div className="dashboard-userbar__avatar" aria-hidden="true">{inicialesUsuario}</div>
            <div className="dashboard-userbar__meta">
              <strong>{usuarioInterno?.nombre_completo}</strong>
              <span>{rolVisible}</span>
            </div>
          </div>
        </header>

        {configuracionAmbiente.bloqueaUso
          ? <BloqueoAmbiente configuracion={configuracionAmbiente} />
          : children}
      </main>
    </div>
  )
}

function AppPrivada({ children }: {
  children: ReactNode
}) {
  return (
    <DashboardShell>
      {children}
    </DashboardShell>
  )
}

function RutaProtegida({
  rolesPermitidos,
  children,
}: {
  rolesPermitidos: RolUsuario[]
  children: ReactNode
}) {
  const { estadoAuth, usuarioInterno } = useAuth()

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

function RouterApp() {
  const { estadoAuth, usuarioInterno, mensajeAuth, session, cerrarSesion } = useAuth()

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            estadoAuth === 'autorizado'
              ? <Navigate to={rutaInicial(usuarioInterno)} replace />
              : <LoginPage estadoAuth={estadoAuth} mensajeAuth={mensajeAuth} session={session} onCerrarSesion={cerrarSesion} />
          }
        />
        <Route
          path="/pacientes"
          element={
            <RutaProtegida rolesPermitidos={['admin', 'terapeuta']}>
              <AppPrivada>
                <PacientesPage />
              </AppPrivada>
            </RutaProtegida>
          }
        />
        <Route
          path="/consultas"
          element={
            <RutaProtegida rolesPermitidos={['admin', 'terapeuta']}>
              <AppPrivada>
                <ConsultasPage />
              </AppPrivada>
            </RutaProtegida>
          }
        />
        <Route
          path="/evaluaciones"
          element={
            <RutaProtegida rolesPermitidos={['admin', 'terapeuta']}>
              <AppPrivada>
                <EvaluacionesPage />
              </AppPrivada>
            </RutaProtegida>
          }
        />
        <Route
          path="/casos"
          element={
            <RutaProtegida rolesPermitidos={['admin', 'terapeuta']}>
              <AppPrivada>
                <CasosPage />
              </AppPrivada>
            </RutaProtegida>
          }
        />
        <Route
          path="/casos/:id"
          element={
            <RutaProtegida rolesPermitidos={['admin', 'terapeuta']}>
              <AppPrivada>
                <CasoDetallePage />
              </AppPrivada>
            </RutaProtegida>
          }
        />
        <Route
          path="/elementos-caso"
          element={
            <RutaProtegida rolesPermitidos={['admin', 'terapeuta']}>
              <AppPrivada>
                <Navigate to="/casos" replace />
              </AppPrivada>
            </RutaProtegida>
          }
        />
        <Route
          path="/revisiones"
          element={
            <RutaProtegida rolesPermitidos={['admin', 'terapeuta']}>
              <AppPrivada>
                <Navigate to="/casos" replace />
              </AppPrivada>
            </RutaProtegida>
          }
        />
        <Route
          path="/detalle-revisiones"
          element={
            <RutaProtegida rolesPermitidos={['admin', 'terapeuta']}>
              <AppPrivada>
                <Navigate to="/casos" replace />
              </AppPrivada>
            </RutaProtegida>
          }
        />
        <Route
          path="/finanzas"
          element={
            <RutaProtegida rolesPermitidos={['admin', 'finanzas']}>
              <AppPrivada>
                <FinanzasPage />
              </AppPrivada>
            </RutaProtegida>
          }
        />
        <Route
          path="/agenda"
          element={
            <RutaProtegida rolesPermitidos={['admin', 'terapeuta']}>
              <AppPrivada>
                <AgendaPage />
              </AppPrivada>
            </RutaProtegida>
          }
        />
        <Route
          path="/reportes"
          element={
            <RutaProtegida rolesPermitidos={['admin', 'terapeuta', 'finanzas']}>
              <AppPrivada>
                <ReportesPage />
              </AppPrivada>
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

export default function App() {
  return (
    <AuthProvider>
      <RouterApp />
    </AuthProvider>
  )
}
