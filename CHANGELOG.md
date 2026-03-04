# 3.0.0-beta.8

> [!tips]+ English
>
> ## Feat
>
> - feat(review): upgrade FSRS algorithm to v5.2.3 (FSRS-6, 21 weights) with full daily review system rebuild
> - feat(review): replace IndexedDB storage with app.saveLocalStorage for review data persistence per thino ID
> - feat(review): add Review settings tab with configurable retention, max interval, fuzz, short-term scheduling, daily limit, and custom FSRS-6 weights
> - feat(review): auto-skip and clean up review data for deleted thinos during review sessions
> - feat(review): enable Daily Review entry in sidebar navigation (Pro)
>
> ## Style
>
> - style(review): redesign daily review page with progress bar, card swipe animations, stacked card depth effect, next-interval preview on rating buttons, and improved start/done states

> [!note]- 中文
>
> ## 新增
>
> - 新增（复习）：升级 FSRS 算法至 v5.2.3（FSRS-6，21 权重），全面重构每日复习系统
> - 新增（复习）：使用 app.saveLocalStorage 替代 IndexedDB 存储复习数据，基于 thino ID 持久化
> - 新增（复习）：新增复习设置页，支持配置保留率、最大间隔、模糊化、短期调度、每日上限及自定义 FSRS-6 权重
> - 新增（复习）：复习时自动跳过并清理已删除 thino 的复习数据
> - 新增（复习）：侧边栏启用每日复习入口（Pro）
>
> ## 样式
>
> - 样式（复习）：重新设计每日复习页面，新增进度条、卡片滑动动画、堆叠卡片纵深效果、评分按钮显示下次间隔预览，优化开始和完成状态展示

---

# 3.0.0-beta.7

> [!tips]+ English
>
> ## Feat
>
> - feat(memo): add secret content masking with password protection (Pro) — supports regex-based content masking with blur or block character styles; set a password via settings to reveal masked content on click, with session-level reveal state that resets on reload
> - feat(memo): add lock action to re-mask revealed secret content — after revealing a masked memo, a new "Lock" context menu item lets you re-mask it instantly without reloading
> - feat(query): add live preview panel to query create dialog — shows a floating side panel on desktop that displays matching memos in real-time as filters are edited
>
> ## Style
>
> - style(global): add button-group layout style for consistent grouped button rendering

> [!note]- 中文
>
> ## 新增
>
> - 新增（Memo）：新增加密内容遮蔽与密码保护（Pro）— 支持基于正则的内容遮蔽，可选模糊或替换字符样式；在设置中配置密码后点击即可揭示，揭示状态为会话级别，刷新页面后自动重置
> - 新增（Memo）：新增锁定操作以重新遮蔽已揭示的加密内容 — 揭示加密 Memo 后，右键菜单中可一键重新遮蔽，无需刷新
> - 新增（查询）：查询创建对话框新增实时预览面板 — 桌面端编辑筛选条件时，侧边浮动面板实时展示匹配的 Memo
>
> ## 样式
>
> - 样式（全局）：新增按钮组布局样式，统一分组按钮的渲染效果

---

# 3.0.0-beta.6

> [!tips]+ English
>
> ## Feat
>
> - feat(canvas): add Thino Canvas Organizer (Pro) — a spatial canvas view for organizing thinos via drag-and-drop, with bidirectional sync between canvas nodes and the thino list
>
> ## Fix
>
> - fix(sync): external file changes (e.g. from Obsidian Sync or other plugins) now correctly trigger thino list updates; previously a global write-lock could silently block unrelated file events
> - fix(memo): editing a thino from the canvas organizer now immediately reflects in the thino list without requiring a manual refresh

> [!note]- 中文
>
> ## 新增
>
> - 新增（画布）：Thino 画布整理器（Pro）— 支持将 Thino 拖放到画布上进行空间整理，画布与 Thino 列表双向同步，一边改另一边自动更新
>
> ## 修复
>
> - 修复（同步）：外部文件变更（如 Obsidian 同步、其他插件修改）现在能正确触发 Thino 列表更新；此前全局写入锁可能误拦截无关文件的变更事件，导致外部修改被静默忽略
> - 修复（Memo）：从画布整理器编辑 Thino 后，列表中的内容会立即更新，无需手动刷新

