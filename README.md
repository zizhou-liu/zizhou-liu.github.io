# 我的个人博客

一个部署在 **GitHub Pages** 上的静态个人博客，使用**纯 HTML / CSS / JavaScript** 构建，零后端依赖。

## 功能特性

- 首页展示最新文章列表
- 文章详情页支持 Markdown 渲染（基于 `marked.js`）
- 标签页 + 归档页，方便内容归类与检索
- 关于我页面（个人简介 + 联系方式）
- 站内搜索（快捷键 `/`）
- 响应式布局，适配桌面与移动端

## 目录结构

```
.
├── index.html          # 单页应用入口
├── css/
│   └── style.css       # 全局样式（清新明亮主题 + 响应式）
├── js/
│   ├── posts.js        # 文章元数据配置（在这里管理文章列表）
│   ├── render.js       # 各页面渲染逻辑
│   ├── router.js       # Hash 路由
│   └── main.js         # 应用入口（导航/搜索/初始化）
├── posts/              # Markdown 文章正文
│   ├── hello-world.md
│   └── ...
└── README.md
```

## 如何写一篇新文章

1. **创建 Markdown 文件**：在 `posts/` 目录下新建一个 `.md` 文件，例如 `my-new-post.md`，写入正文内容。

2. **注册文章元数据**：打开 `js/posts.js`，在 `POSTS` 数组中添加一条记录：

```js
{
  id: "my-new-post",                        // 与文件名对应（不含 .md）
  title: "我的新文章标题",
  date: "2026-08-28",                       // 发布日期 YYYY-MM-DD
  tags: ["技术", "随笔"],                    // 标签数组
  excerpt: "一句话摘要，展示在首页列表。",
  file: "posts/my-new-post.md",             // 正文文件路径
},
```

完成以上两步即可，文章会自动出现在首页、标签页和归档页中。

## 修改站点信息

在 `js/posts.js` 顶部的 `SITE_CONFIG` 中修改：

- `name`：站点名称
- `author`：作者名
- `description`：站点描述
- `avatar`：关于我页面的头像文字
- `bio`：个人简介
- `contacts`：联系方式列表

## 本地预览

由于文章通过 `fetch` 加载，直接双击 `index.html` 可能因跨域限制无法加载正文。请使用本地服务器预览：

```bash
# 方式一：Python
python -m http.server 8000

# 方式二：Node.js
npx serve .

# 方式三：VS Code Live Server 插件
```

然后浏览器访问 `http://localhost:8000`。

## 部署到 GitHub Pages

1. 在 GitHub 新建一个仓库（例如 `my-blog`）。
2. 将本项目所有文件推送到该仓库：

```bash
git init
git add .
git commit -m "init blog"
git branch -M main
git remote add origin https://github.com/<你的用户名>/my-blog.git
git push -u origin main
```

3. 打开仓库 **Settings → Pages**，在 "Build and deployment" 中：
   - Source 选择 **Deploy from a branch**
   - Branch 选择 **main**，目录选择 **/ (root)**

4. 等待部署完成，访问：

```
https://<你的用户名>.github.io/my-blog/
```

> 提示：如果仓库名是 `<用户名>.github.io`，则直接访问 `https://<用户名>.github.io/` 即可，无需加路径。

## 技术说明

- **路由**：使用 Hash 路由（`#/...`），无需服务器端配置。
- **Markdown**：通过 CDN 引入 `marked.js` 在浏览器端渲染。
- **搜索**：基于文章标题、摘要、标签的前端实时过滤。
- **响应式**：媒体查询 + 弹性布局，移动端折叠导航。
