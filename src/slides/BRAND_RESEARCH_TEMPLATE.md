# 品牌调研幻灯片模板规范

每个品牌固定**四页**（含引导页），按以下结构排版。新增品牌时按此文档执行，不需要重新设计。

---

## 文件命名

```
XX0-XX0-{brand}-intro.html    → P0 品牌引导页（全屏大图）
XX-XX-{brand}.html            → P1 品牌概览
XXb-XXb-{brand}-visual.html   → P2 视觉体系
XXc-XXc-{brand}-insight.html  → P3 摄影调性 & 战略洞察
```

CSS 类前缀每页独立，2–3 字母，避免全局污染。示例：`rp-` / `rpv-` / `rpi-`。

---

## P0 — 品牌引导页

每个品牌调研的第一张，全屏大图 + 底部品牌信息。

### 布局
全屏 `position: relative; height: 100%; overflow: hidden`

### 图层（从下到上）
1. **背景图**：`position: absolute; inset: 0; object-fit: cover` — 选用最具张力的品牌摄影
2. **渐变蒙层**：`linear-gradient(to top, rgba(11,12,16,.92) 0%, rgba(11,12,16,.38) 48%, transparent 100%)`
3. **内容区**：`position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: flex-end; padding: 64px 88px; gap: 20px`

### 内容（底部上至下）
- **Layer 标签**：`fn` 13px，`.22em` tracking，uppercase，`var(--am)`
- **Logo**：`height: 60px; width: auto`；纯黑 SVG 加 `filter: brightness(0) invert(1)`；已白色 SVG 直接引用
- **品牌名（英文）**：`fe` 88px 700，白色，`letter-spacing: -.02em`
- **中文名**（有则显示）：`fc` 28px，`rgba(255,255,255,.45)`，`letter-spacing: .08em`，`margin-top: -8px`

---

## P1 — 品牌概览

### 布局
```css
display: grid;
grid-template-columns: 55% 45%;
height: 100%;
```

### 左侧：全出血照片拼图
- 绝对定位填满容器（`position: absolute; inset: 0`）
- 上行 58% 高：一张主图
- 下行 42% 高：`grid-template-columns: 1fr 1fr`，左格可再拆为两图（`1fr 1fr`），右格单图
- 图片缝隙：`gap: 3px`（视觉黑缝）
- 所有图片：`object-fit: cover; object-position: center`

### 右侧：信息面板
```css
display: flex; flex-direction: column; justify-content: space-between;
padding: 60px 80px 60px 68px;
border-left: 1px solid rgba(255,255,255,.05);
```

三段内容，`justify-content: space-between` 撑满：

**① 顶部头部**
- 橙色类别标签：`fn` 14px，`.2em` tracking，uppercase，`var(--am)`
- Logo SVG：白色，左对齐。**尺寸必须按宽高比判断**：宽字标（宽高比 > 3:1）用 `height: 80px`；正方形/图标型（宽高比 ≈ 1:1）用 `height: 120px`；13 页 rs-card 中图标型 logo 一律用 `rs-logo-img--sq`（130px）。新增品牌前先用 `head -3 logo.svg` 确认宽高比。
- 元信息：`fn` 15px，`rgba(255,255,255,.35)`（成立年份 · 城市 · 定位）

**② 中部引言**
- `fc` 24px，`line-height: 1.6`，`rgba(255,255,255,.82)`
- 左竖线：`border-left: 2px solid var(--am); padding-left: 20px`

**③ 底部价值观列表**
- 顶部分隔线 `1px rgba(255,255,255,.07)`
- 每行：`grid-template-columns: 130px 1fr; gap: 16px`
- 左列：`fn` 13px，uppercase，`rgba(255,255,255,.4)`（英文关键词）
- 右列：`fc` 20px，`rgba(255,255,255,.72)`（中文说明）

---

## P2 — 视觉体系

### 布局
全页 flex column，`padding: 52px 88px 56px`

**顶部标题栏**（`flex-shrink: 0`，底部 `1px rgba(255,255,255,.07)` 分隔线，`margin-bottom: 36px`）：
- 左：品牌名（`fe` 34px 700）+ `/`（`rgba(255,255,255,.2)`）+ 页面标题（`fn` 14px uppercase）
- 右：页码（`fn` 13px，`rgba(255,255,255,.2)`）——格式：`视觉体系解析 · 02 / 03`

**内容区**：
```css
display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 28px; flex: 1; min-height: 0;
```

每列顶部：橙色列标签（`fn` 13px，`.2em` tracking，uppercase，`var(--am)`）

---

### Col 1：Color System

**色卡容器**：`flex column; gap: 6px; flex: 1; min-height: 0`

**每张色卡**（`flex: 1; border-radius: 8px; padding: 18px 20px`）：
- 背景 = 该颜色本身（深色卡加 `1px rgba(255,255,255,.1)` 边框）
- 顶部：色名（`fn` 17px bold）+ `HEX xxxxxx` + `RGB x x x`
- 底部（分隔线）：Role 标签（`fn` 12px uppercase）+ 一行描述（`fn` 12px）
- **白色卡片**：文字改为深色，用 `--dk` 修饰符：`rgba(0,0,0,.85/.65/.5/.5/.4)`

