import * as core from '@actions/core'

try {
  const args = process.env.ARGS
  core.info('received args: ' + args)
  const json = JSON.parse(args)
  Object.entries(json).forEach(([k, v]) => core.exportVariable(k, v))
} catch (e) {
  core.error(e)
}
