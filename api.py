"""
东方花硬种 - 九宫格生成器 API 后端
提供纯API接口，支持文件上传和九宫格生成功能
"""

import os
import uuid
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from main import create_nine_grid, get_image_files

# 创建Flask应用
app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 限制上传文件大小为16MB

# 配置CORS - 允许前端跨域访问
CORS(app, origins=['http://localhost:3000', 'http://127.0.0.1:3000',
     'http://localhost:5173', 'http://127.0.0.1:5173'])

# 配置上传和输出目录
UPLOAD_FOLDER = 'uploads'
RESULTS_FOLDER = 'static/results'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'}

# 确保目录存在
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULTS_FOLDER, exist_ok=True)


def allowed_file(filename):
    """检查文件扩展名是否允许"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def generate_unique_filename():
    """生成唯一的文件名"""
    return str(uuid.uuid4()).replace('-', '')[:8]


@app.route('/api/health', methods=['GET'])
def health_check():
    """健康检查接口"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })


@app.route('/api/upload', methods=['POST'])
def upload_file():
    """文件上传和九宫格生成接口"""
    try:
        # 检查是否有文件上传
        if 'file' not in request.files:
            return jsonify({'error': '没有文件被上传'}), 400

        file = request.files['file']

        # 检查文件名
        if not file.filename or file.filename == '':
            return jsonify({'error': '未选择文件'}), 400

        # 检查文件类型
        if not allowed_file(file.filename):
            return jsonify({'error': '不支持的文件类型，请上传图片文件'}), 400

        # 生成安全的文件名
        filename = secure_filename(file.filename)
        unique_id = generate_unique_filename()
        file_extension = filename.rsplit('.', 1)[1].lower()
        uploaded_filename = f"{unique_id}_{filename}"

        # 保存上传的文件
        file_path = os.path.join(UPLOAD_FOLDER, uploaded_filename)
        file.save(file_path)

        # 生成九宫格
        try:
            # 获取aone目录中的图片
            aone_images = get_image_files('aone')
            if len(aone_images) < 8:
                return jsonify({'error': '背景图片不足，需要至少8张'}), 500

            # 生成九宫格图片
            result_filename = f"touhou_nine_grid_{unique_id}.jpg"
            result_path = os.path.join(RESULTS_FOLDER, result_filename)

            # 构建图片路径列表：用户图片 + 8张背景图片
            all_images = [file_path] + aone_images[:8]

            # 生成九宫格，用户图片放在中间位置（索引4）
            from typing import Optional, List
            image_order: List[Optional[int]] = [
                1, 2, 3, 4, 0, 5, 6, 7, 8]  # 0是用户图片，1-8是背景图片
            create_nine_grid(all_images, result_path, image_order)

            # 删除上传的临时文件
            os.remove(file_path)

            # 返回成功响应
            return jsonify({
                'success': True,
                'filename': result_filename,
                'message': '九宫格生成成功！',
                'timestamp': datetime.now().isoformat()
            })

        except Exception as e:
            # 清理临时文件
            if os.path.exists(file_path):
                os.remove(file_path)
            return jsonify({'error': f'生成九宫格时出错：{str(e)}'}), 500

    except Exception as e:
        return jsonify({'error': f'处理请求时出错：{str(e)}'}), 500


@app.route('/api/gallery', methods=['GET'])
def get_gallery():
    """获取历史生成的九宫格图片列表"""
    try:
        gallery_items = []

        if os.path.exists(RESULTS_FOLDER):
            for filename in os.listdir(RESULTS_FOLDER):
                if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
                    file_path = os.path.join(RESULTS_FOLDER, filename)
                    file_stat = os.stat(file_path)

                    gallery_items.append({
                        'filename': filename,
                        'url': f'/static/results/{filename}',
                        'size': file_stat.st_size,
                        'created_at': datetime.fromtimestamp(file_stat.st_ctime).isoformat()
                    })

        # 按创建时间倒序排列
        gallery_items.sort(key=lambda x: x['created_at'], reverse=True)

        return jsonify({
            'success': True,
            'items': gallery_items,
            'total': len(gallery_items)
        })

    except Exception as e:
        return jsonify({'error': f'获取图片列表时出错：{str(e)}'}), 500


@app.route('/api/info', methods=['GET'])
def get_app_info():
    """获取应用信息"""
    try:
        aone_images = get_image_files('aone')

        return jsonify({
            'name': '东方花硬种 - 九宫格生成器',
            'version': '1.0.0',
            'description': '上传您的图片，与东方花硬种角色一起生成精美的九宫格',
            'background_images': len(aone_images),
            'supported_formats': list(ALLOWED_EXTENSIONS),
            'max_file_size': '16MB'
        })

    except Exception as e:
        return jsonify({'error': f'获取应用信息时出错：{str(e)}'}), 500


@app.errorhandler(413)
def file_too_large(error):
    """文件过大错误处理"""
    return jsonify({'error': '文件过大，请上传小于16MB的图片'}), 413


@app.errorhandler(404)
def not_found(error):
    """404错误处理"""
    return jsonify({'error': '接口不存在'}), 404


@app.errorhandler(500)
def internal_error(error):
    """500错误处理"""
    return jsonify({'error': '服务器内部错误'}), 500


if __name__ == '__main__':
    print("🌸 启动东方花硬种 API 服务器")
    print("=" * 48)

    # 检查aone目录
    aone_images = get_image_files('aone')
    print(f"✅ 找到 {len(aone_images)} 张东方角色图片")

    if len(aone_images) < 8:
        print("❌ 警告：背景图片不足8张，可能影响九宫格生成")
    else:
        print("✅ 所有检查通过")

    print("")
    print("🚀 API服务器启动中...")
    print("📱 API地址: http://localhost:5001")
    print("🎯 前端地址: http://localhost:3000")
    print("")
    print("💡 提示: 按 Ctrl+C 停止服务")
    print("=" * 48)

    app.run(host='0.0.0.0', port=5001, debug=True)
