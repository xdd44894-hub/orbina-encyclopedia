# 俄庇娜百科

俄庇娜世界观公开百科。条目按主题维护；已确认的补充直接整合到对应正文，不把聊天来源、资料文件名及逐次修订记录混入网站展示。

## 网站

- 百科：<https://xdd44894-hub.github.io/orbina-encyclopedia/>
- 仓库：<https://github.com/xdd44894-hub/orbina-encyclopedia>
- 托管：GitHub Pages，`main` 分支根目录

## 编辑规范

1. 已存在的事物或设定：直接编辑 `_articles/` 内现有文件，替换过时段落。
2. 独立的新主题：再建立新条目，只填写必要的标题、分类和正文。
3. 尚未确认的内容按需要与正式设定区分，不要把内部工作记录当作百科主体。
4. 重要旧版地图数据继续保存，供现行地图研究追溯和对照。
5. **正文优先正面陈述事实、人物经历、技术机制和历史结果。**重复的“不能理解为……”“不意味着……”“不得写成……”式自我解释、作者修改记录与防误读声明从公开条目正文清理。
6. **保留真正的设定约束与重要未知。**例如器物实际能力、人员与军力统计口径、事件指控与事实之间的区别，直接写进相应事实段落；尚未确定的内容集中简短说明。
7. **时间轴统一入口：** `/timeline/`，按确定年代、相对先后和候选编年分组维护。

示例条目：

```markdown
---
title: 新条目标题
category: 地理与生态
ai_search: true
---

正文内容。
```

## 项目文件

公式：独立公式使用 `~~~tex` 围栏，行内公式使用 `$$公式$$`（Kramdown 行内语法），避免直接写 `\(...\)` 被 Markdown 转义。文章模板通过本站的 MathJax 3.2.2 SVG 渲染器排版，不依赖外部 CDN；普通代码框保持原样。渲染器及 Apache-2.0 许可证位于 `assets/vendor/mathjax/`，来源为 npm 的 `mathjax@3.2.2` 包。

- `timeline.md`：网站大事件时间轴及历史导航
- `_articles/`：百科正文
- `_layouts/`：网站页面模板
- `assets/images/`：插画及专题图
- `assets/maps/`：交互地图研究图册
- `assets/data/`：研究数据与结构化资料
- `assets/js/search.js`、`search.json`：站内搜索
- `ai-search-index.json`、`worker.js`：自动检索服务
- `index.md`、`catalog.md`、`gallery.md`、`about.md`：主要页面
