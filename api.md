---
layout: default
title: 检索 API
permalink: /api/
---
# 外部 AI 检索接口

本接口让外部程序和 AI 应用按关键词查询档案，返回匹配条目的短摘录、来源和页面链接。接口托管在 Cloudflare Workers；Cloudflare 部署完成后，这里会显示实际主机地址。

## 地址

- Worker 主机：部署后补入
- 搜索：`GET <WORKER_URL>/api/search?q=<关键词>&limit=5`
- 状态：`GET <WORKER_URL>/health`
- OpenAPI 规范：[openapi.json]({{ '/openapi.json' | relative_url }})

## 参数

| 参数 | 必填 | 说明 |
| --- | --- | --- |
| `q` | 是 | 搜索词，最多 200 字符。 |
| `limit` | 否 | 结果数量，默认 5，范围 1–10。 |

返回结果包含 `title`、`category`、`source`、`url`、`score` 与不超过 240 字符的 `snippet`。外部程序可用 `url` 让模型标注资料来源。

## 检索范围

AI 接口只检索完成分类审核并在条目 Front Matter 中设置 `ai_search: true` 的档案。未设置该标记的文件不会进入 AI 检索索引；随着逐篇整理，审核完成的资料再逐步加入。这样可避免尚未分类的混合文档和暂不收录的 OC 资料进入外部 AI 搜索结果。

接口采用与站内搜索一致的关键词归一化和标题优先评分规则。公开档案不需要 API 密钥；不要在网页或 Worker 配置里放置 DeepSeek API 密钥。

## DeepSeek 工具定义示例

将下面的函数工具定义传给调用 DeepSeek 的应用。应用收到函数调用后，再执行上面的 HTTP 请求，并把 JSON 结果返回给模型：

```json
{
  "type": "function",
  "function": {
    "name": "search_orbina_archive",
    "description": "搜索俄庇娜资料档案库，返回带来源和链接的匹配档案。",
    "parameters": {
      "type": "object",
      "properties": {
        "query": { "type": "string", "description": "要查找的人物、事件或术语。" },
        "limit": { "type": "integer", "minimum": 1, "maximum": 10, "default": 5 }
      },
      "required": ["query"],
      "additionalProperties": false
    }
  }
}
```

调用端实现函数时，将 `query` 编码为 URL 查询参数 `q`，并把响应中的 `results` 返回给 DeepSeek。DeepSeek 负责提出工具调用，实际 HTTP 请求由你的应用执行。
