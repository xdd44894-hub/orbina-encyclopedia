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
4. 重要旧版地图数据虽然不进入首页或插画图库，但如果仍被现行地图研究使用，就不能删除。

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

- `_articles/`：百科正文
- `_layouts/`：网站页面模板
- `assets/images/`：插画及专题图
- `assets/maps/`：交互地图研究图册
- `assets/data/`：研究数据与结构化资料
- `assets/js/search.js`、`search.json`：站内搜索
- `ai-search-index.json`、`worker.js`：自动检索服务
- `index.md`、`catalog.md`、`gallery.md`、`about.md`：主要页面
