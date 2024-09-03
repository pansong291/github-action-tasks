import url from 'node:url'
import * as github from '@actions/github'
import * as core from '@actions/core'

export function getFileNameFromURL(fileUrl, def = '') {
  const urlObj = url.parse(fileUrl)
  let name = urlObj.path
  if (name) {
    const spl = name.split('/')
    name = spl[spl.length - 1]
  }
  if (name) return name
  return def
}

/**
 * 转义命令行参数
 */
export function cmdEscape(p) {
  return `'${p.replaceAll(`'`, `'\\''`)}'`
}

/**
 * 执行 transfer
 */
export function transfer(args) {
  const backend = args.transfer?.['--backend'] || 'trs'
  return `curl -sL https://raw.githubusercontent.com/Mikubill/transfer/master/install.sh | sh\n./transfer ${backend} ./artifact_${github.context.runId}.zip`
}

/**
 * 执行命令
 */
export function runCommand(commandSupplier) {
  const ME = {
    'prepare-env': (key) => {
      const supplier = commandSupplier[key]
      if (supplier) {
        core.exportVariable('COMMANDS', supplier())
      } else {
        core.setFailed(`不支持的变量: ${key}`)
      }
    }
  }

  const directive = process.argv[2]
  if (ME[directive]) {
    ME[directive](process.argv[3])
  } else {
    core.setFailed(`未知的指令: ${directive}`)
  }
}
