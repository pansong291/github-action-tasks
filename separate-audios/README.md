# 简介

使用 GitHub Actions 分离人声。

## 原理

- [spleeter](https://github.com/deezer/spleeter/)

## 使用

- 通过 [issue](https://github.com/pansong291/github-action-tasks/issues) 触发流程，仅限创建 issue 和创建 issue 评论
- 等待 github action 执行成功，查阅执行日志，找到压缩包下载链接

## 示例
在 [issue](https://github.com/pansong291/github-action-tasks/issues) 提交以下内容（ ``` 符号必须单独占一行）：
````markdown
```json
{
  "run": "separate-audios",
  "args": {
    "download": {
      "url": "https://github.com/pansong291/github-action-tasks/raw/main/test/west-world.mp3",
      "ext": "mp3"
    },
    "ffmpeg": {
      "split": 600
    },
    "spleeter": {
      "-c": "mp3"
    }
  }
}
```
````

- `download` 对象
  - `url` 指定音频文件的下载链接，必填。
  - `ext` 指定输入音频文件的后缀，需要与音频文件的格式匹配，必填。
- `ffmpeg` 对象
  - `split` 指定分段的秒数，用于将音频文件分割成相同时间的分段，以便后续处理，默认为 `600` 秒。
- `spleeter` 对象中仅支持一部分 [spleeter](https://github.com/deezer/spleeter/) 的参数，如下所示：

| 参数 | 值 / 类型 | 说明 | 默认值 |
| ---- | ---- | ---- | ---- |
| -b | TEXT | Audio bitrate to be used for the separated output | `128k` |
| -c | `wav` `mp3` `ogg` `m4a` `wma` `flac` | Audio codec to be used for the separated output | `wav` |
| -p | TEXT | JSON filename that contains params | `spleeter:2stems` |

## 备注

可借鉴 [Grow](https://github.com/Borber/Grow) 项目，利用 [Transfer](https://github.com/Mikubill/transfer) ，把从 Youtube 下载的视频文件上传到文件传输服务（如 [WeTransfer](https://wetransfer.com/) 等）上，再从传输服务处下载。经测试，下载速度比较快。[Testing by stl](https://github.com/Sweetlemon68/github-actions-youtube-dl)
