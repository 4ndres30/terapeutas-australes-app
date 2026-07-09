import { expect, test } from '@playwright/test'

const QA_DEMO_PASSWORD = process.env.QA_DEMO_PASSWORD ?? ''

async function login(page: import('@playwright/test').Page, email: string) {
  await page.goto('/login')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Contraseña').fill(QA_DEMO_PASSWORD)
  await page.getByRole('button', { name: 'Iniciar sesión' }).click()
}

test.describe('Restricciones de seguridad para el rol de Finanzas', () => {
  test.skip(!QA_DEMO_PASSWORD, 'QA_DEMO_PASSWORD no configurada; ver docs/DEVELOPMENT.md')

  test('usuario de finanzas no puede acceder a rutas clinicas y es redirigido a finanzas', async ({ page }) => {
    await login(page, 'qa.demo.finanzas@example.test')
    await expect(page).toHaveURL(/\/finanzas/)

    // Intentar navegar directamente a /pacientes
    await page.goto('/pacientes')
    await expect(page).toHaveURL(/\/finanzas/)

    // Intentar navegar directamente a /casos
    await page.goto('/casos')
    await expect(page).toHaveURL(/\/finanzas/)

    // Intentar navegar directamente a /consultas
    await page.goto('/consultas')
    await expect(page).toHaveURL(/\/finanzas/)

    // Intentar navegar directamente a /evaluaciones
    await page.goto('/evaluaciones')
    await expect(page).toHaveURL(/\/finanzas/)
  })
})
