import { createClient } from '@supabase/supabase-js'

const REQUIRED_CONFIRMATION = 'LOCAL_DEMO_ONLY'
const DEFAULT_LOCAL_SUPABASE_URL = 'http://127.0.0.1:54321'

const demoUsers = [
  {
    identity: 'QA-DEMO-ADMIN',
    email: 'qa.demo.admin@example.test',
    fullName: 'QA Demo Admin',
    role: 'admin',
    active: true,
    profile: true,
  },
  {
    identity: 'QA-DEMO-TERAPEUTA',
    email: 'qa.demo.terapeuta@example.test',
    fullName: 'QA Demo Terapeuta',
    role: 'terapeuta',
    active: true,
    profile: true,
  },
  {
    identity: 'QA-DEMO-FINANZAS',
    email: 'qa.demo.finanzas@example.test',
    fullName: 'QA Demo Finanzas',
    role: 'finanzas',
    active: true,
    profile: true,
  },
  {
    identity: 'QA-DEMO-INACTIVO',
    email: 'qa.demo.inactivo@example.test',
    fullName: 'QA Demo Inactivo',
    role: 'terapeuta',
    active: false,
    profile: true,
  },
  {
    identity: 'QA-DEMO-SIN-PERFIL',
    email: 'qa.demo.sin-perfil@example.test',
    fullName: 'QA Demo Sin Perfil',
    role: null,
    active: null,
    profile: false,
  },
]

function fail(message) {
  console.error(`[SEC-007B] ${message}`)
  process.exit(1)
}

function assertLocalUrl(rawUrl) {
  let parsed

  try {
    parsed = new URL(rawUrl)
  } catch {
    fail('SUPABASE_URL no es una URL valida.')
  }

  const allowedHosts = new Set(['127.0.0.1', 'localhost', '[::1]'])
  const allowedPorts = new Set(['54321'])

  if (parsed.protocol !== 'http:') {
    fail('SEC-007B solo permite http local, no HTTPS ni URLs remotas.')
  }

  if (!allowedHosts.has(parsed.hostname)) {
    fail('SEC-007B solo permite localhost/127.0.0.1/::1.')
  }

  if (!allowedPorts.has(parsed.port)) {
    fail('SEC-007B solo permite el puerto local Supabase 54321.')
  }
}

function assertPassword(password) {
  if (!password || password.length < 12) {
    fail('QA_DEMO_PASSWORD debe tener al menos 12 caracteres.')
  }

  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    fail('QA_DEMO_PASSWORD debe incluir minuscula, mayuscula y numero.')
  }
}

async function findUserByEmail(supabase, email) {
  const perPage = 1000
  let page = 1

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage })

    if (error) {
      throw new Error(`No se pudo listar usuarios Auth: ${error.message}`)
    }

    const user = data.users.find((candidate) => candidate.email?.toLowerCase() === email.toLowerCase())

    if (user) {
      return user
    }

    if (data.users.length < perPage) {
      return null
    }

    page += 1
  }
}

async function ensureAuthUser(supabase, demoUser, password) {
  const existingUser = await findUserByEmail(supabase, demoUser.email)

  if (existingUser) {
    const { data, error } = await supabase.auth.admin.updateUserById(existingUser.id, {
      password,
      email_confirm: true,
      user_metadata: {
        sec007b_identity: demoUser.identity,
        display_name: demoUser.fullName,
        rol: demoUser.role,
        activo: demoUser.active,
      },
    })

    if (error) {
      throw new Error(`No se pudo actualizar ${demoUser.identity}: ${error.message}`)
    }

    return { user: data.user, action: 'updated' }
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: demoUser.email,
    password,
    email_confirm: true,
    user_metadata: {
      sec007b_identity: demoUser.identity,
      display_name: demoUser.fullName,
      rol: demoUser.role,
      activo: demoUser.active,
    },
  })

  if (error) {
    throw new Error(`No se pudo crear ${demoUser.identity}: ${error.message}`)
  }

  return { user: data.user, action: 'created' }
}

async function ensureInternalProfile(supabase, demoUser, userId) {
  if (!demoUser.profile) {
    const { error } = await supabase.from('usuarios_internos').delete().eq('id', userId)

    if (error) {
      throw new Error(`No se pudo asegurar usuario sin perfil ${demoUser.identity}: ${error.message}`)
    }

    return 'removed'
  }

  const { error } = await supabase.from('usuarios_internos').upsert(
    {
      id: userId,
      email: demoUser.email,
      nombre_completo: demoUser.fullName,
      rol: demoUser.role,
      activo: demoUser.active,
    },
    { onConflict: 'id' },
  )

  if (error) {
    throw new Error(`No se pudo preparar perfil ${demoUser.identity}: ${error.message}`)
  }

  return demoUser.active ? 'active' : 'inactive'
}

async function main() {
  const execute = process.argv.includes('--execute')
  const supabaseUrl = process.env.SUPABASE_URL || DEFAULT_LOCAL_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const password = process.env.QA_DEMO_PASSWORD
  const confirmation = process.env.SEC007B_ALLOW_PROVISIONING

  assertLocalUrl(supabaseUrl)

  if (!execute) {
    console.log('[SEC-007B] Dry run. Use --execute con variables temporales para provisionar.')
    for (const demoUser of demoUsers) {
      console.log(`[SEC-007B] ${demoUser.identity}: ${demoUser.profile ? demoUser.role : 'sin-perfil'}`)
    }
    return
  }

  if (confirmation !== REQUIRED_CONFIRMATION) {
    fail(`SEC007B_ALLOW_PROVISIONING debe ser ${REQUIRED_CONFIRMATION}.`)
  }

  if (!serviceRoleKey) {
    fail('SUPABASE_SERVICE_ROLE_KEY es requerido y debe entregarse por variable temporal.')
  }

  assertPassword(password)

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  const results = []

  for (const demoUser of demoUsers) {
    const { user, action } = await ensureAuthUser(supabase, demoUser, password)
    const profileState = await ensureInternalProfile(supabase, demoUser, user.id)

    results.push({
      identity: demoUser.identity,
      auth: action,
      profile: profileState,
    })
  }

  console.log('[SEC-007B] Provisioning local/demo finalizado sin imprimir credenciales.')

  for (const result of results) {
    console.log(`[SEC-007B] ${result.identity}: auth=${result.auth}; profile=${result.profile}`)
  }
}

main().catch((error) => {
  fail(error.message)
})
