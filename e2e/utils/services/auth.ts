import { type Page } from '@playwright/test';
import { AdminLoginPage } from '../../pages/AdminLoginPage';

export async function loginAsAdmin(page: Page) {
  const loginPage = new AdminLoginPage(page);
  await loginPage.goto();
  await loginPage.login(
    process.env.ADMIN_USERNAME ?? '',
    process.env.ADMIN_PASSWORD ?? '',
  );
}
