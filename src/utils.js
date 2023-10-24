import url from 'node:url'

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
 * 获取随机标识符
 * @param len 长度
 */
export function randomWord(len = 8) {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  len = Math.floor(Math.abs(len))
  let result = ''
  while (len > 0) {
    const r = Math.random()
    let n = r * characters.length
    if (n < 10 && !result) n = r * (characters.length - 10) + 10
    result += characters.charAt(Math.floor(n))
    len--
  }
  return result
}
