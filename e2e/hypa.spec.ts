import { test, expect, devices } from '@playwright/test';

// Use iPhone 12 or another iOS device profile
test.use({
  ...devices['iPhone 12'],
});

test('iOS should not zoom when focusing on CommandBar textarea', async ({ page }) => {
  // Go to the chat route
  await page.goto('https://hypachat.com');

  // Ensure the CommandBar is rendered and visible
  const commandInput = page.locator('#chat-input');
  await expect(commandInput).toBeVisible();

  // Focus the input
  await commandInput.focus();

  // Check that the font-size is >= 16px to prevent iOS zoom
  const fontSize = await commandInput.evaluate((el) =>
    parseFloat(window.getComputedStyle(el).fontSize)
  );
  expect(fontSize).toBeGreaterThanOrEqual(16);

  // iOS zoom usually reflects as scale > 1
  const scale = await page.evaluate(() => window.visualViewport.scale);
  expect(scale).toBeCloseTo(1, 0.01); // scale should remain ~1.0

  // Ensure horizontal scroll is not triggered
  const hasHorizontalScroll = await page.evaluate(() =>
    document.documentElement.scrollWidth > document.documentElement.clientWidth
  );
  expect(hasHorizontalScroll).toBe(false);
});


test.use({ ...devices['iPhone 12'] });

// test('📱 Test 2.1: Only transcript scrolls, no outer scrollbars', async ({ page }) => {
//   await page.goto('https://hypachat.com/chat/R19ntq9ePiMUJQ1GzRmL');

//   const transcript = page.locator('.transcript');
//   await expect(transcript).toBeVisible();

//   // Scroll the transcript to bottom
//   await transcript.evaluate(el => el.scrollTo(0, el.scrollHeight));

//   // Check that `body` and `html` did not scroll
//   const bodyScroll = await page.evaluate(() => document.body.scrollTop);
//   const htmlScroll = await page.evaluate(() => document.documentElement.scrollTop);

//   expect(bodyScroll).toBeLessThan(10);
//   expect(htmlScroll).toBeLessThan(10);

//   // Check that no outer vertical scrollbar appears
//   const fullHeight = await page.evaluate(() => document.documentElement.scrollHeight);
//   const viewportHeight = await page.evaluate(() => window.innerHeight);
//   expect(fullHeight).toBeLessThanOrEqual(viewportHeight + 10);
// });



// test.use({ ...devices['iPhone 12'] });

// test('📱 Test 3.1: Last message visible above CommandBar', async ({ page }) => {
//   await page.goto('http://hypachat.com/chat/R19ntq9ePiMUJQ1GzRmL');


//   const input = page.locator('#chat-input');
//   await input.fill('Bottom-padding test');
//   await input.press('Enter');

//   // Wait for the message to appear
//   const lastMessage = page.locator('.transcript >> text=Bottom-padding test');
//   await expect(lastMessage).toBeVisible();

//   // Scroll the transcript to bottom
//   const transcript = page.locator('.transcript');
//   await transcript.evaluate(el => el.scrollTo(0, el.scrollHeight));

//   // Wait a little for scroll to settle
//   await page.waitForTimeout(500);

  
//   const lastMessageBox = await lastMessage.boundingBox();
//   const commandBarBox = await page.locator('#chat-input').boundingBox(); // Or CommandBar wrapper

//   expect(lastMessageBox).not.toBeNull();
//   expect(commandBarBox).not.toBeNull();

//   // Ensure there's at least 20px spacing above CommandBar
//   const spaceAboveCommandBar = _inputBar_g00oa_1.y - (l_inputBar_g00oa_1.y + _inputBar_g00oa_1.height);
//   expect(spaceAboveCommandBar).toBeGreaterThanOrEqual(20);

//   // Extra scroll test (can scroll past last message slightly)
//   const beforeScrollTop = await transcript.evaluate(el => el.scrollTop);
//   await transcript.evaluate(el => el.scrollBy(0, 10));
//   const afterScrollTop = await transcript.evaluate(el => el.scrollTop);
//   expect(afterScrollTop).toBeGreaterThan(beforeScrollTop);
// });


test.use({ ...devices['iPhone 12'] }); 

test('📱 Test 4.1: Extra padding on small viewports (last message not clipped)', async ({ page }) => {
  await page.goto('http://hypachat.com/chat/R19ntq9ePiMUJQ1GzRmL');

  // Type a new message to test visibility
  const input = page.locator('#chat-input');
  await input.fill('Responsive padding test');
  await input.press('Enter');

  // Wait for message to appear
  const lastMessage = page.locator('.transcript >> text=Responsive padding test');
  await expect(lastMessage).toBeVisible();

  // Scroll to bottom
  const transcript = page.locator('.transcript');
  await transcript.evaluate(el => el.scrollTo(0, el.scrollHeight));

  // Wait a bit for smooth scrolling
  await page.waitForTimeout(500);

  // Get positions of last message and command bar
  const messageBox = await lastMessage.boundingBox();
  const commandBarBox = await input.boundingBox();

  expect(messageBox).not.toBeNull();
  expect(commandBarBox).not.toBeNull();

  const space = commandBarBox.y - (messageBox.y + messageBox.height);

  // Expect at least 30px spacing
  expect(space).toBeGreaterThanOrEqual(30);
});
