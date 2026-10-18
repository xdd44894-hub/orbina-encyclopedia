---
layout: default
title: 图像原件目录
permalink: /gallery/
---
<h1>图像原件目录</h1>
<p>点击文件名或缩略图查看原始图片。图库区分正式世界观插画、装备外观图与非正史合成图；同一设备、同一场景出现在衍生画面中，不视为新设备或新地点。</p>
<table class="record-table">
<thead><tr><th>预览</th><th>文件与分类</th><th>关联条目</th></tr></thead>
<tbody>
{% for image in site.static_files %}{% if image.path contains '/assets/images/' %}
{% assign meta = site.data.artworks[image.name] %}
<tr>
<td><a href="{{ image.path | relative_url }}"><img class="image-preview" src="{{ image.path | relative_url }}" alt="{{ image.name | escape }}" loading="lazy"></a></td>
<td>
<a href="{{ image.path | relative_url }}">{{ image.name }}</a>
{% if meta %}
<div><strong>{{ meta.classification }}</strong></div>
<div>{{ meta.note | escape }}</div>
{% if meta.derived_from %}<div>使用素材：{{ meta.derived_from | join: '、' }}</div>{% endif %}
{% endif %}
</td>
<td>{% if meta and meta.article_url != '' %}<a href="{{ meta.article_url | relative_url }}">{{ meta.article_title }}</a>{% elsif meta and meta.derived_from %}联动合成画面{% else %}—{% endif %}</td>
</tr>
{% endif %}{% endfor %}
</tbody>
</table>
