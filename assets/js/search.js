(() => {
  const input = document.getElementById('wiki-search');
  const box = document.getElementById('search-results');
  if (!input || !box) return;
  let items = [];
  const norm = value => (value || '').toLocaleLowerCase().replace(/[\s，。、“”‘’《》【】：:；;,.!?！？—-]/g, '');
  fetch(`${window.WIKI_BASEURL || ''}/search.json`).then(r => r.json()).then(data => { items = data; }).catch(() => {});
  input.addEventListener('input', () => {
    const q = norm(input.value.trim());
    if (!q) { box.hidden = true; box.innerHTML = ''; return; }
    const results = items.map(item => ({...item, score: norm(item.title).includes(q) ? 2 : norm(item.text).includes(q) ? 1 : 0}))
      .filter(item => item.score).sort((a,b) => b.score-a.score).slice(0,10);
    box.innerHTML = results.length ? results.map(item => `<a href="${item.url}"><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.category)}</small></a>`).join('') : '<a><small>没有找到匹配条目，试试更短的关键词。</small></a>';
    box.hidden = false;
  });
  document.addEventListener('keydown', e => { if (e.key === '/' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) { e.preventDefault(); input.focus(); } if (e.key === 'Escape') { box.hidden = true; input.blur(); } });
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
})();
