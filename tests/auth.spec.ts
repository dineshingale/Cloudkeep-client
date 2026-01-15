import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should display landing page when not logged in', async ({ page }) => {
        // Verify Key Landing Page Elements
        await expect(page.locator('text=Capture your thoughts')).toBeVisible();
        await expect(page.locator('text=Continue with Google')).toBeVisible();

        // Verify App features are NOT visible
        await expect(page.locator('nav').filter({ hasText: 'New' })).not.toBeVisible();
    });

    test('should trigger login popup when continue button clicked', async ({ page }) => {
        // Listen for the popup event
        const popupPromise = page.waitForEvent('popup');

        // Click the login button
        await page.click('button:has-text("Continue with Google")');

        // Validate the popup opened (this proves the connection to Firebase Auth SDK is active)
        const popup = await popupPromise;
        expect(popup).toBeTruthy();

        // Optional: We can close it to clean up
        await popup.close();
    });

    test('should not show logout option for guest', async ({ page }) => {
        // Ensure no logout button is present
        await expect(page.locator('button[title="Logout"]')).toHaveCount(0);
    });
});
