import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function RecuperarPage() {
  const [email, setEmail] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState(false)

  async function solicitarRecuperacion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setEnviando(true)
    setMensaje('')
    setError(false)

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin + '/reset-password',
      })

      // Siempre mostrar mensaje genérico para evitar enumeración de usuarios (SEC-003)
      setMensaje('Si el correo está registrado en nuestro sistema, se ha enviado un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y spam.')
      if (resetError) {
        // Loguear internamente pero no exponer detalles al cliente
        console.error('Error en recuperación:', resetError.message)
      }
    } catch (err) {
      console.error('Error inesperado en recuperación:', err)
      setMensaje('Si el correo está registrado en nuestro sistema, se ha enviado un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y spam.')
      setError(true)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <p className="auth-label">Terapeutas Australes</p>
        <h1>Recuperar acceso</h1>
        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem', textAlign: 'center' }}>
          Ingresa tu correo institucional para recibir un enlace seguro de recuperación.
        </p>

        {mensaje && <p className="auth-message" style={{ color: error ? '#ff8080' : '#80ff80' }}>{mensaje}</p>}

        <form className="auth-form" onSubmit={solicitarRecuperacion}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={enviando}
              autoComplete="email"
            />
          </label>

          <button type="submit" disabled={enviando}>
            {enviando ? 'Enviando...' : 'Enviar enlace'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link to="/login" style={{ color: '#00ffff', textDecoration: 'none', fontSize: '0.9rem' }}>
            Volver al inicio de sesión
          </Link>
        </div>
      </section>
    </main>
  )
}

export default RecuperarPage
