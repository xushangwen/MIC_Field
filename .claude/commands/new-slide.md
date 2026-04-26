---
description: 在 MIC Field 品牌提案中新增一张幻灯片
---

在 `src/slides/` 中新增一张幻灯片，并确保它符合项目规范。

## 需要用户提供的信息
- 插入位置（在第几张之后）
- 幻灯片类型（章节开场 / 品牌卡片 / 内容列表 / 核心陈述 / 情绪版 / 自定义）
- 内容（文案、数据、图片需求）
- 背景主题（深色 bg-dk / 暖白 bg-wm / 琥珀 bg-am / 青色 bg-tl）

## 执行步骤
1. 读取最接近类型的现有幻灯片文件作为模板
2. 确定文件序号和命名（`{NN}-{slug}.html`）
3. 根据用户提供的内容生成 HTML
4. 设置正确的 `data-anim` 预设
5. 创建文件，无需修改 `main.ts`（自动 glob 导入）

## 幻灯片模板参考
- 章节开场 → `src/slides/02-02-ch01-context.html`
- 品牌研究卡片 → `src/slides/16-16-specialized.html`
- 核心陈述（居中）→ `src/slides/04-04-core-proposition.html`
- 内容+列表 → `src/slides/12-12-audience-map.html`
- 调研结论 → `src/slides/33-33-finding-1-expertise.html`
- 情绪版网格 → `src/slides/44-44-direction-a-mood.html`
