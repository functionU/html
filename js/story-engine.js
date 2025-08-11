class StoryEngine {
    constructor() {
        this.currentNode = 'start';
        this.playerStats = {
            health: 100,
            wisdom: 50,
            courage: 50
        };
        this.inventory = [];
        this.history = [];
        this.visitedNodes = new Set();
        this.storyData = null;
    }

    initialize(storyData) {
        this.storyData = storyData;
        this.loadNode(this.currentNode);
    }

    loadNode(nodeId) {
        if (!this.storyData || !this.storyData.nodes[nodeId]) {
            console.error('故事节点不存在:', nodeId);
            return;
        }

        this.currentNode = nodeId;
        this.visitedNodes.add(nodeId);
        
        const node = this.storyData.nodes[nodeId];
        
        // 执行节点的效果
        if (node.effects) {
            this.applyEffects(node.effects);
        }

        // 检查条件
        if (node.conditions) {
            if (!this.checkConditions(node.conditions)) {
                // 如果条件不满足，可能需要跳转到其他节点
                if (node.fallbackNode) {
                    this.loadNode(node.fallbackNode);
                    return;
                }
            }
        }

        // 更新UI
        this.updateUI(node);
        
        // 更新进度
        this.updateProgress();
    }

    makeChoice(choiceIndex, choice) {
        const node = this.storyData.nodes[this.currentNode];
        
        if (!node.choices || !node.choices[choiceIndex]) {
            console.error('选择不存在');
            return;
        }

        // 记录选择历史
        this.history.push({
            nodeId: this.currentNode,
            choice: choice.text,
            timestamp: new Date().toLocaleString()
        });

        // 应用选择的效果
        if (choice.effects) {
            this.applyEffects(choice.effects);
        }

        // 跳转到下一个节点
        if (choice.nextNode) {
            this.loadNode(choice.nextNode);
        } else {
            console.log('故事结束');
            this.showEnding();
        }
    }

    applyEffects(effects) {
        effects.forEach(effect => {
            switch (effect.type) {
                case 'stat':
                    this.playerStats[effect.stat] = Math.max(0, 
                        Math.min(100, this.playerStats[effect.stat] + effect.value));
                    break;
                case 'addItem':
                    if (!this.inventory.includes(effect.item)) {
                        this.inventory.push(effect.item);
                    }
                    break;
                case 'removeItem':
                    const index = this.inventory.indexOf(effect.item);
                    if (index > -1) {
                        this.inventory.splice(index, 1);
                    }
                    break;
            }
        });
    }

    checkConditions(conditions) {
        return conditions.every(condition => {
            switch (condition.type) {
                case 'stat':
                    return this.playerStats[condition.stat] >= condition.value;
                case 'hasItem':
                    return this.inventory.includes(condition.item);
                case 'visitedNode':
                    return this.visitedNodes.has(condition.nodeId);
                default:
                    return true;
            }
        });
    }

    updateUI(node) {
        // 更新故事文本
        const storyTextElement = document.getElementById('storyText');
        storyTextElement.innerHTML = node.text;
        storyTextElement.classList.add('fade-in');
        
        setTimeout(() => {
            storyTextElement.classList.remove('fade-in');
        }, 500);

        // 更新选择按钮
        this.updateChoices(node.choices || []);
        
        // 更新侧边栏
        this.updateStats();
        this.updateInventory();
        this.updateHistory();
    }

    updateChoices(choices) {
        const choicesContainer = document.getElementById('choices');
        choicesContainer.innerHTML = '';

        choices.forEach((choice, index) => {
            // 检查选择条件
            if (choice.conditions && !this.checkConditions(choice.conditions)) {
                return; // 跳过不满足条件的选择
            }

            const button = document.createElement('button');
            button.className = 'choice-btn';
            button.textContent = choice.text;
            
            // 显示选择的效果预览
            if (choice.effects) {
                const preview = this.getEffectPreview(choice.effects);
                if (preview) {
                    button.innerHTML = `${choice.text}<br><small style="color: #666;">${preview}</small>`;
                }
            }

            button.onclick = () => this.makeChoice(index, choice);
            choicesContainer.appendChild(button);
        });
    }

    getEffectPreview(effects) {
        const previews = [];
        effects.forEach(effect => {
            switch (effect.type) {
                case 'stat':
                    const sign = effect.value > 0 ? '+' : '';
                    previews.push(`${this.getStatName(effect.stat)} ${sign}${effect.value}`);
                    break;
                case 'addItem':
                    previews.push(`获得: ${effect.item}`);
                    break;
                case 'removeItem':
                    previews.push(`失去: ${effect.item}`);
                    break;
            }
        });
        return previews.join(', ');
    }

    getStatName(stat) {
        const names = {
            health: '健康',
            wisdom: '智慧',
            courage: '勇气'
        };
        return names[stat] || stat;
    }

    updateStats() {
        document.getElementById('health').textContent = this.playerStats.health;
        document.getElementById('wisdom').textContent = this.playerStats.wisdom;
        document.getElementById('courage').textContent = this.playerStats.courage;
    }

    updateInventory() {
        const inventoryList = document.getElementById('inventoryList');
        inventoryList.innerHTML = '';
        
        if (this.inventory.length === 0) {
            inventoryList.innerHTML = '<div class="inventory-item">空</div>';
            return;
        }

        this.inventory.forEach(item => {
            const div = document.createElement('div');
            div.className = 'inventory-item';
            div.textContent = item;
            inventoryList.appendChild(div);
        });
    }

    updateHistory() {
        const historyList = document.getElementById('historyList');
        historyList.innerHTML = '';
        
        // 只显示最近的5个选择
        const recentHistory = this.history.slice(-5);
        
        recentHistory.forEach(entry => {
            const div = document.createElement('div');
            div.className = 'history-item';
            div.innerHTML = `<strong>${entry.choice}</strong><br><small>${entry.timestamp}</small>`;
            historyList.appendChild(div);
        });
    }

    updateProgress() {
        const totalNodes = Object.keys(this.storyData.nodes).length;
        const visitedCount = this.visitedNodes.size;
        const progress = (visitedCount / totalNodes) * 100;
        
        document.getElementById('progressFill').style.width = `${progress}%`;
    }

    showEnding() {
        const storyTextElement = document.getElementById('storyText');
        storyTextElement.innerHTML = `
            <h2>故事结束</h2>
            <p>感谢您的游玩！</p>
            <p>您访问了 ${this.visitedNodes.size} 个故事节点。</p>
            <p>最终状态：</p>
            <ul>
                <li>健康: ${this.playerStats.health}</li>
                <li>智慧: ${this.playerStats.wisdom}</li>
                <li>勇气: ${this.playerStats.courage}</li>
            </ul>
        `;
        
        document.getElementById('choices').innerHTML = '';
    }

    // 保存游戏状态
    saveGame() {
        const gameState = {
            currentNode: this.currentNode,
            playerStats: { ...this.playerStats },
            inventory: [...this.inventory],
            history: [...this.history],
            visitedNodes: Array.from(this.visitedNodes),
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('interactiveStory_save', JSON.stringify(gameState));
        return gameState;
    }

    // 加载游戏状态
    loadGame() {
        const savedData = localStorage.getItem('interactiveStory_save');
        if (!savedData) return false;

        try {
            const gameState = JSON.parse(savedData);
            this.currentNode = gameState.currentNode;
            this.playerStats = gameState.playerStats;
            this.inventory = gameState.inventory;
            this.history = gameState.history;
            this.visitedNodes = new Set(gameState.visitedNodes);
            
            this.loadNode(this.currentNode);
            return true;
        } catch (error) {
            console.error('加载存档失败:', error);
            return false;
        }
    }

    // 重新开始游戏
    restart() {
        this.currentNode = 'start';
        this.playerStats = { health: 100, wisdom: 50, courage: 50 };
        this.inventory = [];
        this.history = [];
        this.visitedNodes = new Set();
        
        localStorage.removeItem('interactiveStory_save');
        this.loadNode(this.currentNode);
    }
}