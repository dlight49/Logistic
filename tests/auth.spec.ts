import { test, expect } from '@playwright/test';

test.describe('Authentication and Protected Routes', () => {

    test('Customer Portal redirects to Login if unauthorized', async ({ page }) => {
        // Try to access protected route without logging in
        await page.goto('http://localhost:3000/customer');

        // It should redirect to /login
        await page.waitForURL('http://localhost:3000/login');

        // Welcome Back is the headline on CustomerLogin.tsx
        await expect(page.getByRole('heading', { name: /Welcome Back/i }).first()).toBeVisible();
    });

    test('Admin Portal redirects to Admin Login if unauthorized', async ({ page }) => {
        await page.goto('http://localhost:3000/admin');

        // Admin routes often redirect to their specific login
        await page.waitForURL('http://localhost:3000/admin/login');

        await expect(page.getByRole('heading', { name: /Admin Console/i }).first()).toBeVisible();
    });

    test('Driver Portal redirects to Driver Login if unauthorized', async ({ page }) => {
        await page.goto('http://localhost:3000/driver');

        // Driver routes often redirect to their specific login
        await page.waitForURL('http://localhost:3000/driver/login');

        await expect(page.getByRole('heading', { name: /Driver Portal/i }).first()).toBeVisible();
    });

    test('Navigation between logins works', async ({ page }) => {
        await page.goto('http://localhost:3000/login');
        const customerHeading = page.getByRole('heading', { name: /Welcome Back/i }).first();
        await expect(customerHeading).toBeVisible();

        await page.goto('http://localhost:3000/admin/login');
        const adminHeading = page.getByRole('heading', { name: /Admin Console/i }).first();
        await expect(adminHeading).toBeVisible();

        await page.goto('http://localhost:3000/driver/login');
        const driverHeading = page.getByRole('heading', { name: /Driver Portal/i }).first();
        await expect(driverHeading).toBeVisible();
    });
});