**底部总结**（`flex-shrink: 0`，顶部分隔线）：
- `fc` 14px，`line-height: 1.7`，`rgba(255,255,255,.38)`
- 内容：颜色体系的整体设计逻辑与市场定位意义

---

### Col 2：Typography & Logo

**Logo 展示卡**（微透明背景 `rgba(255,255,255,.025)` + `1px rgba(255,255,255,.06)` 边框，`border-radius: 8px`）：
- 小标签（`fn` 12px uppercase）：描述 Logo 类型，如 `Wordmark · Custom Serif`
- Logo 图片：`height: 160px; align-self: flex-start; opacity: .9`
- 描述文字（`fn` 13px，`rgba(255,255,255,.35)`）

**字体 Specimen 卡** × 2（各 `flex: 1`，同上微透明背景，**`overflow: hidden`**）：
- 列标签（`fn` 12px uppercase）：字体名称 + 用途
- 大号展示文字（品牌真实字体，**68–72px**，`line-height: 1.05`）——选 1–3 个词，确保在容器宽度内不溢出；全大写 / 宽字距字体酌情降至 **52px**
- 副标题（同字体，**28px**，45% 透明度）
- 底部正文（分隔线，14px，40% 透明度）——英文例句

**底部注释**（`margin-top: auto`，顶部分隔线）：`fc` 17px，`rgba(255,255,255,.45)`

**品牌字体处理**：
- 复制字体文件到 `public/fonts/{brand}/`
- `<style>` 顶部写 `@font-face`，只在本页加载
- 选 Regular / Roman 字重，不用 Italic

---

### Col 3：Photography Style

**照片区**（`flex: 1; flex column; gap: 10px; min-height: 0`）：
- 两张照片，各 `flex: 1; border-radius: 8px; min-height: 60px`
- 上图：`object-position: center top`
- 下图：`object-position: center center`
- 底部注释（同 Col 2 底部注释样式）

---

## P3 — 摄影调性 & 战略洞察

### 布局
```css
display: grid; grid-template-columns: 58% 42%; height: 100%;
```

### 左侧：照片网格
`padding: 52px 48px 52px 88px; flex column; gap: 24px`

- 顶部橙色标签（`fn` 13px uppercase `var(--am)`）
- 照片网格（`flex: 1; min-height: 0`）：
  ```css
  display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 10px;
  ```
  - 上行：两张独立照片（各占一格）
  - 下行：`grid-column: 1/3` 横跨全宽
    - 单图：直接放 `<img>`
    - 三联图：内嵌 `grid-template-columns: 1fr 1fr 1fr; gap: 10px`
  - 所有照片：`border-radius: 6px; object-fit: cover`

### 右侧：文字内容
`padding: 52px 88px 52px 52px; border-left: 1px rgba(255,255,255,.05); flex column; justify-content: space-between`

三段，`justify-content: space-between` 撑满：

**① 美学主张**
- 小标签（`fn` 13px uppercase，`rgba(255,255,255,.3)`）
- 大标题（`fe` 48px 700，白色，`line-height: 1.1`）——2行，概念词组
- 正文（`fc` 20px，`rgba(255,255,255,.65)`，`line-height: 1.7`）

**② 策略/社群**（分隔线上下隔开）
- 小标签（`fn` 13px uppercase，`rgba(255,255,255,.3)`）
- 正文（`fc` 19px，`rgba(255,255,255,.5)`，`line-height: 1.65`）

**③ 对 MIC 的战略洞察卡片**
```css
background: rgba(200,104,58,.08);
border: 1px solid rgba(200,104,58,.22);
border-radius: 8px;
padding: 26px 28px;
```
- 橙色小标签（`fn` 13px uppercase，`var(--am)`）
- 标题（`fe` 24px 700，`rgba(255,255,255,.9)`，`line-height: 1.3`）
- 正文（`fc` 18px，`rgba(255,255,255,.6)`，`line-height: 1.7`）

---

## 通用 Token

| 元素 | 规格 |
|---|---|
| 背景 | `.bg-dk` |
| 强调色 | `var(--am)` #C8683A |
| 主字体（正文）| `var(--fc)` IBM Plex Sans SC |
| 标题字体 | `var(--fe)` Plus Jakarta Sans |
| 标签/数字字体 | `var(--fn)` Space Grotesk |
| 外侧水平 padding | 88px |
| 分隔线 | `1px solid rgba(255,255,255,.07)` |
| 细边框 | `1px solid rgba(255,255,255,.05-.06)` |
| 照片圆角 | `6–8px` |

---

## 交付清单

提供以下内容，我按此模板排版输出：

- [ ] Markdown 调研文档（包含：品牌概述、颜色、字体、摄影调性、核心价值、对 MIC 的启示）
- [ ] 品牌图片文件夹（5–7 张，按用途命名）
- [ ] Logo 文件（SVG，白色版 or 可处理的原版）
- [ ] 字体文件夹（可选，woff2 格式）
