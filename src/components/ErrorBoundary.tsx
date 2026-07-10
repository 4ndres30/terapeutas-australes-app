import { Component, type ErrorInfo, type ReactNode } from 'react'

type ErrorBoundaryProps = {
  children: ReactNode
}

type ErrorBoundaryState = {
  tieneError: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { tieneError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { tieneError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error de render capturado por ErrorBoundary:', error, info.componentStack)
  }

  reintentar = () => {
    this.setState({ tieneError: false })
  }

  render() {
    if (this.state.tieneError) {
      return (
        <main className="auth-shell">
          <section className="auth-card" role="alert">
            <p className="auth-label">Terapeutas Australes</p>
            <h1>Algo salió mal</h1>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem', textAlign: 'center' }}>
              Ocurrió un error inesperado al mostrar esta sección. Tus datos no se vieron afectados.
            </p>
            <button type="button" onClick={this.reintentar}>
              Reintentar
            </button>
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <a href="/" style={{ color: '#00ffff', textDecoration: 'none', fontSize: '0.9rem' }}>
                Volver al inicio
              </a>
            </div>
          </section>
        </main>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
