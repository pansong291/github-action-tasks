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
      "-F": [
        "https://www.youtube.com/watch?v=jF3er5lsaeg"
      ],
      "-p": "https://www.youtube.com/playlist?list=PL-454Fe3dQH1L38FnKkz_O1CqYx6sKaXk",
      "-items": "0,2-4,6"
    },
    "transfer": {
      "--backend": "gg"
    }
  }
}
```
````

- `lux` 对象中仅支持一部分 [lux](https://github.com/iawia002/lux) 的参数，其中 `-F` 参数与 [lux](https://github.com/iawia002/lux) 不同，它应为视频文件的下载链接数组，其余的如下所示：

| 参数 | 说明 | 默认值 |
| ---- | ---- | ---- |
| -p | 指定一个播放列表。 | |
| -items | 要下载的播放列表视频项。用逗号分隔，如 `1,5,8-10,14,17-22` | |
| -c | 设置 Cookie。 | |
| -n | 下载线程数。 | `1` |
| -retry | 下载失败的重试次数。 | `10` |
- `transfer` 对象
  - `--backend` 指定文件传输服务，默认为 `trs`，详见 [Mikubill/transfer](https://github.com/Mikubill/transfer) 。
