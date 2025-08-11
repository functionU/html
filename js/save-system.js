class SaveSystem {
    constructor() {
        this.storageKey = 'interactiveStory_saves';
        this.maxSaves = 10;
    }

    // 保存游戏到指定槽位
    saveGame(slotIndex, gameState, saveName = null) {
        try {
            const saves = this.getAllSaves();
            
            const saveData = {
                slotIndex: slotIndex,
                saveName: saveName || `存档 ${slotIndex + 1}`,
                timestamp: new Date().toISOString(),
                gameState: gameState,
                preview: this.generatePreview(gameState)
            };

            saves[slotIndex] = saveData;
            localStorage.setItem(this.storageKey, JSON.stringify(saves));
            
            return true;
        } catch (error) {
            console.error('保存失败:', error);
            return false;
        }
    }

    // 从指定槽位加载游戏
    loadGame(slotIndex) {
        try {
            const saves = this.getAllSaves();
            
            if (saves[slotIndex]) {
                return saves[slotIndex].gameState;
            }
            
            return null;
        } catch (error) {
            console.error('加载失败:', error);
            return null;
        }
    }

    // 获取所有存档
    getAllSaves() {
        try {
            const saves = localStorage.getItem(this.storageKey);
            return saves ? JSON.parse(saves) : {};
        } catch (error) {
            console.error('读取存档列表失败:', error);
            return {};
        }
    }

    // 删除存档
    deleteSave(slotIndex) {
        try {
            const saves = this.getAllSaves();
            delete saves[slotIndex];
            localStorage.setItem(this.storageKey, JSON.stringify(saves));
            return true;
        } catch (error) {
            console.error('删除存档失败:', error);
            return false;
        }
    }

    // 生成存档预览信息
    generatePreview(gameState) {
        const preview = {
            currentNode: gameState.currentNode,
            stats: gameState.playerStats,
            itemCount: gameState.inventory.length,
            choiceCount: gameState.history.length,
            visitedCount: gameState.visitedNodes.length
        };

        return preview;
    }

    // 检查是否有自动存档
    hasAutoSave() {
        return localStorage.getItem('interactiveStory_autosave') !== null;
    }

    // 自动保存
    autoSave(gameState) {
        try {
            const autoSaveData = {
                timestamp: new Date().toISOString(),
                gameState: gameState
            };
            
            localStorage.setItem('interactiveStory_autosave', JSON.stringify(autoSaveData));
            return true;
        } catch (error) {
            console.error('自动保存失败:', error);
            return false;
        }
    }

    // 加载自动存档
    loadAutoSave() {
        try {
            const autoSave = localStorage.getItem('interactiveStory_autosave');
            if (autoSave) {
                const data = JSON.parse(autoSave);
                return data.gameState;
            }
            return null;
        } catch (error) {
            console.error('加载自动存档失败:', error);
            return null;
        }
    }

    // 显示存档管理界面
    showSaveInterface(gameEngine, uiManager) {
        const overlay = this.createSaveInterface(gameEngine, uiManager);
        document.body.appendChild(overlay);
        
        // 显示动画
        setTimeout(() => {
            overlay.style.opacity = '1';
            overlay.querySelector('.save-dialog').style.transform = 'scale(1)';
        }, 10);
    }

    // 显示加载界面
    showLoadInterface(gameEngine, uiManager) {
        const overlay = this.createLoadInterface(gameEngine, uiManager);
        document.body.appendChild(overlay);
        
        // 显示动画
        setTimeout(() => {
            overlay.style.opacity = '1';
            overlay.querySelector('.save-dialog').style.transform = 'scale(1)';
        }, 10);
    }

    // 创建存档界面
    createSaveInterface(gameEngine, uiManager) {
        const overlay = this.createOverlay();
        const dialog = this.createDialog('保存游戏');
        
        const saves = this.getAllSaves();
        const slotsContainer = document.createElement('div');
        slotsContainer.className = 'save-slots';
        slotsContainer.style.cssText = `
            max-height: 400px;
            overflow-y: auto;
            margin: 1rem 0;
        `;

        // 创建存档槽位
        for (let i = 0; i < this.maxSaves; i++) {
            const slot = this.createSaveSlot(i, saves[i], true);
            slot.onclick = () => {
                const saveName = prompt('输入存档名称:', saves[i]?.saveName || `存档 ${i + 1}`);
                if (saveName !== null) {
                    const gameState = gameEngine.saveGame();
                    if (this.saveGame(i, gameState, saveName)) {
                        uiManager.showNotification('保存成功!', 'success');
                        this.hideDialog(overlay);
                    } else {
                        uiManager.showNotification('保存失败!', 'error');
                    }
                }
            };
            slotsContainer.appendChild(slot);
        }

        const buttonContainer = this.createButtonContainer();
        const cancelBtn = this.createCancelButton(() => this.hideDialog(overlay));
        
        buttonContainer.appendChild(cancelBtn);
        dialog.appendChild(slotsContainer);
        dialog.appendChild(buttonContainer);
        overlay.appendChild(dialog);

        return overlay;
    }

    // 创建加载界面
    createLoadInterface(gameEngine, uiManager) {
        const overlay = this.createOverlay();
        const dialog = this.createDialog('加载游戏');
        
        const saves = this.getAllSaves();
        const slotsContainer = document.createElement('div');
        slotsContainer.className = 'save-slots';
        slotsContainer.style.cssText = `
            max-height: 400px;
            overflow-y: auto;
            margin: 1rem 0;
        `;

        // 如果有自动存档，优先显示
        if (this.hasAutoSave()) {
            const autoSaveSlot = this.createAutoSaveSlot();
            autoSaveSlot.onclick = () => {
                const gameState = this.loadAutoSave();
                if (gameState) {
                    this.loadGameState(gameEngine, gameState);
                    uiManager.showNotification('加载自动存档成功!', 'success');
                    this.hideDialog(overlay);
                } else {
                    uiManager.showNotification('加载自动存档失败!', 'error');
                }
            };
            slotsContainer.appendChild(autoSaveSlot);
        }

        // 创建存档槽位
        Object.keys(saves).forEach(slotIndex => {
            const save = saves[slotIndex];
            const slot = this.createSaveSlot(slotIndex, save, false);
            slot.onclick = () => {
                uiManager.showConfirmDialog(
                    `确定要加载 "${save.saveName}" 吗？当前进度将会丢失。`,
                    () => {
                        const gameState = this.loadGame(parseInt(slotIndex));
                        if (gameState) {
                            this.loadGameState(gameEngine, gameState);
                            uiManager.showNotification('加载成功!', 'success');
                            this.hideDialog(overlay);
                        } else {
                            uiManager.showNotification('加载失败!', 'error');
                        }
                    }
                );
            };
            slotsContainer.appendChild(slot);
        });

        if (Object.keys(saves).length === 0 && !this.hasAutoSave()) {
            slotsContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">暂无存档</p>';
        }

        const buttonContainer = this.createButtonContainer();
        const cancelBtn = this.createCancelButton(() => this.hideDialog(overlay));
        
        buttonContainer.appendChild(cancelBtn);
        dialog.appendChild(slotsContainer);
        dialog.appendChild(buttonContainer);
        overlay.appendChild(dialog);

        return overlay;
    }

    // 创建存档槽位元素
    createSaveSlot(slotIndex, saveData, isForSaving) {
        const slot = document.createElement('div');
        slot.className = 'save-slot';
        slot.style.cssText = `
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            padding: 1rem;
            margin-bottom: 0.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
            background: ${saveData ? '#f7fafc' : '#ffffff'};
        `;

        slot.onmouseenter = () => {
            slot.style.borderColor = '#667eea';
            slot.style.background = '#f0f4ff';
        };

        slot.onmouseleave = () => {
            slot.style.borderColor = '#e2e8f0';
            slot.style.background = saveData ? '#f7fafc' : '#ffffff';
        };

        if (saveData) {
            slot.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <div style="font-weight: bold; margin-bottom: 0.5rem;">${saveData.saveName}</div>
                        <div style="font-size: 0.9rem; color: #666;">
                            节点: ${saveData.preview.currentNode}<br>
                            选择数: ${saveData.preview.choiceCount} | 物品: ${saveData.preview.itemCount}<br>
                            探索进度: ${saveData.preview.visitedCount} 个节点
                        </div>
                    </div>
                    <div style="text-align: right; font-size: 0.8rem; color: #999;">
                        ${new Date(saveData.timestamp).toLocaleString()}
                        ${!isForSaving ? `<br><button onclick="event.stopPropagation(); this.deleteSave(${slotIndex})" style="color: #e53e3e; background: none; border: none; cursor: pointer; font-size: 0.8rem;">删除</button>` : ''}
                    </div>
                </div>
            `;
        } else {
            slot.innerHTML = `
                <div style="text-align: center; color: #999; padding: 1rem;">
                    <div style="font-size: 1.2rem; margin-bottom: 0.5rem;">槽位 ${parseInt(slotIndex) + 1}</div>
                    <div>点击保存游戏</div>
                </div>
            `;
        }

        return slot;
    }

    // 创建自动存档槽位
    createAutoSaveSlot() {
        const slot = document.createElement('div');
        slot.className = 'save-slot auto-save';
        slot.style.cssText = `
            border: 2px solid #48bb78;
            border-radius: 8px;
            padding: 1rem;
            margin-bottom: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            background: #f0fff4;
        `;

        slot.innerHTML = `
            <div style="display: flex; align-items: center;">
                <div style="margin-right: 1rem; color: #48bb78; font-size: 1.2rem;">🔄</div>
                <div>
                    <div style="font-weight: bold; color: #48bb78;">自动存档</div>
                    <div style="font-size: 0.9rem; color: #666;">点击加载最近的自动存档</div>
                </div>
            </div>
        `;

        return slot;
    }

    // 辅助方法
    createOverlay() {
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
        return overlay;
    }

    createDialog(title) {
        const dialog = document.createElement('div');
        dialog.className = 'save-dialog';
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

        const titleElement = document.createElement('h2');
        titleElement.textContent = title;
        titleElement.style.cssText = `
            margin-bottom: 1.5rem;
            color: #2d3748;
            text-align: center;
        `;

        dialog.appendChild(titleElement);
        return dialog;
    }

    createButtonContainer() {
        const container = document.createElement('div');
        container.style.cssText = `
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-top: 1.5rem;
        `;
        return container;
    }

    createCancelButton(onClick) {
        const btn = document.createElement('button');
        btn.textContent = '取消';
        btn.className = 'btn btn-secondary';
        btn.onclick = onClick;
        return btn;
    }

    hideDialog(overlay) {
        overlay.style.opacity = '0';
        overlay.querySelector('.save-dialog').style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 300);
    }

    loadGameState(gameEngine, gameState) {
        gameEngine.currentNode = gameState.currentNode;
        gameEngine.playerStats = gameState.playerStats;
        gameEngine.inventory = gameState.inventory;
        gameEngine.history = gameState.history;
        gameEngine.visitedNodes = new Set(gameState.visitedNodes);
        gameEngine.loadNode(gameEngine.currentNode);
    }
}