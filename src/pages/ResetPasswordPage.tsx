import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState(false)
  const [hasSession, setHasSession] = useState<boolean | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession()
      setHasSession(Boolean(data.session))
    }
    void checkSession()
  }, [])

  async function actualizarContrasena(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMensaje('')
    setError(false)

    if (password.length < 8) {
      setMensaje('La contraseña debe tener al menos 8 caracteres.')
      setError(true)
      return
    }

    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setMensaje('La contraseña debe incluir al menos una letra minúscula, una letra mayúscula y un número.')
      setError(true)
      return
    }

    if (password !== confirmPassword) {
      setMensaje('Las contraseñas no coinciden.')
      setError(true)
      return
    }

    setEnviando(true)

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      })

      if (updateError) {
        setMensaje('No se pudo restablecer la contraseña. El enlace podría haber expirado. Vuelve a intentarlo.')
        setError(true)
      } else {
        setMensaje('Contraseña restablecida exitosamente. Redirigiendo al inicio de sesión...')
        // Forzar logout para limpiar cualquier sesión temporal de recuperación
        await supabase.auth.signOut()
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      }
    } catch (err) {
      console.error('Error inesperado al restablecer contraseña:', err)
      setMensaje('Ocurrió un error inesperado. Inténtalo de nuevo.')
      setError(true)
    } finally {
      setEnviando(false)
    }
  }

  if (hasSession === null) {
    return (
      <main className="auth-shell">
        <section className="auth-card">
          <h1>Verificando sesión...</h1>
        </section>
      </main>
    )
  }

  if (hasSession === false) {
    return (
      <main className="auth-shell">
        <section className="auth-card">
          <p className="auth-label">Terapeutas Australes</p>
          <h1>Acceso no válido</h1>
          <p className="auth-message" style={{ color: '#ff8080' }}>
            El enlace de recuperación es inválido o ha expirado. Por favor, solicita uno nuevo.
          </p>
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <Link to="/recuperar" style={{ color: '#00ffff', textDecoration: 'none', fontSize: '0.9rem' }}>
              Solicitar nuevo enlace
            </Link>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <p className="auth-label">Terapeutas Australes</p>
        <h1>Nueva contraseña</h1>
        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem', textAlign: 'center' }}>
          Ingresa tu nueva contraseña de acceso. Debe cumplir con las políticas de seguridad.
        </p>

        {mensaje && <p className="auth-message" style={{ color: error ? '#ff8080' : '#80ff80' }}>{mensaje}</p>}

        <form className="auth-form" onSubmit={actualizarContrasena}>
          <label>
            Nueva contraseña
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              disabled={enviando}
              autoComplete="new-password"
            />
          </label>

          <label>
            Confirmar contraseña
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              disabled={enviando}
              autoComplete="new-password"
            />
          </label>

          <button type="submit" disabled={enviando}>
            {enviando ? 'Guardando...' : 'Restablecer contraseña'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default ResetPasswordPage
