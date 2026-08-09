# Fields of Mistria Wiki

## 项目目标

建设一个面向英文搜索用户的《Fields of Mistria》玩家攻略站／Wiki。网站以真实、可追溯的游戏资料为基础，围绕已有长尾关键词建立可被搜索引擎发现的攻略页面，而不是凭空生成内容。

首页定位：

- 标题：Fields of Mistria Wiki — Guides, Romance & Farm Layouts
- 覆盖内容：新手攻略、角色与恋爱、礼物、物品、钓鱼地点、农场布局与实用技巧。
- 视觉方向：暖象牙白底、森林绿和暖金色；有舒适的 90 年代动画农场游戏氛围。

## 已准备的内容

- 关键词表与页面规划：`../关键字&素材/关键字结合网站.csv`、`../关键字&素材/关键字.json`
- 原始素材档案：`../关键字&素材/Fields of Mistria - All 30 Documents/`
- 按关键词归档的素材库：`../关键字&素材/关键词素材库/`
- 网站图标：`../关键字&素材/` 内的 favicon、Apple Touch Icon 和 Android 图标文件。

## 首批页面

1. Fields of Mistria Guide
2. Fields of Mistria Characters
3. Fields of Mistria Farm Layout
4. Fields of Mistria Items
5. How to Get the Shovel in Fields of Mistria
6. Fields of Mistria Water Chestnuts
7. Fields of Mistria Deep Woods Fish
8. Fields of Mistria Stone Loach
9. Olric Fields of Mistria Gifts
10. Fields of Mistria Wedding Outfits

## 当前阶段

素材准备（教程第三步）已完成；现在进入建站的第四步。代码、配置和本地预览文件都放在本目录。

接下来的顺序：

1. 选择一个同类新游戏 Wiki／攻略站作为结构参考，只参考信息架构和页面布局，不复制其文本或数据。
2. 初始化网站项目，搭建首页、导航、页面模板和基础 SEO。
3. 用已收集的原始资料为十个关键词页面填入内容，并保留来源可追溯性。
4. 本地检查后提交 GitHub、部署上线，再逐页验证。

## 本地启动工具

- 双击 `start.command`：启动本地网站并打开浏览器。
- 双击 `restart.command`：停止本站已有的本地开发进程，再重新启动并打开浏览器。
- 终端方式：运行 `./scripts/dev-server.sh start`、`restart` 或 `stop`。

## 内容原则

- 发布内容以网页原文、Steam 页面／社区资料和视频字幕等来源为依据。
- AI 研究报告仅作辅助索引，不作为唯一事实来源。
- 不编造游戏机制、数值、角色关系或更新内容。
- 首期语言以英文为主；后续可扩展日语、德语和西班牙语。
