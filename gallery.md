---
layout: default
title: 图像原件目录
permalink: /gallery/
---
<h1>图像原件目录</h1>
<p>文件名按归档保留。点击文件名查看原始图像。</p>
<table class="record-table">
<thead><tr><th>文件名</th><th>预览</th></tr></thead>
<tbody>
{% for image in site.static_files %}{% if image.path contains '/assets/images/' %}<tr><td><a href="{{ image.path | relative_url }}">{{ image.name }}</a></td><td><a href="{{ image.path | relative_url }}"><img class="image-preview" src="{{ image.path | relative_url }}" alt="{{ image.name | escape }}" loading="lazy"></a></td></tr>{% endif %}{% endfor %}
</tbody>
</table>
