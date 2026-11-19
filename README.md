# my-portfolio

Eleventy 版作品集。内容在 `src/*.md` 与 `src/projects/*.md`，图片在 `public/imgs`，样式在 `src/assets/style.css`。

## 本地预览

```bash
pnpm install
pnpm start
```

打开 `http://127.0.0.1:8080/`。

## 发布到 GitHub Pages

远程仓库：<https://github.com/Dmg-Kwing/Jiong.github.io>

首次发布前，在仓库 **Settings → Pages → Build and deployment** 中把 **Source** 设为 **GitHub Actions**。之后每次 push 到 `main`，`.github/workflows/deploy.yml` 会自动构建并发布；也可以在 Actions 页面手动运行 `workflow_dispatch`。

实际发布地址是项目页路径：<https://dmg-kwing.github.io/Jiong.github.io/>

因为仓库名不是 `<用户名>.github.io`，Pages 会把它放在 `/Jiong.github.io/` 子路径下。工作流构建时设置了 `PATH_PREFIX=/Jiong.github.io/`，所有 `/assets`、`/imgs` 和站内链接都会自动加上这个前缀；本地预览仍使用根路径。若以后改仓库名，需要同步修改 `.github/workflows/deploy.yml` 里的 `PATH_PREFIX`。

## 内容结构

- `src/index.md`：首页元信息，项目入口由 `src/projects/*.md` 自动生成。
- `src/about.md`：关于页，纯文字 Markdown。
- `src/projects/*.md`：每个项目一个文件；`gallery` 保存图片与图名，正文保存设计说明。
- `src/articles/*.md`：写作页的文章；每篇自动生成摘要、展开/收起全文。
- `src/drawings.md`、`src/writing.md`、`src/news.md`、`src/playing.md`：其余内容页。
- `public/imgs/`：全部图片，页面用 `/imgs/...` 引用。
- `public/fonts/`：字体子集；`src/assets/style.css` 通过 `../fonts/fonts.css` 引用。

## 新增一篇文章

在 `src/articles/` 新建一个 `.md`，按下面格式填写；写作页会自动出现该文章。目录数据文件 `src/articles/articles.json` 已经处理了布局、集合和输出，不需要在每篇文章里重复。

```yaml
---
title: 文章标题
year: "2025.12"
kind: 课程论文
abstract:
  - 第一段摘要
  - 第二段摘要
keywords: 关键词一 / 关键词二
order: 3
---

正文 Markdown 写在这里。
```

图片放进 `public/imgs/writing/`，正文用 `![说明](/imgs/writing/文件名.webp)` 引用。

## 更换开屏图片

编辑 `src/index.md`：

```yaml
introImage: /imgs/drawings/d13.webp
introWidth: 2000
introHeight: 1055
```

把图片放进 `public/imgs/`，改 `introImage` 即可；宽高按实际图片填写。
