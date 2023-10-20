import os
import subprocess

# 指定目录路径
directory = "audios"

# 获取目录下的全部文件
files = os.listdir(directory)

# 拼接相对路径并用空格隔开
file_paths = " ".join([os.path.join(directory, file) for file in files])

# 执行Shell命令，获取输出结果
result = subprocess.run("spleeter separate \\\n -o audio_output \\\n -f {foldername}/{filename}_{instrument}.{codec} \\\n " + file_paths, shell=True, capture_output=True, text=True)

# 打印输出结果
print(result.stdout)