class UIManager {
    constructor() {
        this.isAnimating = false;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // 添加样式
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;

        // 根据类型设置背景色
        switch (type) {
            case 'success':
                notification.style.background = 'linear-gradient(45deg, #48bb78, #38a169)';
                break;
            case 'error':
                notification.style.background = 'linear-gradient(45deg, #e53e3e, #c53030)';
                break;
            case 'warning':
                notification.style.background = 'linear-gradient(45deg, #ed8936, #dd6b20)';
                break;
            default:
                notification.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
        }

        document.body.appendChild(notification);

        // 动画显示
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // 自动隐藏
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    animateStatChange(statElement, oldValue, newValue) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        const difference = newValue - oldValue;
        
        if (difference === 0) {
            this.isAnimating = false;
            return;
        }

        // 创建动画文本
        const animText = document.createElement('span');
        animText.textContent = difference > 0 ? `+${difference}` : `${difference}`;
        animText.style.cssText = `
            position: absolute;
            right: -30px;
            top: 0;
            color: ${difference > 0 ? '#48bb78' : '#e53e3e'};
            font-weight: bold;
            font-size: 0.9rem;
            opacity: 0;
            transform: translateY(0);
            transition: all 0.5s ease;
            pointer-events: none;
        `;

        statElement.parentNode.style.position = 'relative';
        statElement.parentNode.appendChild(animText);

        // 高亮统计值
        statElement.style.transition = 'all 0.3s ease';
        statElement.style.color = difference > 0 ? '#48bb78' : '#e53e3e';
        statElement.style.transform = 'scale(1.1)';

        // 动画效果
        setTimeout(() => {
            animText.style.opacity = '1';
            animText.style.transform = 'translateY(-20px)';
        }, 100);

        setTimeout(() => {
            animText.style.opacity = '0';
            animText.style.transform = 'translateY(-40px)';
            
            statElement.style.color = '#667eea';
            statElement.style.transform = 'scale(1)';
        }, 1500);

        setTimeout(() => {
            if (animText.parentNode) {
                animText.parentNode.removeChild(animText);
            }
            this.isAnimating = false;
        }, 2000);
    }

    highlightNewItem(itemElement) {
        itemElement.style.cssText += `
            animation: pulse 1s ease-in-out;
            border-left-color: #48bb78;
        `;

        // 添加脉冲动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(72, 187, 120, 0.7); }
                70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(72, 187, 120, 0); }
                100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(72, 187, 120, 0); }
            }
        `;
        
        if (!document.querySelector('#pulse-animation-style')) {
            style.id = 'pulse-animation-style';
            document.head.appendChild(style);
        }
    }

    showConfirmDialog(message, onConfirm, onCancel) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const dialog = document.createElement('div');
        dialog.style.cssText = `
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            max-width: 400px;
            width: 90%;
            text-align: center;
            transform: scale(0.8);
            transition: transform 0.3s ease;
        `;

        const messageElement = document.createElement('p');
        messageElement.textContent = message;
        messageElement.style.cssText = `
            margin-bottom: 1.5rem;
            font-size: 1.1rem;
            color: #2d3748;
            line-height: 1.5;
        `;

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            gap: 1rem;
            justify-content: center;
        `;

        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = '确认';
        confirmBtn.className = 'btn btn-primary';

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '取消';
        cancelBtn.className = 'btn btn-secondary';

        confirmBtn.onclick = () => {
            this.hideDialog(overlay);
            onConfirm && onConfirm();
        };

        cancelBtn.onclick = () => {
            this.hideDialog(overlay);
            onCancel && onCancel();
        };

        buttonContainer.appendChild(confirmBtn);
        buttonContainer.appendChild(cancelBtn);
        dialog.appendChild(messageElement);
        dialog.appendChild(buttonContainer);
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        // 显示动画
        setTimeout(() => {
            overlay.style.opacity = '1';
            dialog.style.transform = 'scale(1)';
        }, 10);

        return overlay;
    }

    hideDialog(overlay) {
        overlay.style.opacity = '0';
        overlay.querySelector('div').style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 300);
    }

    typeWriter(element, text, speed = 50) {
        element.innerHTML = '';
        let i = 0;
        
        const timer = setInterval(() => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);

        return timer;
    }

    showLoadingSpinner(container) {
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        spinner.style.cssText = `
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(102, 126, 234, 0.3);
            border-radius: 50%;
            border-top-color: #667eea;
            animation: spin 1s ease-in-out infinite;
            margin-right: 0.5rem;
        `;

        // 添加旋转动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        
        if (!document.querySelector('#spin-animation-style')) {
            style.id = 'spin-animation-style';
            document.head.appendChild(style);
        }

        container.insertBefore(spinner, container.firstChild);
        return spinner;
    }

    removeLoadingSpinner(spinner) {
        if (spinner && spinner.parentNode) {
            spinner.parentNode.removeChild(spinner);
        }
    }

    updateProgressBar(percentage, animated = true) {
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            if (animated) {
                progressFill.style.transition = 'width 0.5s ease';
            } else {
                progressFill.style.transition = 'none';
            }
            progressFill.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
        }
    }

    flashElement(element, color = '#667eea', duration = 1000) {
        const originalBorder = element.style.border;
        element.style.border = `2px solid ${color}`;
        element.style.transition = 'border 0.3s ease';
        
        setTimeout(() => {
            element.style.border = originalBorder;
        }, duration);
    }

    smoothScrollTo(element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    }
}