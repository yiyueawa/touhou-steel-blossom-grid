# 东方花硬种 - 九宫格生成器 (Touhou Steel Blossom Grid)

一个基于React + TypeScript的纯前端九宫格生成器，让您的图片与东方花硬种的美丽角色一起组成精美的九宫格。

**英文项目名**: `touhou-steel-blossom-grid` - 钢铁花朵网格，寓意坚硬而美丽的花朵组成的九宫格艺术。

## ✨ 特色功能

- 🎨 **纯前端处理** - 图片不会上传到服务器，隐私安全
- 🌐 **多语言支持** - 中文/日文界面切换
- 📱 **响应式设计** - 支持桌面和移动设备
- 🖼️ **智能缩放** - 自动调整图片尺寸和位置
- ⬇️ **一键下载** - 生成的九宫格可直接下载
- 🎯 **零配置** - 开箱即用，无需后端服务器

## 🖥️ 技术栈

- **前端框架**: React 18 + TypeScript
- **UI组件库**: Ant Design
- **国际化**: react-i18next
- **构建工具**: Vite
- **图像处理**: Canvas API

## 📦 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

### 构建部署

```bash
# 构建生产版本
npm run build

# 构建GitHub Pages版本
npm run build:gh-pages

# 预览构建结果
npm run preview
```

## 🚀 部署选项

### 1. GitHub Pages
1. 将项目推送到GitHub仓库
2. 运行 `npm run build:gh-pages`
3. 将 `dist` 目录内容推送到 `gh-pages` 分支
4. 在GitHub仓库设置中启用Pages

### 2. Vercel
1. 连接GitHub仓库到Vercel
2. 设置构建命令: `npm run build`
3. 设置输出目录: `dist`
4. 自动部署

### 3. Netlify
1. 拖拽 `dist` 文件夹到Netlify部署界面
2. 或连接GitHub仓库自动部署

## 📁 项目结构

```
├── public/
│   ├── images/          # 东方角色图片
│   │   ├── 恋.jpg
│   │   ├── 求.jpg
│   │   └── ...
│   └── index.html
├── src/
│   ├── components/      # React组件
│   │   ├── Layout.tsx
│   │   └── CharacterPreview.tsx
│   ├── pages/          # 页面组件
│   │   └── Home.tsx
│   ├── services/       # 业务逻辑
│   │   └── imageGenerator.ts
│   ├── locales/        # 国际化文件
│   │   ├── zh.json
│   │   └── ja.json
│   ├── App.tsx         # 主应用组件
│   ├── App.css         # 全局样式
│   ├── i18n.ts         # 国际化配置
│   └── main.tsx        # 应用入口
├── aone/               # 原始角色图片资源
├── package.json        # 依赖配置
├── vite.config.ts      # Vite配置
└── tsconfig.json       # TypeScript配置
```

## 🎮 使用说明

1. **选择语言**: 点击右上角语言选择器切换中文/日文
2. **上传图片**: 点击或拖拽图片到上传区域
3. **生成九宫格**: 系统自动将您的图片与8个东方角色组合
4. **预览结果**: 在右侧查看生成的九宫格
5. **下载图片**: 点击下载按钮保存到本地

## 🎨 九宫格布局

```
[角色1] [角色2] [角色3]
[角色4] [您的图] [角色5]
[角色6] [角色7] [角色8]
```

用户上传的图片会自动放置在九宫格的中央位置，周围环绕8个东方花硬种角色。

## ⚡ 性能优化

- 图片懒加载和缓存
- Canvas硬件加速
- 组件级代码分割
- 静态资源CDN优化

## 🛠️ 自定义配置

在 `src/services/imageGenerator.ts` 中可以调整:
- 九宫格尺寸
- 用户图片位置
- 图片处理算法
- 输出格式和质量

## 📝 开发说明

### 添加新角色图片
1. 将图片放入 `public/images/` 目录
2. 更新 `CharacterPreview.tsx` 中的角色列表
3. 更新 `imageGenerator.ts` 中的图片列表

### 添加新语言
1. 在 `src/locales/` 创建新的语言文件
2. 在 `i18n.ts` 中注册新语言
3. 在 `Layout.tsx` 中添加语言选项

## 🚀 部署到GitHub Pages

这个项目已经配置好了GitHub Actions自动部署。要部署到GitHub Pages：

1. **创建GitHub仓库**
   ```bash
   # 初始化Git仓库（如果还没有）
   git init
   git add .
   git commit -m "Initial commit"
   
   # 添加GitHub仓库作为远程源
   git remote add origin https://github.com/你的用户名/touhou-steel-blossom-grid.git
   git branch -M main
   git push -u origin main
   ```

2. **启用GitHub Pages**
   - 进入GitHub仓库设置页面
   - 滚动到"Pages"部分
   - 在"Source"中选择"GitHub Actions"

3. **自动部署**
   - 推送代码到main分支会自动触发构建和部署
   - 部署完成后，访问：`https://你的用户名.github.io/touhou-steel-blossom-grid/`

4. **本地构建测试**
   ```bash
   npm install
   npm run build
   npm run preview
   ```

> **注意**: 如果仓库名称不是"touhou-steel-blossom-grid"，请修改 `vite.config.ts` 中的 `base` 配置为您的实际仓库名称。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 📄 许可证

本项目采用 [MIT License](./LICENSE) 开源协议。

MIT协议特点：
- ✅ 允许商业使用
- ✅ 允许修改和分发
- ✅ 允许私人使用
- ✅ 允许专利使用
- ⚠️ 需要包含版权声明
- ⚠️ 软件"按原样"提供，不提供任何担保

## 🎉 致谢

感谢东方花硬种的美丽角色们，让这个九宫格生成器变得如此特别！

感谢Flandre Scarlet提供的诡异灵感！

感谢白蔡老师提供的美丽测试样例，老师的博丽灵梦cos非常可爱！

---

**开发者**: 异月（99%的工作量）AI（1%的工作量） | **联系方式**: QQ 3526869976