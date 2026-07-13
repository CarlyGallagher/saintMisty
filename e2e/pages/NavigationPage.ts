import { type Page } from '@playwright/test';

export class NavigationPage {
  constructor(private page: Page) {}

  async goto(path = '/') {
    await this.page.goto(path);
  }

  async clickLink(name: string) {
    await this.page.getByRole('link', { name }).click();
  }

  skipToMainLink() {
    return this.page.getByText('Skip to main content');
  }

  navLink(name: string) {
    return this.page.getByRole('navigation').getByRole('link', { name });
  }
}
