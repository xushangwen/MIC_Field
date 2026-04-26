# MIC Field — Brand Direction Proposal

Vite + GSAP + deck-stage，61 张幻灯片。`npm run dev` → http://localhost:5173/proposal.html

## 幻灯片
- 文件：`src/slides/{NN}-{slug}.html`，按文件名排序即为播放顺序
- 每文件一个 `<section class="bg-dk" data-label="..." data-anim="preset">`
- 新增无需注册（`import.meta.glob` 自动发现）；插中间用 `17b-` 命名

**data-anim 预设：** `cover` 封面 · `chapter` 章节 · `finding` 结论数字 · `statement` 陈述 · `brandcard` 品牌左图右文 · `moodgrid` 情绪版 · `default` 通用

**背景类：** `.bg-dk` #0B0C10 · `.bg-md` #171A1F · `.bg-wm` #F4F0E8 · `.bg-am` #C8683A · `.bg-tl` #1E7085

## CSS 速查
```
颜色：--dk --mid --wm --am #C8683A --am2 --tl #1E7085 --tlt --td --md --ml --fc --fe --fn
字体：--fc IBM Plex Sans SC · --fe Plus Jakarta Sans · --fn Space Grotesk
字号类：.dp 100px · .jb 76px · .tt 56px · .sb 38px · .bd 28px · .sm 24px · .xs 20px · .lbl 20px uppercase
布局类：.pad 48px 88px · .h100 · .col · .row · .fcnt · .va · .jsb
```

## 图片
用户提供 URL 直接替换。全屏 `w=1920`，内容图 `w=1040`，网格 `w=800`。本地图放 `public/images/`，引用 `/images/filename.webp`。

待补品牌图：18 Canyon/Pinarello · 22 MAAP/PNS · 26 Goldwin · 29 Polestar/Porsche · 30 Aesop/Muji · 44/46/48 情绪版

## 动画扩展
`src/animations/index.ts` → `presets.myPreset = (tl, slide) => {...}` 后在 section 上设 `data-anim="myPreset"`。SVG 描边已内置 `animateTopo(tl, slide)`。

## 部署
Vercel 主分支自动构建，无需额外配置。
