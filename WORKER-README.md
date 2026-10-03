# Orbina Archive Search Worker

Cloudflare Worker exposing the archive's built-in title/body substring search to external tools and AI applications.

## Endpoints

- `GET /health` — health check.
- `GET /api/search?q=<keyword>&limit=5` — ranked search. Limit is clamped to 1–10; query length is capped at 200 characters.
- `OPTIONS /api/search` — CORS preflight.

Results contain title, category, source, canonical page URL, score, and a short excerpt. The Worker never returns full article bodies.

## Search scope

The Worker reads `/ai-search-index.json`, generated from articles whose front matter explicitly sets `ai_search: true`. Articles are excluded by default. Set the flag only after a document has been reviewed and classified; this keeps mixed-source and unreviewed OC content out of external AI results. Search normalization and title/body scoring follow `assets/js/search.js`.

## Deploy

With a Cloudflare account, connect this GitHub repository in Workers & Pages and choose the branch and project root, or use Wrangler from this directory:

```sh
npx wrangler deploy
```

The first deploy assigns a `workers.dev` hostname. Replace the OpenAPI server placeholder with that hostname before publishing the API page.

## DeepSeek function calling

Register a function such as `search_orbina_archive` in the application calling DeepSeek. Its implementation sends `GET <WORKER_URL>/api/search?q=<url-encoded-query>&limit=5` and returns the JSON. DeepSeek emits the requested function call; the calling application performs the HTTP request.
