class RandomStoryUI {
    constructor(storyGenerator, gameEngine, uiManager) {
        this.storyGenerator = storyGenerator;
        this.gameEngine = gameEngine;
        this.uiManager = uiManager;
    }

    // 显示故事生成器界面
    showGeneratorInterface() {
        const overlay = this.createGeneratorOverlay();
        document.body.appendChild(overlay);
        
        // 显示动画
        setTimeout(() => {
            overlay.style.opacity = '1';
            overlay.querySelector('.generator-dialog').style.transform = 'scale(1)';
        }, 10);
    }

    // 创建生成器界面
    createGeneratorOverlay() {
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
        dialog.className = 'generator-dialog';
        dialog.style.cssText = `
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            transform: scale(0.8);
            transition: transform 0.3s ease;
        `;

        dialog.innerHTML = this.createGeneratorContent();
        overlay.appendChild(dialog);

        // 绑定事件
        this.bindGeneratorEvents(overlay);

        return overlay;
    }

    // 创建生成器内容
    createGeneratorContent() {
        const templates = this.storyGenerator.getAvailableTemplates();
        
        return `
            <h2 style="text-align: center; margin-bottom: 1.5rem; color: #2d3748;">🎲 随机故事生成器</h2>
            
            <div class="generator-section">
                <h3 style="color: #4a5568; margin-bottom: 1rem;">选择故事类型</h3>
                <div class="template-options" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
                    <label class="template-option" style="display: flex; flex-direction: column; align-items: center; padding: 1rem; border: 2px solid #e2e8f0; border-radius: 8px; cursor: pointer; transition: all 0.3s ease;">
                        <input type="radio" name="template" value="random" checked style="margin-bottom: 0.5rem;">
                        <span style="font-weight: 500;">🎯 随机选择</span>
                        <small style="color: #666; text-align: center;">让系统为你选择</small>
                    </label>
                    ${templates.map(template => `
                        <label class="template-option" style="display: flex; flex-direction: column; align-items: center; padding: 1rem; border: 2px solid #e2e8f0; border-radius: 8px; cursor: pointer; transition: all 0.3s ease;">
                            <input type="radio" name="template" value="${template.id}" style="margin-bottom: 0.5rem;">
                            <span style="font-weight: 500;">${this.getTemplateIcon(template.id)} ${template.name}</span>
                            <small style="color: #666; text-align: center;">${this.getTemplateDescription(template.id)}</small>
                        </label>
                    `).join('')}
                </div>
            </div>

            <div class="generator-section">
                <h3 style="color: #4a5568; margin-bottom: 1rem;">故事复杂度</h3>
                <div class="complexity-options" style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
                    <label class="complexity-option" style="flex: 1; padding: 1rem; border: 2px solid #e2e8f0; border-radius: 8px; cursor: pointer; text-align: center; transition: all 0.3s ease;">
                        <input type="radio" name="complexity" value="simple" style="margin-bottom: 0.5rem;">
                        <div style="font-weight: 500;">🚀 简单</div>
                        <small style="color: #666;">5个节点，快速体验</small>
                    </label>
                    <label class="complexity-option" style="flex: 1; padding: 1rem; border: 2px solid #e2e8f0; border-radius: 8px; cursor: pointer; text-align: center; transition: all 0.3s ease;">
                        <input type="radio" name="complexity" value="medium" checked style="margin-bottom: 0.5rem;">
                        <div style="font-weight: 500;">⚖️ 中等</div>
                        <small style="color: #666;">8个节点，平衡体验</small>
                    </label>
                    <label class="complexity-option" style="flex: 1; padding: 1rem; border: 2px solid #e2e8f0; border-radius: 8px; cursor: pointer; text-align: center; transition: all 0.3s ease;">
                        <input type="radio" name="complexity" value="complex" style="margin-bottom: 0.5rem;">
                        <div style="font-weight: 500;">🌟 复杂</div>
                        <small style="color: #666;">12个节点，深度体验</small>
                    </label>
                </div>
            </div>

            <div class="generator-section">
                <h3 style="color: #4a5568; margin-bottom: 1rem;">高级选项</h3>
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: flex; align-items: center; margin-bottom: 0.5rem;">
                        <input type="checkbox" id="includeRandomEvents" checked style="margin-right: 0.5rem;">
                        <span>包含随机事件</span>
                    </label>
                    <label style="display: flex; align-items: center; margin-bottom: 0.5rem;">
                        <input type="checkbox" id="dynamicGeneration" style="margin-right: 0.5rem;">
                        <span>启用动态生成（实验性）</span>
                    </label>
                    <label style="display: flex; align-items: center;">
                        <span style="margin-right: 0.5rem;">随机种子：</span>
                        <input type="number" id="randomSeed" placeholder="留空为随机" style="padding: 0.25rem; border: 1px solid #e2e8f0; border-radius: 4px; width: 100px;">
                    </label>
                </div>
            </div>

            <div class="button-container" style="display: flex; gap: 1rem; justify-content: center; margin-top: 2rem;">
                <button id="generateStoryBtn" class="btn btn-primary" style="padding: 1rem 2rem;">
                    🎲 生成新故事
                </button>
                <button id="generateVariantBtn" class="btn btn-secondary">
                    🔄 生成当前故事变体
                </button>
                <button id="cancelGeneratorBtn" class="btn btn-secondary">
                    取消
                </button>
            </div>

            <div class="generator-info" style="margin-top: 1.5rem; padding: 1rem; background: #f7fafc; border-radius: 8px; border-left: 4px solid #667eea;">
                <h4 style="margin-bottom: 0.5rem; color: #2d3748;">💡 提示</h4>
                <ul style="margin: 0; padding-left: 1.5rem; color: #4a5568; font-size: 0.9rem;">
                    <li>随机故事会覆盖当前进度，建议先保存</li>
                    <li>故事变体会在现有故事基础上添加随机事件</li>
                    <li>动态生成可以创建无限长度的故事</li>
                    <li>设置相同的随机种子可以重现同样的故事</li>
                </ul>
            </div>
        `;
    }

