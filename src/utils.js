import http from 'node:http'
import https from 'node:https'
import fs from 'node:fs'
import url from 'node:url'

export function downloadFile(fileUrl, path) {
  return new Promise((resolve, reject) => {
    const urlObj = url.parse(fileUrl)
    // 判断下载文件协议是否为http
    const protocol = urlObj.protocol

    // 判断下载文件协议是否为http
    if (protocol !== 'http:' && protocol !== 'https:') {
      throw new Error('文件下载链接仅支持 http 和 https 协议')
    }

    // 创建http、https请求
    const request = protocol === 'http:' ? http.request : https.request
    followRedirect(request, urlObj, (res) => {
      if (res.statusCode !== 200) {
        reject(Error(`文件下载请求异常:\n statusCode: ${res.statusCode}\n url: ${fileUrl}`))
        return
      }

      // 创建一个写入流
      const writer = fs.createWriteStream(path)
      // 将响应流导向写入流
      res.pipe(writer)
        .on('finish', () => {
          console.info(`文件下载成功:\n ${fileUrl}\n ${path}`)
          resolve(path)
        })
        .on('error', (err) => reject(`文件写入异常:\n ${err}`))
    }, (err) => {
      reject(`下载文件时发生错误:\n ${err}`)
    })
  })
}

function followRedirect(request, urlObj, callback, onError) {
  const req = request(urlObj, (res) => {
    if (res.statusCode === 302) {
      const req = request(res.headers.location, callback)
      req.on('error', onError)
      req.end()
    } else {
      callback?.(res)
    }
  })
  req.on('error', onError)
  req.end()
}

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
