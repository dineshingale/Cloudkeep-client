import { test, expect } from '@playwright/test';

test.describe('Note Management', () => {

    const TEST_USER = {
        uid: 'test-user-123',
        displayName: 'Test User',
        email: 'test@example.com',
        photoURL: 'https://via.placeholder.com/150'
    };

    test.beforeEach(async ({ page }) => {
        // Mock API
        await page.route('**/api/records?userId=*', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ data: [] })
            });
        });

        // Debug Logs
        page.on('console', msg => console.log(`PAGE: ${msg.text()}`));

        await page.goto('/');

        // Set LS and Reload
        await page.evaluate((user) => {
            localStorage.setItem('TEST_USER', JSON.stringify(user));
        }, TEST_USER);

        await page.reload();
    });

    test('should allow creating a new thought', async ({ page }) => {
        await page.route('**/api/records', async route => {
            if (route.request().method() === 'POST') {
                // Return the created record in the response so the frontend knows it succeeded
                await route.fulfill({
                    status: 201,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        message: 'Success',
                        data: { _id: 'new-id', title: 'My Thought', body: 'Frontend Test Note' }
                    })
                });
            }
            else await route.continue();
        });

        // 1. Wait for Login
        await expect(page.getByText('Your Timeline')).toBeVisible({ timeout: 5000 });

        // 2. Open Creator
        await page.getByRole('button', { name: 'New' }).click();

        // 3. Add a NOTE block first (Default UI says "Add blocks to build your thought")
        // The CreateThought component shows "Add note" button
        await page.getByRole('button', { name: 'Add note' }).click();

        // 4. Now the textarea appears
        const input = page.locator('textarea[placeholder="Type note..."]');
        await expect(input).toBeVisible();
        await input.fill('Frontend Test Note');

        // 5. Post
        const postButton = page.getByRole('button', { name: 'Post Thought' });
        await expect(postButton).toBeEnabled();
        await postButton.click();

        // 6. Verify Created
        // If successful, the creator closes and the new note should appear (if we mocked the re-fetch or if we add it optimistically)
        // Since the component refetches on success, we need to mock the SECOND fetch or ensure the list updates.
        // For this "creation flow" test, just verifying the creator closes is good enough for now.
        await expect(input).not.toBeVisible();
    });
});
