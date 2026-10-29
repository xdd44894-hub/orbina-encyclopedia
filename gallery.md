---
layout: default
title: 插画图库
permalink: /gallery/
---
<h1>插画图库</h1>
<p>展示世界观场景、人物、装备与相关视觉设计。旧版世界地图、气候统计图、几何校验图不混入插画列表；请在<a href="{{ '/assets/maps/orbina-v225r-b45-mainland-watershed-comparison.html' | relative_url }}">全主大陆高程与排水研究（B45）</a>、<a href="{{ '/assets/maps/orbina-v225r-b44-relative-relief-watershed-comparison.html' | relative_url }}">东岸局部研究（B44）</a>、<a href="{{ '/assets/maps/orbina-v225r-b43-east-inner-sea-r1-r2-study.html' | relative_url }}">R1／R2河口试绘（B43）</a>或<a href="{{ '/assets/maps/orbina-v225r-b42-north-crown-dual-basin-before-after.html' | relative_url }}">北冠双海盆岸线（B42）</a>查看地图。</p>
<table class="record-table">
<thead><tr><th>预览</th><th>作品</th><th>相关条目</th></tr></thead>
<tbody>
{% for image in site.static_files %}
{% assign ext = image.extname | downcase %}
{% if image.path contains '/assets/images/' %}
{% if ext == '.png' or ext == '.jpg' or ext == '.jpeg' or ext == '.webp' %}
{% assign meta = site.data.artworks[image.name] %}
<tr>
<td><a href="{{ image.path | relative_url }}"><img class="image-preview" src="{{ image.path | relative_url }}" alt="{{ image.name | escape }}" loading="lazy"></a></td>
<td><a href="{{ image.path | relative_url }}">{{ image.name }}</a>{% if meta %}<div><strong>{{ meta.classification }}</strong></div>{% if meta.note != '' %}<div>{{ meta.note | escape }}</div>{% endif %}{% endif %}</td>
<td>{% if meta and meta.article_url != '' %}<a href="{{ meta.article_url | relative_url }}">{{ meta.article_title }}</a>{% else %}—{% endif %}</td>
</tr>
{% endif %}
{% endif %}
{% endfor %}
</tbody>
</table>
