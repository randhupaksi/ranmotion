import { spawn } from 'node:child_process'
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

const args = process.argv.slice(2)
const runTests =
  args[0] === 'test' && !args.some(arg => ['--list', '--help', '-h', '--version'].includes(arg))
let ownedServer = null
let runner = null

async function serverState() {
  try {
    const response = await fetch('http://127.0.0.1:4173/', { signal: AbortSignal.timeout(1000) })
    const html = await response.text()
    return response.ok && html.includes('RanMotion') ? 'ranmotion' : 'other'
  } catch {
    return 'offline'
  }
}

function stopOwnedProcesses() {
  // Terminate only direct children created by this command. Avoid Windows process-tree teardown.
  if (runner && runner.exitCode === null && !runner.killed) runner.kill()
  if (ownedServer && ownedServer.exitCode === null && !ownedServer.killed) ownedServer.kill()
}
process.once('SIGINT', stopOwnedProcesses)
process.once('SIGTERM', stopOwnedProcesses)

try {
  if (runTests) {
    env.RANMOTION_E2E_MANAGED = '1'
    const state = await serverState()
    if (state === 'other')
      throw new Error(
        'Port 4173 is occupied by another site. Close it or run RanMotion on this port before testing.',
      )
    if (state === 'offline') {
      ownedServer = spawn(
        process.execPath,
        [
          path.join(projectRoot, 'node_modules/vite/bin/vite.js'),
          '--host',
          '127.0.0.1',
          '--port',
          '4173',
          '--strictPort',
        ],
        { cwd: projectRoot, env, stdio: ['ignore', 'pipe', 'pipe'], shell: false },
      )
      ownedServer.stdout.on('data', () => {})
      ownedServer.stderr.on('data', chunk => process.stderr.write(chunk))
      const deadline = Date.now() + 20000
      while ((await serverState()) !== 'ranmotion') {
        if (ownedServer.exitCode !== null || Date.now() > deadline)
          throw new Error('The RanMotion test server could not start on port 4173.')
        await new Promise(resolve => setTimeout(resolve, 200))
      }
    }
  }
  runner = spawn(process.execPath, [playwrightCli, ...args], {
    cwd: projectRoot,
    env,
    stdio: 'inherit',
    shell: false,
  })
  process.exitCode = await new Promise((resolve, reject) => {
    runner.once('error', reject)
    runner.once('exit', code => resolve(code ?? 1))
  })
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Playwright could not start.')
  process.exitCode = 1
} finally {
  stopOwnedProcesses()
  if (ownedServer && ownedServer.exitCode === null)
    await Promise.race([
      new Promise(resolve => ownedServer.once('exit', resolve)),
      new Promise(resolve => setTimeout(resolve, 2000)),
    ])
}
