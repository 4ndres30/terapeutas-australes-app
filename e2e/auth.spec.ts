import { expect, test } from '@playwright/test'

// Requiere Supabase local corriendo y usuarios demo SEC-007B provisionados
// (ver docs/DEVELOPMENT.md). La contraseña se lee de la variable de entorno
// QA_DEMO_PASSWORD para no versionarla.
const QA_DEMO_PASSWORD = process.env.QA_DEMO_PASSWORD ?? ''

async function login(page: import('@playwright/test').Page, email: string) {
  await page.goto('/login')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Contraseña').fill(QA_DEMO_PASSWORD)
  await page.getByRole('button', { name: 'Iniciar sesión' }).click()
}

test.describe('Autenticación y navegación por rol', () => {
  test.skip(!QA_DEMO_PASSWORD, 'QA_DEMO_PASSWORD no configurada; ver docs/DEVELOPMENT.md')

  test('admin ve todos los módulos y puede cerrar sesión', async ({ page }) => {
    await login(page, 'qa.demo.admin@example.test')
    await expect(page).toHaveURL(/\/pacientes/)
    await expect(page.getByRole('link', { name: 'Finanzas / Pagos' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Pacientes' })).toBeVisible()

    await page.getByRole('button', { name: 'Cerrar sesión' }).click()
    await expect(page).toHaveURL(/\/login/)
  })

  test('terapeuta no ve Finanzas', async ({ page }) => {
    await login(page, 'qa.demo.terapeuta@example.test')
    await expect(page).toHaveURL(/\/pacientes/)
    await expect(page.getByRole('link', { name: 'Pacientes' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Finanzas / Pagos' })).toHaveCount(0)
  })

  test('finanzas solo ve Finanzas y Reportes', async ({ page }) => {
    await login(page, 'qa.demo.finanzas@example.test')
    await expect(page).toHaveURL(/\/finanzas/)
    await expect(page.getByRole('link', { name: 'Finanzas / Pagos' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Pacientes' })).toHaveCount(0)
  })

  test('credenciales invalidas muestran mensaje sin filtrar detalle tecnico', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill('qa.demo.admin@example.test')
    await page.getByLabel('Contraseña').fill('password-incorrecta')
    await page.getByRole('button', { name: 'Iniciar sesión' }).click()
    await expect(page.getByText('No se pudo iniciar sesión')).toBeVisible()
  })
})
