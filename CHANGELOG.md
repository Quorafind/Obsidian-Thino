# 3.0.0-beta.2

> [!tips]+ English
>
> ## Feat
>
> - feat(cli): add Obsidian CLI support with `thino`, `thinos`, and `thinos:search` commands
>   - `obsidian thino:add` — create a new thino from the command line with content, location, and type options
>   - `obsidian thinos` — search and list thinos with filters for date, tag, location, type, and output format
>   - `obsidian thinos:search` — hybrid semantic + text search powered by Super, with text-only fallback
>   - Use `obsidian help thinos` or `obsidian help thino` to see full commands
>
> ## Style
>
> - style(search): redesign search bar with filter chips and dropdown panels

> [!note]- 中文
>
> ## 新增
>
> - 新增（CLI）：支持 Obsidian CLI，提供 `thino`、`thinos` 和 `thinos:search` 命令
>   - `obsidian thino:add` — 通过命令行创建新 Thino，支持内容、存储位置和类型选项
>   - `obsidian thinos` — 搜索和列出 Thino，支持按日期、标签、存储位置、类型等筛选，可输出 JSON 格式
>   - `obsidian thinos:search` — Super 语义 + 文本混合搜索，无 Super 时回退为纯文本搜索
>   - 使用 `obsidian help thinos` 和 `obsidian help thino` 来查看完整命令
>
> ## 样式
>
> - 样式（搜索）：重新设计搜索栏，支持筛选标签与下拉面板

---

# 3.0.0-beta.1

> [!tips]+ English
>
> ## Feat
>
> - feat(super): add AI-powered semantic search and Super sidebar with local embedding (ONNX/MiniLM), vector store, and optional OpenAI/Anthropic provider support
> - feat(search): rewrite SearchBar with time-range presets and Super semantic search integration
> - feat(memo): add enhanced link card rendering for link-only memos
> - feat: support special thino showing
>
> ## Fix
>
> - fix(memo): add per-file optimistic lock to prevent flicker on creation
> - fix(core): improve image regex and tag filtering logic
> - fix(filter): fix type filter matching logic for NOT_TAGGED, LINKED, IMAGED, CONNECTED
> - fix(worker): fix outstanding key tracking in worker pool
> - fix(persist): return object directly for zustand v5 persist compatibility
>
> ## Refactor
>
> - refactor(settings): migrate settings page to sidebar-layout modal
> - refactor(i18n): extract shared locale helper with navigator.language fallback for all language detection
>
> ## Style
>
> - style(search): redesign search bar with filter chips and dropdown panels

> [!note]- 中文
>
> ## 新增
>
> - 新增（Super）：AI 语义搜索与 Super 侧边栏，支持本地嵌入（ONNX/MiniLM）、向量存储，以及可选的 OpenAI/Anthropic 提供商
> - 新增（搜索）：重构搜索栏，支持时间范围预设与 Super 语义搜索集成
> - 新增（Memo）：为纯链接 Memo 添加增强型链接卡片渲染
> - 新增：支持特殊 Thino 展示
>
> ## 修复
>
> - 修复（Memo）：添加文件级乐观锁，防止创建时闪烁
> - 修复（核心）：改进图片正则与标签过滤逻辑
> - 修复（筛选）：修复 NOT_TAGGED、LINKED、IMAGED、CONNECTED 类型过滤匹配逻辑
> - 修复（Worker）：修复 Worker 池中 outstanding key 追踪问题
> - 修复（持久化）：直接返回对象以兼容 zustand v5 persist
>
> ## 重构
>
> - 重构（设置）：设置页迁移为侧边栏布局弹窗
> - 重构（国际化）：提取共享语言检测辅助函数，支持 navigator.language 回退
>
> ## 样式
>
> - 样式（搜索）：重新设计搜索栏，支持筛选标签与下拉面板

---

# 2.8.21

> [!tips]+ English
> 
> ## Fix
> - fix(settings): deep copy CaptureKey to ensure it's mutable (fixes delete property error)

> [!note]- 中文
>
> ## 修复
> - 修复（设置）：深拷贝 CaptureKey 确保其可变性（修复删除属性错误）

# 2.8.20

> [!tips]+ English
> 
> ## Fix
> - fix(settings): deep copy tokenForVerify to ensure it's mutable (fixes delete property error)

> [!note]- 中文
>
> ## 修复
> - 修复（设置）：深拷贝 tokenForVerify 确保其可变性（修复删除属性错误）

# 2.8.12

> [!tips]+ English
>
> ## Feat
>
> - feat(ui): add ShadowRoot component for Shadow DOM style isolation
>
> ## Fix
>
> - fix(share): fix MarkdownRenderer lifecycle management with proper Component initialization and cleanup
> - fix(moments): fix edit button icon rendering using Obsidian's setIcon API
>
> ## Style
>
> - style(chat): improve history button positioning for inline and fluent styles
> - style(moments): add mix-blend-mode for better edit button visibility
> - style(share): refine tag styling in share dialog

> [!note]- 中文
>
> ## 新增
>
> - 新增（UI）：添加 ShadowRoot 组件，实现 Shadow DOM 样式隔离
>
> ## 修复
>
> - 修复（分享）：修复 MarkdownRenderer 生命周期管理，正确初始化和清理 Component
> - 修复（Moments）：使用 Obsidian 的 setIcon API 修复编辑按钮图标渲染
>
> ## 样式
>
> - 样式（聊天）：改进 inline 和 fluent 样式下历史按钮的定位
> - 样式（Moments）：添加 mix-blend-mode 提升编辑按钮可见性
> - 样式（分享）：优化分享对话框中的标签样式

---

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
