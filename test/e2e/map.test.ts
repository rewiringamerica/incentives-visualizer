import { expect, test } from '@playwright/test';

test.describe('Map Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:1234');
    await page.waitForSelector('.maplibregl-canvas', { state: 'visible' });
  });

  test('should render the map container', async ({ page }) => {
    const mapCanvas = page.locator('.maplibregl-canvas').first();
    await expect(mapCanvas).toBeVisible();
  });

  test('should initialize the map with the correct center and zoom', async ({
    page,
  }) => {
    await page.waitForFunction(
      () => (window as any).maplibreglMap?.isStyleLoaded(),
    );

    const center = await page.evaluate(() => {
      const map = (window as any).maplibreglMap;
      return map.getCenter().toArray();
    });
    const zoom = await page.evaluate(() => {
      const map = (window as any).maplibreglMap;
      return map.getZoom();
    });

    expect(center).toEqual([-98.5795, 39.8283]); // USA center
    expect(zoom).toBe(4); // Initial zoom level
  });

  test('should call loadStates on map load', async ({ page }) => {
    await page.waitForFunction(
      () => (window as any).maplibreglMap !== undefined,
    );
    await page.waitForFunction(
      () => (window as any).loadStatesCalled !== undefined,
    );

    const loadStatesCalled = await page.evaluate(
      () => (window as any).loadStatesCalled,
    );
    expect(loadStatesCalled).toBe(true);
  });
});
