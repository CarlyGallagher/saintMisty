import { type Page } from '@playwright/test';

export class AdminLoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/admin/login');
  }

  usernameField() {
    return this.page.getByLabel(/username|email/i);
  }

  passwordField() {
    return this.page.getByLabel(/password/i);
  }

  submitButton() {
    return this.page.getByRole('button', { name: /login|sign in/i });
  }

  async login(username: string, password: string) {
    await this.usernameField().fill(username);
    await this.passwordField().fill(password);
    await this.submitButton().click();
  }

  errorMessage() {
    return this.page.getByRole('alert');
  }
}
