import { test, expect } from '@playwright/test';

test.describe('Comprehensive Application Audit', () => {

    test('1. Customer: Verification Blocker & Dashboard Access', async ({ page }) => {
        await page.goto('http://localhost:3000/');

        // Mock an unverified customer
        await page.evaluate(() => {
            localStorage.setItem('mock_user', JSON.stringify({
                id: 'unverified-cust',
                email: 'unverified@lumin.com',
                name: 'Unverified User',
                role: 'customer',
                emailVerified: false
            }));
        });

        await page.goto('http://localhost:3000/customer');
        await page.waitForLoadState('networkidle');

        // Check for verification blocker
        await expect(page.getByText(/Verify Your Identity/i)).toBeVisible();
        await expect(page.getByText(/unverified@lumin.com/i)).toBeVisible();

        // Now mock a verified customer
        await page.evaluate(() => {
            localStorage.setItem('mock_user', JSON.stringify({
                id: 'verified-cust',
                email: 'verified@lumin.com',
                name: 'Verified User',
                role: 'customer',
                emailVerified: true
            }));
        });

        await page.goto('http://localhost:3000/customer');
        await page.waitForLoadState('networkidle');

        // Check for dashboard content
        await expect(page.getByText(/Welcome back, Verified User/i)).toBeVisible();
        await expect(page.getByRole('heading', { name: /Active Shipments/i })).toBeVisible();
    });

    test('2. Admin: Shipment Creation & Fleet Management', async ({ page }) => {
        await page.goto('http://localhost:3000/');

        // Mock Admin
        await page.evaluate(() => {
            localStorage.setItem('mock_user', JSON.stringify({
                id: 'admin-audit',
                email: 'admin@audit.com',
                name: 'Auditor Admin',
                role: 'admin',
                emailVerified: true
            }));
        });

        await page.goto('http://localhost:3000/admin');
        await page.waitForLoadState('networkidle');

        // Explore Admin features
        await expect(page.getByText(/Global Logistics/i)).toBeVisible();
        await expect(page.getByText(/Command Center/i)).toBeVisible();
        
        // Go to Create Shipment
        await page.goto('http://localhost:3000/admin/create');
        await expect(page.getByRole('heading', { name: /Create Shipment/i }).first()).toBeVisible();
        await expect(page.getByPlaceholder(/John Doe/i)).toBeVisible();

        // Go to Driver Directory
        await page.goto('http://localhost:3000/admin/drivers');
        await expect(page.getByText(/Driver Intelligence/i)).toBeVisible();
    });

    test('3. Driver: Operational Portal', async ({ page }) => {
        await page.goto('http://localhost:3000/');

        // Mock Driver (operator)
        await page.evaluate(() => {
            localStorage.setItem('mock_user', JSON.stringify({
                id: 'driver-audit',
                email: 'driver@audit.com',
                name: 'Auditor Driver',
                role: 'operator',
                emailVerified: true
            }));
        });

        await page.goto('http://localhost:3000/driver');
        await page.waitForLoadState('networkidle');

        // Explore Driver features
        await expect(page.getByText(/Assigned Routes/i)).toBeVisible();
    });

    test('4. Security: Role-Based Access Control (RBAC)', async ({ page }) => {
        await page.goto('http://localhost:3000/');

        // Mock Customer trying to access Admin
        await page.evaluate(() => {
            localStorage.setItem('mock_user', JSON.stringify({
                id: 'sneaky-cust',
                email: 'sneaky@audit.com',
                name: 'Sneaky User',
                role: 'customer',
                emailVerified: true
            }));
        });

        await page.goto('http://localhost:3000/admin');
        await page.waitForLoadState('networkidle');

        // Should be redirected back to customer dashboard
        expect(page.url()).toContain('/customer');
    });

});
