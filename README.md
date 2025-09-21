# 东方花硬种 - 九宫格图片拼接工具

这是一个用于创建九宫格图片拼接的Python工具，可以将8张图片按照您的喜好排列成3x3的九宫格，中间或其他位置可以留空。

## 功能特点

- ✅ 自动缩放图片到合适大小（保持比例，不丢失细节）
- ✅ 支持自定义图片排列顺序
- ✅ 支持在任意位置留空
- ✅ 高质量输出（使用LANCZOS重采样算法）
- ✅ 支持多种图片格式（JPG, PNG, BMP, GIF, TIFF等）

## 快速开始

### 1. 运行默认九宫格（中间留空）
```bash
uv run python main.py
```

这会自动：
- 扫描当前目录的所有图片文件
- 使用前8张图片创建九宫格
- 中间位置留空
- 输出文件：`touhou_nine_grid.jpg`

### 2. 自定义排列示例
```bash
uv run python custom_examples.py
```

这会创建多种不同排列的九宫格：
- `grid_default.jpg` - 默认排列（中间留空）
- `grid_custom1.jpg` - 四个角留空
- `grid_custom2.jpg` - 倒序排列  
- `grid_custom3.jpg` - 棋盘式排列

## 自定义排列

您可以通过修改 `image_order` 参数来自定义图片排列：

```python
from main import create_nine_grid, get_image_files

# 获取图片文件
image_files = get_image_files()

# 自定义排列 - 中间留空
create_nine_grid(
    image_paths=image_files[:8],
    output_path="my_grid.jpg",
    image_order=[0, 1, 2, 3, None, 4, 5, 6, 7],  # None表示留空
    grid_size=1200  # 输出尺寸
)
```

### 位置说明

九宫格的位置编号如下：
```
[0] [1] [2]
[3] [4] [5]  
[6] [7] [8]
```

### image_order 参数说明

- 数组长度必须为9（对应9个位置）
- 数字表示使用第几张图片（从0开始计数）
- `None` 表示该位置留空
- 示例：
  - `[0, 1, 2, 3, None, 4, 5, 6, 7]` - 中间留空
  - `[None, 0, None, 1, 2, 3, None, 4, None]` - 四个角留空
  - `[7, 6, 5, 4, None, 3, 2, 1, 0]` - 倒序排列

## 参数说明

### create_nine_grid 函数参数

- `image_paths`: 图片文件路径列表
- `output_path`: 输出文件名（默认："nine_grid.jpg"）
- `image_order`: 排列顺序（默认：中间留空）
- `grid_size`: 最终九宫格尺寸，正方形（默认：800像素）

### 建议的 grid_size 值

- `800` - 适合网页展示
- `1200` - 高质量输出（推荐）
- `1600` - 超高清输出

## 图片处理说明

- 程序会自动将图片缩放到合适大小
- 使用高质量的LANCZOS重采样算法
- 保持原始比例，不会变形
- 图片在格子中居中显示
- 留空位置会显示浅灰色边框

## 支持的图片格式

- JPG/JPEG
- PNG  
- BMP
- GIF
- TIFF

## 输出文件

所有生成的九宫格都会保存为高质量的JPG文件（quality=95）。

## 示例用法

```python
# 基础用法
from main import create_nine_grid, get_image_files

images = get_image_files()
create_nine_grid(images[:8])

# 高级用法 - 完全自定义
create_nine_grid(
    image_paths=["img1.jpg", "img2.jpg", "img3.jpg", "img4.jpg", 
                 "img5.jpg", "img6.jpg", "img7.jpg", "img8.jpg"],
    output_path="custom_grid.jpg",
    image_order=[2, 0, 4, 1, None, 3, 6, 7, 5],  # 自定义排列
    grid_size=1600  # 超高清输出
)
```

享受您的九宫格创作吧！ 🎨
