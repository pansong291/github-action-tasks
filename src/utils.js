import url from 'node:url'
import * as github from '@actions/github'

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
