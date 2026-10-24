import { test, expect } from '@playwright/test'
import { getPracticeLesson, practiceLessons } from '../src/data/curriculum'

test('a new learner can complete a challenge, persist progress, and switch language in place', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('lang', 'id')
  const requests: string[] = []
  page.on('request', request => requests.push(request.url()))
  await page.reload()
  expect(requests.some(url => /MotionLab|CodeEditor|codemirror/.test(url))).toBe(false)
  await page.getByRole('link', { name: 'Masuk ke pelajaran pertama', exact: true }).click()
  await expect(page).toHaveURL(/learn\/gsap-foundations/)
  await expect(page.locator('.cm-content')).toHaveCount(0)
  await page
    .getByRole('radio', { name: 'Mengatur perubahan posisi kotak selama suatu waktu', exact: true })
    .check()
  await expect(page.getByText('Ya, kamu memahami idenya.', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Tandai selesai', exact: true }).click()
  await page.locator('.lesson-pagination').getByRole('link').last().click()
  await expect(page).toHaveURL(/learn\/animation-blueprint/)
  await page.getByRole('slider', { name: /Waktu tempuh/ }).fill('2')
  await page
    .getByRole('radio', {
      name: 'Kotak memerlukan waktu lebih lama untuk tiba di tujuan yang sama',
      exact: true,
    })
    .check()
  await page.getByRole('button', { name: 'Tandai selesai', exact: true }).click()
  await page.locator('.lesson-pagination').getByRole('link').last().click()
  await expect(page).toHaveURL(/learn\/orientation/)
  await page.getByRole('button', { name: 'Periksa tantangan', exact: true }).click()
  await expect(page.getByText('Jalankan kode terbarumu dahulu.', { exact: true })).toBeVisible()
  await page.locator('.cm-content').fill(getPracticeLesson('orientation')!.solution)
  await page.getByRole('button', { name: 'Jalankan kode', exact: true }).click()
  await expect(page.getByText('Kode berhasil dijalankan', { exact: true })).toBeVisible()
  await page.getByRole('slider', { name: 'Progres animasi', exact: true }).fill('100')
  await expect
    .poll(() =>
      page
        .frameLocator('iframe')
        .locator('.box')
        .evaluate(el => new DOMMatrix(getComputedStyle(el).transform).m41),
    )
    .toBe(240)
  await page.getByRole('button', { name: 'Periksa tantangan', exact: true }).click()
  await expect(
    page.getByText('Berhasil. Kamu sudah menerapkan idenya!', { exact: true }),
  ).toBeVisible()
  await page.reload()
  await expect(page.getByRole('button', { name: 'Pelajaran selesai', exact: true })).toBeDisabled()
  await expect(page.locator('.cm-content')).toContainText('240')
  await page.getByRole('button', { name: /Switch to English/ }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page).toHaveURL(/learn\/orientation/)
  await expect(
    page.getByRole('heading', { name: 'One box, many possibilities', exact: true }),
  ).toBeVisible()
  expect(errors).toEqual([])
})

for (const lesson of practiceLessons) {
  test(`real GSAP preview and challenge: ${lesson.id}`, async ({ page }) => {
    await page.goto(`/learn/${lesson.id}`)
    await page.getByRole('button', { name: 'Jalankan kode', exact: true }).click()
    await expect(page.getByText('Kode berhasil dijalankan', { exact: true })).toBeVisible()
    await page.getByRole('button', { name: 'Periksa tantangan', exact: true }).click()
    await expect(
      page.getByText('Belum sesuai. Coba satu perubahan lagi.', { exact: true }),
    ).toBeVisible()
    await page.locator('.cm-content').fill(lesson.solution)
    await page.getByRole('button', { name: 'Jalankan kode', exact: true }).click()
    await expect(page.getByText('Kode berhasil dijalankan', { exact: true })).toBeVisible()
    const frame = page.frameLocator('iframe[title="Preview animasi GSAP"]')
    if (['click', 'overwrite'].includes(lesson.id))
      await frame.getByRole('button', { name: 'Animasikan kotak', exact: true }).click()
    if (['context', 'project-menu'].includes(lesson.id))
      await frame.getByRole('button', { name: 'Coba interaksi', exact: true }).click()
    if (lesson.id === 'callbacks') await expect(frame.locator('.status')).toHaveText('Complete')
    if (lesson.id === 'hover')
      await frame.getByRole('button', { name: 'Fokus kotak', exact: true }).click()
    if (lesson.id === 'project')
      await frame.getByRole('button', { name: 'Ulangi cerita', exact: true }).click()
    await expect(async () => {
      await page.getByRole('button', { name: 'Periksa tantangan', exact: true }).click()
      await expect(
        page.getByText('Berhasil. Kamu sudah menerapkan idenya!', { exact: true }),
      ).toBeVisible({ timeout: 200 })
    }).toPass({ timeout: 4000 })
    await page.getByRole('button', { name: 'Coba variasi', exact: true }).click()
    await page.getByRole('button', { name: 'Jalankan kode', exact: true }).click()
    await expect(page.getByText('Kode berhasil dijalankan', { exact: true })).toBeVisible()
  })
}

test('broken code stays recoverable and cannot access parent browser storage', async ({ page }) => {
  await page.goto('/learn/to')
  await page.locator('.cm-content').fill('gsap.to(".box", { x: 120 ')
  await page.getByRole('button', { name: 'Jalankan kode', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('Periksa sintaks')
  await expect(
    page.getByRole('heading', { name: 'Menuju keadaan baru dengan to()', exact: true }),
  ).toBeVisible()
  await page.locator('.cm-content').fill('parent.localStorage.getItem("ranmotion.progress.v1");')
  await page.getByRole('button', { name: 'Jalankan kode', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText(/SecurityError|Blocked a frame/)
  await page.getByRole('button', { name: 'Reset contoh', exact: true }).click()
  await expect(page.getByRole('alert')).toHaveCount(0)
  await page.getByRole('button', { name: 'Jalankan kode', exact: true }).click()
  await expect(page.getByText('Kode berhasil dijalankan', { exact: true })).toBeVisible()
})

test('timeline scrub follows actual tracks and isolated scroll does not move the page', async ({
  page,
}) => {
  await page.goto('/playground?example=overlap')
  await page.getByRole('button', { name: 'Jalankan kode', exact: true }).click()
  await expect(page.locator('.timeline-bar')).toHaveCount(3)
  await page.getByRole('slider', { name: 'Progres animasi', exact: true }).fill('50')
  await expect(page.locator('.playback-controls output')).toHaveText('50%')
  await page.getByRole('combobox', { name: 'MULAI DARI SEBUAH CONTOH', exact: true }).click()
  await page.getByRole('option', { name: /^Scroll sebagai playhead/ }).click()
  await expect(page).toHaveURL(/example=scrub/)
  await page.getByRole('button', { name: 'Jalankan kode', exact: true }).click()
  await expect(page.getByText('Kode berhasil dijalankan', { exact: true })).toBeVisible()
  const slider = page.getByRole('slider', { name: 'Progres scroll', exact: true })
  await slider.scrollIntoViewIfNeeded()
  const initialY = await page.evaluate(() => window.scrollY)
  await slider.fill('60')
  await expect
    .poll(async () =>
      Number((await page.locator('.playback-controls output').textContent())?.replace('%', '')),
    )
    .toBeGreaterThanOrEqual(59)
  expect(await page.evaluate(() => window.scrollY)).toBe(initialY)
  await expect(page.frameLocator('iframe').locator('.box')).toHaveCSS('transform', /matrix/)
  await page.getByRole('button', { name: 'Berhenti', exact: true }).click()
  const transform = await page
    .frameLocator('iframe')
    .locator('.box')
    .evaluate(el => getComputedStyle(el).transform)
  await page
    .frameLocator('iframe')
    .locator('.scroll-scene')
    .evaluate(el => {
      el.scrollTop += 80
    })
  await expect(page.frameLocator('iframe').locator('.box')).toHaveCSS('transform', transform)
  await page.getByRole('button', { name: 'Lanjutkan animasi', exact: true }).click()
  await expect(page.frameLocator('iframe').locator('.box')).not.toHaveCSS('transform', transform)
})

test('reduced motion displays a static result and search is keyboard accessible', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/learn/to')
  await page.getByRole('button', { name: 'Jalankan kode', exact: true }).click()
  await expect(page.getByText('Kode berhasil dijalankan', { exact: true })).toBeVisible()
  await expect(page.locator('.playback-controls output')).toHaveText('100%')
  await expect(page.getByRole('button', { name: 'Lanjutkan animasi', exact: true })).toBeDisabled()
  await page.keyboard.press('ControlOrMeta+k')
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByRole('textbox', { name: 'Cari materi', exact: true }).fill('stagger')
  await page.getByRole('dialog').getByRole('link').first().click()
  await expect(page).toHaveURL(/learn\/stagger/)
})

test('desktop and mobile pages remain within the viewport', async ({ page }) => {
  test.setTimeout(180000)
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 })
    for (const path of [
      '/',
      '/learn',
      '/learn/gsap-foundations',
      '/learn/animation-blueprint',
      '/learn/to',
      '/playground?example=pin',
      '/challenges',
      '/progress',
      '/reference',
    ]) {
      await page.goto(path)
      await expect(page.locator('h1')).toBeVisible()
      if (path.includes('playground') || path === '/learn/to')
        await expect(page.locator('.motion-lab')).toBeVisible()
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      )
      const outliers =
        overflow > 1
          ? await page.evaluate(() =>
              [...document.querySelectorAll('body *')]
                .filter(
                  el =>
                    el.getBoundingClientRect().right > innerWidth + 1 &&
                    getComputedStyle(el).position !== 'fixed',
                )
                .slice(0, 8)
                .map(el => ({
                  tag: el.tagName,
                  class: el.className,
                  width: el.getBoundingClientRect().width,
                })),
            )
          : []
      expect(overflow, `${width}px ${path}: ${JSON.stringify(outliers)}`).toBeLessThanOrEqual(1)
    }
  }
})

