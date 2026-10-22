import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('navigation resets the page and focuses the real lazy-loaded destination', async ({
  page,
}) => {
  await page.goto('/learn/to')
  await page.locator('.lesson-pagination').scrollIntoViewIfNeeded()
  await page
    .locator('.desktop-nav')
    .getByRole('link', { name: /Belajar/ })
    .click()
  await expect(page).toHaveURL(/\/learn$/)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
  await expect(page.locator('main')).toBeFocused()
  await page.goto('/learn/motion-path#challenge')
  await expect(page.locator('#challenge')).toBeFocused()
  await expect
    .poll(() =>
      page
        .locator('#challenge')
        .evaluate(element => Math.round(element.getBoundingClientRect().top)),
    )
    .toBeGreaterThanOrEqual(64)
  await page.goto('/learn#module-6')
  await expect(page.locator('#module-6')).toHaveAttribute('open', '')
  await expect(page.locator('#module-6')).toBeFocused()
})

test('search supports Enter, Escape restores focus, and the ticker can be paused', async ({
  page,
}) => {
  await page.goto('/')
  const trigger = page.getByRole('button', { name: 'Cari pelajaran · Ctrl K / ⌘ K', exact: true })
  await trigger.click()
  await expect(page.getByRole('textbox', { name: 'Cari materi', exact: true })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(trigger).toBeFocused()
  await page.getByRole('button', { name: 'Pengaturan belajar', exact: true }).click()
  await page.keyboard.press('ControlOrMeta+k')
  await expect(page.getByRole('dialog')).toHaveCount(1)
  await expect(page.getByRole('textbox', { name: 'Cari materi', exact: true })).toBeFocused()
  await page.getByRole('textbox', { name: 'Cari materi', exact: true }).fill('Kenalan dengan GSAP')
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/learn\/gsap-foundations/)
  await expect(page.locator('main')).toBeFocused()
  await page.getByRole('button', { name: 'Jeda teks berjalan', exact: true }).click()
  await expect(
    page.getByRole('button', { name: 'Lanjutkan teks berjalan', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('.ticker-track')).toHaveCSS('animation-play-state', 'paused')
  await page.getByRole('button', { name: 'Lanjutkan teks berjalan', exact: true }).click()
  await expect(
    page.getByRole('button', { name: 'Jeda teks berjalan', exact: true }),
  ).toHaveAttribute('aria-pressed', 'false')
  await expect(page.locator('.ticker-track')).toHaveCSS('animation-play-state', 'running')
})

test('syntax and runtime diagnostics stay next to the faulty line and clear after editing', async ({
  page,
}) => {
  await page.goto('/playground?example=to')
  await page.locator('.cm-content').fill('const distance = 120;\ngsap.to(".box", { x: );')
  await page.getByRole('button', { name: 'Jalankan kode', exact: true }).click()
  await expect(page.locator('.cm-code-error')).toContainText('Baris 2')
  await expect(page.locator('.cm-content')).toBeFocused()
  await expect(page.locator('.cm-content')).toHaveAttribute('aria-invalid', 'true')
  await expect(page.locator('.lab-error')).toHaveCount(0)
  await page
    .locator('.cm-content')
    .fill('const distance = 120;\n\ngsap.to(".box", { x: missingDistance });')
  await expect(page.getByRole('alert')).toHaveCount(0)
  await page.getByRole('button', { name: 'Jalankan kode', exact: true }).click()
  await expect(page.locator('.cm-code-error')).toContainText('Baris 3')
  await expect(page.locator('.cm-error-line')).toContainText('missingDistance')
  await page.getByRole('button', { name: 'Reset contoh', exact: true }).click()
  await expect(page.getByRole('alert')).toHaveCount(0)
  await page.getByRole('button', { name: 'Jalankan kode dari editor', exact: true }).click()
  await expect(page.getByText('Kode berhasil dijalankan', { exact: true })).toBeVisible()
})

test('an error with no source location stays visible after a long code document', async ({
  page,
}) => {
  await page.goto('/playground')
  await page
    .locator('.cm-content')
    .fill(Array.from({ length: 40 }, (_, index) => `const value${index} = ${index};`).join('\n'))
  await page.getByRole('button', { name: 'Jalankan kode', exact: true }).click()
  await expect(page.locator('.cm-code-error')).toContainText('Belum ada tween')
  await expect(page.locator('.cm-code-error')).toBeInViewport()
  await expect(page.locator('.cm-content')).toBeFocused()
  await page.getByRole('button', { name: /Periksa pesan di kode/ }).click()
  await expect(page.locator('.cm-code-error')).toBeInViewport()
})

test('canvas controls work with a keyboard and background clicks run the code', async ({
  page,
}) => {
  await page.goto('/playground?example=to')
  const frame = page.frameLocator('iframe')
  await frame.locator('.stage').click({ position: { x: 15, y: 55 } })
  await expect(page.getByText('Kode berhasil dijalankan', { exact: true })).toBeVisible()
  await page.getByRole('slider', { name: 'Progres animasi', exact: true }).fill('100')
  await expect(frame.getByRole('button', { name: 'Ulangi', exact: true })).toBeVisible()
  await frame.getByRole('button', { name: 'Ulangi', exact: true }).focus()
  await page.keyboard.press('Enter')
  await expect
    .poll(async () =>
      Number((await page.locator('.playback-controls output').textContent())?.replace('%', '')),
    )
    .toBeLessThan(100)
})

test('visual introductions support reduced motion and a returning learner resumes the last lesson', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/learn/animation-blueprint')
  await expect(page.locator('.concept-playback output')).toHaveText('100%')
  await page.getByRole('slider', { name: 'Amati progres', exact: true }).fill('40')
  await expect(page.locator('.concept-playback output')).toHaveText('40%')
  await expect(page.locator('.cm-content')).toHaveCount(0)
  await page.locator('.brand-cluster a').click()
  await expect(page.locator('.hero-actions .primary')).toHaveAttribute(
    'href',
    '/learn/animation-blueprint',
  )
})

for (const width of [1440, 390]) {
  for (const path of [
    '/',
    '/learn',
    '/learn/gsap-foundations',
    '/learn/animation-blueprint',
    '/learn/to',
    '/playground',
    '/challenges',
    '/progress',
    '/reference',
  ]) {
    test(`accessibility ${width}px ${path}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 })
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto(path)
      await expect(page.locator('h1')).toBeVisible()
      if (path === '/learn/to' || path === '/playground')
        await expect(page.locator('.cm-content')).toBeVisible()
      if (path.includes('foundations') || path.includes('blueprint'))
        await expect(page.locator('.concept-study')).toBeVisible()
      const result = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze()
      await testInfo.attach('accessibility', {
        body: JSON.stringify(
          { violations: result.violations, incomplete: result.incomplete },
          null,
          2,
        ),
        contentType: 'application/json',
      })
      expect(
        result.violations.map(item => ({
          rule: item.id,
          nodes: item.nodes.map(node => ({ target: node.target, summary: node.failureSummary })),
        })),
      ).toEqual([])
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
      ).toBeLessThanOrEqual(1)
    })
  }
}

test('dialog and inline error accessibility, with representative screenshots', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/learn/gsap-foundations')
  await expect(page.locator('.concept-study')).toBeVisible()
  await page.screenshot({ path: '.artifacts/foundations-desktop.png', fullPage: true })
  await page.getByRole('button', { name: 'Cari pelajaran · Ctrl K / ⌘ K', exact: true }).click()
  const dialog = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze()
  expect(dialog.violations.map(item => item.id)).toEqual([])
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'Pengaturan belajar', exact: true }).click()
  const settings = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze()
  expect(settings.violations.map(item => item.id)).toEqual([])
  await page.getByRole('button', { name: 'Reset progres belajar', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Batal', exact: true })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(
    page.getByRole('button', { name: 'Reset progres belajar', exact: true }),
  ).toBeFocused()
  await page.keyboard.press('Escape')
  await page.goto('/playground')
  await page
    .locator('.cm-content')
    .fill('const distance = 120;\ngsap.to(".box", { x: unknownDistance });')
  await page.getByRole('button', { name: 'Jalankan kode', exact: true }).click()
  await expect(page.getByRole('alert')).toBeVisible()
  const error = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  expect(error.violations.map(item => item.id)).toEqual([])
  await page.locator('.motion-lab').screenshot({ path: '.artifacts/inline-error-desktop.png' })
  await page.setViewportSize({ width: 390, height: 844 })
  const mobileEditor = page.locator('.editor-pane')
  const errorBounds = await page.locator('.cm-code-error').boundingBox()
  const editorBounds = await mobileEditor.boundingBox()
  expect(
    errorBounds &&
      editorBounds &&
      errorBounds.x + errorBounds.width <= editorBounds.x + editorBounds.width,
  ).toBe(true)
  await mobileEditor.screenshot({
    path: '.artifacts/inline-error-mobile.png',
    style: '.site-header,.mobile-nav{visibility:hidden}',
  })
  await page.goto('/learn/animation-blueprint')
  const visualStudy = page.locator('.concept-study')
  await visualStudy.screenshot({
    path: '.artifacts/foundations-mobile.png',
    style: '.site-header,.mobile-nav{visibility:hidden}',
  })
})
