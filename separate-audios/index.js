import fs from 'node:fs'
import * as core from '@actions/core'
import * as utils from '../src/utils'

const downloadsDir = 'downloads'
const segmentsDir = 'segments'
const separatesDir = 'separates'
const outputsDir = 'outputs'
const ARGS = JSON.parse(process.env.ARGS)

const commandSupplier = {
  /**
   * 下载文件
   */
  downloadFiles() {
    const urls = ARGS.download.urls
    if (urls && Array.isArray(urls)) {
      return urls.map((url, i) => {
        const ep = utils.cmdEscape(`${downloadsDir}/${i}_${utils.getFileNameFromURL(url)}`)
        return `curl -kL -o ${ep} ${utils.cmdEscape(url)}`
      }).join('\n')
    }
    throw new Error(`download 参数中未指定 urls 数组`)
  },
  /**
   * ffmpeg 分割音频
   */
  ffmpegSplit() {
    const split = ARGS.ffmpeg?.['-segment_time'] || 300
    return fs.readdirSync(downloadsDir).map((f) => {
      const order = f.substring(0, f.indexOf('_'))
      const filePath = utils.cmdEscape(`${downloadsDir}/${f}`)
      return `ffmpeg -i ${filePath} -f segment -segment_time ${split} -c copy ${segmentsDir}/${order}_%d.nut`
    }).join('\n')
  },
  /**
   * 运行 spleeter
   */
  spleeter() {
    const availableOptions = ['--bitrate', '--codec', '--params_filename']
    const options = {
      '--duration': '660', // 11 分钟，实际上音频的长度需要小于这个值
      '--filename_format': '{instrument}/{filename}.{codec}',
      '--codec': 'wav'
    }
    const spleeterArgs = ARGS.spleeter
    if (spleeterArgs) {
      for (const op of availableOptions) {
        if (spleeterArgs[op]) options[op] = spleeterArgs[op]
      }
    }
    const optionStr = Object.entries(options).map(([k, v]) => `${k} ${v}`).join(' ')

    return fs.readdirSync(segmentsDir).map(f => {
      const order = f.substring(0, f.indexOf('_'))
      return `spleeter separate --output_path ${separatesDir}/${order} ${optionStr} ${utils.cmdEscape(`${segmentsDir}/${f}`)}`
    }).join('\n')
  },
  /**
   * ffmpeg 合并音频
   */
  ffmpegConcat() {
    const cmds = []
    const originFileName = {}
    fs.readdirSync(downloadsDir).forEach(f => {
      const order = f.substring(0, f.indexOf('_'))
      originFileName[order] = f
    })
    fs.readdirSync(separatesDir).forEach(order => {
      fs.readdirSync(`${separatesDir}/${order}`).forEach(instrument => {
        const instPath = `${separatesDir}/${order}/${instrument}`
        const audioFiles = fs.readdirSync(instPath)
        const count = audioFiles.length
        const first = audioFiles[0]
        const ext = first.substring(first.indexOf('.') + 1)
        const segmentPaths = []
        for (let i = 0; i < count; i++) {
          segmentPaths.push(`file '${order}_${i}.${ext}'`)
        }
        const filepath = `${instPath}/segments.txt`
        fs.writeFileSync(filepath, segmentPaths.join('\n'))
        const outputName = utils.cmdEscape(`${outputsDir}/${originFileName[order]}_${instrument}.${ext}`)
        cmds.push(`ffmpeg -f concat -safe 0 -i ${filepath} -c copy ${outputName}`)
      })
    })
    return cmds.join('\n')
  },
  transfer() {
    return utils.transfer(ARGS)
  }
}

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

/*
  Usage: spleeter separate [OPTIONS] FILES...

  Arguments:
    FILES...                               List of input audio file path  [required]

  Options:
    -i, --inputs TEXT                      (DEPRECATED) placeholder for deprecated input option

    -a, --adapter TEXT                     Name of the audio adapter to use for audio I/O
                                           [default: spleeter.audio.ffmpeg.FFMPEGProcessAudioAdapter]

    -b, --bitrate TEXT                     Audio bitrate to be used for the separated output
                                           [default: 128k]

    -c, --codec [wav|mp3|ogg|m4a|wma|flac] Audio codec to be used for the separated output
                                           [default: wav]

    -d, --duration FLOAT                   Set a maximum duration for processing audio
                                           (only separate offset + duration first seconds of the input file)
                                           [default: 600.0]

    -s, --offset FLOAT                     Set the starting offset to separate audio from
                                           [default: 0.0]

    -o, --output_path TEXT                 Path of the output directory to write audio files in
                                           [default: /tmp/separated_audio]

    -f, --filename_format TEXT             Template string that will be formatted to generated output filename.
                                           Such template should be Python formattable string, and could use {filename},
                                           {instrument}, and {codec}variables
                                           [default: {filename}/{instrument}.{codec}]

    -p, --params_filename TEXT             JSON filename that contains params
                                           [default: spleeter:2stems]

    --mwf                                  Whether to use multichannel Wiener filtering for separation
                                           [default: False]

    --verbose                              Enable verbose logs
                                           [default: False]

    --help                                 Show this message and exit.
 */
