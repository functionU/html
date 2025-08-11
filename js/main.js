// 全局变量
let gameEngine;
let uiManager;
let saveSystem;
let storyGenerator;
let randomStoryUI;

// 初始化游戏
document.addEventListener('DOMContentLoaded', function() {
    // 创建实例
    gameEngine = new StoryEngine();
    uiManager = new UIManager();
    saveSystem = new SaveSystem();
    storyGenerator = new StoryGenerator();
    randomStoryUI = new RandomStoryUI(storyGenerator, gameEngine, uiManager);

    // 初始化游戏引擎
    gameEngine.initialize(storyData);

    // 设置事件监听器
    setupEventListeners();

    // 显示欢迎信息
    uiManager.showNotification('欢迎来到互动式故事世界！', 'info');

    // 检查是否有自动存档
    if (saveSystem.hasAutoSave()) {
        setTimeout(() => {
            uiManager.showConfirmDialog(
                '检测到自动存档，是否要继续上次的游戏？',
                () => {
                    const gameState = saveSystem.loadAutoSave();
                    if (gameState) {
                        saveSystem.loadGameState(gameEngine, gameState);
                        uiManager.showNotification('继续上次的冒险！', 'success');
                    }
                },
                () => {
                    uiManager.showNotification('开始新的冒险！', 'info');
                }
            );
        }, 1000);
    }

    // 设置自动保存
    setupAutoSave();
});

// 设置事件监听器
function setupEventListeners() {
    // 生成随机故事按钮
    document.getElementById('generateBtn').addEventListener('click', () => {
        randomStoryUI.showGeneratorInterface();
    });

    // 保存按钮
    document.getElementById('saveBtn').addEventListener('click', () => {
        saveSystem.showSaveInterface(gameEngine, uiManager);
    });

    // 加载按钮
    document.getElementById('loadBtn').addEventListener('click', () => {
        saveSystem.showLoadInterface(gameEngine, uiManager);
    });

    // 重新开始按钮
    document.getElementById('restartBtn').addEventListener('click', () => {
        uiManager.showConfirmDialog(
            '确定要重新开始游戏吗？当前进度将会丢失。',
            () => {
                gameEngine.restart();
                uiManager.showNotification('游戏已重新开始！', 'info');
            }
        );
    });

    // 键盘快捷键
    document.addEventListener('keydown', handleKeyboardShortcuts);

    // 页面离开前保存
    window.addEventListener('beforeunload', () => {
        const gameState = gameEngine.saveGame();
        saveSystem.autoSave(gameState);
    });

    // 响应式设计：窗口大小改变时调整UI
    window.addEventListener('resize', handleWindowResize);
}

// 处理键盘快捷键
function handleKeyboardShortcuts(event) {
    // Ctrl+S 保存游戏
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        saveSystem.showSaveInterface(gameEngine, uiManager);
    }
    
    // Ctrl+L 加载游戏
    if (event.ctrlKey && event.key === 'l') {
        event.preventDefault();
        saveSystem.showLoadInterface(gameEngine, uiManager);
    }
    
    // 数字键1-9选择选项
    if (event.key >= '1' && event.key <= '9') {
        const choiceIndex = parseInt(event.key) - 1;
        const choices = document.querySelectorAll('.choice-btn');
        if (choices[choiceIndex]) {
            choices[choiceIndex].click();
        }
    }
    
    // Esc键关闭对话框
    if (event.key === 'Escape') {
        const dialogs = document.querySelectorAll('[style*="z-index: 2000"]');
        dialogs.forEach(dialog => {
            const cancelBtn = dialog.querySelector('.btn-secondary');
            if (cancelBtn) {
                cancelBtn.click();
            }
        });
    }
}

// 处理窗口大小改变
function handleWindowResize() {
    // 在移动设备上优化显示
    if (window.innerWidth < 768) {
        document.body.classList.add('mobile-view');
    } else {
        document.body.classList.remove('mobile-view');
    }
}

// 设置自动保存
function setupAutoSave() {
    // 每30秒自动保存一次
    setInterval(() => {
        if (gameEngine && gameEngine.currentNode !== 'start') {
            const gameState = gameEngine.saveGame();
            saveSystem.autoSave(gameState);
        }
    }, 30000);
}

