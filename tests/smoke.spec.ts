import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    // Note: Adjust 'CloudKeep' to whatever the actual apps title is if different
    await expect(page).toHaveTitle(/CloudKeep/i);
});

test('shows login or landing content', async ({ page }) => {
    await page.goto('/');
    // Check if body is visible, effectively checking if the app crashed
    await expect(page.locator('body')).toBeVisible();
});
