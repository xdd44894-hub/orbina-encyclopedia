# 俄庇娜百科

俄庇娜世界观资料站。正文以独立 Markdown 条目维护，页面模板、样式、搜索脚本和图片分开放置，更新设定无需编辑整份 HTML。

## 网站与仓库

- 网站：<https://xdd44894-hub.github.io/orbina-encyclopedia/>
- GitHub 仓库：<https://github.com/xdd44894-hub/orbina-encyclopedia>
- Pages 从 `main` 分支根目录发布。提交到 `main` 后，GitHub Pages 会自动重新构建。

## 修改或添加条目

1. 在仓库打开 `_articles/`。
2. 编辑现有 `article-XXX.md`，或新建一个 Markdown 文件，例如 `article-057.md`。
3. 在文件开头填写标题、分类和来源，然后用 Markdown 编写正文：

```yaml
---
title: 新条目标题
category: 地理与生态
source: 原始资料文件名.txt
---

## 小节标题

在这里写正文。
```

4. 提交到 `main`。分类会自动出现在目录和搜索中。

## 项目结构

- `_articles/`：独立百科条目与来源标记。
- `_layouts/`：共享页面布局。
- `assets/css/site.css`：视觉样式。
- `assets/js/search.js`：站内搜索。
- `assets/images/`：归档配图。
- `index.md`、`catalog.md`、`gallery.md`、`about.md`：首页、目录、图片档案和编辑说明。
- `_config.yml`、`Gemfile`：Jekyll 与 GitHub Pages 配置。

初始条目整理自 2026-10-02 提供的俄庇娜归档包。人物私档和跨作品材料未并入核心百科。不同稿件发生冲突时，优先核对明确标注的覆盖修正和来源日期。
