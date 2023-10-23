import fs from 'node:fs'
import path from 'node:path'
import * as core from '@actions/core'
import { getFileNameFromURL } from '../src/utils'

const audiosDirectory = 'audios'

const ME = {
  'prepare-env': (key) => {
    const ARGS = JSON.parse(process.env.ARGS)
    switch (key) {
      case 'DOWNLOAD_OPTIONS':
        core.exportVariable(key, getDownloadOptions(ARGS))
        break
      case 'SPLEETER_OPTIONS':
        core.exportVariable(key, getSpleeterOptions(ARGS))
        break
      case 'FILE_PATHS':
        core.exportVariable(key, getFilePaths())
        break
      default:
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
 * 获取下载参数
 */
function getDownloadOptions(args) {
  const { urls, zip } = args.download
  if (urls && Array.isArray(urls)) {
    const list = []
    for (let i = 0; i < urls.length; i++) {
      const ep = escapePath(`${audiosDirectory}/audio_${i}_${getFileNameFromURL(urls[i])}`)
      list.push(`-o ${ep} ${escapePath(urls[i])}`)
    }
    return list.join(' ')
  } else if (zip) {
    core.exportVariable('FILE_ARCHIVE', 'zip')
    return `-o downloads/archive.zip ${zip}`
  }
}

/**
 * 获取可用参数选项
 */
function getSpleeterOptions(args) {
  const availableOptions = ['-b', '-c', '-d', '-s', '-f', '-p']
  const options = {
    '-o': 'audio_output',
    '-f': '{filename}_{instrument}.{codec}'
  }
  const spleeterArgs = args.spleeter
  if (spleeterArgs) {
    for (const op of availableOptions) {
      if (spleeterArgs[op]) options[op] = spleeterArgs[op]
    }
  }
  return Object.entries(options).map(([k, v]) => `${k} ${v}`).join(' ')
}

/**
 * 获取音频文件路径
 */
function getFilePaths() {
  const files = fs.readdirSync(audiosDirectory)
  return files.map(fn => escapePath(path.join(audiosDirectory, fn))).join(' ')
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
