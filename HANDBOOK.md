# 作品集维护手册

写给第一次接触这套东西的人。先记住一句话：

> **你以后主要改 `src/` 里的 Markdown 文字和 `public/imgs/` 里的图片；`_site/` 是自动生成的成品，不要手改。**

- 线上地址：<https://dmg-kwing.github.io/>
- 本地预览：`http://localhost:8080/`
- 代码仓库：<https://github.com/Dmg-Kwing/Dmg-Kwing.github.io>

---

## 一、这次从旧网页到上线，经历了什么

### 1. 拆旧网页

原来的作品集是一堆已经写好的 `.html` 文件，加上 `assets/` 里的 CSS、JavaScript、字体和图片。浏览器打开就能看，但改内容要直接改 HTML，容易改坏。

### 2. 把“内容”和“版式”分开

把旧网页里的文字、图片、项目说明、文章摘要、关键词、游戏记录等提取出来：

- 文字 → `src/*.md` 和 `src/projects/*.md`
- 每个项目一个 Markdown 文件
- 图片 → `public/imgs/`
- 文章全文 → `src/articles/*.md`

### 3. 用 Eleventy 做“装配线”

Eleventy 是一个静态网站生成器。它把：

```text
Markdown 文字 + Nunjucks 模板 + CSS + 图片
```

装配成浏览器能看的 HTML，输出到 `_site/`。

可以把它理解成：

- `src/` 是素材和文字稿
- `_includes/` 是版式模具
- `_site/` 是装配好的成品
- `eleventy.config.js` 是装配线说明书

### 4. 保留原来的视觉，再做局部重设计

先把旧版样式原样跑通，确认没有丢内容，再改了开屏动画、写作页展开全文、去掉滑动页的 SWIPE 等。

### 5. 放到 GitHub

把整个项目放进 GitHub 仓库。GitHub 同时是：

- 网盘：保存代码和历史版本
- 版本记录：每次修改都有记录，可以回退
- 自动化的起点：push 后触发构建

### 6. 用 GitHub Actions 自动构建

`.github/workflows/deploy.yml` 是一张“自动任务单”：

```text
每次 push 到 main
→ 安装依赖
→ 运行 pnpm build
→ 把 _site 上传
→ 发布到 GitHub Pages
```

你不需要手动上传 HTML。

### 7. 发布到 GitHub Pages

GitHub Pages 是展示柜。它把 `_site/` 的内容挂到公网：

```text
https://dmg-kwing.github.io/
```

中间遇到过一次“页面能打开但没样式”的问题：因为仓库当时叫 `Jiong.github.io`，GitHub 把它当成子路径项目页，而网页里的 `/assets`、`/imgs` 都指向了根目录。后来把仓库改名成 `Dmg-Kwing.github.io`，它才变成真正的用户主页，直接使用根地址。

---

## 二、目录地图

```text
my-portfolio/
├── src/
│   ├── index.md                 首页（开屏图、首页信息）
│   ├── about.md                 关于页
│   ├── drawings.md              绘画页图片列表
│   ├── writing.md               写作页外壳
│   ├── news.md                  动态列表
│   ├── playing.md               最近在玩列表
│   ├── projects/
│   │   ├── student-housing.md
│   │   ├── diaoyutai-arts-center.md
│   │   └── world-literature-living-room.md
│   ├── articles/
│   │   ├── brutalism.md         文章全文 + 摘要
│   │   ├── zoo.md
│   │   └── articles.json         文章目录的公共设置
│   ├── assets/
│   │   ├── style.css            全站样式
│   │   └── site.js              开屏、灯箱、展开收起等交互
│   └── _includes/               页面模板
├── public/
│   ├── imgs/                    所有图片
│   └── fonts/                   字体
├── .github/workflows/deploy.yml 自动部署任务
├── eleventy.config.js           Eleventy 配置
├── package.json                 项目依赖和命令
└── HANDBOOK.md                  本文件
```

### 可以改的

- `src/*.md`
- `src/projects/*.md`
- `src/articles/*.md`
- `src/assets/style.css`（改样式时小心）
- `public/imgs/`（加图片）
- `public/fonts/`（一般不用动）

### 尽量不要动

- `_site/`：每次构建都会重新生成，手改会被覆盖
- `node_modules/`：依赖包，不要手改
- `.github/workflows/deploy.yml`：自动部署任务
- `eleventy.config.js`：装配线设置
- `package.json`、`pnpm-lock.yaml`：依赖版本
- `.gitignore`：告诉 Git 哪些文件不要提交

