import childProcess from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import * as core from '@actions/core'
import { downloadFile, getFileNameFromURL } from '../src/utils'

main()

async function main() {
  try {
    const ARGS = JSON.parse(process.env.ARGS)
    await prepareAudioFiles(ARGS)
    const command = `spleeter separate ${getOptionString(ARGS)} ${getFilePathString()}`
    core.info('执行命令:\n' + command)
    const stdout = childProcess.execSync(command, { env: getEnv() })
    core.info('命令输出结果:\n' + stdout)
  } catch (e) {
    core.setFailed(e)
  }
}

/**
 * 准备音频文件
 */
async function prepareAudioFiles(args) {
  const { urls, zip } = args.download
  if (urls && Array.isArray(urls)) {
    fs.mkdirSync('audios', { recursive: true })
    for (let i = 0; i < urls.length; i++) {
      await downloadFile(urls[i], `audios/audio_${i}_${getFileNameFromURL(urls[i])}`)
    }
  } else if (zip) {
    fs.mkdirSync('downloads', { recursive: true })
    await downloadFile(zip, 'downloads/archive.zip')
    childProcess.execSync('unzip -q -o -d audios/ downloads/archive.zip')
  }
}

/**
 * 获取可用参数选项
 */
function getOptionString(args) {
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
function getFilePathString() {
  const directory = 'audios'
  const files = fs.readdirSync(directory)
  return files.map(fn => escapePath(path.join(directory, fn))).join(' ')
}

/**
 * 转义文件路径
 */
function escapePath(p) {
  return `'${p.replaceAll(`'`, `'\\''`)}'`
}

/**
 * 获取环境变量
 * @see https://github.com/deezer/spleeter/issues/873
 */
function getEnv() {
  const env = {}
  const excludes = ['GITHUB_HOST', 'GITHUB_REPOSITORY', 'GITHUB_RELEASE']
  Object.entries(process.env).forEach(([k, v]) => {
    if (!excludes.includes(k)) env[k] = v
  })
  return env
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
