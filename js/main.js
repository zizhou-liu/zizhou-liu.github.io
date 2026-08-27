/* =========================================================
   应用入口
   初始化：路由监听、导航、搜索、年份显示
   ========================================================= */

(function () {
  // 设置底部年份
  document.getElementById("year").textContent = new Date().getFullYear();

  // 配置 marked
  if (typeof marked !== "undefined") {
    marked.setOptions({
      gfm: true,
      breaks: false,
    });
  }

  // 监听路由变化
  window.addEventListener("hashchange", router);

  // 移动端导航菜单
  const navToggle = document.getElementById("navToggle");
  const siteNav = document.getElementById("siteNav");
  navToggle.addEventListener("click", () => {
    siteNav.classList.toggle("open");
  });
  // 点击导航链接后关闭菜单
  siteNav.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      siteNav.classList.remove("open");
    }
  });

  // 搜索弹层
  const searchToggle = document.getElementById("searchToggle");
  const searchOverlay = document.getElementById("searchOverlay");
  const searchClose = document.getElementById("searchClose");
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  function openSearch() {
    searchOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
    setTimeout(() => searchInput.focus(), 100);
  }
  function closeSearch() {
    searchOverlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  searchToggle.addEventListener("click", openSearch);
  searchClose.addEventListener("click", closeSearch);
  searchOverlay.addEventListener("click", (e) => {
    if (e.target === searchOverlay) closeSearch();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSearch();
    // 快捷键：按 "/" 打开搜索
    if (
      e.key === "/" &&
      !searchOverlay.classList.contains("open") &&
      !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)
    ) {
      e.preventDefault();
      openSearch();
    }
  });

  // 搜索逻辑
  function doSearch(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      searchResults.innerHTML = "";
      return;
    }
    const results = POSTS.filter((p) => {
      return (
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });

    if (results.length === 0) {
      searchResults.innerHTML =
        '<div class="empty">未找到相关文章</div>';
      return;
    }

    const highlight = (text) => {
      const idx = text.toLowerCase().indexOf(q);
      if (idx === -1) return escapeHtml(text);
      const before = escapeHtml(text.slice(0, idx));
      const match = escapeHtml(text.slice(idx, idx + q.length));
      const after = escapeHtml(text.slice(idx + q.length));
      return `${before}<mark>${match}</mark>${after}`;
    };

    searchResults.innerHTML = results
      .map(
        (p) => `
          <a class="search-result-item" href="#/post/${p.id}">
            <div class="sr-title">${highlight(p.title)}</div>
            <div class="sr-meta">${formatDate(p.date)} · ${escapeHtml(p.tags.join(", "))}</div>
          </a>`
      )
      .join("");
  }

  searchInput.addEventListener("input", (e) => doSearch(e.target.value));
  // 点击搜索结果后关闭弹层
  searchResults.addEventListener("click", (e) => {
    if (e.target.closest("a")) closeSearch();
  });

  // 初始路由
  router();
})();