---

## 三、第一次在电脑上打开

### 需要装的东西

1. **Node.js**：<https://nodejs.org/> 下载 LTS 版本，一路下一步。
2. **pnpm**：Node 装好后，打开 PowerShell，运行：

   ```powershell
   corepack enable
   ```

   如果提示找不到 `corepack`，也可以：

   ```powershell
   npm install -g pnpm
   ```

3. **GitHub Desktop**（推荐新手）：<https://desktop.github.com/>，安装后登录 GitHub。

### 启动本地预览

在 PowerShell 里进入项目目录：

```powershell
cd "D:\Downloads\个人主页\my-portfolio"
pnpm install
pnpm start
```

第一次 `pnpm install` 会下载依赖，之后不用每次都装。

看到：

```text
Server at http://localhost:8080/
```

就用浏览器打开：

```text
http://localhost:8080/
```

改完文件后，本地页面会自动刷新。停止预览：在 PowerShell 里按 `Ctrl + C`。

### 只检查能不能构建

```powershell
pnpm build
```

构建成功后，成品在 `_site/`。**不要手改 `_site/`**。

---

## 四、日常修改

### 1. 改关于页

打开 `src/about.md`。上面 `---` 之间是页面信息，下面是正文：

```markdown
这个人很懒，什么都没有留下

姓名
: 黄炅
```

冒号和空格后面的内容就是显示的文字。改完保存，本地预览会自动刷新。

### 2. 改项目文字

打开 `src/projects/student-housing.md` 这类文件。

文件开头 `---` 之间是项目信息：

```yaml
title: 学生公寓
navTitle: Student Housing
coverTitle: 学生公寓
pageTitle: 学生公寓 — INDEX
order: 1
cover: /imgs/projects/dorm/01-view.webp
```

- `title`：项目名，浏览器标题和部分文字会用到
- `navTitle`：左侧导航里的英文名
- `coverTitle`：首页项目入口显示的中文名
- `order`：排序，数字越小越靠前
- `cover`：首页入口封面图

下面的 `gallery:` 是项目横向图片列表，每张图有 `src`、`alt`、`width`、`height`、`class`、`caption`。

正文在第二个 `---` 下面，写设计说明即可。

### 3. 新增一个项目

1. 复制 `src/projects/student-housing.md`，改名成新项目，例如 `src/projects/new-project.md`。
2. 改 `title`、`navTitle`、`coverTitle`、`pageTitle`、`order`。
3. 把图片放进 `public/imgs/projects/new-project/`。
4. 把 `cover` 和 `gallery` 里的路径改成 `/imgs/projects/new-project/...`。
5. 改正文。
6. 本地预览确认。
7. 提交并 push。

只要文件在 `src/projects/` 里，并且有 `tags: projects`（现有文件已经带了），首页和左侧导航会自动出现。

### 4. 新增一篇文章

在 `src/articles/` 新建一个 `.md`，例如 `src/articles/new-article.md`：

```markdown
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

正文从这里开始。

图片这样引用：

![说明](/imgs/writing/图片名.webp)
```

保存后，写作页会自动出现摘要和“展开”按钮。`src/articles/articles.json` 已经统一处理了布局、集合和输出，不需要每篇重复写。

图片放进 `public/imgs/writing/`。

### 5. 换开屏图片

打开 `src/index.md`，改这三行：

```yaml
introImage: /imgs/drawings/d13.webp
introWidth: 2000
introHeight: 1055
```

把新图放进 `public/imgs/`，改 `introImage`；宽高按图片实际尺寸填。

### 6. 改绘画页图片

打开 `src/drawings.md`，`gallery:` 下面每一段是一张图。复制一段，改 `src`、`alt`、`width`、`height`、`class`。

### 7. 改“最近在玩”

打开 `src/playing.md`，`games:` 下面是游戏列表。每项包含 `name`、`note`、`hours`、`image`、`url`。

### 8. 改“动态”

打开 `src/news.md`，`entries:` 下面每项包含 `date`、`title`、`text`。

### 9. 改样式

样式在 `src/assets/style.css`。可以改颜色、字号、间距，但建议一次只改一个小地方，改完立刻看本地预览。

不要直接改 `_site/assets/style.css`，下次构建会被覆盖。

---

## 五、发布：把修改送到线上

### 方法 A：GitHub Desktop（推荐新手）

