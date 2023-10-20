import os
import subprocess

# 指定目录路径
directory = "audios"

# 获取目录下的全部文件
files = os.listdir(directory)

# 拼接相对路径并用空格隔开
file_paths = " ".join([os.path.join(directory, file) for file in files])

command = "spleetera separate -o audio_output -f {foldername}/{filename}_{instrument}.{codec}"

print(command)
print(file_paths)

# 设置环境变量
env = {'GITHUB_REPOSITORY': 'deezer/spleeter'}

# 执行Shell命令，获取输出结果
try:
    result = subprocess.run([command, file_paths], shell=True, env=env, check=True, capture_output=True, text=True)
    print("Command executed successfully.")
    print("Command output:\n", result.stdout)
except subprocess.CalledProcessError as e:
    print("Command encountered an error with return code:", e.returncode)
    print("Command error:\n", e.stderr)
    raise e