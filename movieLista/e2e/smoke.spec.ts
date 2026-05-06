import { test, expect } from '@playwright/test';

test('shows app shell on root', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('Entertainment Tracker')).toBeVisible();
    await expect(page.getByText('Created by Michael Nindl')).toBeVisible();
});

test('navigates to books via toolbar', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Books' }).click();

    await expect(page).toHaveURL(/\/books$/);
    await expect(page.getByText('Books (Google Books, German)')).toBeVisible();
});

test('navigates to games via toolbar and shows footer', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Games' }).click();

    await expect(page).toHaveURL(/\/games$/);
    await expect(page.getByText('Games (RAWG)')).toBeVisible();
    await expect(page.getByText('Created by Michael Nindl')).toBeVisible();
});



