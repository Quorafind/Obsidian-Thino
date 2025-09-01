# 2.8.0-2

> [!tips]+ English
>
> ## Fix
>
> - fix(stats): time distribution and time-series charts misalignment by enforcing stable ordering (hours, days, months) and dynamic width to avoid label overlap; enable horizontal scroll when needed
> - fix(memos): archive/delete now instantly reflects in the list by notifying worker cache and triggering filtered list recompute
> - fix(filter): clicking a saved query reliably updates the main list by transforming query to worker query in filterMemos and avoiding stale cache keys
>
> ## Improvement
>
> - chore(charts): consistent axis labels and safer zero/edge-case handling

> [!note]- 中文
>
> ## 修复
>
> - 修复（统计）：通过对小时/日期/月等数据进行稳定排序，并根据数据量动态计算图表宽度，避免标签拥挤导致的“错位”；在需要时启用横向滚动
> - 修复（列表）：删除/归档后立即反映到列表中（通知 Worker 缓存并触发筛选重算）
> - 修复（筛选）：点击已保存的检索式后主列表能可靠更新（在 filterMemos 中将查询转换为 Worker 查询并避免缓存不一致）
>
> ## 优化
>
> - 优化（图表）：统一坐标轴标签与零值/边界情况处理

# 2.7.18

> [!tips]+ English
>
> ## Fix
>
> - fix: or logic issue in query filter;
>
> [!note]- 中文
>
> ## 修复
>
> - 修复：查询过滤器中的或逻辑问题；

# 2.7.17

> [!tips]+ English
>
> ## Fix
>
> - fix: improve multi-line memo content extraction logic to prevent truncation
> - fix: handle edge case where memos with multiple list items were incorrectly processed
>
> [!note]- 中文
>
> ## 修复
>
> - 修复：改进多行 memo 内容提取逻辑，防止内容被截断
> - 修复：处理包含多个列表项的 memo 被错误处理的边缘情况

---

> [!warning]+ English
> Other releases info are not listed here, you can view them on the [release page](https://github.com/Quorafind/Obsidian-Thino/blob/main/CHANGELOG_ARCHIVE.md).

> [!note]- 中文
> 其他版本信息未在此列出，您可以在[发布页面](https://github.com/Quorafind/Obsidian-Thino/blob/main/CHANGELOG_ARCHIVE.md)查看。
