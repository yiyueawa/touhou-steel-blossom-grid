/**
 * 前端九宫格图像处理服务
 * 使用Canvas API在浏览器中生成九宫格
 */

export interface GridConfig {
  gridSize: number;
  cellSize: number;
  userImagePosition: number; // 用户图片在九宫格中的位置 (0-8)
}

export interface ImageInfo {
  file: File;
  url: string;
  width: number;
  height: number;
}

export class NineGridGenerator {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private config: GridConfig;

  // 默认的东方角色图片文件名
  private readonly characterImages = [
    "恋.jpg",
    "求.jpg",
    "沙.jpg",
    "猫.jpg",
    "紫.jpg",
    "芙.jpg",
    "花.jpg",
    "谁？.jpg",
  ];

  constructor(
    config: GridConfig = { gridSize: 800, cellSize: 266, userImagePosition: 4 }
  ) {
    this.config = config;
    this.canvas = document.createElement("canvas");
    this.canvas.width = config.gridSize;
    this.canvas.height = config.gridSize;
    this.ctx = this.canvas.getContext("2d")!;
  }

  /**
   * 加载图片并返回HTMLImageElement
   */
  private async loadImage(src: string | File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));

      if (src instanceof File) {
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(src);
      } else {
        img.src = src;
      }
    });
  }

  /**
   * 智能调整图片尺寸，保持宽高比，确保图片完全适应目标区域
   */
  private resizeImageSmart(
    img: HTMLImageElement,
    targetWidth: number,
    targetHeight: number
  ): { width: number; height: number; x: number; y: number } {
    const imgRatio = img.width / img.height;
    const targetRatio = targetWidth / targetHeight;

    let width, height, x, y;

    if (imgRatio > targetRatio) {
      // 图片更宽，以宽度为准，确保不超出边界
      width = targetWidth;
      height = width / imgRatio;
      x = 0;
      y = (targetHeight - height) / 2;
    } else {
      // 图片更高或正方形，以高度为准，确保不超出边界
      height = targetHeight;
      width = height * imgRatio;
      x = (targetWidth - width) / 2;
      y = 0;
    }

    return { width, height, x, y };
  }

  /**
   * 在指定位置绘制图片
   */
  private drawImageAtPosition(
    img: HTMLImageElement,
    position: number,
    cellSize: number = this.config.cellSize
  ): void {
    const row = Math.floor(position / 3);
    const col = position % 3;
    const x = col * cellSize;
    const y = row * cellSize;

    // 计算最佳尺寸和位置
    const {
      width,
      height,
      x: offsetX,
      y: offsetY,
    } = this.resizeImageSmart(img, cellSize, cellSize);

    // 绘制图片
    this.ctx.drawImage(img, x + offsetX, y + offsetY, width, height);
  }

  /**
   * 生成九宫格
   */
  async generateNineGrid(userImageFile: File): Promise<string> {
    try {
      // 清空画布
      this.ctx.clearRect(0, 0, this.config.gridSize, this.config.gridSize);
      this.ctx.fillStyle = "#ffffff";
      this.ctx.fillRect(0, 0, this.config.gridSize, this.config.gridSize);

      // 加载用户图片
      const userImage = await this.loadImage(userImageFile);

      // 加载所有角色图片
      const characterImagePromises = this.characterImages.map((filename) =>
        this.loadImage(`/images/${filename}`)
      );
      const characterImages = await Promise.all(characterImagePromises);

      // 创建九宫格布局
      const gridLayout: (HTMLImageElement | null)[] = new Array(9).fill(null);

      // 将用户图片放在指定位置（默认中间）
      gridLayout[this.config.userImagePosition] = userImage;

      // 填充其他位置的角色图片
      let characterIndex = 0;
      for (let i = 0; i < 9; i++) {
        if (
          i !== this.config.userImagePosition &&
          characterIndex < characterImages.length
        ) {
          gridLayout[i] = characterImages[characterIndex];
          characterIndex++;
        }
      }

      // 绘制所有图片
      gridLayout.forEach((img, position) => {
        if (img) {
          this.drawImageAtPosition(img, position);
        }
      });

      // 添加网格线（可选）
      this.drawGridLines();

      // 返回生成的图片数据URL
      return this.canvas.toDataURL("image/jpeg", 0.9);
    } catch (error) {
      console.error("生成九宫格时出错:", error);
      throw new Error("生成九宫格失败，请重试");
    }
  }

  /**
   * 绘制网格线
   */
  private drawGridLines(): void {
    const { cellSize } = this.config;

    this.ctx.strokeStyle = "#ffffff";
    this.ctx.lineWidth = 2;
    this.ctx.globalAlpha = 0.8;

    // 绘制竖线
    for (let i = 1; i < 3; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(i * cellSize, 0);
      this.ctx.lineTo(i * cellSize, this.config.gridSize);
      this.ctx.stroke();
    }

    // 绘制横线
    for (let i = 1; i < 3; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, i * cellSize);
      this.ctx.lineTo(this.config.gridSize, i * cellSize);
      this.ctx.stroke();
    }

    this.ctx.globalAlpha = 1;
  }

  /**
   * 下载生成的图片
   */
  downloadImage(
    dataUrl: string,
    filename: string = "touhou_nine_grid.jpg"
  ): void {
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * 获取可用的角色图片列表
   */
  getCharacterImages(): string[] {
    return this.characterImages.map((filename) => `/images/${filename}`);
  }

  /**
   * 设置用户图片在九宫格中的位置
   */
  setUserImagePosition(position: number): void {
    if (position >= 0 && position < 9) {
      this.config.userImagePosition = position;
    }
  }

  /**
   * 获取Canvas元素（用于预览）
   */
  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }
}
