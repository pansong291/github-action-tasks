# 简介

使用 GitHub Actions 分离人声。

## 原理

- [spleeter](https://github.com/deezer/spleeter/)

## 示例
在 [issue](https://github.com/pansong291/github-action-tasks/issues) 提交以下内容（ ``` 符号必须单独占一行）：
````markdown
```json
{
  "run": "separate-audios",
  "args": {
    "download": {
      "urls": [
        "https://github.com/pansong291/github-action-tasks/raw/main/test/west-world.mp3"
      ]
    },
    "ffmpeg": {
      "-segment_time": 300
    },
    "spleeter": {
      "--codec": "mp3"
    },
    "transfer": {
      "--backend": "trs"
    }
  }
}
```
````

- `download` 对象
  - `urls` 音频文件的下载链接数组，不能为空。
- `ffmpeg` 对象
  - `-segment_time` 指定分段的秒数，用于将音频文件分割成相同时间的分段，当执行出错时有可能是音频文件过大导致占用内存过多，可以减少这个值以降低内存占用，默认为 `300` 秒。
- `spleeter` 对象中仅支持一部分 [spleeter](https://github.com/deezer/spleeter/) 的参数，如下所示：

| 参数 | 值 / 类型 | 说明 | 默认值 |
| ---- | ---- | ---- | ---- |
| --bitrate | TEXT | Audio bitrate to be used for the separated output | `128k` |
| --codec | `wav` `mp3` `ogg` `m4a` `wma` `flac` | Audio codec to be used for the separated output | `wav` |
| --params_filename | TEXT | JSON filename that contains params | `spleeter:2stems` |
- `transfer` 对象
  - `--backend` 指定文件传输服务，默认为 `trs`，详见 [Mikubill/transfer](https://github.com/Mikubill/transfer) 。
