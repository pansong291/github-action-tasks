import * as core from '@actions/core'
import * as github from '@actions/github'

const content = getContent(github.context)
try {
  const obj = parseObj(content)
  Object.entries(obj).forEach(([k, v]) => {
    core.info(k + ': ' + v)
    core.setOutput(k, v)
  })
} catch (e) {
  core.error(e)
}

function getContent(context) {
  const eventName = context.eventName
  const payload = context.payload
  core.info('event name: ' + eventName)
  switch (eventName) {
    case 'issue':
      return payload.issue.body
    case 'issue_comment':
      return payload.comment.body
    default:
      const err = new Error('Unsupported event name: ' + eventName)
      core.setFailed(err)
      throw err
  }
}

function parseObj(content) {
  const matchArray = content.match(/(?:^|\n)(```+)[^\n]*\n((?:(?!\1)[\d\D])*)\n\1/)
  const str = matchArray?.[2]
  if (!str) throw new Error('Parameter not found')
  const obj = JSON.parse(str)
  if (!obj?.run) throw Error('No target need to run')
  return { run: obj.run, args: JSON.stringify(obj.args) }
}
