#!/usr/bin/env python3
"""
东方花硬种 - Web应用启动脚本
快速启动九宫格生成Web服务
"""

import os
import sys
import webbrowser
import time
from threading import Timer


def open_browser():
    """延迟打开浏览器"""
    time.sleep(1.5)  # 等待服务器启动
    webbrowser.open('http://localhost:5001')


def main():
    print("🌸 启动东方花硬种 - 九宫格生成器")
    print("=" * 50)

    # 检查必要的文件夹
    required_dirs = ['static', 'templates', 'static/results', 'aone']
    for dir_name in required_dirs:
        if not os.path.exists(dir_name):
            print(f"❌ 缺少必要文件夹: {dir_name}")
            return

    # 检查图片文件
    import glob
    aone_images = glob.glob('aone/*.jpg') + glob.glob('aone/*.png')
    if len(aone_images) < 8:
        print(f"❌ aone文件夹中需要至少8张图片，当前只有{len(aone_images)}张")
        return

    print(f"✅ 找到 {len(aone_images)} 张东方角色图片")
    print("✅ 所有检查通过")
    print()
    print("🚀 正在启动Web服务器...")
    print("📱 服务地址: http://localhost:5001")
    print("🎯 功能说明: 上传您的图片，生成专属九宫格")
    print()
    print("💡 提示: 按 Ctrl+C 停止服务")
    print("=" * 50)

    # 延迟打开浏览器
    Timer(1.5, open_browser).start()

    # 启动Flask应用
    from app import app
    try:
        app.run(debug=False, host='0.0.0.0', port=5001)
    except KeyboardInterrupt:
        print("\n👋 服务已停止，感谢使用！")
    except Exception as e:
        print(f"\n❌ 启动失败: {e}")


if __name__ == '__main__':
    main()