    // 绑定生成器事件
    bindGeneratorEvents(overlay) {
        // 模板选择高亮
        overlay.querySelectorAll('.template-option').forEach(option => {
            option.addEventListener('click', () => {
                overlay.querySelectorAll('.template-option').forEach(opt => {
                    opt.style.borderColor = '#e2e8f0';
                    opt.style.background = 'white';
                });
                option.style.borderColor = '#667eea';
                option.style.background = '#f0f4ff';
            });
        });

        // 复杂度选择高亮
        overlay.querySelectorAll('.complexity-option').forEach(option => {
            option.addEventListener('click', () => {
                overlay.querySelectorAll('.complexity-option').forEach(opt => {
                    opt.style.borderColor = '#e2e8f0';
                    opt.style.background = 'white';
                });
                option.style.borderColor = '#667eea';
                option.style.background = '#f0f4ff';
            });
        });

        // 生成新故事
        overlay.querySelector('#generateStoryBtn').addEventListener('click', () => {
            this.generateNewStory(overlay);
        });

        // 生成故事变体
        overlay.querySelector('#generateVariantBtn').addEventListener('click', () => {
            this.generateStoryVariant(overlay);
        });

        // 取消
        overlay.querySelector('#cancelGeneratorBtn').addEventListener('click', () => {
            this.hideDialog(overlay);
        });
    }

