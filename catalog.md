---
layout: default
title: 条目目录
permalink: /catalog/
---
<div class="page-intro"><div class="eyebrow">INDEX</div><h1>条目目录</h1><p>每条资料都是独立的 Markdown 文件。更新设定时可以直接改对应条目，也可以新增文件。</p></div>
{% assign categories = site.articles | map: 'category' | uniq | sort %}
{% for category in categories %}
<section class="catalog-section" id="{{ category | slugify }}"><h2>{{ category }}</h2><div class="catalog-list">
{% assign entries = site.articles | where: 'category', category | sort: 'title' %}
{% for article in entries %}<a href="{{ article.url | relative_url }}"><span>{{ article.title }}</span><small>{{ article.source }}</small></a>{% endfor %}
</div></section>
{% endfor %}