1. 打开 GitHub Desktop，选择 **Add Local Repository**，指向 `D:\Downloads\个人主页\my-portfolio`。
2. 左边会列出你改过的文件。
3. 在左下角 Summary 里写一句这次改了什么，例如“更新学生公寓图片”。
4. 点 **Commit to main**。
5. 点 **Push origin**。
6. 打开 GitHub 仓库的 **Actions** 页面，等最新的 **Deploy portfolio** 变成绿色对勾。

### 方法 B：命令行

```powershell
cd "D:\Downloads\个人主页\my-portfolio"
git add .
git commit -m "更新学生公寓图片"
git push
```

如果提示没有 `git`，就安装 Git for Windows，或者用 GitHub Desktop。

### 发布之后

- 等 1～2 分钟。
- 打开 <https://dmg-kwing.github.io/>。
- 如果还是旧内容，按 `Ctrl + F5` 强制刷新。
- 如果 Actions 是红叉，点进去看哪一步报错。

---

## 六、Actions 红了怎么办

先看红色那一步的名字：

### `Install dependencies` 失败

通常是 `pnpm-lock.yaml` 和 `package.json` 不一致。不要手改 `pnpm-lock.yaml`。在本地运行：

```powershell
pnpm install
```

然后把生成的 `pnpm-lock.yaml` 一起提交。

### `Build site` 失败

最常见原因：

1. YAML 缩进错了（`---` 里的字段）
2. 图片路径写错
3. Markdown 里的图片文件名大小写不一致
4. 某个字段少了引号

本地先运行：

```powershell
pnpm build
```

终端会告诉你哪个文件、哪一行有问题。

### `Deploy to GitHub Pages` 失败

通常是 Pages 设置问题。到仓库：

```text
Settings → Pages → Build and deployment
Source 选 GitHub Actions
```

然后到 Actions 页面点 **Re-run jobs**。

### 页面能打开但没样式

检查：

- 仓库名是否还是 `Dmg-Kwing.github.io`
- 是否有人改了 `eleventy.config.js`
- 浏览器控制台（F12）里是否有 404

如果仓库改名，Pages 地址会变，样式路径也会变，需要重新调整。

---

## 七、日常维护清单

每次改完，按这个顺序：

1. 本地 `pnpm start` 看效果
2. 检查图片有没有显示、链接能不能点
3. 提交并 push
4. 看 Actions 是否绿色
5. 打开线上地址强制刷新

### 一定要记住

- **不要改 `_site/`**
- **不要删除 `.git/`**
- **不要删除 `.github/workflows/deploy.yml`**
- **不要随便改仓库名**
- **图片文件名大小写要一致**（GitHub 的 Linux 构建区分大小写，Windows 不区分）
- **YAML 的 `year` 建议加引号**，例如 `year: "2025.12"`
- **大图片先压缩**，网页会更快

### 备份

GitHub 上的每次提交就是一次备份。改坏了可以在 GitHub 的提交历史里找到旧版本，或者用 GitHub Desktop 的 History 回退。

更保险的做法：每隔一段时间把整个 `my-portfolio` 文件夹复制一份到移动硬盘。

---

## 八、常见问题

**Q：`pnpm` 不是内部或外部命令？**

先装 Node.js LTS，再运行 `corepack enable`；或者 `npm install -g pnpm`。

**Q：`pnpm start` 后 8080 被占用？**

关掉之前没退出的预览窗口，或者在 `package.json` 里把 `--port=8080` 改成 `--port=8081`。

**Q：改了文字，线上没变？**

先确认已经 push；再等 Actions 跑完；最后 `Ctrl + F5`。

**Q：图片不显示？**

检查图片是否真的在 `public/imgs/...`，路径大小写是否和 Markdown 里一致。

**Q：想改导航文字？**

导航在 `src/_includes/rail.njk`。这是模板文件，改之前最好先备份。

**Q：想加一个全新页面？**

需要新建 Markdown 和模板，属于结构性修改。可以先让 agent 帮忙，或者参考现有页面复制。

**Q：GitHub Pages 页面显示“GitHub Pages is designed to host...”？**

那通常是仓库的 Pages 设置页，不是你的网站。网站地址是 <https://dmg-kwing.github.io/>。

---

## 九、什么时候适合找 agent

- 想重新设计版式
- 想加全新的页面类型
- Actions 报错看不懂
- 要批量改很多项目或文章
- 要换域名、换部署方式
- 不确定某次修改会不会影响其他页面

平时只是改文字、换图片、加一篇文章，按上面的步骤自己来就够了。
