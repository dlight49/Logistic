import { test, expect } from '@playwright/test';

test.describe('Logistic Platform Deep Functional Audit', () => {

    test.beforeEach(async ({ page, context }) => {
        // Set up mock localStorage BEFORE the page loads
        await context.addInitScript(() => {
            // Covering all bases for different auth implementations in the app
            localStorage.setItem('access_token', 'mock-access-token');
            localStorage.setItem('lumin_token', 'mock-access-token');
            localStorage.setItem('lumin_user', JSON.stringify({
                id: 'audit-admin-id',
                email: 'admin@audit.com',
                name: 'Audit Administrator',
                role: 'admin',
                emailVerified: true
            }));
            localStorage.setItem('lumin_cookie_consent', 'accepted');
        });

        // Mock API responses to avoid 401 redirects or crashes
        await page.route('**/api/stats', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    total: 150,
                    inTransit: 45,
                    inCustoms: 5,
                    issues: 2,
                    activeTickets: 3
                })
            });
        });

        await page.route('**/api/users', async route => {
            const method = route.request().method();
            if (method === 'GET') {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify([
                        { id: '1', name: 'User One', email: 'user1@test.com', role: 'customer' }
                    ])
                });
            } else if (method === 'POST') {
                await route.fulfill({
                    status: 201,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        id: 'new-user-id',
                        email: 'audit-test@example.com',
                        role: 'customer',
                        tempPassword: 'generated-pass-123'
                    })
                });
            } else {
                await route.continue();
            }
        });

        await page.route('**/api/settings', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ companyName: 'Audit Logistics' })
            });
        });

        await page.route('**/api/notifications/logs', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([])
            });
        });
    });

    test('1. User Management: Success Flow', async ({ page }) => {
        await page.goto('http://localhost:3000/admin/users');
        
        // Wait for page load
        await expect(page.getByText(/User Directory/i)).toBeVisible({ timeout: 20000 });

        // Open Add User Modal
        await page.getByRole('button', { name: /Add User/i }).first().click();
        
        // Fill form
        await page.getByLabel(/Full Name/i).fill('Audit Test User');
        await page.getByLabel(/Email Address/i).fill('audit-test@example.com');
        
        // Click Initialize Account
        await page.getByRole('button', { name: /Initialize Account/i }).click();

        // Should show SECURE CREDENTIALS
        await expect(page.getByText(/SECURE CREDENTIALS/i)).toBeVisible({ timeout: 15000 });
    });

    test('2. Shipment Creation: Complete Step-by-Step Flow', async ({ page }) => {
        await page.goto('http://localhost:3000/admin/create');
        
        // Wait for first step to load
        await expect(page.getByLabel(/Sender Name/i)).toBeVisible({ timeout: 20000 });
        
        // Step 1: Shipper Info
        await page.getByLabel(/Sender Name/i).fill('Audit Shipper');
        await page.getByLabel(/City/i).first().fill('Audit City');
        await page.getByLabel(/Country/i).first().fill('Audit Country');
        await page.getByPlaceholder(/Street, Building, Suite.../i).fill('123 Audit Street');
        await page.getByRole('button', { name: /Continue/i }).click();

        // Step 2: Recipient Info
        await page.getByLabel(/Customer Name/i).fill('Audit Recipient');
        await page.getByLabel(/Phone Number/i).fill('+1234567890');
        await page.getByLabel(/Email Address/i).fill('recipient@audit.com');
        await page.getByLabel(/City/i).last().fill('Recipient City');
        await page.getByLabel(/Country/i).last().fill('Recipient Country');
        await page.getByPlaceholder(/Full Delivery Address/i).fill('456 Recipient Ave');
        await page.getByRole('button', { name: /Continue/i }).click();

        // Step 3: Package Details
        await page.getByLabel(/Total Weight \(kg\)/i).fill('10.5');
        await page.getByLabel(/Expected Delivery/i).fill('2026-12-31');
        await page.getByRole('button', { name: /Continue/i }).click();

        // Should be on Final Review Step
        await expect(page.getByText(/Final Review/i)).toBeVisible();
    });

    test('3. Admin Navigation: Verify Sidebar Links', async ({ page }) => {
        await page.goto('http://localhost:3000/admin');
        await expect(page.getByText(/Command Center/i)).toBeVisible({ timeout: 20000 });

        const routes = [
            { name: "Dashboard", url: '/admin' },
            { name: "Registry", url: '/admin/shipments' },
            { name: "Fleet", url: '/admin/drivers' },
            { name: "Support", url: '/admin/support' },
            { name: "Settings", url: '/admin/settings' }
        ];

        const nav = page.getByRole('navigation');

        for (const route of routes) {
            await nav.getByRole('link', { name: route.name, exact: true }).click();
            await expect(page).toHaveURL(new RegExp(route.url));
        }
    });

    test('4. Tracking Page Functionality', async ({ page }) => {
        await page.goto('http://localhost:3000/track');
        await expect(page.getByPlaceholder(/Enter tracking number/i)).toBeVisible({ timeout: 15000 });
        
        await page.getByPlaceholder(/Enter tracking number/i).fill('AUDIT-123');
        
        // Mock tracking response
        await page.route('**/api/shipments/track/AUDIT-123', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    id: 'AUDIT-123',
                    type: 'Air Freight',
                    status: 'In Transit',
                    est_delivery: '2026-03-25'
                })
            });
        });

        await page.getByRole('button', { name: /TRACK/i }).click();
        await expect(page.getByText(/AUDIT-123/i)).toBeVisible();
    });
});
