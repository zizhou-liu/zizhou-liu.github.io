/* =========================================================
   页面渲染逻辑
   包含：首页、文章详情、标签页、归档页、关于我、搜索
   ========================================================= */

// 通用：转义 HTML，防止 XSS
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// 通用：格式化日期
function formatDate(dateStr) {
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// 通用：生成标签胶囊 HTML
function renderTags(tags, alt = false) {
  return tags
    .map((t) => {
      const cls = alt ? "tag tag-alt" : "tag";
      return `<a href="#/tags/${encodeURIComponent(t)}" class="${cls}">${escapeHtml(t)}</a>`;
    })
    .join("");
}

// 通用：文章卡片
function postCard(post) {
  return `
    <article class="post-card">
      <h2 class="post-card-title">
        <a href="#/post/${post.id}">${escapeHtml(post.title)}</a>
      </h2>
      <div class="post-card-meta">
        <span class="meta-date">${formatDate(post.date)}</span>
      </div>
      <p class="post-card-excerpt">${escapeHtml(post.excerpt)}</p>
      <div class="post-card-tags">${renderTags(post.tags)}</div>
    </article>
  `;
}

/* ---------- 首页 ---------- */
function renderHome() {
  const sorted = [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
  const list = sorted.map(postCard).join("");
  document.getElementById("app").innerHTML = `
    <h1 class="page-title">最新文章</h1>
    <p class="page-subtitle">共 ${POSTS.length} 篇文章 · 持续更新中</p>
    <div class="post-list">${list || '<div class="empty">暂无文章</div>'}</div>
  `;
}

/* ---------- 文章详情 ---------- */
async function renderPost(id) {
  const post = POSTS.find((p) => p.id === id);
  const app = document.getElementById("app");

  if (!post) {
    app.innerHTML = `<div class="empty">文章不存在或已被删除。</div>`;
    return;
  }

  // 找到上一篇 / 下一篇
  const sorted = [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
  const idx = sorted.findIndex((p) => p.id === id);
  const prev = sorted[idx + 1] || null;
  const next = sorted[idx - 1] || null;

  // 先渲染骨架，避免白屏
  app.innerHTML = `
    <article class="post-detail">
      <header class="post-detail-header">
        <h1>${escapeHtml(post.title)}</h1>
        <div class="post-detail-meta">
          <span>${formatDate(post.date)}</span>
          <span>${renderTags(post.tags, true)}</span>
        </div>
      </header>
      <div class="post-content">加载中…</div>
      <nav class="post-nav">
        ${
          prev
            ? `<a href="#/post/${prev.id}" class="nav-prev">
                <span class="nav-label">上一篇</span>
                <span class="nav-title">${escapeHtml(prev.title)}</span>
              </a>`
            : `<a class="nav-prev" style="opacity:.4;cursor:default">
                <span class="nav-label">上一篇</span>
                <span class="nav-title">没有了</span>
              </a>`
        }
        ${
          next
            ? `<a href="#/post/${next.id}" class="nav-next">
                <span class="nav-label">下一篇</span>
                <span class="nav-title">${escapeHtml(next.title)}</span>
              </a>`
            : `<a class="nav-next" style="opacity:.4;cursor:default">
                <span class="nav-label">下一篇</span>
                <span class="nav-title">没有了</span>
              </a>`
        }
      </nav>
    </article>
  `;

  // 加载 Markdown 正文
  try {
    const res = await fetch(post.file);
    if (!res.ok) throw new Error("加载失败");
    const md = await res.text();
    const html = marked.parse(md);
    document.querySelector(".post-content").innerHTML = html;
    document.title = `${post.title} · ${SITE_CONFIG.name}`;
  } catch (e) {
    document.querySelector(".post-content").innerHTML =
      '<div class="empty">文章正文加载失败，请检查文件路径。</div>';
  }
}

/* ---------- 标签页 ---------- */
function renderTagsPage() {
  // 统计每个标签的文章数
  const tagMap = {};
  POSTS.forEach((p) => {
    p.tags.forEach((t) => {
      tagMap[t] = (tagMap[t] || 0) + 1;
    });
  });
  const tags = Object.keys(tagMap).sort();

  const cloud = tags
    .map(
      (t) =>
        `<a href="#/tags/${encodeURIComponent(t)}" class="tag tag-alt">${escapeHtml(t)}<span class="count">${tagMap[t]}</span></a>`
    )
    .join("");

  document.getElementById("app").innerHTML = `
    <h1 class="page-title">标签</h1>
    <p class="page-subtitle">共 ${tags.length} 个标签 · 点击查看相关文章</p>
    <div class="tag-cloud">${cloud || '<div class="empty">暂无标签</div>'}</div>
  `;
}

/* ---------- 某个标签下的文章 ---------- */
function renderTagDetail(tag) {
  const posts = POSTS.filter((p) => p.tags.includes(tag)).sort(
    (a, b) => (a.date < b.date ? 1 : -1)
  );
  const list = posts.map(postCard).join("");

  document.getElementById("app").innerHTML = `
    <h1 class="page-title"># ${escapeHtml(tag)}</h1>
    <p class="page-subtitle">共 ${posts.length} 篇文章</p>
    <div class="post-list">${list || '<div class="empty">暂无相关文章</div>'}</div>
  `;
}

/* ---------- 归档页 ---------- */
function renderArchive() {
  const sorted = [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));

  // 按年份分组
  const byYear = {};
  sorted.forEach((p) => {
    const year = p.date.slice(0, 4);
    if (!byYear[year]) byYear[year] = [];
    byYear[year].push(p);
  });

  const years = Object.keys(byYear).sort((a, b) => (a < b ? 1 : -1));
  const html = years
    .map((year) => {
      const items = byYear[year]
        .map(
          (p) => `
            <div class="archive-item">
              <span class="date">${formatDate(p.date)}</span>
              <a href="#/post/${p.id}">${escapeHtml(p.title)}</a>
            </div>`
        )
        .join("");
      return `<section class="archive-year"><h2>${year}</h2>${items}</section>`;
    })
    .join("");

  document.getElementById("app").innerHTML = `
    <h1 class="page-title">归档</h1>
    <p class="page-subtitle">共 ${POSTS.length} 篇文章</p>
    ${html || '<div class="empty">暂无文章</div>'}
  `;
}

/* ---------- 关于我 ---------- */
function renderAbout() {
  const cfg = SITE_CONFIG;
  const contacts = cfg.contacts
    .map(
      (c) => `
        <li>
          <span class="contact-icon">${escapeHtml(c.icon)}</span>
          <div>
            <div style="font-size:.85rem;color:var(--text-muted)">${escapeHtml(c.label)}</div>
            <div>${escapeHtml(c.value)}</div>
          </div>
        </li>`
    )
    .join("");

  document.getElementById("app").innerHTML = `
    <h1 class="page-title">关于我</h1>
    <div class="about-card">
      <div class="about-avatar">${escapeHtml(cfg.avatar)}</div>
      <h2>${escapeHtml(cfg.author)}</h2>
      <p>${escapeHtml(cfg.bio)}</p>
      <h2>联系方式</h2>
      <ul class="contact-list">${contacts}</ul>
    </div>
  `;
}

/* ---------- 404 ---------- */
function renderNotFound() {
  document.getElementById("app").innerHTML = `
    <div class="empty">
      <h1 class="page-title">404</h1>
      <p>页面不存在，<a href="#/">返回首页</a></p>
    </div>
  `;
}