test('blocked storage falls back to session progress and controls edit the same code', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new DOMException('Storage blocked', 'SecurityError')
    }
    Storage.prototype.setItem = () => {
      throw new DOMException('Storage blocked', 'SecurityError')
    }
  })
  await page.goto('/learn/to')
  await expect(
    page.getByText('Penyimpanan browser tidak tersedia. Progres hanya bertahan selama sesi ini.', {
      exact: true,
    }),
  ).toBeVisible()
  await page.getByRole('slider', { name: 'Jarak', exact: true }).fill('240')
  await page.getByRole('slider', { name: 'Durasi', exact: true }).fill('2')
  await expect(page.locator('.cm-content')).toContainText('distance = 240')
  await expect(page.locator('.cm-content')).toContainText('duration = 2')
  await page.getByRole('button', { name: 'Jalankan kode', exact: true }).click()
  await expect(page.getByText('Kode berhasil dijalankan', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Periksa tantangan', exact: true }).click()
  await expect(
    page.getByText('Berhasil. Kamu sudah menerapkan idenya!', { exact: true }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Reset contoh', exact: true }).click()
  await expect(page.locator('.cm-content')).toContainText('distance = 180')
})

test('code tabs support arrow keys and the latest draft follows the learner to the playground', async ({
  page,
}) => {
  await page.goto('/learn/to')
  await page.getByRole('tab', { name: 'JavaScript', exact: true }).focus()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByRole('tab', { name: 'HTML', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  )
  await page.keyboard.press('End')
  await expect(page.getByRole('tab', { name: 'CSS', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  )
  await page.keyboard.press('Home')
  await page.getByRole('button', { name: 'Beri aku petunjuk', exact: true }).click()
  await page.getByRole('button', { name: 'Beri aku petunjuk', exact: true }).click()
  await page.getByText('Lihat satu contoh jawaban', { exact: true }).click()
  await page.getByRole('button', { name: 'Gunakan contoh ini di editor', exact: true }).click()
  await expect(page.locator('.cm-content')).toContainText('distance = 240')
  await page.getByRole('link', { name: 'Buka di playground', exact: true }).click()
  await expect(page).toHaveURL(/playground\?example=to/)
  await expect(page.locator('.cm-content')).toContainText('duration = 2')
  await expect(page.locator('.cm-content')).toContainText('distance = 240')
})

test('a mixed timeline and scroll project resumes both parts after stopping', async ({ page }) => {
  await page.goto('/playground?example=project')
  await page.getByRole('slider', { name: 'Durasi', exact: true }).fill('3')
  await page.getByRole('button', { name: 'Jalankan kode', exact: true }).click()
  await expect(page.getByText('Kode berhasil dijalankan', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Berhenti', exact: true }).click()
  const kicker = page.frameLocator('iframe').locator('.project-kicker')
  const stopped = await kicker.evaluate(el => getComputedStyle(el).transform)
  await page.getByRole('button', { name: 'Lanjutkan animasi', exact: true }).click()
  await expect(kicker).not.toHaveCSS('transform', stopped)
})

test('a beginner can predict, inspect code, open a glossary, and compare a variation', async ({
  page,
}) => {
  await page.goto('/learn/orientation')
  await page.getByRole('radio', { name: /Kotak lebih jauh/ }).check()
  await expect(page.getByText('Coba lihat dari sisi ini.', { exact: true })).toBeVisible()
  await page.getByRole('radio', { name: /Animasi lebih lama/ }).check()
  await expect(page.getByText('Ya, kamu menangkap idenya.', { exact: true })).toBeVisible()
  await page.getByRole('tab', { name: 'Baca kodenya', exact: true }).click()
  await expect(page.locator('.coach-code-line.is-highlighted')).toContainText('const distance')
  await page.getByRole('button', { name: 'Bagian kode berikutnya', exact: true }).click()
  await expect(page.locator('.coach-code-line.is-highlighted')).toContainText('gsap.to(')
  await page.getByRole('tab', { name: 'Kamus mini', exact: true }).click()
  await page.locator('.mini-glossary summary').filter({ hasText: 'selector' }).click()
  await expect(page.locator('.mini-glossary details[open]')).toContainText('class box')
  await page.locator('.guided-steps input').first().check()
  await expect(page.getByText('1/3 langkah dicoba', { exact: true })).toBeVisible()
  await page
    .locator('.cm-content')
    .fill(getPracticeLesson('orientation')!.code.replace('duration = 1.2', 'duration = 1.8'))
  await page.getByRole('button', { name: 'Coba variasi', exact: true }).click()
  await expect(page.locator('.cm-content')).toContainText('duration = 2.4')
  await page.getByRole('button', { name: 'Kembali ke kode saya', exact: true }).click()
  await expect(page.locator('.cm-content')).toContainText('duration = 1.8')
  await page.getByRole('button', { name: 'Coba variasi', exact: true }).click()
  await page.getByRole('button', { name: 'Jalankan kode', exact: true }).click()
  await expect(page.getByText('Kode berhasil dijalankan', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Contoh awal', exact: true }).click()
  await expect(page.locator('.cm-content')).toContainText('duration = 1.2')
  await page.getByRole('button', { name: /Switch to English/ }).click()
  await expect(page.getByRole('tab', { name: 'Mini glossary', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  )
  await expect(page.locator('.mini-glossary details[open]')).toContainText(
    'An address for HTML elements',
  )
  await page.goto('/learn/coordinates')
  await expect(page.locator('.guided-steps input:checked')).toHaveCount(0)
  await expect(page.getByRole('tab', { name: 'Predict first', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  )
})

test('responsive animation uses the preview viewport and honors the system motion preference', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/playground?example=match-media')
  await page.getByRole('button', { name: 'Jalankan kode', exact: true }).click()
  await expect(page.getByText('Kode berhasil dijalankan', { exact: true })).toBeVisible()
  await page.getByRole('slider', { name: 'Progres animasi', exact: true }).fill('0')
  await expect
    .poll(() =>
      page
        .frameLocator('iframe')
        .locator('.item')
        .first()
        .evaluate(el => Math.round(new DOMMatrix(getComputedStyle(el).transform).m42)),
    )
    .toBe(60)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByRole('button', { name: 'Jalankan kode', exact: true }).click()
  await expect(page.getByText('Kode berhasil dijalankan', { exact: true })).toBeVisible()
  await page.getByRole('slider', { name: 'Progres animasi', exact: true }).fill('0')
  await expect
    .poll(() =>
      page
        .frameLocator('iframe')
        .locator('.item')
        .first()
        .evaluate(el => Math.round(new DOMMatrix(getComputedStyle(el).transform).m42)),
    )
    .toBe(25)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/learn/reduced-motion')
  const lesson = getPracticeLesson('reduced-motion')!
  await page.locator('.cm-content').fill(lesson.solution)
  await page.getByRole('button', { name: 'Jalankan kode', exact: true }).click()
  await expect(page.getByText('Kode berhasil dijalankan', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Periksa tantangan', exact: true }).click()
  await expect(
    page.getByText('Berhasil. Kamu sudah menerapkan idenya!', { exact: true }),
  ).toBeVisible()
  await expect(page.frameLocator('iframe').locator('.card').first()).toHaveCSS('opacity', '1')
})

test('capture representative desktop and mobile screens', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/')
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({ path: '.artifacts/home-desktop.png', fullPage: true })
  await page.screenshot({ path: '.artifacts/home-desktop-viewport.png' })
  await page.goto('/learn/timeline')
  await page.locator('.lesson-coach').screenshot({ path: '.artifacts/learning-coach-desktop.png' })
  await page.getByRole('button', { name: 'Jalankan kode', exact: true }).click()
  await expect(page.locator('.timeline-bar')).toHaveCount(3)
  await page.getByRole('slider', { name: 'Progres animasi', exact: true }).fill('45')
  await page.locator('.motion-lab').screenshot({ path: '.artifacts/lab-desktop.png' })
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({ path: '.artifacts/lesson-desktop.png', fullPage: true })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({ path: '.artifacts/home-mobile.png', fullPage: true })
  await page.screenshot({ path: '.artifacts/home-mobile-viewport.png' })
  await page.goto('/playground?example=scrub')
  await page.getByRole('button', { name: 'Jalankan kode', exact: true }).click()
  await expect(page.getByText('Kode berhasil dijalankan', { exact: true })).toBeVisible()
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({ path: '.artifacts/playground-mobile.png', fullPage: true })
  await page.goto('/learn/motion-path')
  await page.getByRole('tab', { name: 'Baca kodenya', exact: true }).click()
  await page.locator('.lesson-coach').screenshot({ path: '.artifacts/code-coach-mobile.png' })
  await page.getByRole('button', { name: 'Jalankan kode', exact: true }).click()
  await expect(page.getByText('Kode berhasil dijalankan', { exact: true })).toBeVisible()
  await page.locator('.motion-lab').screenshot({ path: '.artifacts/motionpath-mobile.png' })
})
