---
layout: default
title: 全部资料
permalink: /catalog/
---
<h1>全部资料</h1>
<p>按分类列出现行条目。历史归档保留原页面，可通过相关条目的交叉链接访问。</p>
{% assign current_articles = site.articles | where_exp: "article", "article.archived != true" %}
{% assign categories = current_articles | map: 'category' | uniq | sort %}
{% for category in categories %}
<section class="catalog-section" id="{{ category | slugify }}">
<h2>{{ category }}</h2>
{% assign entries = current_articles | where: 'category', category | sort: 'title' %}
<table class="record-table"><thead><tr><th>条目</th><th>来源文件</th></tr></thead><tbody>
{% for article in entries %}<tr><td><a href="{{ article.url | relative_url }}">{{ article.title }}</a></td><td>{{ article.source }}</td></tr>{% endfor %}
</tbody></table>
</section>
{% endfor %}
