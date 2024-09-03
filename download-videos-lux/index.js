import fs from 'node:fs'
import * as utils from '../src/utils'
import { runCommand } from '../src/utils'
import * as core from '@actions/core'
import childProcess from 'node:child_process'

const tempDir = 'temp'
const downloadsDir = 'downloads'
const batchFilePath = 'batch-file.txt'
const ARGS = JSON.parse(process.env.ARGS)

const commandSupplier = {
  /**
   * 下载 lux
   */
  downloadLux() {
    const command = 'uname -m'
    core.info('执行命令: ' + command)
    const stdout = childProcess.execSync(command).toString().trim()
    core.info('命令输出结果: ' + stdout)
    let arch = ''
    if (stdout === 'x86_64') {
      arch = 'x86_64'
    } else if (stdout === 'aarch64') {
      arch = 'arm64'
    } else if (stdout === 'armv6l') {
      arch = 'armv6'
    } else if (['i386', 'i486', 'i586', 'i686'].includes(stdout)) {
      arch = 'i386'
    }
    if (!arch) throw new Error(`unknown arch: ${stdout}`)
    const url = `https://github.com/iawia002/lux/releases/download/v0.24.1/lux_0.24.1_Linux_${arch}.tar.gz`
    return `curl -kL -o ${utils.cmdEscape(`${tempDir}/lux.tar.gz`)} ${utils.cmdEscape(url)}`
  },
  /**
   * 运行 lux
   */
  lux() {
    const availableOptions = ['-F', '-p', '-items', '-c', '-n', '-retry']
    const options = {
      '-o': downloadsDir,
      '-n': 1
    }
    const param = { hasBatchFile: false, hasPlaylist: false, urls: [] }
    const luxArgs = ARGS.lux
    if (!luxArgs) {
      throw new Error('缺少必须的 lux 对象')
    }
    for (const op of availableOptions) {
      if (luxArgs[op]) {
        if (op === '-F') {
          param.hasBatchFile = true
          param.urls = luxArgs[op]
          options[op] = batchFilePath
        } else {
          if (op === '-p') param.hasPlaylist = true
          options[op] = utils.cmdEscape(luxArgs[op])
        }
      }
    }
    if (!param.hasPlaylist) delete options['-items']
    const optionStr = Object.entries(options).map(([k, v]) => `${k} ${v}`).join(' ')
    if (param.hasBatchFile) {
      if (param.urls && Array.isArray(param.urls)) {
        fs.writeFileSync(batchFilePath, param.urls.join('\n'), 'utf8')
      } else {
        throw new Error(`-F 参数必须是视频链接数组`)
      }
    } else if (!param.hasPlaylist) {
      throw new Error('-F 和 -p 参数必须至少指定其中一个')
    }
    return `lux ${optionStr}`
  },
  transfer() {
    return utils.transfer(ARGS)
  }
}

runCommand(commandSupplier)
