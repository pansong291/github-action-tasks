import fs from 'node:fs'
import * as utils from '../src/utils'
import { runCommand } from '../src/utils'

const downloadsDir = 'downloads'
const configFilePath = 'config.txt'
const batchFilePath = 'batch-file.txt'
const ARGS = JSON.parse(process.env.ARGS)

const commandSupplier = {
  /**
   * 运行 yt-dlp
   */
  ytDlp() {
    const availableOptions = ['--batch-file', '--yes-playlist', '--format', '--compat-options', '--recode-video']
    const options = {
      '--format': 'best*',
      '--output': `${downloadsDir}/%(title)s_%(id)s.%(ext)s`
    }
    const param = { hasBatchFile: false, hasPlaylist: false, urls: [] }
    const ytDlpArgs = ARGS['yt-dlp']
    if (!ytDlpArgs) {
      throw new Error('缺少必须的 yt-dlp 对象')
    }
    for (const op of availableOptions) {
      if (ytDlpArgs[op]) {
        if (op === '--batch-file') {
          param.hasBatchFile = true
          param.urls = ytDlpArgs[op]
          options[op] = batchFilePath
        } else if (op === '--yes-playlist') {
          param.hasPlaylist = true
          options[op] = ytDlpArgs[op]
        } else {
          options[op] = ytDlpArgs[op]
        }
      }
    }
    const optionStr = Object.entries(options).map(([k, v]) => `${k} ${v}`).join('\n')
    fs.writeFileSync(configFilePath, optionStr, 'utf8')
    if (param.hasBatchFile) {
      if (param.urls && Array.isArray(param.urls)) {
        fs.writeFileSync(batchFilePath, param.urls.join('\n'), 'utf8')
      } else {
        throw new Error(`--batch-file 参数必须是视频链接数组`)
      }
    } else if (!param.hasPlaylist) {
      throw new Error('--batch-file 和 --yes-playlist 参数必须至少指定其中一个')
    }
    return `yt-dlp --config-location ${configFilePath}`
  },
  transfer() {
    return utils.transfer(ARGS)
  }
}

runCommand(commandSupplier)
