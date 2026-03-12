import { test, expect } from '@playwright/test';

test.describe('Authenticated Dashboards', () => {

    test('Admin Dashboard loads and renders features', async ({ page }) => {
        // Navigate to root to set localStorage on the right origin
        await page.goto('http://localhost:3000/');

        // Set mock auth for admin
        await page.evaluate(() => {
            localStorage.setItem('mock_user', JSON.stringify({
                id: 'test-admin',
                email: 'admin@lumin.com',
                name: 'Test Admin',
                role: 'admin'
            }));
        });

        // Navigate to admin
        await page.goto('http://localhost:3000/admin');
        await page.waitForLoadState('networkidle');

        // Verify it didn't redirect
        expect(page.url()).toBe('http://localhost:3000/admin');

        // Verify Dashboard specific elements
        await expect(page.getByText('Command Center').first()).toBeVisible();
        await expect(page.getByText('Active Shipments').first()).toBeVisible();
        await expect(page.getByText('Live Global Operations').first()).toBeVisible();
    });

    test('Driver Dashboard loads and renders features', async ({ page }) => {
        await page.goto('http://localhost:3000/');

        await page.evaluate(() => {
            localStorage.setItem('mock_user', JSON.stringify({
                id: 'test-driver',
                email: 'driver@lumin.com',
                name: 'Test Driver',
                role: 'operator'
            }));
        });

        await page.goto('http://localhost:3000/driver');
        await page.waitForLoadState('networkidle');

        expect(page.url()).toBe('http://localhost:3000/driver');

        // Verify Driver UI
        await expect(page.getByText('Assigned Routes').first()).toBeVisible();
    });

    test('Customer Dashboard loads and renders features', async ({ page }) => {
        await page.goto('http://localhost:3000/');

        await page.evaluate(() => {
            localStorage.setItem('mock_user', JSON.stringify({
                id: 'test-customer',
                email: 'customer@lumin.com',
                name: 'Test Customer',
                role: 'customer'
            }));
        });

        await page.goto('http://localhost:3000/customer');
        await page.waitForLoadState('networkidle');

        expect(page.url()).toBe('http://localhost:3000/customer');

        // Verify Customer UI
        await expect(page.getByText('Active Shipments').first()).toBeVisible();

        // New Quote is a Link, not a button
        await expect(page.getByRole('link', { name: /New Quote/i }).first()).toBeVisible();
    });

});
