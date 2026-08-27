/* =========================================================
   文章数据配置
   在这里管理所有文章的元数据（列表页/归档/标签依赖此文件）。
   正文内容存放在 posts/ 目录下的对应 .md 文件中。

   字段说明：
   - id:       文章唯一标识（与 posts/ 下的文件名对应，不含 .md）
   - title:    文章标题
   - date:     发布日期（格式 YYYY-MM-DD）
   - tags:     标签数组（用于标签页归类）
   - excerpt:  摘要（展示在首页列表）
   - file:     正文 Markdown 文件路径（相对站点根目录）
   ========================================================= */

const SITE_CONFIG = {
  name: "我的博客",
  author: "你的名字",
  description: "记录技术、生活与思考的个人博客",
  avatar: "L",           // 关于我页面的头像文字（单字或首字母）
  bio: "一名热爱技术的开发者，喜欢折腾各种有趣的项目，也喜欢记录下自己的学习与生活点滴。",
  contacts: [
    { label: "邮箱", value: "you@example.com", icon: "✉" },
    { label: "GitHub", value: "github.com/yourname", icon: "⌥" },
    { label: "微博", value: "@yourname", icon: "◈" },
    { label: "公众号", value: "你的公众号", icon: "✦" },
  ],
};

const POSTS = [
  {
    id: "hello-world",
    title: "你好，世界：我的第一篇博客",
    date: "2026-08-20",
    tags: ["随笔", "开端"],
    excerpt: "欢迎来到我的博客。这篇开篇之作，聊聊我为什么要搭建这个站点，以及未来会在这里记录些什么。",
    file: "posts/hello-world.md",
  },
  {
    id: "why-github-pages",
    title: "为什么选择 GitHub Pages 搭建个人博客",
    date: "2026-08-22",
    tags: ["技术", "建站"],
    excerpt: "无需服务器、免费托管、版本可控……GitHub Pages 是搭建静态博客的绝佳选择。本文分享我的选型思路与踩坑经验。",
    file: "posts/why-github-pages.md",
  },
  {
    id: "markdown-guide",
    title: "Markdown 写作指南：优雅地记录内容",
    date: "2026-08-24",
    tags: ["技术", "写作"],
    excerpt: "从标题、列表、引用到代码块与表格，一篇带你掌握 Markdown 常用语法，让你的写作更专注、更优雅。",
    file: "posts/markdown-guide.md",
  },
  {
    id: "responsive-design",
    title: "响应式设计：让博客在手机上也好看",
    date: "2026-08-26",
    tags: ["前端", "设计"],
    excerpt: "桌面与移动端体验如何兼顾？本文聊聊媒体查询、弹性布局与移动优先策略，打造真正响应式的博客。",
    file: "posts/responsive-design.md",
  },
];
