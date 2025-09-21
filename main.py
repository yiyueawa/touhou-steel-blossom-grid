import os
from PIL import Image, ImageDraw
from typing import List, Optional
import glob


def create_nine_grid(image_paths: List[str], output_path: str = "nine_grid.jpg",
                     image_order: Optional[List[Optional[int]]] = None,
                     grid_size: int = 800) -> None:
    """
    创建九宫格图片拼接

    Args:
        image_paths: 图片文件路径列表
        output_path: 输出文件路径
        image_order: 九宫格位置排列顺序，None表示留空，数字表示使用第几张图片（从0开始）
                    例如：[0, 1, 2, 3, None, 4, 5, 6, 7] 表示中间位置留空
        grid_size: 最终九宫格的尺寸（正方形）
    """
    if not image_paths:
        raise ValueError("图片路径列表不能为空")

    # 如果没有指定排列顺序，默认中间留空
    if image_order is None:
        image_order = [0, 1, 2, 3, None, 4, 5, 6, 7]

    # 验证image_order长度
    if len(image_order) != 9:
        raise ValueError("image_order必须包含9个元素")

    # 加载所有图片
    images = []
    for path in image_paths:
        try:
            img = Image.open(path)
            images.append(img)
            print(f"已加载图片: {os.path.basename(path)} ({img.size})")
        except Exception as e:
            print(f"加载图片 {path} 失败: {e}")
            continue

    if not images:
        raise ValueError("没有成功加载任何图片")

    # 计算单个格子的尺寸
    cell_size = grid_size // 3

    # 创建空白画布
    grid_image = Image.new('RGB', (grid_size, grid_size), color='white')

    # 计算九宫格位置
    positions = [
        (0, 0), (cell_size, 0), (cell_size * 2, 0),      # 上行
        (0, cell_size), (cell_size, cell_size), (cell_size * 2, cell_size),  # 中行
        (0, cell_size * 2), (cell_size, cell_size *
                             2), (cell_size * 2, cell_size * 2)  # 下行
    ]

    # 按指定顺序放置图片
    for i, img_index in enumerate(image_order):
        if img_index is None:
            # 留空位置，可以画个边框表示
            draw = ImageDraw.Draw(grid_image)
            x, y = positions[i]
            draw.rectangle([x, y, x + cell_size - 1, y + cell_size - 1],
                           outline='lightgray', width=2)
            continue

        if img_index >= len(images):
            print(f"警告: 图片索引 {img_index} 超出范围，跳过")
            continue

        # 获取当前图片
        current_img = images[img_index].copy()

        # 缩放图片到合适大小（保持比例，不丢失细节）
        resized_img = resize_image_smart(current_img, cell_size)

        # 居中放置
        x, y = positions[i]
        paste_x = x + (cell_size - resized_img.width) // 2
        paste_y = y + (cell_size - resized_img.height) // 2

        grid_image.paste(resized_img, (paste_x, paste_y))
        print(f"已放置图片 {img_index + 1} 到位置 {i + 1}")

    # 保存结果
    grid_image.save(output_path, quality=95)
    print(f"九宫格已保存到: {output_path}")


def resize_image_smart(img: Image.Image, max_size: int) -> Image.Image:
    """
    智能缩放图片，保持比例且不超过最大尺寸

    Args:
        img: PIL图片对象
        max_size: 最大尺寸（宽或高的最大值）

    Returns:
        缩放后的图片
    """
    # 获取原始尺寸
    width, height = img.size

    # 如果图片已经很小，不需要缩放
    if max(width, height) <= max_size:
        return img

    # 计算缩放比例
    if width > height:
        new_width = max_size
        new_height = int(height * max_size / width)
    else:
        new_height = max_size
        new_width = int(width * max_size / height)

    # 使用高质量的重采样算法
    return img.resize((new_width, new_height), Image.Resampling.LANCZOS)


def get_image_files(directory: str = ".") -> List[str]:
    """
    获取目录中所有图片文件

    Args:
        directory: 目录路径

    Returns:
        图片文件路径列表
    """
    extensions = ['*.jpg', '*.jpeg', '*.png', '*.bmp', '*.gif', '*.tiff']
    image_files = []

    for ext in extensions:
        pattern = os.path.join(directory, ext)
        image_files.extend(glob.glob(pattern))
        # 也查找大写扩展名
        pattern = os.path.join(directory, ext.upper())
        image_files.extend(glob.glob(pattern))

    return sorted(image_files)


def main():
    print("东方花硬种 - 九宫格图片拼接工具")
    print("=" * 40)

    # 获取当前目录中的所有图片
    image_files = get_image_files("aone")
    # image_files .extend(get_image_files("images"))
    # image_files.extend(["images/户晨风-安卓.png"])
    # image_files.extend(["images/baka二郎腿.jpg"])
    image_files.extend(["images/9开战.jpeg"])

    if not image_files:
        print("当前目录中没有找到图片文件！")
        return

    print(f"找到 {len(image_files)} 张图片:")
    for i, path in enumerate(image_files):
        print(f"{i + 1}. {os.path.basename(path)}")

    # 使用默认排列（中间留空）创建九宫格
    if len(image_files) >= 8:
        try:
            create_nine_grid(
                image_paths=image_files,  # 只取前8张图片
                output_path="touhou_nine_grid.jpg",
                image_order=[0, 1, 2, 3, 8, 4, 5, 6, 7],  # 中间留空
                grid_size=1200  # 较大尺寸保持细节
            )
            print("\n✅ 九宫格创建成功！")
            print("您可以修改 image_order 参数来自定义图片排列顺序")
            print("例如：[1, 0, 2, 4, None, 3, 6, 7, 5] 来重新排列")
        except Exception as e:
            print(f"❌ 创建九宫格时出错: {e}")
    else:
        print(f"❌ 需要至少8张图片，当前只有 {len(image_files)} 张")


if __name__ == "__main__":
    main()
