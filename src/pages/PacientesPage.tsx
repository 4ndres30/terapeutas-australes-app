import { FormEvent, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import './PacientesPage.css'

type Paciente = {
  id: string
  nombres: string
  apellidos: string
  fecha_nacimiento: string
  sexo: string
  telefono: string
  email: string
  comuna: string
  region: string
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
    sexo: '',
    telefono: '',
    email: '',
    comuna: '',
    region: '',
    estado: 'activo',
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
      fecha_nacimiento: formulario.fecha_nacimiento,
      sexo: formulario.sexo,
      telefono: formulario.telefono,
      email: formulario.email,
      comuna: formulario.comuna,
      region: formulario.region,
      estado: formulario.estado,
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
      sexo: '',
      telefono: '',
      email: '',
      comuna: '',
      region: '',
      estado: 'activo',
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
        <p>Registro inicial completo de pacientes de Terapeutas Australes.</p>

        <form onSubmit={guardarPaciente} className="formulario-pacientes">
          <label>
            Nombres *
            <input
              placeholder="Ej: Catalina Belén"
              value={formulario.nombres}
              onChange={(e) => setFormulario({ ...formulario, nombres: e.target.value })}
              required
            />
          </label>

          <label>
            Apellidos *
            <input
              placeholder="Ej: Troncoso Caro"
              value={formulario.apellidos}
              onChange={(e) => setFormulario({ ...formulario, apellidos: e.target.value })}
              required
            />
          </label>

          <label>
            Fecha de nacimiento *
            <input
              type="date"
              value={formulario.fecha_nacimiento}
              onChange={(e) => setFormulario({ ...formulario, fecha_nacimiento: e.target.value })}
              required
            />
          </label>

          <label>
            Sexo *
            <select
              value={formulario.sexo}
              onChange={(e) => setFormulario({ ...formulario, sexo: e.target.value })}
              required
            >
              <option value="">Seleccionar</option>
              <option value="femenino">Femenino</option>
              <option value="masculino">Masculino</option>
              <option value="otro">Otro</option>
              <option value="prefiere_no_decir">Prefiere no decir</option>
            </select>
          </label>

          <label>
            Teléfono *
            <input
              placeholder="Ej: +56 9 1234 5678"
              value={formulario.telefono}
              onChange={(e) => setFormulario({ ...formulario, telefono: e.target.value })}
              required
            />
          </label>

          <label>
            Email *
            <input
              placeholder="Ej: paciente@correo.cl"
              type="email"
              value={formulario.email}
              onChange={(e) => setFormulario({ ...formulario, email: e.target.value })}
              required
            />
          </label>

          <label>
            Comuna *
            <input
              placeholder="Ej: Castro"
              value={formulario.comuna}
              onChange={(e) => setFormulario({ ...formulario, comuna: e.target.value })}
              required
            />
          </label>

          <label>
            Región *
            <input
              placeholder="Ej: Los Lagos"
              value={formulario.region}
              onChange={(e) => setFormulario({ ...formulario, region: e.target.value })}
              required
            />
          </label>

          <label>
            Estado *
            <select
              value={formulario.estado}
              onChange={(e) => setFormulario({ ...formulario, estado: e.target.value })}
              required
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </label>

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
                <th>Sexo</th>
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
                  <td>{paciente.fecha_nacimiento}</td>
                  <td>{paciente.sexo}</td>
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