import { test, expect } from '@playwright/test';
import { AdminLoginPage } from '../pages/AdminLoginPage';

test.describe('Admin login', () => {
  test('shows login form', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);
    await loginPage.goto();
    await expect(loginPage.usernameField()).toBeVisible();
    await expect(loginPage.passwordField()).toBeVisible();
    await expect(loginPage.submitButton()).toBeVisible();
  });

  test('shows error on invalid credentials', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);
    await loginPage.goto();
    await loginPage.login('wrong@email.com', 'wrongpassword');
    await expect(loginPage.errorMessage()).toBeVisible();
  });
});
