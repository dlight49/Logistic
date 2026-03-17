import { test, expect } from '@playwright/test';

test.use({
    viewport: { width: 375, height: 812 }, // iPhone X/11/12 mini sizing
});

test('capture mobile navbar screenshot via local storage mock_user', async ({ page }) => {
    await page.goto('http://localhost:3000/login');

    await page.evaluate(() => {
        window.localStorage.setItem('mock_user', JSON.stringify({
            id: 'admin1', role: 'admin', name: 'Admin User', email: 'admin@logistics.com'
        }));
    });

    await page.goto('http://localhost:3000/admin');

    // Wait simply by time to let dashboard load
    await page.waitForTimeout(4000);

    // Take screenshot of the entire page
    await page.screenshot({ path: 'mobile-nav-screenshot.png', fullPage: true });
});
