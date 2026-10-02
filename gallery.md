---
layout: default
title: 图像档案
permalink: /gallery/
---
<div class="page-intro"><div class="eyebrow">VISUAL ARCHIVE</div><h1>图像档案</h1><p>随归档资料提供的世界观配图。图像标题保留原文件名。</p></div>
<div class="gallery">
{% for image in site.static_files %}{% if image.path contains '/assets/images/' %}<figure><a href="{{ image.path | relative_url }}"><img src="{{ image.path | relative_url }}" alt="{{ image.name | escape }}" loading="lazy"></a><figcaption>{{ image.name }}</figcaption></figure>{% endif %}{% endfor %}
</div>
