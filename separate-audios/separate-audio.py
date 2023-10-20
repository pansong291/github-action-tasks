import os
import subprocess

# 指定目录路径
directory = "audios"

# 获取目录下的全部文件
files = os.listdir(directory)

# 转义文件路径
def escape_path(p):
    return "'" + p.replace("'", "'\\''") + "'"

# 拼接相对路径并用空格隔开
file_paths = " ".join(map(escape_path, [os.path.join(directory, file) for file in files]))

command = "spleeter separate -o audio_output -f {foldername}/{filename}_{instrument}.{codec} " + file_paths

print(command)

# 设置环境变量
env = {}
for key in os.environ:
    env[key] = os.environ[key]
env['GITHUB_REPOSITORY'] = 'deezer/spleeter'

# 执行Shell命令，获取输出结果
try:
    result = subprocess.run(command, shell=True, env=env, check=True, capture_output=True, text=True)
    print("Command executed successfully.")
    print("Command output:\n", result.stdout)
except subprocess.CalledProcessError as e:
    print("Command encountered an error with return code:", e.returncode)
    print("Command error:\n", e.stderr)
    raise e
