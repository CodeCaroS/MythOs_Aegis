export const DASHBOARD_HTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>AI Engineering Platform</title>
  <style>
    :root{color-scheme:dark;--bg:#0b0f14;--panel:#121923;--line:#263244;--text:#e8eef7;--muted:#9aabc0;--accent:#78dba9;--warn:#ffca67}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:15px/1.5 system-ui,sans-serif}header,main{width:min(1180px,calc(100% - 32px));margin:auto}header{padding:32px 0 18px}h1{margin:0;font-size:clamp(1.8rem,5vw,3.4rem);line-height:1.05;letter-spacing:-.04em;overflow-wrap:anywhere}p{color:var(--muted)}.auth,.grid,.split{display:grid;gap:12px}.auth{grid-template-columns:1fr 1fr auto;margin:18px 0}.grid{grid-template-columns:repeat(auto-fit,minmax(180px,1fr))}.split{grid-template-columns:minmax(280px,.8fr) minmax(360px,1.2fr);margin:18px 0 40px}.card{min-width:0;background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:16px}.metric strong{display:block;font-size:1.8rem;color:var(--accent)}label{display:grid;gap:5px;color:var(--muted)}input,button{min-width:0;font:inherit;border:1px solid var(--line);border-radius:8px;padding:10px;background:#0d141d;color:var(--text)}button{cursor:pointer}button:hover,button:focus-visible{border-color:var(--accent)}table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:9px;border-bottom:1px solid var(--line);vertical-align:top}.timeline{list-style:none;padding:0}.timeline li{border-left:3px solid var(--accent);padding:4px 0 16px 14px}.timeline .error{border-color:#ff7785}code{color:var(--warn);word-break:break-word}@media(max-width:780px){.auth,.split{grid-template-columns:1fr}}@media(max-width:480px){.grid{grid-template-columns:1fr}}
  </style>
</head>
<body>
<header><p>MYTHOS / OPERATIONS</p><h1>AI Engineering Platform</h1><p>Routing, semantic cache, regression signals, and failure traces in one local control surface.</p></header>
<main>
  <section class="auth" aria-label="Dashboard connection"><label>API key<input id="key" type="password" autocomplete="off"></label><label>Tenant<input id="tenant" value="default" pattern="[A-Za-z0-9._-]+"></label><button id="refresh" type="button">Refresh</button></section>
  <section class="grid" aria-label="Platform metrics">
    <article class="card metric"><span>Requests</span><strong id="requests">—</strong></article>
    <article class="card metric"><span>Cache hit rate</span><strong id="hitRate">—</strong></article>
    <article class="card metric"><span>Cost saved</span><strong id="saved">—</strong></article>
    <article class="card metric"><span>Average latency</span><strong id="latency">—</strong></article>
  </section>
  <section class="split">
    <article class="card"><h2>Recent traces</h2><table><thead><tr><th>Request</th><th>Status</th><th>Started</th></tr></thead><tbody id="traces"></tbody></table></article>
    <article class="card"><h2>Trace timeline</h2><p id="rootCause" aria-live="polite">Select a trace.</p><ol class="timeline" id="timeline"></ol></article>
  </section>
  <p id="status" role="status" aria-live="polite"></p>
</main>
<script>
const $=id=>document.getElementById(id); const headers=()=>{const h={'x-tenant-id':$('tenant').value||'default'};if($('key').value)h.authorization='Bearer '+$('key').value;return h};
async function api(path){const r=await fetch(path,{headers:headers()});if(!r.ok)throw new Error((await r.json()).detail||r.statusText);return r.json()}
function n(value,digits=0){return Number(value||0).toLocaleString(undefined,{maximumFractionDigits:digits})}
async function showTrace(id){const trace=await api('/api/traces/'+encodeURIComponent(id));$('rootCause').textContent=trace.rootCause?'Likely origin: '+trace.rootCause.name+' — '+(trace.rootCause.error||'failed'):'No failed step detected.';$('timeline').innerHTML=trace.steps.map(s=>{const dependency=s.parentStepId?' · depends on '+s.parentStepId:'';const tool=s.toolCall?' · tool '+JSON.stringify(s.toolCall):'';return '<li class="'+(s.status==='error'?'error':'')+'"><strong>'+escapeHtml(s.name)+'</strong><br><code>'+escapeHtml(s.status+(s.latencyMs?' · '+s.latencyMs+' ms':'')+dependency+tool)+'</code></li>'}).join('')}
function escapeHtml(v){const d=document.createElement('div');d.textContent=String(v);return d.innerHTML}
async function refresh(){try{$('status').textContent='Loading…';const [m,t]=await Promise.all([api('/api/metrics'),api('/api/traces?limit=30')]);$('requests').textContent=n(m.requests);$('hitRate').textContent=n((m.cacheHitRate||0)*100,1)+'%';$('saved').textContent='$'+n(m.savedCost,4);$('latency').textContent=n(m.averageLatencyMs,0)+' ms';$('traces').innerHTML=t.length?t.map(x=>'<tr><td><button type="button" data-id="'+escapeHtml(x.id)+'">'+escapeHtml(x.name)+'</button></td><td>'+escapeHtml(x.status)+'</td><td>'+escapeHtml(x.startedAt)+'</td></tr>').join(''):'<tr><td colspan="3">No traces yet.</td></tr>';$('traces').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>showTrace(b.dataset.id)));$('status').textContent='Updated.'}catch(e){$('status').textContent='Could not load dashboard: '+e.message}}
$('refresh').addEventListener('click',refresh);refresh();
</script>
</body></html>`;
