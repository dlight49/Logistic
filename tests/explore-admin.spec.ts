import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 375, height: 812 } });

test('explore all admin features', async ({ page }) => {
    test.setTimeout(120000); // increase to 2 minutes
    await page.goto('http://localhost:3000/login');
    await page.evaluate(() => {
        window.localStorage.setItem('mock_user', JSON.stringify({
            id: 'admin1', role: 'admin', name: 'Admin User', email: 'admin@logistics.com'
        }));
    });

    await page.goto('http://localhost:3000/admin');
    await page.waitForTimeout(3000);

    // Take the root screenshot
    await page.screenshot({ path: 'admin-1-dashboard.png' });

    // Get all nav links in the BaseNav
    const links = page.locator('nav a');
    const count = await links.count();

    for (let i = 1; i < count; i++) {
        // Click the i-th nav item (skipping idx 0 which is dashboard)
        await links.nth(i).click();
        await page.waitForTimeout(2500); // wait for load/animations

        // Log the current URL and screenshot
        const currentUrl = page.url();
        const tabName = currentUrl.split('/').pop() || 'index';
        await page.screenshot({ path: `admin-${i + 1}-${tabName}.png` });
    }
});
