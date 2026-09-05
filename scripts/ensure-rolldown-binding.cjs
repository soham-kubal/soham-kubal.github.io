// Workaround for a known npm optional-dependency bug (npm/cli#4828).
//
// Vite 8 bundles with Rolldown, which ships its native binding as a
// platform-specific optionalDependency (e.g. @rolldown/binding-win32-x64-msvc).
// On this Windows dev machine, Node is slightly below the binding's declared
// `engines` requirement (needs ^20.19.0 || >=22.12.0), and npm silently skips
// installing optionalDependencies it considers "incompatible" for that reason
// — with no error, just a missing native module that breaks `vite build` at
// runtime. This script detects that gap right after install and force-installs
// the exact matching binding package.
//
// It's a no-op everywhere else: other platforms/architectures, or once Node
// is upgraded past the required version (npm will then install the binding
// normally and this script finds it already present).
const { existsSync } = require('node:fs')
const path = require('node:path')
const { execFileSync } = require('node:child_process')

if (process.platform !== 'win32' || process.arch !== 'x64') {
  process.exit(0)
}

const bindingDir = path.join(__dirname, '..', 'node_modules', '@rolldown', 'binding-win32-x64-msvc')
if (existsSync(bindingDir)) {
  process.exit(0)
}

let version
try {
  version = require('../node_modules/rolldown/package.json').version
} catch {
  // rolldown isn't installed (e.g. no longer a dependency) - nothing to fix.
  process.exit(0)
}

console.log(
  `[ensure-rolldown-binding] @rolldown/binding-win32-x64-msvc missing, installing v${version} (npm/cli#4828 workaround)...`,
)
execFileSync(
  'npm',
  ['install', `@rolldown/binding-win32-x64-msvc@${version}`, '--no-save', '--no-audit', '--no-fund'],
  { stdio: 'inherit', shell: true },
)
