import fs from 'node:fs'
import path from 'node:path'
import * as core from '@actions/core'
import { getFileNameFromURL } from '../src/utils'

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
    const url = ARGS.download.url
    if (url) {
      const ep = escapePath(`${downloadsDir}/audio_${getFileNameFromURL(url)}`)
      return `curl -kL -o ${ep} ${escapePath(url)}`
    }
    throw new Error(`download 参数中未指定 url`)
  },
  /**
   * ffmpeg 分割音频
   */
  ffmpegSplit() {
    const split = ARGS.ffmpeg?.split || 600
    const files = fs.readdirSync(downloadsDir)
    const filePath = files.map(fn => escapePath(path.join(downloadsDir, fn)))[0]
    return `ffmpeg -i ${filePath} -f segment -segment_time ${split} -c copy ${segmentsDir}/%d.${ARGS.download.ext}`
  },
  /**
   * 运行 spleeter
   */
  spleeter() {
    const availableOptions = ['-b', '-c', '-p']
    const options = {
      '-o': separatesDir,
      '-d': '660', // 11 分钟，实际上音频的长度需要小于这个值
      '-f': '{instrument}/{filename}.{codec}',
      '-c': 'wav'
    }
    const spleeterArgs = ARGS.spleeter
    if (spleeterArgs) {
      for (const op of availableOptions) {
        if (spleeterArgs[op]) options[op] = spleeterArgs[op]
      }
    }
    const optionStr = Object.entries(options).map(([k, v]) => `${k} ${v}`).join(' ')
    const files = fs.readdirSync(segmentsDir)
    const filePaths = files.map(fn => escapePath(path.join(segmentsDir, fn)))
    return filePaths.map(p => `spleeter separate ${optionStr} ${p}`).join('\n')
  },
  /**
   * ffmpeg 合并音频
   */
  ffmpegConcat() {
    const cmds = []
    const instruments = ['vocals', 'accompaniment']
    for (const instrument of instruments) {
      const audioFiles = fs.readdirSync(`${separatesDir}/${instrument}`)
      const count = audioFiles.length
      const first = audioFiles[0]
      const ext = first.substring(first.indexOf('.') + 1)
      const segmentPaths = []
      for (let i = 0; i < count; i++) {
        segmentPaths.push(`file '${i}.${ext}'`)
      }
      const filepath = `${separatesDir}/${instrument}/segments.txt`
      fs.writeFileSync(filepath, segmentPaths.join('\n'))
      const originFileName = fs.readdirSync(downloadsDir)[0]
      const outputName = escapePath(`${originFileName}_${instrument}.${ext}`)
      cmds.push(`ffmpeg -f concat -safe 0 -i ${filepath} -c copy ${outputsDir}/${outputName}`)
    }
    return cmds.join('\n')
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

/**
 * 转义文件路径
 */
function escapePath(p) {
  return `'${p.replaceAll(`'`, `'\\''`)}'`
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
