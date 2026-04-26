# MIC Field — Concept Direction Proposal

品牌概念方向提案，61 张幻灯片，基于 Vite + GSAP 构建的 Web PPT。

## 技术栈

| 工具 | 版本 | 用途 |
|------|------|------|
| Vite | ^8 | 构建 + 热更新 |
| GSAP | ^3.15 | 动画引擎 |
| deck-stage.js | 自定义 | 幻灯片导航 Web Component |
| IBM Plex Sans SC | — | 中文正文字体 |
| Plus Jakarta Sans | — | 英文展示字体 |
| Space Grotesk | — | 数字 / 等宽字体 |

## 快速开始

```bash
npm install
npm run dev        # 开发服务器 → http://localhost:5173/proposal.html
```

## 常用命令

```bash
npm run dev        # 开发服务器
npm run build      # 构建到 dist/
npm run preview    # 预览构建产物
npm run split      # 将 proposal.html 重新拆分为单幻灯片文件（会覆盖 src/slides/）
```

## 目录结构

```
src/
├── slides/           # 每张幻灯片一个 HTML 文件，按文件名排序
│   ├── 01-01-cover.html
│   └── … (共 61 个)
├── styles/
│   ├── tokens.css        # CSS 变量（颜色 + 字体）
│   ├── typography.css    # 字号类：.dp .jb .tt .sb .bd .sm .xs .lbl
│   ├── layout.css        # 布局 / 间距 / 装饰
│   └── components.css    # 组件样式
├── animations/
│   └── index.ts          # GSAP 动画预设系统
└── main.ts               # 入口：glob 导入 + 组装 + 动画初始化

public/
├── deck-stage.js         # 导航 Web Component（请勿修改）
└── images/               # 本地图片，引用路径 /images/xxx.webp
```

## 幻灯片结构

每个文件包含一个 `<section>`，通过 `data-anim` 指定动画预设：

```html
<section class="bg-dk" data-label="标题" data-anim="preset">
  <!-- 内容 -->
</section>
```

### 动画预设

| `data-anim` | 场景 |
|-------------|------|
| `cover` | 封面 |
| `chapter` | 章节开场 |
| `finding` | 调研结论 |
| `statement` | 核心陈述 |
| `brandcard` | 品牌研究卡片 |
| `moodgrid` | 情绪版网格 |
| `default` | 通用 |

### 背景主题类

| 类名 | 色值 | 适用文字色 |
|------|------|-----------|
| `.bg-dk` | `#0B0C10` 深黑 | `--tlt` |
| `.bg-md` | `#171A1F` 中深 | `--tlt` |
| `.bg-wm` | `#F4F0E8` 暖白 | `--td` |
| `.bg-am` | `#C8683A` 琥珀 | `#fff` |
| `.bg-tl` | `#1E7085` 青色 | `#fff` |

## 字体规模

| 类 | 字号 | 字重 |
|----|------|------|
| `.dp` | 100px | 700 |
| `.jb` | 76px | 700 |
| `.tt` | 56px | 600 |
| `.sb` | 38px | 500 |
| `.bd` | 28px | 400 |
| `.sm` | 24px | 400 |
| `.xs` | 20px | 300 |
| `.lbl` | 20px | 500 + uppercase |

## 新增幻灯片

1. 在 `src/slides/` 新建 `{NN}-{slug}.html`
2. 参照最近似的现有幻灯片复制结构
3. 设置 `data-anim` 为合适的预设
4. 无需注册，`main.ts` 通过 `import.meta.glob` 自动发现

## 图片规范

**Unsplash CDN 格式：**

```html
<img src="https://images.unsplash.com/photo-{ID}?auto=format&fit=crop&w=1040&q=85"
     style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;"
     loading="lazy" alt="描述">
```

**本地图片：** 放入 `public/images/`，引用 `/images/filename.webp`

## 部署

Vercel 自动检测 Vite，推送主分支后自动构建。
