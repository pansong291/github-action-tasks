import * as fs from 'node:fs'
import * as os from 'node:os'
import * as core from '@actions/core'

try {
  const args = process.env.ARGS
  core.info('received args: ' + args)
  const json = JSON.parse(args)
  const data = Object.entries(json).map(([k, v]) => `${k}=${v}${os.EOL}`).join('')
  core.info('convert to env state:' + os.EOL + data)
  fs.appendFileSync(process.env.GITHUB_ENV, data, 'utf8')
} catch (e) {
  core.error(e)
}
