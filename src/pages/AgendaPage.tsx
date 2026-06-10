import './ClinicalModuleBase.css'

function AgendaPage() {
  return (
    <main className="clinical-module-page">
      <section className="clinical-hero">
        <div className="clinical-hero__copy">
          <span className="clinical-kicker">Módulo pendiente</span>
          <h1>Agenda</h1>
          <p>La base local no tiene una tabla pública de agenda, citas o eventos dedicada.</p>
        </div>

        <section className="clinical-metrics" aria-label="Estado de agenda">
          <article className="clinical-metric-card">
            <strong>0</strong>
            <span>Eventos</span>
            <p>No hay tabla agenda para leer.</p>
          </article>
          <article className="clinical-metric-card">
            <strong>0</strong>
            <span>Formularios</span>
            <p>No se habilita guardado sin esquema real.</p>
          </article>
        </section>
      </section>

      <section className="clinical-panel" aria-label="Estado del módulo agenda">
        <div className="clinical-panel__header">
          <div>
            <span className="clinical-kicker">Placeholder técnico</span>
            <h2>Falta tabla real de agenda</h2>
            <p>
              Para habilitar este módulo se necesita definir una tabla pública real con primary key,
              columnas obligatorias, relaciones y reglas de inserción.
            </p>
          </div>
        </div>

        <div className="clinical-empty">
          <strong>No se creó lógica de guardado.</strong>
          <p>
            Esto evita inventar columnas o relaciones. Cuando Javier/Vicky definan el esquema,
            se puede conectar la ruta a la tabla correspondiente sin tocar Pacientes ni Casos.
          </p>
        </div>
      </section>
    </main>
  )
}

export default AgendaPage
