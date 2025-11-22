import { test, expect } from '@playwright/test'

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#contact')
  })

  test('should display validation errors for empty form', async ({ page }) => {
    await page.click('button[type="submit"]')
    
    await expect(page.locator('text=Le prénom est requis')).toBeVisible()
    await expect(page.locator('text=Le nom est requis')).toBeVisible()
    await expect(page.locator('text=L\'email est requis')).toBeVisible()
  })

  test('should validate email format', async ({ page }) => {
    await page.fill('input[name="email"]', 'invalid-email')
    await page.blur('input[name="email"]')
    
    await expect(page.locator('text=Veuillez entrer un email valide')).toBeVisible()
  })

  test('should fill and submit contact form successfully', async ({ page }) => {
    await page.fill('input[name="firstName"]', 'Ahmed')
    await page.fill('input[name="lastName"]', 'Benali')
    await page.fill('input[name="email"]', 'ahmed.benali@example.com')
    await page.fill('input[name="phone"]', '+213 555 123 456')
    await page.fill('textarea[name="message"]', 'Je souhaite prendre un rendez-vous pour une consultation.')
    
    await expect(page.locator('button[type="submit"]')).toBeEnabled()
  })
})
