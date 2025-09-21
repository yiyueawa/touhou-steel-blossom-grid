// 东方花硬种 - 主要JavaScript功能

document.addEventListener('DOMContentLoaded', function() {
    // 初始化提示框
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 页面加载动画
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // 图片懒加载
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('loading');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });
});

// 通用工具函数
const Utils = {
    // 显示消息提示
    showMessage: function(message, type = 'info', duration = 3000) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        // 自动移除
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, duration);
    },

    // 格式化文件大小
    formatFileSize: function(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    // 格式化时间
    formatTime: function(timestamp) {
        const date = new Date(timestamp * 1000);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) { // 1分钟内
            return '刚刚';
        } else if (diff < 3600000) { // 1小时内
            return Math.floor(diff / 60000) + '分钟前';
        } else if (diff < 86400000) { // 1天内
            return Math.floor(diff / 3600000) + '小时前';
        } else {
            return date.toLocaleDateString('zh-CN') + ' ' + date.toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    },

    // 防抖函数
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // 节流函数
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// 文件上传相关功能
const FileUpload = {
    // 验证文件类型
    validateFileType: function(file) {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/tiff'];
        return allowedTypes.includes(file.type);
    },

    // 验证文件大小
    validateFileSize: function(file, maxSize = 16 * 1024 * 1024) { // 16MB
        return file.size <= maxSize;
    },

    // 预览图片
    previewImage: function(file, callback) {
        const reader = new FileReader();
        reader.onload = function(e) {
            callback(e.target.result);
        };
        reader.readAsDataURL(file);
    },

    // 压缩图片（如果需要）
    compressImage: function(file, quality = 0.8, callback) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = function() {
            const maxWidth = 1920;
            const maxHeight = 1920;
            let { width, height } = img;
            
            // 计算新尺寸
            if (width > height) {
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = (width * maxHeight) / height;
                    height = maxHeight;
                }
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // 绘制压缩后的图片
            ctx.drawImage(img, 0, 0, width, height);
            
            canvas.toBlob(callback, 'image/jpeg', quality);
        };
        
        const reader = new FileReader();
        reader.onload = function(e) {
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};

// 九宫格相关功能
const GridGenerator = {
    // 显示九宫格预览
    showPreview: function(imageUrl, container) {
        const img = document.createElement('img');
        img.src = imageUrl;
        img.className = 'img-fluid rounded shadow';
        img.alt = '生成的九宫格';
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        
        container.innerHTML = '';
        container.appendChild(img);
        
        // 添加加载效果
        img.addEventListener('load', function() {
            this.classList.add('fade-in');
        });
    },

    // 创建下载链接
    createDownloadLink: function(imageUrl, filename = 'touhou_nine_grid.jpg') {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = filename;
        link.className = 'btn btn-primary';
        link.innerHTML = '<i class="fas fa-download"></i> 下载九宫格';
        return link;
    }
};

// 画廊相关功能
const Gallery = {
    // 初始化画廊
    init: function() {
        const galleryImages = document.querySelectorAll('.gallery-image');
        galleryImages.forEach(img => {
            img.addEventListener('click', function() {
                Gallery.showModal(this.src, this.alt);
            });
        });
    },

    // 显示模态框
    showModal: function(imageSrc, imageAlt) {
        const modal = document.getElementById('imageModal');
        const modalImage = document.getElementById('modalImage');
        const modalDownload = document.getElementById('modalDownload');
        
        if (modal && modalImage) {
            modalImage.src = imageSrc;
            modalImage.alt = imageAlt;
            
            if (modalDownload) {
                modalDownload.href = imageSrc;
            }
            
            const modalInstance = new bootstrap.Modal(modal);
            modalInstance.show();
        }
    },

    // 删除图片（如果有权限）
    deleteImage: function(imageId, callback) {
        if (confirm('确定要删除这张图片吗？')) {
            fetch(`/api/delete/${imageId}`, {
                method: 'DELETE',
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Utils.showMessage('图片删除成功', 'success');
                    if (callback) callback();
                } else {
                    Utils.showMessage('删除失败: ' + data.message, 'danger');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Utils.showMessage('删除失败，请重试', 'danger');
            });
        }
    }
};

// 页面性能监控
const Performance = {
    // 监控页面加载时间
    monitorPageLoad: function() {
        window.addEventListener('load', function() {
            const navigationStart = performance.timing.navigationStart;
            const loadComplete = performance.timing.loadEventEnd;
            const loadTime = loadComplete - navigationStart;
            
            console.log(`页面加载时间: ${loadTime}ms`);
            
            // 如果加载时间过长，显示提示
            if (loadTime > 3000) {
                Utils.showMessage('页面加载较慢，请检查网络连接', 'warning', 5000);
            }
        });
    },

    // 监控错误
    monitorErrors: function() {
        window.addEventListener('error', function(e) {
            console.error('JavaScript错误:', e.error);
            Utils.showMessage('页面出现错误，请刷新重试', 'danger');
        });
        
        window.addEventListener('unhandledrejection', function(e) {
            console.error('未处理的Promise错误:', e.reason);
            Utils.showMessage('操作失败，请重试', 'danger');
        });
    }
};

// 初始化性能监控
Performance.monitorPageLoad();
Performance.monitorErrors();

// 导出到全局
window.Utils = Utils;
window.FileUpload = FileUpload;
window.GridGenerator = GridGenerator;
window.Gallery = Gallery;