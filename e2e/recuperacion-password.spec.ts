import { expect, test } from '@playwright/test'

test.describe('Recuperación de contraseña (UI-024)', () => {
  test('solicitar recuperación siempre muestra el mismo mensaje generico, exista o no el correo', async ({ page }) => {
    await page.goto('/recuperar')
    await page.getByLabel('Email').fill('correo-que-no-existe@example.test')
    await page.getByRole('button', { name: 'Enviar enlace' }).click()

    await expect(
      page.getByText('Si el correo está registrado en nuestro sistema'),
    ).toBeVisible()
  })

  test('enlace de reset sin sesion valida muestra acceso no valido, nunca el formulario', async ({ page }) => {
    await page.goto('/reset-password')

    await expect(page.getByText('Acceso no válido')).toBeVisible()
    await expect(page.getByLabel('Nueva contraseña')).toHaveCount(0)
  })

  test('desde login se puede navegar a recuperar y volver', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('link', { name: /contraseña/i }).click()
    await expect(page).toHaveURL(/\/recuperar/)

    await page.getByRole('link', { name: 'Volver al inicio de sesión' }).click()
    await expect(page).toHaveURL(/\/login/)
  })
})
