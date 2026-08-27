/* =========================================================
   Hash 路由
   路由规则：
   - #/            首页
   - #/post/:id    文章详情
   - #/tags        标签列表
   - #/tags/:tag   某个标签下的文章
   - #/archive     归档
   - #/about       关于我
   ========================================================= */

function parseRoute() {
  const hash = window.location.hash.replace(/^#\/?/, "");
  const parts = hash.split("/").filter(Boolean);
  return parts;
}

function router() {
  const parts = parseRoute();
  const [section, param] = parts;

  // 高亮当前导航
  highlightNav(section);

  // 关闭搜索弹层（路由切换时）
  const overlay = document.getElementById("searchOverlay");
  if (overlay) {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  switch (section) {
    case "":
    case undefined:
      renderHome();
      document.title = `${SITE_CONFIG.name} · ${SITE_CONFIG.description}`;
      break;
    case "post":
      renderPost(param);
      break;
    case "tags":
      if (param) renderTagDetail(decodeURIComponent(param));
      else renderTagsPage();
      document.title = `标签 · ${SITE_CONFIG.name}`;
      break;
    case "archive":
      renderArchive();
      document.title = `归档 · ${SITE_CONFIG.name}`;
      break;
    case "about":
      renderAbout();
      document.title = `关于我 · ${SITE_CONFIG.name}`;
      break;
    default:
      renderNotFound();
      document.title = `页面不存在 · ${SITE_CONFIG.name}`;
  }

  // 切换路由后回到顶部
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
}

// 高亮当前导航项
function highlightNav(section) {
  const map = { "": "home", post: "home", tags: "tags", archive: "archive", about: "about" };
  const current = map[section] || "home";
  document.querySelectorAll(".site-nav a[data-nav]").forEach((a) => {
    if (a.dataset.nav === current) a.classList.add("active");
    else a.classList.remove("active");
  });
}
