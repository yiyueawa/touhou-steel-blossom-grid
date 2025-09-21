# 东方花硬种 - Web版使用指南

## 🌸 欢迎使用东方花硬种九宫格生成器！

这是一个专为东方Project粉丝设计的Web应用，可以将您的图片与精美的东方角色图片组合成独特的九宫格。

## 🚀 快速开始

### 1. 启动Web服务
```bash
# 方法1：使用启动脚本（推荐）
uv run python start_web.py

# 方法2：直接启动Flask应用
uv run python app.py
```

### 2. 访问Web界面
在浏览器中打开：http://localhost:5001

### 3. 上传图片
- 点击上传区域或拖拽图片文件
- 支持JPG、PNG、GIF、BMP、TIFF格式
- 文件大小限制：16MB

### 4. 生成九宫格
- 系统自动将您的图片放在九宫格中心
- 周围环绕8张精美的东方角色图片
- 生成高质量1200x1200像素的九宫格

### 5. 下载作品
- 生成完成后可直接下载
- 在"作品展示"页面查看历史作品

## 📁 项目结构

```
东方花硬种/
├── app.py              # Flask Web应用主文件
├── main.py             # 核心九宫格生成逻辑
├── start_web.py        # Web应用启动脚本
├── aone/               # 东方角色图片文件夹
│   ├── 恋.jpg
│   ├── 求.jpg
│   ├── 沙.jpg
│   ├── 猫.jpg
│   ├── 紫.jpg
│   ├── 芙.jpg
│   ├── 花.jpg
│   └── 谁？.jpg
├── templates/          # HTML模板
│   ├── base.html
│   ├── index.html
│   ├── gallery.html
│   └── about.html
├── static/             # 静态资源
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── results/        # 生成的九宫格存储
└── uploads/            # 临时上传文件存储
```

## 🎯 功能特色

### ✨ 核心功能
- **智能缩放**: 保持图片比例和质量
- **中心定位**: 上传的图片自动放在九宫格中心
- **高质量输出**: 1200x1200像素，95%质量
- **多格式支持**: 支持主流图片格式

### 🖥️ Web界面
- **响应式设计**: 支持各种设备尺寸
- **拖拽上传**: 直接拖拽图片上传
- **实时进度**: 显示处理进度
- **作品管理**: 查看和下载历史作品

### 🎨 界面设计
- **东方主题**: 紫色渐变配色方案
- **现代风格**: Bootstrap 5 + 自定义CSS
- **动画效果**: 平滑过渡和悬停效果
- **用户友好**: 直观的操作流程

## 🔧 技术栈

### 后端
- **Python 3.13**: 主要编程语言
- **Flask 3.x**: Web框架
- **Pillow**: 图像处理库
- **Werkzeug**: WSGI工具库

### 前端
- **HTML5**: 页面结构
- **Bootstrap 5**: UI框架
- **JavaScript ES6+**: 交互逻辑
- **Font Awesome**: 图标库

## 🛠️ 开发相关

### 环境要求
- Python 3.13+
- uv (包管理工具)
- 现代浏览器

### 依赖安装
```bash
uv sync
```

### 开发模式启动
```bash
uv run python app.py
```

### 生产环境部署
建议使用 Gunicorn 或 uWSGI 部署：
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5001 app:app
```

## 📝 API接口

### POST /upload
上传图片并生成九宫格

**请求参数:**
- `file`: 图片文件 (multipart/form-data)

**响应示例:**
```json
{
    "success": true,
    "message": "九宫格创建成功！",
    "result_image": "/static/results/touhou_nine_grid_abc123.jpg",
    "user_id": "abc123"
}
```

### GET /gallery
获取作品展示页面

### GET /about
获取关于页面

## 🎨 自定义配置

### 修改九宫格布局
在 `app.py` 的 `create_web_nine_grid` 函数中：
```python
# 当前布局：中间是上传图片
image_order=[0, 1, 2, 3, 8, 4, 5, 6, 7]

# 自定义布局示例
image_order=[8, 1, 2, 3, 0, 4, 5, 6, 7]  # 左上角是上传图片
```

### 添加更多角色图片
将图片放入 `aone/` 文件夹即可自动识别

### 修改输出质量
在 `main.py` 的 `create_nine_grid` 函数中：
```python
grid_image.save(output_path, quality=95)  # 调整quality参数
```

## 🐛 常见问题

### 1. 端口被占用
```
Address already in use: Port 5000 is in use
```
**解决方案**: 修改 `app.py` 中的端口号或关闭占用端口的程序

### 2. 图片数量不足
```
需要至少8张预设图片
```
**解决方案**: 确保 `aone/` 文件夹中有至少8张图片

### 3. 上传失败
**可能原因**:
- 文件格式不支持
- 文件大小超过16MB
- 网络连接问题

### 4. 生成的九宫格质量模糊
**解决方案**: 
- 使用更高分辨率的原图
- 调整 `grid_size` 参数增加输出尺寸

## 📞 技术支持

如遇到技术问题，请检查：
1. Python环境是否正确配置
2. 依赖是否正确安装
3. 图片文件是否存在且格式正确
4. 端口是否被占用

## 🎉 享受创作

现在您可以开始创作专属的东方九宫格了！

- 上传您喜欢的图片
- 与精美的东方角色图片组合
- 分享您的创意作品

祝您使用愉快！ ✨