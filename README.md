# github-action-tasks

Performing tasks using GitHub Actions.

利用 Github Actions 执行任务。

## 任务列表

- [使用 yt-dlp 下载视频](./download-videos-dlp)
- [使用 lux 下载视频](./download-videos-lux)
- [使用 spleeter 分离人声](./separate-audios)

## 使用

- 通过 [issue](https://github.com/pansong291/github-action-tasks/issues) 触发流程，仅限「创建 issue」和「创建 issue 评论」
- 等待 Github Actions 执行成功，查阅执行日志，找到压缩包下载链接

具体参数参阅 [任务列表](#任务列表)。

## 备注

### 关于大文件输出

可借鉴 [Borber/Grow](https://github.com/Borber/Grow) 项目，利用 [Mikubill/transfer](https://github.com/Mikubill/transfer) ，
把 Github Actions 输出的大文件上传到文件传输服务（如 [Transfer.sh](https://transfer.sh/) 等）上，再从传输服务处下载。
经测试，下载速度比较快。[Testing by stl](https://github.com/Sweetlemon68/github-actions-youtube-dl)

### 关于运行时长

Github Actions 的「作业」最长运行时间是 6 小时，达到这个时间后任务将被强制结束。所以尽量减少运行耗时。
尤其是进行批量操作的时候，尽量分成多个子任务分批运行，这样不仅能避免超时，还能减少总运行时间，更快的完成目标，
因为 Github Actions 是可以同时运行多个任务的。

### 关于运行内存

Github Actions 的各个运行器的运行内存可参阅文档 [Supported runners and hardware resources](https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners/about-github-hosted-runners#supported-runners-and-hardware-resources) 。
但是如果内存占用过高，任务会被强制取消。 关于如何降低运行时的内存占用，请参阅具体任务的相关文档。

### 关于并发任务数

Github Actions 支持的同时运行任务的数量也有限制，具体参阅文档 [Usage limits](https://docs.github.com/en/actions/learn-github-actions/usage-limits-billing-and-administration#usage-limits) 。
