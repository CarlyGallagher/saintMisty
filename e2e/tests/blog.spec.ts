import { test, expect } from '@playwright/test';
import { BlogPage } from '../pages/BlogPage';

test.describe('Blog', () => {
  test('blog list page loads', async ({ page }) => {
    const blogPage = new BlogPage(page);
    await blogPage.goto();
    await expect(page).toHaveURL('/blog');
  });

  test('clicking a post navigates to the post', async ({ page }) => {
    const blogPage = new BlogPage(page);
    await blogPage.goto();
    await blogPage.clickFirstPost();
    await expect(page).toHaveURL(/\/blog\/.+/);
  });
});
