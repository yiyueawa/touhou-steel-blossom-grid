import os
import io
import base64
from flask import Flask, render_template, request, flash, redirect, url_for, jsonify
from werkzeug.utils import secure_filename
from PIL import Image
from main import create_nine_grid, get_image_files, resize_image_smart
import uuid
import shutil

app = Flask(__name__)
app.secret_key = 'touhou_flower_mapping_secret_key_2024'  # 用于flash消息

# 配置
UPLOAD_FOLDER = 'uploads'
STATIC_FOLDER = 'static'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff'}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH

# 确保必要的文件夹存在
for folder in [UPLOAD_FOLDER, STATIC_FOLDER, 'static/results']:
    os.makedirs(folder, exist_ok=True)


def allowed_file(filename):
    """检查文件扩展名是否允许"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def image_to_base64(image_path):
    """将图片转换为base64编码"""
    try:
        with open(image_path, "rb") as img_file:
            return base64.b64encode(img_file.read()).decode('utf-8')
    except Exception as e:
        print(f"转换图片到base64失败: {e}")
        return None


def create_web_nine_grid(uploaded_file_path, user_id):
    """为Web版本创建九宫格，将上传的图片放在中间"""
    try:
        # 获取预设的东方角色图片
        preset_images = []

        # 从aone文件夹获取图片（这里是您的东方角色图片）
        if os.path.exists('aone'):
            preset_images.extend(get_image_files('aone'))

        # 检查是否有其他预设图片文件夹
        if os.path.exists('images'):
            preset_images.extend(get_image_files('images'))

        # 获取当前目录的图片（排除之前生成的九宫格）
        current_images = [f for f in get_image_files('.')
                          if not f.endswith('_nine_grid.jpg') and
                          not f.startswith('grid_') and
                          f != uploaded_file_path]

        preset_images.extend(current_images)

        if len(preset_images) < 8:
            return None, f"需要至少8张预设图片，当前只有{len(preset_images)}张"

        # 创建包含上传图片的图片列表（上传的图片会放在中间）
        all_images = preset_images[:8] + [uploaded_file_path]

        # 生成唯一的输出文件名
        output_filename = f"touhou_nine_grid_{user_id}.jpg"
        output_path = os.path.join('static/results', output_filename)

        # 创建九宫格：前8张预设图片 + 上传的图片放中间
        create_nine_grid(
            image_paths=all_images,
            output_path=output_path,
            image_order=[0, 1, 2, 3, 8, 4, 5, 6, 7],  # 8是上传的图片，放在中间
            grid_size=1200
        )

        return output_filename, "九宫格创建成功！"

    except Exception as e:
        return None, f"创建九宫格时出错: {str(e)}"


@app.route('/')
def index():
    """主页"""
    return render_template('index.html')


@app.route('/upload', methods=['POST'])
def upload_file():
    """处理文件上传"""
    if 'file' not in request.files:
        return jsonify({'success': False, 'message': '没有选择文件'})

    file = request.files['file']
    if file.filename == '':
        return jsonify({'success': False, 'message': '没有选择文件'})

    if file and allowed_file(file.filename):
        try:
            # 生成唯一的用户ID和文件名
            user_id = str(uuid.uuid4())[:8]
            filename = secure_filename(file.filename or 'unknown.jpg')
            file_path = os.path.join(
                app.config['UPLOAD_FOLDER'], f"{user_id}_{filename}")

            # 保存上传的文件
            file.save(file_path)

            # 验证是否为有效图片
            try:
                with Image.open(file_path) as img:
                    img.verify()
            except Exception:
                os.remove(file_path)
                return jsonify({'success': False, 'message': '上传的文件不是有效的图片'})

            # 创建九宫格
            result_filename, message = create_web_nine_grid(file_path, user_id)

            if result_filename:
                # 清理上传的临时文件
                os.remove(file_path)

                return jsonify({
                    'success': True,
                    'message': message,
                    'result_image': url_for('static', filename=f'results/{result_filename}'),
                    'user_id': user_id
                })
            else:
                # 清理上传的临时文件
                if os.path.exists(file_path):
                    os.remove(file_path)
                return jsonify({'success': False, 'message': message})

        except Exception as e:
            return jsonify({'success': False, 'message': f'处理文件时出错: {str(e)}'})

    return jsonify({'success': False, 'message': '不支持的文件格式'})


@app.route('/gallery')
def gallery():
    """展示历史生成的九宫格"""
    results_dir = 'static/results'
    if not os.path.exists(results_dir):
        return render_template('gallery.html', images=[])

    # 获取所有生成的九宫格图片
    image_files = []
    for filename in os.listdir(results_dir):
        if filename.endswith('.jpg') and 'nine_grid' in filename:
            image_files.append({
                'filename': filename,
                'url': url_for('static', filename=f'results/{filename}'),
                'timestamp': os.path.getctime(os.path.join(results_dir, filename))
            })

    # 按时间排序（最新的在前）
    image_files.sort(key=lambda x: x['timestamp'], reverse=True)

    return render_template('gallery.html', images=image_files)


@app.route('/about')
def about():
    """关于页面"""
    return render_template('about.html')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
