import shutil, os, subprocess

ffmpeg_path = shutil.which("ffmpeg")
print("ffmpeg path:", ffmpeg_path)

if not ffmpeg_path:
    # check common paths
    paths = [
        r"C:\Program Files\ffmpeg\bin\ffmpeg.exe",
        r"C:\ffmpeg\bin\ffmpeg.exe",
        r"C:\ProgramData\chocolatey\bin\ffmpeg.exe",
        r"C:\Users\ambde\AppData\Local\Microsoft\WinGet\Packages",
    ]
    for p in paths:
        if os.path.exists(p):
            print("Found at:", p)
