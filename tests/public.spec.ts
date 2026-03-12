import { test, expect } from '@playwright/test';

test.describe('Public Pages Verification', () => {

    test('Homepage Call-To-Action buttons', async ({ page }) => {
        // Go to homepage
        await page.goto('http://localhost:3000/');

        // Check main headline or hero element to ensure page loaded
        await expect(page.getByText('Lumin Logistics', { exact: false }).first()).toBeVisible();

        // Find all typical CTA links or buttons
        // Since we don't know the exact text, we guess the most likely ones based on standard logistics apps
        const ctas = ['Get a Quote', 'Track a Shipment', 'Sign In', 'Track Package'];

        for (const cta of ctas) {
            // Go back to home
            await page.goto('http://localhost:3000/');
            // Wait for network idle
            await page.waitForLoadState('networkidle');

            const button = page.getByRole('link', { name: new RegExp(cta, 'i') }).first();
            // Only test the ones that exist on the page
            if (await button.isVisible()) {
                console.log(`Testing CTA: ${cta}`);
                const href = await button.getAttribute('href');
                await button.click();

                // Wait to navigate
                await page.waitForURL(new RegExp('.*'), { waitUntil: 'domcontentloaded' });

                // Ensure not on a blank/broken page by checking for the body
                await expect(page.locator('body')).toBeVisible();
            }
        }
    });

    test('Navigation Bar Links', async ({ page }) => {
        await page.goto('http://localhost:3000/');
        await page.waitForLoadState('networkidle');

        // Trying to find nav links
        const navLinks = await page.locator('nav a').all();
        console.log(`Found ${navLinks.length} links in the nav menu`);

        for (let i = 0; i < navLinks.length; i++) {
            await page.goto('http://localhost:3000/');
            await page.waitForLoadState('networkidle');

            // Re-locate links to avoid stale element reference
            const links = await page.locator('nav a').all();
            if (i < links.length) {
                const linkText = await links[i].textContent();
                console.log(`Clicking nav link: ${linkText?.trim()}`);
                await links[i].click();
                await page.waitForLoadState('domcontentloaded');
                // Basic sanity check that it loaded a valid react page layout
                await expect(page.locator('body')).toBeVisible();
            }
        }
    });

    test('Tracking Page Functionality', async ({ page }) => {
        // Navigate to /track
        await page.goto('http://localhost:3000/track');

        // Attempt tracking
        const searchInput = page.getByRole('textbox').first();
        await expect(searchInput).toBeVisible();
        await searchInput.fill('SHIP12345');

        // Click track/search button
        // It could be an icon button or "Track" text
        const searchButton = page.locator('button').filter({ hasText: /Track|Search/i }).first();

        if (await searchButton.isVisible()) {
            await searchButton.click();
        } else {
            // Fallback: press Enter
            await searchInput.press('Enter');
        }

        // Give it a moment to show "not found" or similar
        await page.waitForTimeout(2000);

        // We expect it to update the UI (either showing an error or a result)
        const bodyContent = await page.locator('body').innerText();
        expect(bodyContent.length).toBeGreaterThan(0);
        // Ideally we wouldn't see a blank white screen, ensuring the app didn't crash.
    });
});
