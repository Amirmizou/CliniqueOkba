import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/')
    
    await expect(page).toHaveTitle(/Clinique OKBA/)
    
    await expect(page.locator('h1')).toContainText(/Bienvenue/)
  })

  test('should navigate to contact section', async ({ page }) => {
    await page.goto('/')
    
    await page.click('a[href="#contact"]')
    
    await expect(page.locator('#contact')).toBeVisible()
  })

  test('should have all main sections', async ({ page }) => {
    await page.goto('/')
    
    const sections = ['#about', '#specialties', '#services', '#gallery', '#contact']
    
    for (const section of sections) {
      await expect(page.locator(section)).toBeVisible()
    }
  })
})
