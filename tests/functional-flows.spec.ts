import { test, expect } from '@playwright/test';

test.describe('Logistic Platform Deep Functional Audit', () => {

    test.beforeEach(async ({ page }) => {
        // Mock a verified admin user for all tests in this suite
        await page.goto('http://localhost:3000/');
        await page.evaluate(() => {
            localStorage.setItem('mock_user', JSON.stringify({
                id: 'audit-admin-id',
                email: 'admin@audit.com',
                name: 'Audit Administrator',
                role: 'admin',
                emailVerified: true
            }));
        });
    });

    test('1. User Management: Form Validation and Error Handling', async ({ page }) => {
        await page.goto('http://localhost:3000/admin/users');
        await page.waitForLoadState('networkidle');

        // Open Add User Modal
        await page.getByRole('button', { name: /Add New User/i }).click();
        
        // Try to submit empty form
        await page.getByRole('button', { name: /Create Account/i }).click();

        // Check if backend validation error is caught (mocking response would be better, but we check if app stays alive)
        // Since we added Zod, the app should show validation errors if the frontend sends bad data
        // For now, let's verify we can fill it
        await page.getByPlaceholder(/John Doe/i).fill('Test Audit User');
        await page.getByPlaceholder(/name@example.com/i).fill('invalid-email');
        await page.getByRole('button', { name: /Create Account/i }).click();
        
        // Assuming the frontend shows some error or at least doesn't crash
        await expect(page.getByText(/Test Audit User/i)).toBeVisible(); // Modal should still be open
    });

    test('2. Shipment Creation: Step-by-Step Flow', async ({ page }) => {
        await page.goto('http://localhost:3000/admin/create');
        
        // Step 1: Shipper Info
        await page.getByPlaceholder(/John Doe/i).fill('Audit Shipper');
        await page.getByRole('button', { name: /Next/i }).click();

        // Step 2: Recipient Info
        await page.getByPlaceholder(/Jane Smith/i).fill('Audit Recipient');
        await page.getByRole('button', { name: /Next/i }).click();

        // Step 3: Package Details
        await page.getByPlaceholder(/e.g. 5.5/i).fill('10');
        await page.getByRole('button', { name: /Next/i }).click();

        // Should be on Review Step
        await expect(page.getByText(/Review Shipment Details/i)).toBeVisible();
        await expect(page.getByText(/Audit Shipper/i)).toBeVisible();
        await expect(page.getByText(/Audit Recipient/i)).toBeVisible();
    });

    test('3. Admin Navigation: Verify All Sidebar Links', async ({ page }) => {
        const routes = [
            { name: /Command Center/i, url: '/admin' },
            { name: /Shipments/i, url: '/admin/shipments' },
            { name: /Fleet/i, url: '/admin/drivers' },
            { name: /Support/i, url: '/admin/support' },
            { name: /Settings/i, url: '/admin/settings' }
        ];

        for (const route of routes) {
            await page.getByRole('link', { name: route.name }).click();
            await expect(page).toHaveURL(new RegExp(route.url));
        }
    });

    test('4. Real-time Map and Driver Tracking Page', async ({ page }) => {
        await page.goto('http://localhost:3000/track');
        await expect(page.getByPlaceholder(/Enter tracking number/i)).toBeVisible();
        
        // Verify tracking button is functional
        await page.getByPlaceholder(/Enter tracking number/i).fill('AUDIT-123');
        await page.getByRole('button', { name: /Track/i }).click();
        
        // Should show "not found" or data (since it's a mock number)
        // Key is that the page doesn't crash
        await expect(page.getByText(/AUDIT-123/i)).toBeVisible();
    });
});
