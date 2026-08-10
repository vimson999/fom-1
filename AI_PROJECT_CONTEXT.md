# Fields of Mistria Wiki — AI 项目上下文

## 这是什么项目

这是一个英文优先的《Fields of Mistria》非官方粉丝 Wiki／攻略站。目标是用真实、可追溯的资料，为玩家提供可被搜索发现的攻略内容；不是生成没有来源的泛泛介绍。

首版参考 Solarpunk Wiki 的信息架构、页面密度和交互节奏，但不得复制其名称、文案、图片、游戏数据、样式代码或其他品牌资产。

## 当前目标

1. 维护一个可运行的 Next.js 网站。
2. 首页展示第 4 关调研中确认的站点介绍、官方入口、SEO 信息、导航以及现有指南／条目入口。
3. 十个已具备资料的关键词各有一篇独立 MDX 攻略。
4. 让后续 AI 或开发者可以安全地新增页面、修正资料、测试和优化，不破坏已有结构。

## 技术与本地运行

- 框架：Next.js App Router + TypeScript。
- 内容格式：MDX。
- 首发语言：English；未完成的翻译不保留可见入口或无效语言配置，待翻译内容可发布时再启用。
- 本地启动：双击 `start.command`。
- 本地重启：双击 `restart.command`。
- 终端命令：`./scripts/dev-server.sh start`、`restart`、`stop`。
- 本地日志：`.local/fields-of-mistria-dev.log`。
- 自动测试：`npm test`。
- 生产构建：`npm run build`。

## 现有路由

| 路由 | 用途 |
| --- | --- |
| `/` | 首页：Hero、起步导航、游戏介绍、指南／条目入口、最终 CTA、官方入口。 |
| `/database/items` | 可搜索、可按分类筛选的条目列表。 |
| `/database/items/[slug]` | 物品详情模板，包含结构化信息、来源和相关条目。 |
| `/guides` | 十篇关键词攻略的导航页。 |
| `/guides/[slug]` | MDX 攻略文章模板。 |

## 内容来源与依据

所有正式游戏内容应优先来自项目内的 `references/`：

- `references/source-materials/Fields of Mistria - All 30 Documents/`：十个主题的 Raw Full Text、Official Steam Text 与 YouTube Transcripts。
- `references/keywords.json`：关键词分类参考。
- `references/stage-4-project-research.md`：官方链接、首页文案、SEO、主题色、语言优先级和兑换码状态。

首页已确认的官方入口：

- 官网：`https://www.fieldsofmistria.com/`
- Steam：`https://store.steampowered.com/app/2142790/Fields_of_Mistria/`
- Discord：`https://discord.gg/fieldsofmistria`
- YouTube：`https://www.youtube.com/watch?v=0hW64R15-qI`

## 已发布的十个内容主题

1. fields of mistria guide
2. fields of mistria characters
3. fields of mistria farm layout
4. fields of mistria items
5. how to get shovel fields of mistria
6. water chestnuts fields of mistria
7. fields of mistria deep woods fish
8. stone loach fields of mistria
9. olric fields of mistria gifts
10. wedding outfits fields of mistria

对应 MDX 均位于 `content/guides/`。本轮只做这十个已有素材支撑的页面；`关键字.json` 中其余没有匹配素材的关键词不应擅自发布。

## 不可违反的内容规则

- 只使用已收集或后来明确补充的真实资料。
- 不编造数值、掉率、价格、角色名、兑换码、游戏机制、更新内容、官方链接或物品效果。
- 无法从来源确认的细节应省略；仅在版本差异确实影响操作时使用一条简洁的英文 `Version note`，不得显示内部占位词或编辑说明。
- 每个内容页的 title 必须含目标关键词，长度 40–60 字符。
- meta description 必须含目标关键词，长度 140–160 字符。
- 正文开头直接回答搜索问题；正文约 1200 个英文词；使用 H2；段落保持 3–4 句，方便扫读。
- 每篇文章保留来源 URL；AI 研究报告只能辅助定位，不可作为唯一事实依据。
- 不复制 Solarpunk Wiki 或其他对标站的正文、数据、品牌或图片。

## 视觉与品牌约束

- 默认亮色主题，暖象牙白背景、森林绿和暖金色。
- 导航主色：`145 42% 45%`；深色导航变体：`145 35% 32%`。
- 视觉气质：舒适的 90 年代动画农场游戏。
- 使用项目 `public/` 中的已生成 favicon；不要替换为对标站或官方 Logo。
- 页脚必须保留“非官方粉丝 Wiki／不隶属 NPC Studio”的说明。

## 每次迭代前自检

1. 这次改动是否确实服务于一个已确认的用户需求？
2. 新的游戏事实是否有至少一个可追溯来源？没有则省略；版本差异必要时用一条简洁的 `Version note`。
3. 是否意外复制了对标站的文案、图片、名称或数据？
4. 新增页面是否使用独立 title、description 和正确关键词？
5. 是否维持英文首发范围，而没有制造未完成的翻译页面？
6. 是否避免把资料不足的关键词伪装成完整攻略？

## 每次迭代后自检

1. 运行 `npm test`。
2. 运行 `npm run build`。
3. 检查首页、`/guides`、至少一篇文章和 `/database/items` 是否能打开。
4. 查看 `.local/fields-of-mistria-dev.log` 是否出现实际运行错误。
5. 检查移动端窄宽度下的导航、卡片、筛选和文章可读性。
6. 用 `git status --short` 确认没有遗漏应提交的文件。
7. 提交前复核：来源、SEO 字符数、必要的版本说明和非官方声明仍然正确。

## 当前发布状态与后续范围

- 隐私政策与服务条款页面已提供，页脚保留可访问入口。
- Canonical production domain 已配置为 `https://fieldsofmistria.land`，生产构建、安全响应头、robots 与 sitemap 配置已完成。
- 非英文翻译尚未制作，因此当前不显示语言切换入口，也不保留未启用语言配置。
- 兑换码没有已确认来源，因此当前不发布兑换码模块；获得可信来源后再作为独立内容评估。
- 攻略中的版本、掉率、价格、解锁与库存细节若缺少可靠依据，应省略或引导读者查看当前游戏信息，不得重新加入占位文案。
