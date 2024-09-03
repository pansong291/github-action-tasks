# 简介

使用 GitHub Actions 运行 [lux](https://github.com/iawia002/lux) 下载视频。

## 原理

- [lux](https://github.com/iawia002/lux)

## 示例
在 [issue](https://github.com/pansong291/github-action-tasks/issues) 提交以下内容（ ``` 符号必须单独占一行）：
````markdown
```json
{
  "run": "download-videos-lux",
  "args": {
    "lux": {
      "--batch-file": [
        "https://www.youtube.com/watch?v=jF3er5lsaeg"
      ],
      "--yes-playlist": "https://www.youtube.com/playlist?list=PL-454Fe3dQH1L38FnKkz_O1CqYx6sKaXk",
      "--recode-video": "mp4"
    },
    "transfer": {
      "--backend": "gg"
    }
  }
}
```
````

- `lux` 对象中仅支持一部分 [lux](https://github.com/iawia002/lux) 的参数，其中 `--batch-file` 参数与 [lux](https://github.com/iawia002/lux) 不同，它应为视频文件的下载链接数组，其余的如下所示：

| 参数 | 说明 | 默认值 |
| ---- | ---- | ---- |
| --yes-playlist | 指定一个播放列表。参见 [Video Selection](https://github.com/yt-dlp/yt-dlp#video-selection) |  |
| --format | 指定下载的媒体格式。参见 [Video Format Options](https://github.com/yt-dlp/yt-dlp#video-format-options) | `best*` |
| --compat-options | 指定合并选项，比如 `no-direct-merge`。参见 [General Options](https://github.com/yt-dlp/yt-dlp#general-options) |  |
| --recode-video | 将视频转码为其他格式，可用值：`avi` `flv` `gif` `mkv` `mov` `mp4` `webm` `aac` `aiff` `alac` `flac` `m4a` `mka` `mp3` `ogg` `opus` `vorbis` `wav`。参见 [Post-Processing Options](https://github.com/yt-dlp/yt-dlp#post-processing-options) |  |
- `transfer` 对象
  - `--backend` 指定文件传输服务，默认为 `trs`，详见 [Mikubill/transfer](https://github.com/Mikubill/transfer) 。
