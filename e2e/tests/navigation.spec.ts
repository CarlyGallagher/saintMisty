import { test, expect } from '@playwright/test';
import { NavigationPage } from '../pages/NavigationPage';

test.describe('Navigation', () => {
  test('skip to main content link is present', async ({ page }) => {
    const nav = new NavigationPage(page);
    await nav.goto('/');
    await expect(nav.skipToMainLink()).toBeAttached();
  });

  test('Blog nav link opens the newsletter signup modal', async ({ page }) => {
    const nav = new NavigationPage(page);
    await nav.goto('/');
    await page.getByRole('navigation').getByRole('button', { name: 'Blog' }).click();
    await expect(page.getByRole('heading', { name: 'Get Saint Misty Updates' })).toBeVisible();
  });

  test('navigates to Shows page', async ({ page }) => {
    const nav = new NavigationPage(page);
    await nav.goto('/');
    await nav.clickLink('Shows');
    await expect(page).toHaveURL('/shows');
  });

  test('EPK link is not shown in the nav (private, unlisted page)', async ({ page }) => {
    const nav = new NavigationPage(page);
    await nav.goto('/');
    await expect(nav.navLink('EPK')).not.toBeAttached();
  });

  test('EPK page loads directly via its private URL', async ({ page }) => {
    const nav = new NavigationPage(page);
    await nav.goto('/epk-0a02faa10e');
    await expect(page.getByRole('heading', { name: 'Saint Misty' })).toBeVisible();
  });
});
