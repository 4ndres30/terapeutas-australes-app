import type { FormEvent } from 'react'
import type { Session } from '@supabase/supabase-js'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

type EstadoAuth = 'cargando' | 'sin_sesion' | 'autorizado' | 'sin_autorizacion' | 'inactivo' | 'error'

type LoginPageProps = {
  estadoAuth: EstadoAuth
  mensajeAuth: string
  session: Session | null
  onCerrarSesion: () => Promise<void>
}

const mensajeLoginFallido =
  'No se pudo iniciar sesión. Revisa tus credenciales o solicita acceso a un administrador.'

function LoginPage({ estadoAuth, mensajeAuth, session, onCerrarSesion }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [mensajeLogin, setMensajeLogin] = useState('')

  async function iniciarSesion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setEnviando(true)
    setMensajeLogin('')

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (error) {
      setMensajeLogin(mensajeLoginFallido)
      setEnviando(false)
      return
    }

    setEnviando(false)
  }

  const accesoBloqueado = estadoAuth === 'sin_autorizacion' || estadoAuth === 'inactivo' || estadoAuth === 'error'

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <p className="auth-label">Terapeutas Australes</p>
        <h1>Acceso interno</h1>

        {mensajeAuth && <p className="auth-message">{mensajeAuth}</p>}
        {mensajeLogin && <p className="auth-message">{mensajeLogin}</p>}

        {accesoBloqueado && session ? (
          <button type="button" onClick={() => void onCerrarSesion()}>
            Cerrar sesión
          </button>
        ) : (
          <form className="auth-form" onSubmit={iniciarSesion}>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
              />
            </label>

            <label>
              Contraseña
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                autoComplete="current-password"
              />
            </label>

            <button type="submit" disabled={enviando || estadoAuth === 'cargando'}>
              {enviando || estadoAuth === 'cargando' ? 'Validando...' : 'Iniciar sesión'}
            </button>
          </form>
        )}
      </section>
    </main>
  )
}

export default LoginPage
