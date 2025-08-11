# 互动式故事系统

一个基于Web的互动式故事游戏引擎，支持分支剧情、状态管理、存档系统等功能。

## 特性

### 🎮 核心功能
- **分支叙事**: 支持复杂的故事分支和多结局
- **状态管理**: 玩家属性（健康、智慧、勇气）动态变化
- **条件系统**: 基于玩家状态和物品的选择条件判断
- **物品系统**: 收集和使用各种物品
- **进度追踪**: 实时显示游戏进度和探索状态

### 🎲 随机故事生成器
- **智能生成**: 基于模板自动创建独特故事内容
- **多种类型**: 冒险、悬疑、奇幻等不同主题
- **动态扩展**: 根据玩家选择实时生成新节点
- **随机事件**: 增加故事的不可预测性和趣味性
- **可重现性**: 支持随机种子，便于分享和调试

### 💾 存档系统
- **多槽位存档**: 支持10个手动存档槽位
- **自动存档**: 每30秒自动保存游戏进度
- **存档预览**: 显示存档的详细信息和时间戳
- **导入导出**: 支持JSON格式的游戏状态导入导出

### 🎨 用户界面
- **现代化设计**: 响应式设计，支持移动设备
- **动画效果**: 平滑的过渡动画和状态变化提示
- **键盘快捷键**: 支持数字键选择、Ctrl+S保存等
- **通知系统**: 实时状态提示和反馈

## 快速开始

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建项目
```bash
npm run build
```

### 预览构建结果
```bash
npm run preview
```

## 项目结构

```
interactive-story/
├── index.html              # 主HTML文件
├── style.css               # 样式文件
├── package.json            # 项目配置
├── js/
│   ├── story-engine.js     # 故事引擎核心逻辑
│   ├── story-data.js       # 故事数据定义
│   ├── story-generator.js  # 随机故事生成器
│   ├── random-story-ui.js  # 随机故事UI管理
│   ├── ui-manager.js       # UI管理和动画
│   ├── save-system.js      # 存档系统
│   └── main.js             # 主程序入口
├── README.md               # 项目说明
└── RANDOM_STORY_GUIDE.md   # 随机故事生成器指南
```

## 游戏机制

### 故事节点结构
```javascript
{
  "nodeId": {
    "text": "故事文本内容，支持HTML",
    "choices": [
      {
        "text": "选择描述",
        "nextNode": "下个节点ID",
        "conditions": [
          { "type": "stat", "stat": "courage", "value": 50 }
        ],
        "effects": [
          { "type": "stat", "stat": "health", "value": 10 },
          { "type": "addItem", "item": "物品名称" }
        ]
      }
    ]
  }
}
```

### 条件类型
- `stat`: 检查玩家属性值
- `hasItem`: 检查是否拥有指定物品
- `visitedNode`: 检查是否访问过指定节点

### 效果类型
- `stat`: 修改玩家属性值
- `addItem`: 添加物品到背包
- `removeItem`: 从背包移除物品

## 键盘快捷键

- `1-9`: 选择对应选项
- `Ctrl+S`: 保存游戏
- `Ctrl+L`: 加载游戏
- `Esc`: 关闭对话框

## 开发者工具

在浏览器控制台中可以使用以下调试命令：

```javascript
// 导出当前游戏状态
gameUtils.exportGameState()

// 导入游戏状态
gameUtils.importGameState(jsonString)

// 跳转到指定节点
gameUtils.jumpToNode('nodeId')

// 设置玩家属性
gameUtils.setPlayerStat('health', 100)

// 添加物品
gameUtils.addItem('魔法道具')

// 生成随机故事
gameUtils.generateRandomStory('adventure', 'medium')

// 生成故事变体
gameUtils.generateStoryVariant()
```

## 随机故事生成

系统提供强大的随机故事生成功能：

### 使用方法
1. **UI界面**: 点击"生成随机故事"按钮
2. **控制台**: 使用 `gameUtils.generateRandomStory()` 命令
3. **动态模式**: 启用无限长度的故事生成

### 故事模板
- **冒险故事**: 探索未知世界，寻找宝藏
- **悬疑故事**: 解开谜团，揭露真相  
- **奇幻故事**: 魔法世界的英雄传说

详细使用方法请参考 [随机故事生成器指南](RANDOM_STORY_GUIDE.md)。

## 自定义故事

要创建自己的故事，只需修改 `js/story-data.js` 文件：

1. 定义故事节点和选择
2. 设置条件和效果
3. 创建分支路径和多重结局

或者使用随机生成器作为创作灵感的起点！

## 技术栈

- **原生JavaScript**: 核心逻辑实现
- **CSS3**: 现代化样式和动画
- **HTML5**: 语义化结构
- **localStorage**: 本地存档功能
- **Vite**: 开发和构建工具

## 示例故事

项目包含一个完整的示例故事"神秘森林的冒险"，包含：
- 多个分支路径
- 不同的角色和场景
- 条件性选择和多重结局
- 属性和物品系统的完整应用

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request来改进这个项目！