// 扩展StoryEngine类以支持UI动画
const originalUpdateStats = StoryEngine.prototype.updateStats;
StoryEngine.prototype.updateStats = function() {
    const oldStats = {
        health: parseInt(document.getElementById('health').textContent) || this.playerStats.health,
        wisdom: parseInt(document.getElementById('wisdom').textContent) || this.playerStats.wisdom,
        courage: parseInt(document.getElementById('courage').textContent) || this.playerStats.courage
    };

    originalUpdateStats.call(this);

    // 添加动画效果
    if (uiManager) {
        Object.keys(this.playerStats).forEach(stat => {
            const element = document.getElementById(stat);
            if (element && oldStats[stat] !== this.playerStats[stat]) {
                uiManager.animateStatChange(element, oldStats[stat], this.playerStats[stat]);
            }
        });
    }
};

// 扩展StoryEngine类以支持物品高亮
const originalUpdateInventory = StoryEngine.prototype.updateInventory;
StoryEngine.prototype.updateInventory = function() {
    const oldItemCount = document.querySelectorAll('.inventory-item').length;
    
    originalUpdateInventory.call(this);
    
    // 高亮新物品
    const newItemCount = document.querySelectorAll('.inventory-item').length;
    if (newItemCount > oldItemCount && uiManager) {
        const newItems = document.querySelectorAll('.inventory-item');
        if (newItems.length > 0) {
            uiManager.highlightNewItem(newItems[newItems.length - 1]);
        }
    }
};

// 添加一些实用的全局函数
window.gameUtils = {
    // 获取当前游戏状态的JSON
    exportGameState: function() {
        const gameState = gameEngine.saveGame();
        return JSON.stringify(gameState, null, 2);
    },
    
    // 从JSON导入游戏状态
    importGameState: function(jsonString) {
        try {
            const gameState = JSON.parse(jsonString);
            saveSystem.loadGameState(gameEngine, gameState);
            uiManager.showNotification('导入成功！', 'success');
        } catch (error) {
            uiManager.showNotification('导入失败：格式错误', 'error');
        }
    },
    
    // 跳转到指定节点（调试用）
    jumpToNode: function(nodeId) {
        if (storyData.nodes[nodeId]) {
            gameEngine.loadNode(nodeId);
            uiManager.showNotification(`已跳转到节点: ${nodeId}`, 'warning');
        } else {
            uiManager.showNotification('节点不存在！', 'error');
        }
    },
    
    // 修改玩家属性（调试用）
    setPlayerStat: function(stat, value) {
        if (gameEngine.playerStats.hasOwnProperty(stat)) {
            gameEngine.playerStats[stat] = Math.max(0, Math.min(100, value));
            gameEngine.updateStats();
            uiManager.showNotification(`${stat} 已设置为 ${value}`, 'info');
        }
    },
    
    // 添加物品（调试用）
    addItem: function(item) {
        if (!gameEngine.inventory.includes(item)) {
            gameEngine.inventory.push(item);
            gameEngine.updateInventory();
            uiManager.showNotification(`已添加物品: ${item}`, 'success');
        }
    },
    
    // 生成随机故事（调试用）
    generateRandomStory: function(templateType = null, complexity = 'medium') {
        const story = storyGenerator.generateRandomStory(templateType, complexity);
        gameEngine.storyData = story;
        gameEngine.restart();
        gameEngine.initialize(story);
        uiManager.showNotification('随机故事已生成！', 'success');
        return story;
    },
    
    // 生成故事变体（调试用）
    generateStoryVariant: function() {
        if (!gameEngine.storyData) {
            uiManager.showNotification('请先加载一个故事！', 'warning');
            return;
        }
        const variant = storyGenerator.generateStoryVariant(gameEngine.storyData);
        gameEngine.storyData = variant;
        gameEngine.loadNode(gameEngine.currentNode);
        uiManager.showNotification('故事变体已生成！', 'success');
        return variant;
    }
};

// 控制台欢迎信息
console.log('%c🎮 互动式故事系统已加载！', 'color: #667eea; font-size: 16px; font-weight: bold;');
console.log('%c📝 可用的调试命令:', 'color: #4a5568; font-size: 14px;');
console.log('gameUtils.exportGameState() - 导出游戏状态');
console.log('gameUtils.importGameState(json) - 导入游戏状态');
console.log('gameUtils.jumpToNode(nodeId) - 跳转到指定节点');
console.log('gameUtils.setPlayerStat(stat, value) - 设置玩家属性');
console.log('gameUtils.addItem(item) - 添加物品');
console.log('gameUtils.generateRandomStory(type, complexity) - 生成随机故事');
console.log('gameUtils.generateStoryVariant() - 生成故事变体');