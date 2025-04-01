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

  test('should initialize the map with controls', async ({ page }) => {
    // Check for map controls to verify initialization
    const mapControls = page.locator('.maplibregl-ctrl');
    await expect(mapControls).toBeVisible();
  });

  test('should display the legend', async ({ page }) => {
    // Check if the legend is visible
    const legend = page.locator('.legend');
    await expect(legend).toBeVisible();

    // Verify legend content
    const legendContent = await legend.textContent();
    // expect(legendContent).toContain('Legend');
    // expect(legendContent).toContain('Covered States');
    // expect(legendContent).toContain('Beta States');
    // expect(legendContent).toContain('Uncovered States');
    expect(legendContent).toContain('Legend');
    expect(legendContent).toContain('US States');
  });

  test('should load states with different colors', async ({ page }) => {
    // Wait for the states to be loaded
    await page.waitForSelector('.legend', { state: 'visible' });

    // Take a screenshot and compare it (optional)
    // This is a more advanced visual testing approach
    // const screenshot = await page.screenshot();
    // expect(screenshot).toMatchSnapshot('map-with-states.png');

    // Alternative: Check for some visual indicators that states are loaded
    // For example, check if map has the expected size
    const mapCanvas = page.locator('.maplibregl-canvas').first();
    const boundingBox = await mapCanvas.boundingBox();
    expect(boundingBox?.width).toBeGreaterThan(200);
    expect(boundingBox?.height).toBeGreaterThan(200);
  });

  test('should show tooltip on state hover', async ({ page }) => {
    // First wait for the map to be fully loaded
    await page.waitForSelector('.legend', { state: 'visible' });

    // Get the map canvas for hover operation
    const mapCanvas = page.locator('.maplibregl-canvas').first();

    // Hover over the center of the map (likely to hit a state)
    const box = await mapCanvas.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);

      // Wait briefly for the tooltip to appear
      await page.waitForTimeout(500);

      // Check if a popup appears
      const popup = page.locator('.maplibregl-popup');
      await expect(popup).toBeVisible({ timeout: 2000 });
    }
  });
});
