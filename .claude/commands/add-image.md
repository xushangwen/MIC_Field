---
description: 为指定幻灯片添加或替换配图
---

为 MIC Field 提案中的指定幻灯片添加、替换或优化配图。

## 使用方式
告诉我：幻灯片编号（或标题）+ 你想要的图片内容描述

## 图片来源优先级
1. **官方品牌图**（需用户提供）→ 放入 `public/images/`，引用 `/images/xxx.webp`
2. **Unsplash**（免费可用）→ 搜索合适图片，获取 CDN URL
3. **已有 CSS 渐变占位**（保留作为 fallback）

## 替换占位色块的方式
在 slide 文件中，找到渐变 `<div>` 并在其前面插入 `<img>`：
```html
<!-- 替换前 -->
<div style="position:absolute;inset:0;background:linear-gradient(...)"></div>
<div class="stripe"></div>

<!-- 替换后 -->
<img src="https://images.unsplash.com/photo-{ID}?auto=format&fit=crop&w=1040&q=85"
     style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;"
     loading="lazy"
     alt="描述">
<div style="position:absolute;inset:0;background:linear-gradient(to right,transparent 65%,var(--dk) 100%);"></div>
```

## 情绪版网格（幻灯片 44 / 46 / 48）
每个格子替换背景，保留 stripe 和 label：
```html
<div style="position:relative;overflow:hidden;">
  <img src="..." style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;">
  <div style="position:absolute;inset:0;background:rgba(0,0,0,.25);"></div>
  <div style="position:absolute;bottom:20px;left:20px;font-size:24px;opacity:.5;">标签</div>
</div>
```

## 已使用图片记录（避免重复）
见 CLAUDE.md → 图片规范 → Unsplash 已用图片表格。
