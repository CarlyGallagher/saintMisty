import { test, expect } from '@playwright/test';
import { NavigationPage } from '../pages/NavigationPage';

test.describe('Navigation', () => {
  test('skip to main content link is present', async ({ page }) => {
    const nav = new NavigationPage(page);
    await nav.goto('/');
    await expect(nav.skipToMainLink()).toBeAttached();
  });

  test('navigates to Blog page', async ({ page }) => {
    const nav = new NavigationPage(page);
    await nav.goto('/');
    await nav.clickLink('Blog');
    await expect(page).toHaveURL('/blog');
  });

  test('navigates to Shows page', async ({ page }) => {
    const nav = new NavigationPage(page);
    await nav.goto('/');
    await nav.clickLink('Shows');
    await expect(page).toHaveURL('/shows');
  });

  test('navigates to EPK page', async ({ page }) => {
    const nav = new NavigationPage(page);
    await nav.goto('/');
    await nav.clickLink('EPK');
    await expect(page).toHaveURL('/epk');
  });
});
