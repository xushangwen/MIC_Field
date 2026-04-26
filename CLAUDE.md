# MIC Field — Brand Direction Proposal

## 项目简介
为 MIC Field 骑行品牌制作的品牌方向概念提案，61 张幻灯片，基于 Vite + GSAP + deck-stage Web Component 构建。

## 技术栈
| 工具 | 用途 |
|------|------|
| Vite | 构建 + 热更新 |
| GSAP free (core + ScrollTrigger) | 动画引擎 |
| deck-stage.js | 幻灯片导航 Web Component |
| IBM Plex Sans SC / Plus Jakarta Sans / Space Grotesk | 字体三件套 |

## 常用命令
```bash
npm run dev      # 开发服务器 → http://localhost:5173/proposal.html
npm run build    # 构建到 dist/
npm run preview  # 本地预览构建产物
npm run split    # 将 proposal.html 重新拆分为单幻灯片文件（⚠️ 会覆盖 src/slides/）
```

---

## 目录结构
```
src/
├── slides/          ← 每张幻灯片一个文件，按文件名自动排序组装
│   ├── 01-01-cover.html
│   ├── 02-02-ch01-context.html
│   └── … (61 个文件)
├── styles/
│   ├── tokens.css       ← CSS 变量（颜色 + 字体）← 品牌 token 修改入口
│   ├── typography.css   ← 字号类：.dp .jb .tt .sb .bd .sm .xs .lbl
│   ├── layout.css       ← 布局/间距/装饰：.col .row .pad .g16 … .rule .dot
│   └── components.css   ← 组件：.b-img .b-info .insight .kw .cmp .ck .fn-n
├── animations/
│   └── index.ts         ← GSAP 动画系统
└── main.ts              ← 入口：glob 导入 + 组装 + 动画初始化

public/
├── deck-stage.js        ← 导航 Web Component（不要修改）
└── images/              ← 本地图片放这里，引用路径 /images/xxx.webp

scripts/
└── split-slides.js      ← 幻灯片拆分脚本
```

---

## 幻灯片规范

### 文件命名
`src/slides/{NN}-{label-slug}.html`，NN 两位数，按字母顺序排序即为播放顺序。

### 每个文件只含一个 `<section>`
```html
<section class="bg-dk" data-label="XX Title" data-anim="preset">
  <!-- 内容 -->
</section>
```

### `data-anim` 动画预设对照
| 值 | 适用场景 |
|----|---------|
| `cover` | 封面（含 SVG topo + 标题） |
| `chapter` | 章节开场（含 `.ch-n` 大背景数字） |
| `finding` | 调研结论（含 `.fn-n` 大数字） |
| `statement` | 核心陈述/居中引用（含 SVG topo） |
| `brandcard` | 品牌研究：左 `.b-img` + 右 `.b-info` |
| `moodgrid` | 情绪版网格（绝对定位 grid） |
| `default` | 通用（自动查找常见类名） |

### 背景主题类
```
.bg-dk   深黑   #0B0C10   文字 --tlt
.bg-md   中深   #171A1F   文字 --tlt
.bg-wm   暖白   #F4F0E8   文字 --td
.bg-am   琥珀   #C8683A   文字 #fff
.bg-tl   青色   #1E7085   文字 #fff
```

---

## CSS 变量速查
```css
/* 颜色 */
--dk   #0B0C10    深色背景
--mid  #171A1F    中深背景
--wm   #F4F0E8    暖白背景
--am   #C8683A    品牌琥珀色（标签/强调）
--am2  #E28A5A    琥珀浅色
--tl   #1E7085    青色辅助
--tlt  #EBE6DC    深色背景上的文字色
--td   #1A1815    浅色背景上的文字色
--md   #8C8878    次要文字（muted）

/* 字体 */
--fc  'IBM Plex Sans SC'   中文 body
--fe  'Plus Jakarta Sans'  英文 display
--fn  'Space Grotesk'      数字/等宽
```

---

## 新增幻灯片
1. 在 `src/slides/` 创建文件，命名 `{NN}-{slug}.html`
2. 复制最近似的现有幻灯片结构作为模板
3. 设置 `data-anim` 为合适的预设
4. `main.ts` 通过 `import.meta.glob` 自动发现，无需注册

插入到特定位置：调整序号（如在 17 和 18 之间插入，命名 `17b-xxx.html`，或将后续幻灯片重新编号）。

---

## 删除 / 重排幻灯片
直接删除或重命名 `src/slides/` 中的文件。按文件名字母顺序排序即为播放顺序。

---

## 图片规范

### Unsplash 已用图片（已替换为真实图）
| 幻灯片 | 内容 | Unsplash CDN ID |
|--------|------|----------------|
| 10 Tokyo Context | 日本街头骑行 | `1742268350506-efd0f67ee859` |
| 16 Specialized | 公路骑行赛事 | `1517649763962-0c623066013b` |
| 17 Trek | 山地车越野 | `1633625463244-19e22598bceb` |
| 21 Rapha | 公路骑行生活方式 | `1578910643182-5590e3fcdc81` |
| 25 Arc'teryx | 云雾山地 | `1761762503587-1cc7e4b10e73` |
| 26 Snow Peak | 日式空间 | `1764445274404-f2e14fd3f20c` |

### Unsplash 图片使用方式
```html
<img src="https://images.unsplash.com/photo-{ID}?auto=format&fit=crop&w=1040&q=85"
     style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;"
     loading="lazy"
     alt="描述">
```

### 待补充官方品牌图（当前仍为色块占位）
从各品牌官网下载后放入 `public/images/`，在对应 slide 文件中替换：
- 幻灯片 18：Canyon / Pinarello
- 幻灯片 22：MAAP / Pas Normal Studios
- 幻灯片 26：Goldwin（Snow Peak 已有图）
- 幻灯片 29：Polestar / Porsche
- 幻灯片 30：Aesop / Muji
- 情绪版 44, 46, 48：各方向氛围图拼贴

### 本地图片
```
放置路径：public/images/filename.webp
引用方式：src="/images/filename.webp"
```

---

## 动画扩展
在 `src/animations/index.ts` 的 `presets` 对象中新增：
```typescript
presets.myPreset = (tl, slide) => {
  const el = slide.querySelector('.my-class')
  tl.from(el, { opacity: 0, y: 20, duration: 0.6 })
}
```
然后在幻灯片 `<section>` 上设置 `data-anim="myPreset"`。

SVG 路径描绘动画（免费替代 GSAP DrawSVG）：
```typescript
// 已内置在 animateTopo() 中，对 .topo 下所有 path/ellipse/circle/line 生效
// 在任意 preset 中调用 animateTopo(tl, slide) 即可
```

---

## 部署
Vercel 自动检测 Vite 框架，主分支推送后自动构建。
无需额外配置，`vite.config.ts` 中已定义多页入口（proposal + pricing）。
