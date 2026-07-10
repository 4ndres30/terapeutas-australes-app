/**
 * usePacienteForm — funciones compartidas entre el wizard de alta (PacientesPage)
 * y el formulario plano de edición (UI-045 / DEC-044).
 *
 * SOLO funciones puras: no usa hooks de React para mantener la lógica agnóstica
 * del modo (wizard vs plano). El estado del formulario vive en el componente.
 */

import { normalizarTexto } from '../lib/format'

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export type FormularioPaciente = {
  nombres: string
  apellidos: string
  fecha_nacimiento: string
  sexo: string
  telefono: string
  email: string
  comuna: string
  region: string
  estado: string
}

export type OpcionFormulario = {
  etiqueta: string
  valor: string
}

// Valores del CHECK constraint real de la migración (minúsculas en pacientes)
export const opcionesSexo: OpcionFormulario[] = [
  { etiqueta: 'Femenino', valor: 'femenino' },
  { etiqueta: 'Masculino', valor: 'masculino' },
  { etiqueta: 'Otro', valor: 'otro' },
  { etiqueta: 'Prefiere no decir', valor: 'prefiere_no_decir' },
]

export const opcionesEstado: OpcionFormulario[] = [
  { etiqueta: 'Activo', valor: 'activo' },
  { etiqueta: 'Inactivo', valor: 'inactivo' },
]

export const regionesChile: string[] = [
  'Arica y Parinacota',
  'Tarapacá',
  'Antofagasta',
  'Atacama',
  'Coquimbo',
  'Valparaíso',
  'Metropolitana de Santiago',
  "Libertador General Bernardo O'Higgins",
  'Maule',
  'Ñuble',
  'Biobío',
  'La Araucanía',
  'Los Ríos',
  'Los Lagos',
  'Aysén del General Carlos Ibáñez del Campo',
  'Magallanes y de la Antártica Chilena',
]

// ---------------------------------------------------------------------------
// Estado inicial
// ---------------------------------------------------------------------------

export const formularioInicial: FormularioPaciente = {
  nombres: '',
  apellidos: '',
  fecha_nacimiento: '',
  sexo: '',
  telefono: '',
  email: '',
  comuna: '',
  region: '',
  estado: 'activo',
}

// ---------------------------------------------------------------------------
// Funciones puras
// ---------------------------------------------------------------------------

/**
 * Normaliza texto para comparar duplicados: sin acentos, lowercase, trim.
 */
export function normalizarClave(texto: string): string {
  return normalizarTexto(texto.trim().replace(/\s+/g, ' '))
}

/**
 * Construye una clave de deduplicación combinando todos los campos del paciente.
 * Recibe tanto FormularioPaciente como registros de la BD (que comparten los mismos campos).
 */
export function construirClavePaciente(datos: FormularioPaciente): string {
  return [
    normalizarClave(datos.nombres),
    normalizarClave(datos.apellidos),
    datos.fecha_nacimiento.trim(),
    normalizarClave(datos.sexo),
    normalizarClave(datos.telefono),
    normalizarClave(datos.email),
    normalizarClave(datos.comuna),
    normalizarClave(datos.region),
    normalizarClave(datos.estado),
  ].join('|')
}

/**
 * Resultado de validación: campo con error + mensaje legible.
 * No acoplado a PasoFicha para que funcione tanto en wizard como en formulario plano.
 */
export type ResultadoValidacion = {
  campo: keyof FormularioPaciente
  mensaje: string
}

/**
 * Valida el formulario completo.
 * Retorna null si todo está OK, o el primer error encontrado.
 */
export function validarFormularioPaciente(
  formulario: FormularioPaciente,
): ResultadoValidacion | null {
  if (!formulario.nombres.trim()) {
    return { campo: 'nombres', mensaje: 'Ingresa los nombres del paciente.' }
  }
  if (!formulario.apellidos.trim()) {
    return { campo: 'apellidos', mensaje: 'Ingresa los apellidos del paciente.' }
  }
  if (!formulario.fecha_nacimiento) {
    return { campo: 'fecha_nacimiento', mensaje: 'Selecciona la fecha de nacimiento.' }
  }
  if (!formulario.sexo) {
    return { campo: 'sexo', mensaje: 'Selecciona el sexo del paciente.' }
  }
  if (!formulario.telefono.trim()) {
    return { campo: 'telefono', mensaje: 'Ingresa un teléfono de contacto.' }
  }
  if (!/^\S+@\S+\.\S+$/.test(formulario.email.trim())) {
    return { campo: 'email', mensaje: 'Ingresa un email válido.' }
  }
  if (!formulario.comuna.trim()) {
    return { campo: 'comuna', mensaje: 'Ingresa la comuna del paciente.' }
  }
  if (!formulario.region.trim()) {
    return { campo: 'region', mensaje: 'Ingresa la región del paciente.' }
  }
  if (!formulario.estado) {
    return { campo: 'estado', mensaje: 'Selecciona el estado del paciente.' }
  }
  return null
}

/**
 * Prepara los datos del formulario para enviar a Supabase (trim, lowercase email).
 */
export function prepararPacienteParaGuardar(formulario: FormularioPaciente) {
  return {
    nombres: formulario.nombres.trim(),
    apellidos: formulario.apellidos.trim(),
    fecha_nacimiento: formulario.fecha_nacimiento,
    sexo: formulario.sexo,
    telefono: formulario.telefono.trim(),
    email: formulario.email.trim().toLowerCase(),
    comuna: formulario.comuna.trim(),
    region: formulario.region.trim(),
    estado: formulario.estado,
  }
}

/**
 * Convierte un registro de paciente (BD) a FormularioPaciente para pre-poblar el formulario.
 * Usa slice(0, 10) en fecha para evitar corrimiento de zona horaria (patrón date-only del proyecto).
 */
export function pacienteAFormulario(paciente: {
  nombres: string
  apellidos: string
  fecha_nacimiento: string
  sexo: string
  telefono: string
  email: string
  comuna: string
  region: string
  estado: string
}): FormularioPaciente {
  return {
    nombres: paciente.nombres || '',
    apellidos: paciente.apellidos || '',
    fecha_nacimiento: (paciente.fecha_nacimiento || '').slice(0, 10),
    sexo: paciente.sexo || '',
    telefono: paciente.telefono || '',
    email: paciente.email || '',
    comuna: paciente.comuna || '',
    region: paciente.region || '',
    estado: paciente.estado || 'activo',
  }
}

/**
 * Retorna la etiqueta legible de un valor de opción.
 */
export function obtenerEtiquetaOpcion(
  opciones: OpcionFormulario[],
  valor: string,
): string {
  return opciones.find((o) => o.valor === valor)?.etiqueta || ''
}
