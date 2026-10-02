---
layout: default
title: 全部资料
permalink: /catalog/
---
<h1>全部资料</h1>
<p>按分类列出所有条目。来源列指向整理所依据的原始文件或对话记录。</p>
{% assign categories = site.articles | map: 'category' | uniq | sort %}
{% for category in categories %}
<section class="catalog-section" id="{{ category | slugify }}">
<h2>{{ category }}</h2>
{% assign entries = site.articles | where: 'category', category | sort: 'title' %}
<table class="record-table"><thead><tr><th>条目</th><th>来源文件</th></tr></thead><tbody>
{% for article in entries %}<tr><td><a href="{{ article.url | relative_url }}">{{ article.title }}</a></td><td>{{ article.source }}</td></tr>{% endfor %}
</tbody></table>
</section>
{% endfor %}
