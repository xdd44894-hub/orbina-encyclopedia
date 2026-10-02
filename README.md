# 俄庇娜百科

一个以 Markdown 条目为主、使用 Jekyll 自动生成页面的 GitHub Pages 资料站。样式和搜索脚本分开放在 `assets/`，公共页面模板在 `_layouts/`，正文在 `_articles/`。新增设定时主要编辑 Markdown，不需要改 HTML。

## 上传到 GitHub 并发布

1. 在 GitHub 新建一个空仓库，例如 `orbina-encyclopedia`。
2. 上传本文件夹内的全部内容。确保 `.github/workflows/pages.yml` 一起上传。
3. 打开仓库的 **Settings → Pages**，将 Build and deployment 的 Source 设为 **GitHub Actions**。
4. 打开 `_config.yml`，把 `YOUR-USERNAME` 改成你的 GitHub 用户名，把 `YOUR-REPOSITORY` 改成仓库名。例如仓库名为 `orbina-encyclopedia`，则 `baseurl: /orbina-encyclopedia`。如果仓库名是 `用户名.github.io`，则 `baseurl: ""`。
5. 提交修改后，仓库 **Actions** 页面会自动构建。成功后，Pages 页面会显示网站地址。
6. 之后编辑 `_articles/` 内任一 Markdown 文件并提交，网站就会自动更新。新增文章可复制一个文件并换成新文件名；保留开头的 YAML 信息块，并填写 `title`、`category`、`source`。

## 内容结构

- `_articles/`：独立百科条目，现有原稿按主题分类，附带来源文件名。
- `assets/css/site.css`：页面样式。
- `assets/js/search.js`：站内搜索。
- `assets/images/`：随归档包提供的插图。
- `index.md`、`catalog.md`、`gallery.md`、`about.md`：首页、目录、图像档案和编辑说明。
- `.github/workflows/pages.yml`：GitHub Pages 自动构建与发布流程。

## 写作格式

```yaml
---
title: 新条目标题
category: 地理与生态
source: 原始资料文件名.txt
---

## 小节标题

正文段落。
```

分类目前使用：基础设定、历史与时间线、势力与军事、地理与生态、社会与文化、人物、科技与异常。也可以在文章元数据中添加新分类，目录页会自动收录。

## 说明

初始条目基于 2026-10-02 提供的俄庇娜归档包整理。跨作品人物档案没有并入核心百科。不同稿件若存在冲突，请优先核对明确标注的覆盖修正文件与来源日期。
