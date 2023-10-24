# github-action-tasks
Performing tasks using GitHub Action.

利用 Github Action 执行任务。

## 任务列表

- [下载视频](./download-videos)
- [人声分离](./separate-audios)

## 使用

- 通过 [issue](https://github.com/pansong291/github-action-tasks/issues) 触发流程，仅限创建 issue 和创建 issue 评论
- 等待 github action 执行成功，查阅执行日志，找到压缩包下载链接

具体参数参阅 [任务列表](#任务列表)。

## 备注

### 关于大文件输出
可借鉴 [Borber/Grow](https://github.com/Borber/Grow) 项目，利用 [Mikubill/transfer](https://github.com/Mikubill/transfer) ，把 Github Actions 输出的大文件上传到文件传输服务（如 [Transfer.sh](https://transfer.sh/) 等）上，再从传输服务处下载。经测试，下载速度比较快。[Testing by stl](https://github.com/Sweetlemon68/github-actions-youtube-dl)
