---
layout: default
title: 档案总览
permalink: /
---

<h1>资料档案库</h1>
{% assign current_articles = site.articles | where_exp: "article", "article.archived != true" %}
<p>条目：{{ current_articles | size }}。按主题列出。</p>
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
