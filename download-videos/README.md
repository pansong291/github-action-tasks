# 简介

使用 GitHub Actions 下载 YouTube 视频。原项目 [justjavac/github-actions-youtube-dl](https://github.com/justjavac/github-actions-youtube-dl) 。

## 原理

- [yt-dlp](https://github.com/yt-dlp/yt-dlp)

使用 GitHub Actions 的服务器，从 YouTube 下载视频。将需要下载的视频添加到 playlist.txt 文件中，github action 运行的时候读取 playlist.txt 列表，下载列表中的所有视频，然后打包压缩，再将压缩包上传到文件传输服务。

## 使用

- 点右上角 **Fork** 按钮复制本 GitHub 仓库
- 在自己的项目中，点上方 **Actions** 选项卡进入项目 GitHub Actions 页面, 点击绿色按钮 “**I understand my workflows, go ahead and enable them**” 开启功能
- (可选) 编辑 [config.txt](./config.txt) 文件配置下载选项，具体参阅 [yt-dlp](https://github.com/yt-dlp/yt-dlp)
- 编辑 [playlist.txt](./playlist.txt) 文件，将视频的 url 添加到列表中
- 等待 github action 执行成功，查阅执行日志，找到压缩包下载链接

## 备注

可借鉴 [Grow](https://github.com/Borber/Grow) 项目，利用 [Transfer](https://github.com/Mikubill/transfer) ，把从 Youtube 下载的视频文件上传到文件传输服务（如 [WeTransfer](https://wetransfer.com/) 等）上，再从传输服务处下载。经测试，下载速度比较快。[Testing by stl](https://github.com/Sweetlemon68/github-actions-youtube-dl)
