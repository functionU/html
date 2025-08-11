class StoryGenerator {
    constructor() {
        this.storyTemplates = this.initializeTemplates();
        this.storyElements = this.initializeElements();
        this.randomEvents = this.initializeRandomEvents();
        this.generatedNodeCounter = 0;
    }

    // 初始化故事模板
    initializeTemplates() {
        return {
            adventure: {
                name: "冒险故事",
                startScenarios: [
                    "你发现了一张古老的宝藏地图",
                    "一个神秘的传送门突然出现在你面前",
                    "你被邀请参加一个危险的远征",
                    "暴风雨后，你漂流到了一个未知的岛屿"
                ],
                locations: ["神秘洞穴", "古老遗迹", "魔法森林", "废弃城堡", "深海洞窟", "天空之城"],
                challenges: ["解谜", "战斗", "逃脱", "寻找线索", "解救人质", "破解机关"],
                rewards: ["宝物", "技能", "盟友", "知识", "魔法道具", "隐藏通道"]
            },
            mystery: {
                name: "悬疑故事", 
                startScenarios: [
                    "一起离奇的失踪案引起了你的注意",
                    "你收到了一封匿名的神秘信件",
                    "古老庄园里传来了奇怪的声音",
                    "一个陌生人留下了一个谜题"
                ],
                locations: ["古老图书馆", "废弃医院", "神秘庄园", "地下室", "阁楼", "密室"],
                challenges: ["调查线索", "访问证人", "破解密码", "追踪嫌疑人", "分析证据", "揭露真相"],
                rewards: ["关键证据", "重要线索", "证人口供", "隐藏信息", "真相片段", "神秘钥匙"]
            },
            fantasy: {
                name: "奇幻故事",
                startScenarios: [
                    "你觉醒了潜藏的魔法能力",
                    "一个精灵请求你的帮助",
                    "恶龙正在威胁附近的村庄",
                    "你被选中成为传说中的英雄"
                ],
                locations: ["魔法学院", "精灵王国", "龙族巢穴", "巫师塔", "魔法森林", "异次元空间"],
                challenges: ["学习法术", "驯服魔兽", "对抗黑暗势力", "收集魔法材料", "完成试炼", "拯救世界"],
                rewards: ["魔法法术", "神器装备", "魔法生物伙伴", "古老知识", "魔法药水", "传说称号"]
            }
        };
    }

    // 初始化故事元素库
    initializeElements() {
        return {
            characters: {
                allies: ["智慧老人", "勇敢骑士", "神秘法师", "机灵盗贼", "善良精灵", "忠诚守卫"],
                enemies: ["邪恶巫师", "残忍强盗", "凶猛怪兽", "腐败贵族", "黑暗骑士", "恶魔召唤师"],
                neutral: ["神秘商人", "普通村民", "守门人", "旅行者", "隐士", "图书管理员"]
            },
            items: {
                weapons: ["魔法剑", "古老法杖", "神射弓", "符文匕首", "圣光盾牌", "战锤"],
                tools: ["万能钥匙", "隐身斗篷", "治疗药水", "魔法绳索", "探测水晶", "传送卷轴"],
                treasures: ["黄金宝箱", "珍贵宝石", "古老硬币", "魔法水晶", "神秘雕像", "传说饰品"]
            },
            events: {
                positive: ["发现隐藏宝藏", "遇到友善角色", "获得意外帮助", "发现捷径", "获得新技能"],
                negative: ["遭遇陷阱", "迷路困境", "物品损坏", "遇到敌人", "天气变坏"],
                neutral: ["发现新信息", "遇到选择分歧", "环境变化", "时间紧迫", "需要休息"]
            }
        };
    }

    // 初始化随机事件系统
    initializeRandomEvents() {
        return [
            {
                id: "weather_change",
                name: "天气变化",
                probability: 0.15,
                effects: [
                    { type: "stat", stat: "health", value: -5 },
                    { type: "addItem", item: "雨衣" }
                ],
                descriptions: [
                    "突然下起了大雨，你全身湿透，但找到了一件雨衣。",
                    "狂风大作，你需要找地方避风。",
                    "浓雾弥漫，视线变得模糊。"
                ]
            },
            {
                id: "random_encounter",
                name: "随机遭遇",
                probability: 0.2,
                effects: [
                    { type: "stat", stat: "courage", value: 10 }
                ],
                descriptions: [
                    "你遇到了一个友善的旅行者，从他那里学到了宝贵经验。",
                    "一只小动物向你求助，帮助它让你感到满足。",
                    "你发现了一个隐藏的小径，这增强了你的信心。"
                ]
            },
            {
                id: "lucky_find",
                name: "幸运发现",
                probability: 0.1,
                effects: [
                    { type: "addItem", item: "幸运符" },
                    { type: "stat", stat: "wisdom", value: 5 }
                ],
                descriptions: [
                    "你在路边发现了一个闪闪发光的物品。",
                    "仔细搜索后，你找到了一些有用的东西。",
                    "运气不错！你捡到了一个神秘物品。"
                ]
            }
        ];
    }

    // 生成随机故事的主入口
    generateRandomStory(templateType = null, complexity = 'medium') {
        // 如果没有指定模板，随机选择一个
        if (!templateType) {
            const templates = Object.keys(this.storyTemplates);
            templateType = this.randomChoice(templates);
        }

        const template = this.storyTemplates[templateType];
        if (!template) {
            throw new Error(`未知的故事模板: ${templateType}`);
        }

        // 生成故事的基本结构
        const storyStructure = this.generateStoryStructure(template, complexity);
        
        // 将结构转换为story-data格式
        const storyData = this.convertToStoryData(storyStructure, template);

        return storyData;
    }

    // 生成故事结构
    generateStoryStructure(template, complexity) {
        const structure = {
            type: template.name,
            nodes: [],
            currentNodeId: 'generated_start'
        };

        // 根据复杂度决定节点数量
        const nodeCount = complexity === 'simple' ? 5 : complexity === 'medium' ? 8 : 12;
        
        // 生成起始节点
        const startNode = this.generateStartNode(template);
        structure.nodes.push(startNode);

        // 生成中间节点
        for (let i = 1; i < nodeCount - 1; i++) {
            const node = this.generateMiddleNode(template, i);
            structure.nodes.push(node);
        }

        // 生成结尾节点
        const endNode = this.generateEndNode(template);
        structure.nodes.push(endNode);

        return structure;
    }

    // 生成起始节点
    generateStartNode(template) {
        const scenario = this.randomChoice(template.startScenarios);
        const location = this.randomChoice(template.locations);
        
        return {
            id: 'generated_start',
            type: 'start',
            text: `<h2>${template.name}开始</h2><p>${scenario}</p><p>你现在位于${location}，需要做出第一个重要决定。</p>`,
            choices: this.generateChoices(template, 3, 'start')
        };
    }

    // 生成中间节点
    generateMiddleNode(template, index) {
        const nodeId = `generated_node_${index}`;
        const location = this.randomChoice(template.locations);
        const challenge = this.randomChoice(template.challenges);
        const character = this.randomChoice([
            ...this.storyElements.characters.allies,
            ...this.storyElements.characters.neutral,
            ...this.storyElements.characters.enemies
        ]);

        // 随机添加事件
        let eventText = '';
        if (Math.random() < 0.3) { // 30%概率触发随机事件
            const event = this.randomChoice(this.randomEvents);
            if (Math.random() < event.probability) {
                eventText = `<p><em>${this.randomChoice(event.descriptions)}</em></p>`;
            }
        }

        const text = `
            <h3>${location}</h3>
            <p>在${location}中，你遇到了${character}。</p>
            <p>面前的挑战是：${challenge}。</p>
            ${eventText}
            <p>你需要决定下一步行动...</p>
        `;

        return {
            id: nodeId,
            type: 'middle',
            text: text,
            choices: this.generateChoices(template, this.randomInt(2, 4), 'middle'),
            effects: this.generateRandomEffects()
        };
    }

    // 生成结尾节点
    generateEndNode(template) {
        const endings = [
            { type: 'victory', text: '恭喜！你成功完成了冒险，获得了丰厚的奖励。' },
            { type: 'partial', text: '虽然遇到了困难，但你还是达成了部分目标。' },
            { type: 'defeat', text: '这次冒险没有成功，但你获得了宝贵的经验。' },
            { type: 'mystery', text: '故事还没有结束，新的谜团等待着你去解开。' }
        ];

        const ending = this.randomChoice(endings);
        const reward = this.randomChoice(template.rewards);

        return {
            id: 'generated_end',
            type: 'end',
            text: `
                <h2>${ending.type === 'victory' ? '胜利结局' : '故事结局'}</h2>
                <p>${ending.text}</p>
                <p>最终奖励：${reward}</p>
                <p><strong>感谢游玩这个随机生成的${template.name}！</strong></p>
            `,
            choices: []
        };
    }

    // 生成选择选项
    generateChoices(template, count, nodeType) {
        const choices = [];
        const actions = [
            '继续探索', '寻找线索', '与角色交流', '使用物品', 
            '尝试其他路径', '休息恢复', '仔细观察', '快速行动'
        ];

        for (let i = 0; i < count; i++) {
            const action = this.randomChoice(actions);
            const nextNodeId = nodeType === 'start' ? `generated_node_${i + 1}` :
                             nodeType === 'middle' ? (Math.random() < 0.8 ? `generated_node_${this.randomInt(1, 6)}` : 'generated_end') :
                             null;

            choices.push({
                text: `${action}`,
                nextNode: nextNodeId,
                effects: this.generateRandomEffects(0.4), // 40%概率有效果
                conditions: Math.random() < 0.2 ? this.generateRandomConditions() : null // 20%概率有条件
            });
        }

        return choices;
    }

    // 生成随机效果
    generateRandomEffects(probability = 0.6) {
        if (Math.random() > probability) return null;

        const effects = [];
        const stats = ['health', 'wisdom', 'courage'];
        
        // 随机修改一个属性
        if (Math.random() < 0.7) {
            const stat = this.randomChoice(stats);
            const value = this.randomInt(-15, 20);
            effects.push({ type: 'stat', stat: stat, value: value });
        }

        // 随机添加物品
        if (Math.random() < 0.3) {
            const items = [
                ...this.storyElements.items.weapons,
                ...this.storyElements.items.tools,
                ...this.storyElements.items.treasures
            ];
            const item = this.randomChoice(items);
            effects.push({ type: 'addItem', item: item });
        }

        return effects.length > 0 ? effects : null;
    }

    // 生成随机条件
    generateRandomConditions() {
        const conditions = [];
        const stats = ['health', 'wisdom', 'courage'];
        
        if (Math.random() < 0.8) {
            const stat = this.randomChoice(stats);
            const value = this.randomInt(20, 80);
            conditions.push({ type: 'stat', stat: stat, value: value });
        }

        return conditions.length > 0 ? conditions : null;
    }

    // 转换为story-data格式
    convertToStoryData(structure, template) {
        const nodes = {};
        
        structure.nodes.forEach(node => {
            nodes[node.id] = {
                text: node.text,
                choices: node.choices || [],
                effects: node.effects || null,
                conditions: node.conditions || null
            };
        });

        return {
            title: `随机${template.name}`,
            nodes: nodes
        };
    }

    // 生成基于现有故事的变体
    generateStoryVariant(originalStoryData) {
        const nodes = { ...originalStoryData.nodes };
        
        // 为每个节点添加随机事件的可能性
        Object.keys(nodes).forEach(nodeId => {
            if (Math.random() < 0.25) { // 25%概率添加随机事件
                const event = this.randomChoice(this.randomEvents);
                const eventDescription = this.randomChoice(event.descriptions);
                
                // 在原文本后添加事件描述
                nodes[nodeId].text += `<p><em>突然，${eventDescription}</em></p>`;
                
                // 添加事件效果
                if (!nodes[nodeId].effects) {
                    nodes[nodeId].effects = [];
                }
                nodes[nodeId].effects.push(...event.effects);
            }
        });

        return { ...originalStoryData, nodes: nodes };
    }

    // 实时生成下一个节点
    generateNextNode(currentNodeId, choice, gameState) {
        this.generatedNodeCounter++;
        const newNodeId = `dynamic_${this.generatedNodeCounter}`;
        
        // 根据当前游戏状态和选择生成下一个节点
        const template = this.getTemplateBasedOnState(gameState);
        const node = this.generateContextualNode(newNodeId, choice, gameState, template);
        
        return { nodeId: newNodeId, node: node };
    }

    // 根据游戏状态选择模板
    getTemplateBasedOnState(gameState) {
        // 根据玩家的属性和物品选择合适的模板
        if (gameState.playerStats.courage > 70) {
            return this.storyTemplates.adventure;
        } else if (gameState.playerStats.wisdom > 70) {
            return this.storyTemplates.mystery;
        } else {
            return this.storyTemplates.fantasy;
        }
    }

    // 生成上下文相关的节点
    generateContextualNode(nodeId, choice, gameState, template) {
        const location = this.randomChoice(template.locations);
        const challenge = this.randomChoice(template.challenges);
        
        // 根据玩家状态调整内容
        let difficultyText = '';
        if (gameState.playerStats.health < 30) {
            difficultyText = '你感到疲惫，需要谨慎行事。';
        } else if (gameState.playerStats.courage > 80) {
            difficultyText = '你充满信心，准备面对任何挑战。';
        }

        const text = `
            <h3>${location}</h3>
            <p>根据你的选择"${choice.text}"，你来到了${location}。</p>
            <p>${difficultyText}</p>
            <p>新的挑战出现了：${challenge}</p>
        `;

        return {
            text: text,
            choices: this.generateChoices(template, 3, 'middle'),
            effects: this.generateRandomEffects()
        };
    }

    // 工具方法：随机选择
    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // 工具方法：随机整数
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // 获取所有可用的故事模板
    getAvailableTemplates() {
        return Object.keys(this.storyTemplates).map(key => ({
            id: key,
            name: this.storyTemplates[key].name
        }));
    }

    // 设置随机种子（用于可重现的随机故事）
    setSeed(seed) {
        // 简单的伪随机数生成器
        this.seed = seed;
        this.random = () => {
            this.seed = (this.seed * 9301 + 49297) % 233280;
            return this.seed / 233280;
        };
    }
}