import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const playwrightCli = require.resolve('@playwright/test/cli')
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const env = {
  ...process.env,
  PLAYWRIGHT_BROWSERS_PATH: path.join(projectRoot, '.playwright-browsers'),
}

const result = spawnSync(process.execPath, [playwrightCli, ...process.argv.slice(2)], {
  cwd: projectRoot,
  env,
  stdio: 'inherit',
})

process.exitCode = result.status ?? 1
