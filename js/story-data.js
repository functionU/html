const storyData = {
    nodes: {
        start: {
            text: `
                <h2>神秘森林的冒险</h2>
                <p>你是一名年轻的冒险者，在茂密的森林中迷失了方向。夜幕降临，远处传来神秘的声音。</p>
                <p>你发现自己站在一个三岔路口前，每条路都通向未知的地方。</p>
                <p>你必须做出选择...</p>
            `,
            choices: [
                {
                    text: "走左边的小径，向着微弱的光芒前进",
                    nextNode: "leftPath",
                    effects: [
                        { type: "stat", stat: "courage", value: 5 }
                    ]
                },
                {
                    text: "选择右边的道路，跟随鸟儿的歌声",
                    nextNode: "rightPath",
                    effects: [
                        { type: "stat", stat: "wisdom", value: 5 }
                    ]
                },
                {
                    text: "直接穿过中间的密林",
                    nextNode: "middlePath",
                    effects: [
                        { type: "stat", stat: "health", value: -10 },
                        { type: "stat", stat: "courage", value: 10 }
                    ]
                }
            ]
        },

        leftPath: {
            text: `
                <h3>光明之径</h3>
                <p>你沿着左边的小径前进，微弱的光芒越来越亮。原来是一个小木屋里透出的温暖灯光。</p>
                <p>一位慈祥的老婆婆坐在门前，她微笑着向你招手。</p>
                <p>"年轻人，夜深了，进来喝杯热茶吧。"她说道。</p>
            `,
            choices: [
                {
                    text: "接受老婆婆的邀请，进入小屋",
                    nextNode: "oldWomanHouse",
                    effects: [
                        { type: "stat", stat: "health", value: 20 },
                        { type: "addItem", item: "温暖的茶" }
                    ]
                },
                {
                    text: "礼貌地谢绝，继续前进",
                    nextNode: "continueAlone",
                    effects: [
                        { type: "stat", stat: "wisdom", value: 10 }
                    ]
                },
                {
                    text: "询问回家的路",
                    nextNode: "askDirections"
                }
            ]
        },

        rightPath: {
            text: `
                <h3>鸟语花香</h3>
                <p>你跟随着悦耳的鸟鸣声前进，来到了一片美丽的花园。</p>
                <p>各种奇异的花朵在月光下闪闪发光，空气中弥漫着甜美的香气。</p>
                <p>突然，你注意到花园中央有一朵特别的蓝色玫瑰，似乎在召唤着你。</p>
            `,
            choices: [
                {
                    text: "小心地摘下蓝色玫瑰",
                    nextNode: "magicRose",
                    effects: [
                        { type: "addItem", item: "魔法蓝玫瑰" },
                        { type: "stat", stat: "wisdom", value: 15 }
                    ]
                },
                {
                    text: "只是欣赏，不要触碰",
                    nextNode: "admireGarden",
                    effects: [
                        { type: "stat", stat: "health", value: 10 },
                        { type: "stat", stat: "wisdom", value: 5 }
                    ]
                },
                {
                    text: "寻找花园的主人",
                    nextNode: "gardenKeeper"
                }
            ]
        },

        middlePath: {
            text: `
                <h3>荆棘密径</h3>
                <p>你勇敢地直接穿过茂密的森林，荆棘划伤了你的皮肤，但你坚持向前。</p>
                <p>经过一番艰难的跋涉，你来到了一个古老的石圈前。</p>
                <p>石圈中央有一个神秘的祭坛，上面放着一个发光的水晶球。</p>
            `,
            choices: [
                {
                    text: "触碰水晶球",
                    nextNode: "crystalBall",
                    conditions: [
                        { type: "stat", stat: "courage", value: 40 }
                    ],
                    effects: [
                        { type: "addItem", item: "预言水晶" },
                        { type: "stat", stat: "wisdom", value: 25 }
                    ]
                },
                {
                    text: "仔细观察石圈的符文",
                    nextNode: "ancientRunes",
                    effects: [
                        { type: "stat", stat: "wisdom", value: 15 }
                    ]
                },
                {
                    text: "快速离开这个地方",
                    nextNode: "escapeCircle",
                    effects: [
                        { type: "stat", stat: "health", value: -5 }
                    ]
                }
            ]
        },

        oldWomanHouse: {
            text: `
                <h3>温暖的小屋</h3>
                <p>小屋内温暖如春，老婆婆为你准备了香甜的茶和食物。</p>
                <p>在炉火的照耀下，她开始讲述关于这片森林的古老传说。</p>
                <p>"这里曾经是精灵们的家园，"她说，"如果你诚心诚意，他们会指引你回家的路。"</p>
            `,
            choices: [
                {
                    text: "请求老婆婆教你召唤精灵的方法",
                    nextNode: "learnMagic",
                    effects: [
                        { type: "addItem", item: "精灵召唤咒语" },
                        { type: "stat", stat: "wisdom", value: 20 }
                    ]
                },
                {
                    text: "询问森林的出口在哪里",
                    nextNode: "getDirections"
                },
                {
                    text: "在小屋里过夜",
                    nextNode: "restInHouse",
                    effects: [
                        { type: "stat", stat: "health", value: 30 }
                    ]
                }
            ]
        },

        magicRose: {
            text: `
                <h3>魔法的力量</h3>
                <p>当你触碰蓝色玫瑰的那一刻，一股温暖的能量流遍全身。</p>
                <p>玫瑰在你手中发出柔和的蓝光，你感到内心充满了智慧和力量。</p>
                <p>突然，一个清脆的声音在你耳边响起："勇敢的旅者，我能帮助你找到回家的路。"</p>
            `,
            choices: [
                {
                    text: "询问声音的主人是谁",
                    nextNode: "flowerSpirit",
                    conditions: [
                        { type: "hasItem", item: "魔法蓝玫瑰" }
                    ]
                },
                {
                    text: "请求指引回家的路",
                    nextNode: "homeGuidance",
                    conditions: [
                        { type: "hasItem", item: "魔法蓝玫瑰" }
                    ]
                },
                {
                    text: "感谢并继续探索",
                    nextNode: "continueExploring"
                }
            ]
        },

        crystalBall: {
            text: `
                <h3>预言的启示</h3>
                <p>当你勇敢地触碰水晶球时，一幅幅画面在你脑海中闪现。</p>
                <p>你看到了森林的全貌，看到了回家的路径，也看到了隐藏在森林深处的秘密。</p>
                <p>水晶球告诉你，这片森林是连接两个世界的桥梁，而你现在拥有了穿越的能力。</p>
            `,
            choices: [
                {
                    text: "选择回到原来的世界",
                    nextNode: "returnHome",
                    conditions: [
                        { type: "hasItem", item: "预言水晶" }
                    ]
                },
                {
                    text: "选择探索新的世界",
                    nextNode: "newWorld",
                    conditions: [
                        { type: "hasItem", item: "预言水晶" }
                    ]
                },
                {
                    text: "寻找更多关于森林的秘密",
                    nextNode: "forestSecrets"
                }
            ]
        },

        learnMagic: {
            text: `
                <h3>精灵的祝福</h3>
                <p>老婆婆教会了你古老的精灵召唤咒语。当你轻声吟唱时，森林中出现了点点光芒。</p>
                <p>几个美丽的精灵出现在你面前，他们愿意帮助这个善良的旅者。</p>
                <p>"我们会为你点亮回家的路，"精灵首领说道，"但你必须承诺保护这片森林。"</p>
            `,
            choices: [
                {
                    text: "郑重承诺保护森林",
                    nextNode: "protectorEnding",
                    effects: [
                        { type: "addItem", item: "森林守护者徽章" }
                    ]
                },
                {
                    text: "谢绝承诺，只想回家",
                    nextNode: "simpleReturn"
                }
            ]
        },

        flowerSpirit: {
            text: `
                <h3>花之精灵</h3>
                <p>"我是花园的守护精灵，"声音说道，"你的善良打动了我。"</p>
                <p>一个美丽的精灵从玫瑰中显现，她有着透明的翅膀和花朵般的衣裙。</p>
                <p>"这片森林有很多秘密，而你现在有了探索它们的钥匙。你想知道什么呢？"</p>
            `,
            choices: [
                {
                    text: "询问如何回到人类世界",
                    nextNode: "spiritGuidance"
                },
                {
                    text: "请求成为森林的朋友",
                    nextNode: "forestFriend",
                    effects: [
                        { type: "addItem", item: "精灵友谊之证" }
                    ]
                },
                {
                    text: "询问森林的历史",
                    nextNode: "forestHistory"
                }
            ]
        },

        protectorEnding: {
            text: `
                <h2>森林守护者</h2>
                <p>你成为了森林的守护者，精灵们为你开启了往返两个世界的通道。</p>
                <p>从此以后，你既能回到人类世界生活，也能在需要的时候回到森林保护这里的生灵。</p>
                <p>你获得了特殊的能力，可以与动植物交流，成为了两个世界之间的桥梁。</p>
                <p><strong>恭喜你达成了"守护者"结局！</strong></p>
            `,
            choices: []
        },

        spiritGuidance: {
            text: `
                <h2>精灵的指引</h2>
                <p>花之精灵用魔法为你指明了回家的路。蓝色的光芒在森林中形成了一条小径。</p>
                <p>"跟着光芒走，"她说，"当第一缕阳光照射大地时，你就能回到家了。"</p>
                <p>你带着感激的心情踏上了回家的路，魔法蓝玫瑰在你手中温暖地发光。</p>
                <p><strong>恭喜你达成了"精灵指引"结局！</strong></p>
            `,
            choices: []
        },

        returnHome: {
            text: `
                <h2>预言的归途</h2>
                <p>借助预言水晶的力量，你看清了回家的路。森林在你眼中不再是迷宫，而是一幅清晰的地图。</p>
                <p>你成功地走出了森林，回到了熟悉的世界。但你知道，这次冒险改变了你。</p>
                <p>你变得更加勇敢、智慧，并且永远不会忘记那片神奇的森林。</p>
                <p><strong>恭喜你达成了"预言归途"结局！</strong></p>
            `,
            choices: []
        },

        newWorld: {
            text: `
                <h2>新世界的探险家</h2>
                <p>你选择了探索新的世界，预言水晶带你穿过了时空的门户。</p>
                <p>在新的世界里，你遇到了更多奇妙的生物和不可思议的冒险。</p>
                <p>你成为了一名跨世界的探险家，用勇气和智慧书写着属于自己的传奇。</p>
                <p><strong>恭喜你达成了"新世界探险家"结局！</strong></p>
            `,
            choices: []
        },

        simpleReturn: {
            text: `
                <h2>简单的回归</h2>
                <p>精灵们虽然有些失望，但还是为你指明了回家的路。</p>
                <p>你安全地回到了人类世界，但总觉得失去了什么重要的东西。</p>
                <p>也许有一天，你会再次回到那片森林，做出不同的选择。</p>
                <p><strong>你达成了"平凡归途"结局。</strong></p>
            `,
            choices: []
        },

        // 添加更多节点...
        continueAlone: {
            text: `
                <h3>独自前行</h3>
                <p>你礼貌地谢绝了老婆婆的邀请，继续在森林中前进。</p>
                <p>虽然夜色更深了，但你的智慧让你能够辨认方向。</p>
                <p>不久后，你发现了一条小溪，溪水清澈见底。</p>
            `,
            choices: [
                {
                    text: "沿着小溪向上游走",
                    nextNode: "upstream"
                },
                {
                    text: "沿着小溪向下游走", 
                    nextNode: "downstream"
                }
            ]
        },

        upstream: {
            text: `
                <h2>溪流的源头</h2>
                <p>你沿着小溪来到了它的源头——一个美丽的瀑布。</p>
                <p>在瀑布后面，你发现了一个隐秘的洞穴，洞口有微弱的光芒。</p>
                <p>这里就是森林的出口！你成功地找到了回家的路。</p>
                <p><strong>恭喜你达成了"智者之路"结局！</strong></p>
            `,
            choices: []
        }
    }
};