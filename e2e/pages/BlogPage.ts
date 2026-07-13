import { type Page } from '@playwright/test';

export class BlogPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/blog');
  }

  blogList() {
    return this.page.getByRole('list');
  }

  blogLinks() {
    return this.page.getByRole('link').filter({ hasText: /./});
  }

  async clickFirstPost() {
    await this.page.getByRole('link').filter({ hasText: /./}).first().click();
  }

  heading() {
    return this.page.getByRole('heading', { level: 1 });
  }
}