    // 生成新故事
    generateNewStory(overlay) {
        try {
            // 获取用户选择
            const templateType = overlay.querySelector('input[name="template"]:checked').value;
            const complexity = overlay.querySelector('input[name="complexity"]:checked').value;
            const includeRandomEvents = overlay.querySelector('#includeRandomEvents').checked;
            const dynamicGeneration = overlay.querySelector('#dynamicGeneration').checked;
            const randomSeed = overlay.querySelector('#randomSeed').value;

            // 设置随机种子
            if (randomSeed) {
                this.storyGenerator.setSeed(parseInt(randomSeed));
            }

            // 显示加载动画
            const generateBtn = overlay.querySelector('#generateStoryBtn');
            const originalText = generateBtn.textContent;
            generateBtn.textContent = '生成中...';
            generateBtn.disabled = true;

            // 生成故事
            setTimeout(() => {
                const selectedTemplate = templateType === 'random' ? null : templateType;
                const newStory = this.storyGenerator.generateRandomStory(selectedTemplate, complexity);
                
                // 应用到游戏引擎
                this.gameEngine.storyData = newStory;
                this.gameEngine.restart();
                this.gameEngine.initialize(newStory);

                // 显示成功信息
                this.uiManager.showNotification(`随机${newStory.title}已生成！`, 'success');
                
                // 关闭对话框
                this.hideDialog(overlay);

                // 如果启用动态生成，设置标志
                if (dynamicGeneration) {
                    this.gameEngine.dynamicGeneration = true;
                    this.uiManager.showNotification('动态生成已启用，故事将根据你的选择动态扩展！', 'info');
                }
            }, 500);

        } catch (error) {
            console.error('生成故事失败:', error);
            this.uiManager.showNotification('生成故事失败：' + error.message, 'error');
        }
    }

    // 生成故事变体
    generateStoryVariant(overlay) {
        try {
            if (!this.gameEngine.storyData) {
                this.uiManager.showNotification('请先加载一个故事！', 'warning');
                return;
            }

            // 显示加载动画
            const generateBtn = overlay.querySelector('#generateVariantBtn');
            const originalText = generateBtn.textContent;
            generateBtn.textContent = '生成中...';
            generateBtn.disabled = true;

            setTimeout(() => {
                // 生成故事变体
                const variantStory = this.storyGenerator.generateStoryVariant(this.gameEngine.storyData);
                
                // 应用到游戏引擎
                this.gameEngine.storyData = variantStory;
                this.gameEngine.loadNode(this.gameEngine.currentNode);

                // 显示成功信息
                this.uiManager.showNotification('故事变体已生成！随机事件已添加到当前故事中。', 'success');
                
                // 关闭对话框
                this.hideDialog(overlay);

                generateBtn.textContent = originalText;
                generateBtn.disabled = false;
            }, 300);

        } catch (error) {
            console.error('生成故事变体失败:', error);
            this.uiManager.showNotification('生成故事变体失败：' + error.message, 'error');
        }
    }

    // 获取模板图标
    getTemplateIcon(templateId) {
        const icons = {
            adventure: '⚔️',
            mystery: '🔍', 
            fantasy: '🧙‍♂️'
        };
        return icons[templateId] || '📖';
    }

    // 获取模板描述
    getTemplateDescription(templateId) {
        const descriptions = {
            adventure: '探索、战斗、寻宝',
            mystery: '调查、解谜、推理',
            fantasy: '魔法、精灵、传奇'
        };
        return descriptions[templateId] || '经典故事';
    }

    // 隐藏对话框
    hideDialog(overlay) {
        overlay.style.opacity = '0';
        overlay.querySelector('.generator-dialog').style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 300);
    }

    // 显示生成器预览
    showGeneratorPreview() {
        const previewData = {
            templates: this.storyGenerator.getAvailableTemplates(),
            totalElements: Object.keys(this.storyGenerator.storyElements.characters.allies).length +
                          Object.keys(this.storyGenerator.storyElements.items.weapons).length +
                          this.storyGenerator.randomEvents.length,
            features: [
                '多种故事模板',
                '随机事件系统', 
                '动态内容生成',
                '可重现的随机种子',
                '智能难度调节'
            ]
        };

        const previewHtml = `
            <div style="padding: 1rem; background: #f0f4ff; border-radius: 8px; margin: 1rem 0;">
                <h4 style="color: #667eea; margin-bottom: 0.5rem;">🎲 随机故事生成器</h4>
                <p style="margin-bottom: 0.5rem; color: #4a5568;">
                    包含 ${previewData.templates.length} 种故事模板，${previewData.totalElements} 个故事元素
                </p>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    ${previewData.features.map(feature => 
                        `<span style="background: #667eea; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem;">${feature}</span>`
                    ).join('')}
                </div>
            </div>
        `;

        return previewHtml;
    }
}