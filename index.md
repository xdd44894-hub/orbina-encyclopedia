---
layout: default
title: 世界观总览
permalink: /
---

<h1>俄庇娜百科</h1>
{% assign current_articles = site.articles | where_exp: "article", "article.archived != true" %}
<p>收录 {{ current_articles | size }} 个公开条目。可按主题浏览，也可以直接检索人物、国家、地理、战争、装备及日常生活。</p>
<p><a href="{{ '/assets/maps/orbina-v225r-b32-exact-shoreline-intersection-atlas.html' | relative_url }}">查看最新世界地图研究图册（B32）</a></p>
<label class="searchbox"><span>全文检索</span><input id="wiki-search" type="search" placeholder="输入人物、地点、术语或事件" autocomplete="off"></label>
<div id="search-results" class="search-results" hidden></div>
<h2>分类目录</h2>
<ul class="category-index">
{% assign categories = current_articles | map: 'category' | uniq | sort %}
{% for category in categories %}
  {% assign count = current_articles | where: 'category', category | size %}
  <li><a href="{{ '/catalog/' | relative_url }}#{{ category | slugify }}">{{ category }}</a>（{{ count }}）</li>
{% endfor %}
</ul>
{% for category in categories %}
<section class="catalog-section" id="{{ category | slugify }}">
  <h2>{{ category }}</h2>
  {% assign entries = current_articles | where: 'category', category | sort: 'title' %}
  <table class="record-table"><thead><tr><th>条目</th></tr></thead><tbody>
  {% for article in entries %}<tr><td><a href="{{ article.url | relative_url }}">{{ article.title }}</a></td></tr>{% endfor %}
  </tbody></table>
</section>
{% endfor %}
