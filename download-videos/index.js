import * as core from '@actions/core'
import fs from 'node:fs'
import { randomWord } from '../src/utils'

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
      '--format': 'bestvideo+bestaudio',
      '--output': 'downloads/%(title)s_%(id)s.%(ext)s'
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
  }
}

const ME = {
  'prepare-env': (key) => {
    const supplier = commandSupplier[key]
    if (supplier) {
      core.exportVariable('COMMANDS', supplier())
    } else if (key === 'RANDOM_NAME') {
      core.exportVariable(key, randomWord())
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
