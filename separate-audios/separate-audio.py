import os
import subprocess

# 指定目录路径
directory = "audios"

# 获取目录下的全部文件
files = os.listdir(directory)

# 拼接相对路径并用空格隔开
file_paths = " ".join([os.path.join(directory, file) for file in files])

command = "spleeter separate -o audio_output -f {foldername}/{filename}_{instrument}.{codec} " + file_paths

print(command)

# 执行Shell命令，获取输出结果
result = subprocess.run(command, shell=True, capture_output=True, text=True)

# 打印输出结果
print(result.stdout)