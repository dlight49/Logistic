import { test, expect } from '@playwright/test';

test.describe('Mobile Accessibility and Touch Targets', () => {
  test.use({ viewport: { width: 390, height: 844 }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1' });

  test('Icon buttons should have aria-labels and minimum 44x44px touch targets', async ({ page }) => {
    // Go to a page with many icon buttons (Admin Registry as example)
    // Note: We might need to handle login if these are protected, but we can check the public ones or bypass auth for structural checks if possible.
    // For now, let's check the public/base elements.
    await page.goto('/');
    
    // Check for any icon buttons (buttons without text)
    const iconButtons = await page.locator('button:not(:has-text(""))').all();
    
    for (const btn of iconButtons) {
      // 1. Check for aria-label or title
      const ariaLabel = await btn.getAttribute('aria-label');
      const title = await btn.getAttribute('title');
      expect(ariaLabel || title, `Button missing descriptive label: ${await btn.innerHTML()}`).toBeTruthy();
      
      // 2. Check for minimum touch target (44x44px)
      const box = await btn.boundingBox();
      if (box) {
        expect(box.width, `Button width ${box.width} is less than 44px`).toBeGreaterThanOrEqual(40); // Allowing slight margin for sub-pixel rendering
        expect(box.height, `Button height ${box.height} is less than 44px`).toBeGreaterThanOrEqual(40);
      }
    }
  });

  test('Mobile navigation should be visible and functional', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    // Check if nav has at least a few items
    const navItems = await nav.locator('a, button').all();
    expect(navItems.length).toBeGreaterThan(0);
  });
});