---

# 3.0.0-beta.5

> [!tips]+ English
>
> ## Feat
>
> - feat(editor): auto-detect clipboard content on editor focus and show a "Paste as Thino" button for quick capture; added dedup guard to prevent duplicate saves on rapid clicks
> - feat(settings): add "Show clipboard paste button on focus" toggle in Editor settings (enabled by default)
> - feat(gallery): improve local image resolution with decoded paths and fallback lookups; clicking on broken images now navigates to the source memo
> - feat(gallery): support displaying external HTTP images in the gallery
> - feat(super): support importing embedding model and WASM runtime files from a local folder (for offline or air-gapped setups), with a folder picker in Super settings
>
> ## Fix
>
> - fix(taglist): eliminate the brief "Loading…" flash that appeared every time the tag list refreshed
> - fix(search): update the filter toggle icon from a filter icon to a chevron for visual consistency

> [!note]- 中文
>
> ## 新增
>
> - 新增（编辑器）：聚焦编辑器时自动检测剪贴板内容，在保存按钮旁显示「粘贴为 Thino」按钮，支持一键创建；增加防重复点击保护，避免连点时重复创建
> - 新增（设置）：编辑器设置中新增「聚焦时显示剪贴板粘贴按钮」开关（默认开启）
> - 新增（图库）：改进本地图片解析，支持百分号编码路径和多级回退查找；图片加载失败时点击可跳转到来源 Thino
> - 新增（图库）：图库现在支持展示外部 HTTP 图片
> - 新增（Super）：支持从本地文件夹导入嵌入模型和 WASM 运行时文件（适用于离线或内网环境），在 Super 设置中提供文件夹选择器
>
> ## 修复
>
> - 修复（标签列表）：消除标签列表每次刷新时短暂闪烁「加载中…」的问题
> - 修复（搜索）：将筛选切换图标从漏斗改为箭头，视觉上更统一

---

# 3.0.0-beta.4

> [!tips]+ English
>
> ## Performance
>
> - perf(render): reduce UI freezes during startup and large memo loads by marking store updates as non-urgent
> - perf(render): fix state cascade where loading memos would trigger two back-to-back full re-renders instead of one
> - perf(css): skip layout and paint for offscreen memo items, reducing ~200ms of layout thrashing when scrolling large lists
> - perf(taglist): fix tag list re-rendering on every memo change even when tags haven't changed
> - perf(render): memoize ThinosGroup component to avoid re-rendering day groups unnecessarily

> [!note]- 中文
>
> ## 性能
>
> - 性能（渲染）：将大批量 Memo 加载标记为低优先级更新，减少启动和加载时的界面卡顿
> - 性能（渲染）：修复状态级联问题 — 加载 Memo 时不再连续触发两次完整重渲染
> - 性能（CSS）：屏幕外的 Memo 元素自动跳过布局和绘制，滚动大列表时减少约 200ms 的布局抖动
> - 性能（标签列表）：修复标签列表在每次 Memo 变化时都重渲染的问题（即使标签本身没变）
> - 性能（渲染）：缓存日期分组组件，避免不必要的重渲染

---

# 3.0.0-beta.3

> [!tips]+ English
>
> ## Refactor
>
> - refactor(sync): extract SyncService — consolidate all sync logic (create/edit/delete/pin/pull/push) into a single service with guard checks for missing token or webId
> - refactor(sync): simplify sync callers in memoService, Memos.tsx, MemoTrash.tsx, and obCreateMemo by delegating to SyncService
> - refactor(webAPI): remove dead code and unused commented-out functions

> [!note]- 中文
>
> ## 重构
>
> - 重构（同步）：提取 SyncService — 将所有同步逻辑（创建/编辑/删除/置顶/拉取/推送）整合为单一服务，增加缺失 token 或 webId 的守卫检查
> - 重构（同步）：简化 memoService、Memos.tsx、MemoTrash.tsx 和 obCreateMemo 中的同步调用，统一委托给 SyncService
> - 重构（webAPI）：移除无用代码和已注释的废弃函数

---

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
