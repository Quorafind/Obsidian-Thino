# 2.8.11

> [!tips]+ English
>
> ## Feat
>
> - feat(share): add outer frame option for share image with padding, shadow and background color

> [!note]- 中文
>
> ## 新增
>
> - 新增（分享）：分享图片支持外框选项，可添加边距、阴影和背景颜色

---

# 2.8.4~2.8.10

> [!tips]+ English
>
> ## Feat
>
> - feat(flow): add UI updates for better responsiveness
> - feat(list): add memo selection feature for batch operations
>
> ## Performance
>
> - perf(list): optimize memo list rendering performance
> - perf(filter): add quick update methods for real-time memo operations
>
> ## Fix
>
> - fix(chat): preserve scroll position when loading history
> - fix(scroll): restore scroll functionality in memo list
> - fix(calendar): remove mobile platform restriction for calendar suggest
> - fix(filter): improve tag filtering and type checking logic
> - fix(filter): correct isFiltered logic to check duration range validity
> - fix(memo-list): prevent unwanted scroll reset when switching to chat view
> - fix(moments): fix moments view styling and icon rendering
> - fix(virtual-list): resolve rendering issues and improve scroll stability
>
> ## Refactor
>
> - refactor(flow): simplify editor implementation with hooks-based approach
> - refactor(list): remove virtual list and add selection feature
> - refactor: remove virtual list implementation and update dependencies
> - refactor: optimize virtual list performance and remove documentation files
>
> ## Build
>
> - build: migrate to rolldown-vite and add node polyfills
>
> ## Style
>
> - style: improve UI responsiveness and scrollbar handling

> [!note]- 中文
>
> ## 新增
>
> - 新增（Flow）：UI 更新，提升响应速度
> - 新增（列表）：添加 Memo 选择功能，支持批量操作
>
> ## 性能
>
> - 性能（列表）：优化 Memo 列表渲染性能
> - 性能（筛选）：添加实时 Memo 操作的快速更新方法
>
> ## 修复
>
> - 修复（聊天）：加载历史记录时保持滚动位置
> - 修复（滚动）：恢复 Memo 列表的滚动功能
> - 修复（日历）：移除日历建议的移动端平台限制
> - 修复（筛选）：改进标签筛选和类型检查逻辑
> - 修复（筛选）：校正筛选时长区间有效性检查逻辑
> - 修复（列表）：切换到聊天视图时避免意外滚动重置
> - 修复（Moments 视图）：修复样式与图标渲染问题
> - 修复（虚拟列表）：解决渲染问题并提升滚动稳定性
>
> ## 重构
>
> - 重构（Flow）：使用基于 Hooks 的方式简化编辑器实现
> - 重构（列表）：移除虚拟列表并添加选择功能
> - 重构：移除虚拟列表实现并更新依赖
> - 重构：优化虚拟列表性能并移除文档文件
>
> ## 构建
>
> - 构建：迁移至 rolldown-vite 并添加 Node polyfills
>
> ## 样式
>
> - 样式：提升界面响应性与滚动条体验

---

# 2.8.0~2.8.3

> [!tips]+ English
>
> ## Feat
>
> - feat: introduce virtual list rendering and optimized components for smoother scrolling on large lists
> - feat: add in-app Changelog view for quick release notes lookup
>
> ## Performance
>
> - perf: major MemoList rendering and filtering optimizations; reduce recomputation and add quick-update methods for real-time operations
> - perf: improve chart rendering performance and filter recomputation efficiency
>
> ## Fix
>
> - fix(filter): correct duration-range validity checks when filter thinos
> - fix(filter): improve tag filtering
> - fix(memo-list): prevent unwanted scroll reset when switching to chat view
> - fix(moment view): adjust styling and icon rendering issues
> - fix(safari issue): work around for ios white screen issue
>
> ## Refactor
>
> - refactor!: migrate state management from custom stores to Zustand while preserving existing plugin behavior
> - refactor: remove unused dependencies/docs/components and optimize imports
>
> ## Style
>
> - style: improve UI responsiveness and scrollbar handling;

> [!note]- 中文
>
> ## 新增
>
> - 新增：引入虚拟列表渲染与优化组件，在长列表下滚动更顺滑
> - 新增：内置「更新日志」页面，便于快速查看版本说明
>
> ## 性能
>
> - 性能：大幅优化 MemoList 渲染与筛选，减少重复计算，并为实时操作提供快速更新方法
> - 性能：优化图表渲染与筛选重算效率
>
> ## 修复
>
> - 修复（筛选）：校正筛选 Thinos 的时长区间校验
> - 修复（筛选）：改进标签筛选
> - 修复（列表）：切换到聊天视图时避免意外滚动重置
> - 修复（Moment 视图）：修复样式与图标渲染问题
> - 修复（safari）：修复 ios 下白屏问题
>
> ## 重构
>
> - 重构：状态管理迁移至 Zustand，同时保持既有行为不变
> - 重构：移除未使用的依赖、文档与组件，并优化导入
>
> ## 样式
>
> - 样式：提升界面响应性与滚动条体验；

---

> [!warning]+ English
> Other releases info are not listed here, you can view them on the [release page](https://github.com/Quorafind/Obsidian-Thino/blob/main/CHANGELOG_ARCHIVE.md).

> [!note]- 中文
> 其他版本信息未在此列出，您可以在[发布页面](https://github.com/Quorafind/Obsidian-Thino/blob/main/CHANGELOG_ARCHIVE.md)查看。
