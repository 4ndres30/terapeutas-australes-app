import { FormEvent, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import './PacientesPage.css'

type Paciente = {
  id: string
  nombres: string
  apellidos: string
  fecha_nacimiento: string | null
  telefono: string | null
  email: string | null
  comuna: string | null
  region: string | null
  estado: string
  created_at: string
}

function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [cargando, setCargando] = useState(false)
  const [mensaje, setMensaje] = useState('')

  const [formulario, setFormulario] = useState({
    nombres: '',
    apellidos: '',
    fecha_nacimiento: '',
    telefono: '',
    email: '',
    comuna: '',
    region: '',
  })

  async function cargarPacientes() {
    setCargando(true)

    const { data, error } = await supabase
      .from('pacientes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setMensaje(`Error al cargar pacientes: ${error.message}`)
      setCargando(false)
      return
    }

    setPacientes(data || [])
    setCargando(false)
  }

  async function guardarPaciente(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMensaje('Guardando paciente...')

    const { error } = await supabase.from('pacientes').insert({
      nombres: formulario.nombres,
      apellidos: formulario.apellidos,
      fecha_nacimiento: formulario.fecha_nacimiento || null,
      telefono: formulario.telefono || null,
      email: formulario.email || null,
      comuna: formulario.comuna || null,
      region: formulario.region || null,
    })

    if (error) {
      setMensaje(`Error al guardar: ${error.message}`)
      return
    }

    setMensaje('Paciente guardado correctamente')

    setFormulario({
      nombres: '',
      apellidos: '',
      fecha_nacimiento: '',
      telefono: '',
      email: '',
      comuna: '',
      region: '',
    })

    await cargarPacientes()
  }

  useEffect(() => {
    cargarPacientes()
  }, [])

  return (
    <main className="pacientes-layout">
      <section className="panel">
        <h1>Pacientes</h1>
        <p>Registro inicial de pacientes de Terapeutas Australes.</p>

        <form onSubmit={guardarPaciente} className="formulario-pacientes">
          <input
            placeholder="Nombres"
            value={formulario.nombres}
            onChange={(e) => setFormulario({ ...formulario, nombres: e.target.value })}
            required
          />

          <input
            placeholder="Apellidos"
            value={formulario.apellidos}
            onChange={(e) => setFormulario({ ...formulario, apellidos: e.target.value })}
            required
          />

          <input
            type="date"
            value={formulario.fecha_nacimiento}
            onChange={(e) => setFormulario({ ...formulario, fecha_nacimiento: e.target.value })}
          />

          <input
            placeholder="Teléfono"
            value={formulario.telefono}
            onChange={(e) => setFormulario({ ...formulario, telefono: e.target.value })}
          />

          <input
            placeholder="Email"
            type="email"
            value={formulario.email}
            onChange={(e) => setFormulario({ ...formulario, email: e.target.value })}
          />

          <input
            placeholder="Comuna"
            value={formulario.comuna}
            onChange={(e) => setFormulario({ ...formulario, comuna: e.target.value })}
          />

          <input
            placeholder="Región"
            value={formulario.region}
            onChange={(e) => setFormulario({ ...formulario, region: e.target.value })}
          />

          <button type="submit">Guardar paciente</button>
        </form>

        {mensaje && <p className="mensaje">{mensaje}</p>}
      </section>

      <section className="panel">
        <h2>Listado de pacientes</h2>

        {cargando ? (
          <p>Cargando pacientes...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Fecha nacimiento</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Comuna</th>
                <th>Región</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              {pacientes.map((paciente) => (
                <tr key={paciente.id}>
                  <td>{paciente.nombres} {paciente.apellidos}</td>
                  <td>{paciente.fecha_nacimiento || 'Sin registrar'}</td>
                  <td>{paciente.telefono}</td>
                  <td>{paciente.email}</td>
                  <td>{paciente.comuna}</td>
                  <td>{paciente.region}</td>
                  <td>{paciente.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  )
}

export default PacientesPage