const ALLOWED_ORIGIN = "*";
const MAX_QUERY_LENGTH = 200;
const MAX_RESULTS = 10;
const SNIPPET_LENGTH = 240;
const INDEX_CACHE_KEY = "https://orbina-index-cache.invalid/index.json";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const headers = corsHeaders();

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }

    if (url.pathname === "/health") {
      return json({ ok: true, service: "orbina-archive-search" }, 200, headers);
    }

    if (url.pathname !== "/api/search") {
      return json({ error: "not_found", message: "Use GET /api/search?q=..." }, 404, headers);
    }
    if (request.method !== "GET") {
      return json({ error: "method_not_allowed" }, 405, headers);
    }

    const rawQuery = (url.searchParams.get("q") || "").trim();
    if (!rawQuery) return json({ error: "missing_query", message: "参数 q 为必填项。" }, 400, headers);
    if (rawQuery.length > MAX_QUERY_LENGTH) {
      return json({ error: "query_too_long", message: `查询最多 ${MAX_QUERY_LENGTH} 个字符。` }, 400, headers);
    }

    const query = normalize(rawQuery);
    if (!query) return json({ error: "empty_query", message: "请输入有效关键词。" }, 400, headers);

    const requestedLimit = Number.parseInt(url.searchParams.get("limit") || "5", 10);
    const limit = Number.isFinite(requestedLimit) ? Math.max(1, Math.min(MAX_RESULTS, requestedLimit)) : 5;

    try {
      const items = await loadIndex(env, ctx);
      const results = items
        .map(item => ({ item, score: score(item, query) }))
        .filter(entry => entry.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(({ item, score }) => ({
          title: item.title,
          category: item.category,
          source: item.source,
          url: absoluteArticleUrl(item.url),
          score,
          snippet: makeSnippet(item.text, rawQuery)
        }));

      return json({
        query: rawQuery,
        count: results.length,
        results,
        note: "仅检索已完成分类审核并标记为 ai_search 的档案。"
      }, 200, headers);
    } catch (error) {
      return json({ error: "index_unavailable", message: "检索索引暂时不可用。", detail: String(error?.message || error) }, 502, headers);
    }
  }
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8"
  };
}

function json(data, status, headers) {
  return new Response(JSON.stringify(data, null, 2), { status, headers });
}

async function loadIndex(env, ctx) {
  if (!env.SEARCH_INDEX_URL) throw new Error("SEARCH_INDEX_URL is not configured");
  const cache = caches.default;
  const cacheKey = new Request(INDEX_CACHE_KEY);
  const cached = await cache.match(cacheKey);
  if (cached) return cached.json();

  const response = await fetch(env.SEARCH_INDEX_URL, {
    headers: { Accept: "application/json" },
    cf: { cacheTtl: 300, cacheEverything: true }
  });
  if (!response.ok) throw new Error(`Search index returned HTTP ${response.status}`);
  const data = await response.json();
  if (!Array.isArray(data)) throw new Error("Search index is not a JSON array");

  const cacheResponse = new Response(JSON.stringify(data), {
    headers: { "Cache-Control": "public, max-age=300", "Content-Type": "application/json" }
  });
  ctx.waitUntil(cache.put(cacheKey, cacheResponse));
  return data;
}

function normalize(value) {
  return String(value || "").toLocaleLowerCase().replace(/[\s，。、“”‘’《》【】：:；;,.!?！？—-]/g, "");
}

function score(item, query) {
  const title = normalize(item.title);
  const text = normalize(item.text);
  return title.includes(query) ? 2 : text.includes(query) ? 1 : 0;
}

function makeSnippet(text, rawQuery) {
  const content = String(text || "").replace(/\s+/g, " ").trim();
  if (!content) return "";
  const q = rawQuery.toLocaleLowerCase();
  const haystack = content.toLocaleLowerCase();
  const at = haystack.indexOf(q);
  const start = at < 0 ? 0 : Math.max(0, at - 80);
  const end = Math.min(content.length, start + SNIPPET_LENGTH);
  return `${start > 0 ? "…" : ""}${content.slice(start, end)}${end < content.length ? "…" : ""}`;
}

function absoluteArticleUrl(value) {
  if (!value) return "https://xdd44894-hub.github.io/orbina-encyclopedia/";
  return new URL(value, "https://xdd44894-hub.github.io/orbina-encyclopedia/").toString();
}
