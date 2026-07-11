import { lazy, Suspense, useState, useEffect, type ReactNode } from 'react'
import { LogOut, Menu, Pin, PinOff, ShieldAlert, X } from 'lucide-react'
import { BrowserRouter, Navigate, NavLink, Outlet, Route, Routes } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import { AuthProvider, useAuth } from './context/AuthContext'
import type { RolUsuario, UsuarioInterno } from './context/authTypes'
import './App.css'
import './DashboardPremium.css'
import './TypographyElegant.css'
import './ReferencePolish.css'
import './ReferenceFinalPass.css'

// Carga diferida de páginas — code splitting por ruta
const PacientesPage     = lazy(() => import('./pages/PacientesPage'))
const ConsultasPage     = lazy(() => import('./pages/ConsultasPage'))
const EvaluacionesPage  = lazy(() => import('./pages/EvaluacionesPage'))
const CasosPage         = lazy(() => import('./pages/CasosPage'))
const CasoDetallePage   = lazy(() => import('./pages/CasoDetallePage'))
const FinanzasPage      = lazy(() => import('./pages/FinanzasPage'))
const AgendaPage        = lazy(() => import('./pages/AgendaPage'))
const ReportesPage      = lazy(() => import('./pages/ReportesPage'))
const LoginPage         = lazy(() => import('./pages/LoginPage'))
const RecuperarPage     = lazy(() => import('./pages/RecuperarPage'))
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'))

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

function PantallaCarga({ mensaje = 'Validando acceso interno...' }: { mensaje?: string }) {
  return (
    <main className="auth-shell">
      <section className="auth-card">
        <h1>Cargando</h1>
        <p>{mensaje}</p>
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
  const [railFijado, setRailFijado] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return window.localStorage.getItem('ta-sidebar-rail-fijado') === '1'
  })

  useEffect(() => {
    window.localStorage.setItem('ta-sidebar-rail-fijado', railFijado ? '1' : '0')
  }, [railFijado])

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

  const clasesShell = [
    'dashboard-shell',
    menuMovilAbierto ? 'dashboard-shell--menu-open' : '',
    railFijado ? 'dashboard-shell--rail-fijado' : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={clasesShell}>
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
            <div className="sidebar-label">
              <strong>Terapeutas Australes</strong>
              <span>Gestión profesional</span>
            </div>
          </div>

          <button
            aria-label={railFijado ? 'Liberar barra lateral' : 'Fijar barra lateral expandida'}
            aria-pressed={railFijado}
            className="sidebar-pin-toggle"
            onClick={() => setRailFijado((valorActual) => !valorActual)}
            title={railFijado ? 'Liberar barra lateral' : 'Fijar barra lateral expandida'}
            type="button"
          >
            {railFijado ? <PinOff aria-hidden="true" /> : <Pin aria-hidden="true" />}
          </button>

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
                title={item.etiqueta}
                to={item.ruta}
              >
                <span className="sidebar-nav-icon" aria-hidden="true">{item.icono}</span>
                <span className="sidebar-label">{item.etiqueta}</span>
              </NavLink>
            ) : (
              <span className="sidebar-nav-item sidebar-nav-item--soon" key={item.etiqueta} title={item.etiqueta}>
                <span className="sidebar-nav-icon" aria-hidden="true">{item.icono}</span>
                <span className="sidebar-label">{item.etiqueta}</span>
              </span>
            )
          ))}
        </nav>

        <div className="sidebar-quote" aria-label="Mensaje institucional">
          <span aria-hidden="true">“</span>
          <p>Cada persona que acompañamos es una historia única.</p>
        </div>

        <div className="sidebar-footer">
          <span className="sidebar-label">v1.0.0</span>
          <div className="sidebar-status">
            <span aria-hidden="true" />
            <span className="sidebar-label">En línea</span>
          </div>
        </div>

        <button
          className="sidebar-logout"
          onClick={() => void cerrarSesion()}
          title="Cerrar sesión"
          type="button"
        >
          <LogOut aria-hidden="true" />
          <span className="sidebar-label">Cerrar sesión</span>
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

function RutaProtegidaLayout({ rolesPermitidos }: { rolesPermitidos: RolUsuario[] }) {
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

  return (
    <DashboardShell>
      <Outlet />
    </DashboardShell>
  )
}

function RouterApp() {
  const { estadoAuth, usuarioInterno, mensajeAuth, session, cerrarSesion } = useAuth()

  return (
    <BrowserRouter>
      <ErrorBoundary>
      <Suspense fallback={<PantallaCarga mensaje="Cargando módulo..." />}>
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
            path="/recuperar"
            element={
              estadoAuth === 'autorizado'
                ? <Navigate to={rutaInicial(usuarioInterno)} replace />
                : <RecuperarPage />
            }
          />
          <Route
            path="/reset-password"
            element={
              <ResetPasswordPage />
            }
          />
          <Route element={<RutaProtegidaLayout rolesPermitidos={['admin', 'terapeuta']} />}>
            <Route path="/pacientes" element={<PacientesPage />} />
            <Route path="/consultas" element={<ConsultasPage />} />
            <Route path="/evaluaciones" element={<EvaluacionesPage />} />
            <Route path="/casos" element={<CasosPage />} />
            <Route path="/casos/:id" element={<CasoDetallePage />} />
            <Route path="/elementos-caso" element={<Navigate to="/casos" replace />} />
            <Route path="/revisiones" element={<Navigate to="/casos" replace />} />
            <Route path="/detalle-revisiones" element={<Navigate to="/casos" replace />} />
            <Route path="/agenda" element={<AgendaPage />} />
          </Route>
          <Route element={<RutaProtegidaLayout rolesPermitidos={['admin', 'finanzas']} />}>
            <Route path="/finanzas" element={<FinanzasPage />} />
          </Route>
          <Route element={<RutaProtegidaLayout rolesPermitidos={rolesValidos} />}>
            <Route path="/reportes" element={<ReportesPage />} />
          </Route>
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
      </Suspense>
      </ErrorBoundary>
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
