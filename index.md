---
layout: default
title: 俄庇娜百科
permalink: /
---

<section class="hero">
  <div class="eyebrow">WORLD REFERENCE · 俄庇娜世界观资料库</div>
  <h1>俄庇娜百科</h1>
  <p>一座持续生长的世界设定档案馆。按主题浏览，或直接搜索术语、人物、地点与事件。</p>
  <label class="searchbox"><span aria-hidden="true">⌕</span><input id="wiki-search" type="search" placeholder="搜索：联合城、现实失衡能、洛古里克……" autocomplete="off"><kbd>/</kbd></label>
  <div id="search-results" class="search-results" hidden></div>
  <div class="hero-meta"><span>现有条目 <strong>{{ site.articles | size }}</strong></span><span>资料整理至 2026.10.02</span></div>
</section>

<section class="section-heading"><div><div class="eyebrow">EXPLORE</div><h2>按主题浏览</h2></div><a href="{{ '/catalog/' | relative_url }}">全部条目 →</a></section>
<div class="category-grid">
{% assign categories = site.articles | map: 'category' | uniq | sort %}
{% for category in categories %}
  {% assign count = site.articles | where: 'category', category | size %}
  <a class="category-card" href="{{ '/catalog/' | relative_url }}#{{ category | slugify }}"><span class="category-mark">{{ forloop.index | prepend: '0' | slice: -2, 2 }}</span><h3>{{ category }}</h3><p>{{ count }} 篇资料</p></a>
{% endfor %}
</div>

<section class="section-heading"><div><div class="eyebrow">RECENTLY CURATED</div><h2>近期修订与核心资料</h2></div><a href="{{ '/catalog/' | relative_url }}">打开目录 →</a></section>
<div class="feature-list">
{% assign featured = site.articles | sort: 'source' | reverse %}
{% for article in featured limit: 6 %}
<a class="feature-row" href="{{ article.url | relative_url }}"><span class="feature-category">{{ article.category }}</span><span class="feature-title">{{ article.title }}</span><span class="feature-arrow">↗</span></a>
{% endfor %}
</div>

<div class="notice"><strong>资料优先级</strong><span>明确标注为“覆盖修正”的新文件优先于旧稿。遇到冲突时，先查看条目开头的来源文件与日期；讨论中的猜测不自动视为正式设定。</span></div>
