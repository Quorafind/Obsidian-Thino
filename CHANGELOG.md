# 3.0.0

> [!note]- English
>
> ## Feat
>
> - feat(journal): add JOURNAL save mode — a new periodic notes storage format supporting daily/weekly/monthly/yearly granularity with independent folder, date format, and template settings; replaces external `obsidian-daily-notes-interface` with built-in implementation; JOURNAL mode is free (no Pro required); DAILY mode marked as Deprecated
> - feat(super): add AI-powered semantic search and Super sidebar with local embedding (ONNX/MiniLM), vector store, and optional OpenAI/Anthropic provider support
> - feat(super): PKMer AI Agent can now automatically delegate tasks to specialized models — image generation, text summarization, web page summarization, and quick classification — without manual model switching
> - feat(super): enhance AI chat with structured tool call rendering, reasoning/thinking blocks, and conversation history management
> - feat(super): add inline Super AI chat in ChatView and ThinoEditor with @mention suggestions
> - feat(super): add PKMer AI provider for Chinese locale users
> - feat(super): support importing embedding model and WASM runtime files from a local folder (for offline or air-gapped setups)
> - feat(review): upgrade FSRS algorithm with full daily review system rebuild, IndexedDB → app.saveLocalStorage migration, configurable retention/interval/weights, auto-skip deleted thinos
> - feat(review): apply current query filter to Daily Review and Random Review Thino pools
> - feat(canvas): add Thino Canvas Organizer (Pro) — spatial canvas view for organizing thinos via drag-and-drop with bidirectional sync
> - feat(tag): add tag pinning, bulk rename, custom emoji/color icons, and right-click context menu
> - feat(sidebar): allow hiding/showing sidebar navigation entries with persistent preferences and overflow menu
> - feat(Thino): add "Send to file" action to organize selected Thinos into a vault file with list, callout, or plain format
> - feat(Thino): add secret content masking with password protection (Pro) — regex-based masking with blur or block styles
> - feat(query): add live preview panel to query create dialog
> - feat(editor): auto-detect clipboard content on editor focus and show "Paste" button for quick capture
> - feat(gallery): improve local image resolution and support displaying external HTTP images
> - feat(cli): add Obsidian CLI support with `thino:add`, `thinos`, and `thinos:search` commands
> - feat(search): rewrite SearchBar with time-range presets and Super semantic search integration
> - feat(Thino): add enhanced link card rendering for link-only Thinos
> - feat(group): persist day-mark group collapse/expand state across sessions
> - feat: introduce virtual list rendering for smoother scrolling on large lists
> - feat: add in-app Changelog view for quick release notes lookup
> - feat(list): add Thino selection feature for batch operations
>
> ## Performance
>
> - perf(render): reduce UI freezes during startup by marking store updates as non-urgent; fix state cascade causing double re-renders
> - perf(css): skip layout and paint for offscreen Thino items (~200ms reduction)
> - perf(taglist): fix tag list re-rendering on every Thino change
> - perf(list): optimize Thino list rendering and filtering; add quick-update methods for real-time operations
> - perf(filter): improve chart rendering and filter recomputation efficiency
>
> ## Fix
>
> - fix(sync): external file changes (e.g. Obsidian Sync) now correctly trigger thino list updates
> - fix(super): fix content duplication after tool calls; fix duplicate streaming from API proxies
> - fix(review): reset review state when filter changes; clear query on unmount
> - fix(daily): fix date card vertical centering when daily thinos list is empty
> - fix(settings): fix Capacitor Device access crash on desktop; fix device ID retrieval pattern
> - fix(tag,editor): color-btn style and cursor auto-scroll
> - fix(core): improve image regex and tag filtering logic
> - fix(filter): fix type filter matching for NOT_TAGGED, LINKED, IMAGED, CONNECTED; correct duration-range validity
> - fix(worker): fix outstanding key tracking in worker pool
> - fix(persist): return object directly for zustand v5 persist compatibility
> - fix(Thino): add per-file optimistic lock to prevent flicker on creation
> - fix(calendar): remove mobile platform restriction for calendar suggest
> - fix(chat): preserve scroll position when loading history
> - fix(scroll): restore scroll functionality in Thino list
>
> ## Refactor
>
> - refactor!: migrate state management from custom stores to Zustand
> - refactor(sync): extract SyncService — consolidate all sync logic into a single service
> - refactor(settings): migrate settings page to sidebar-layout modal; extract Review and Super settings into modular tab components
> - refactor(settings): integrate PKMer OAuth verification flow into settings UI
> - refactor(i18n): extract shared locale helper with navigator.language fallback
> - refactor(flow): simplify editor implementation with hooks-based approach
> - refactor(list): remove virtual list and add selection feature
>
> ## Style
>
> - style(review): redesign daily review page with progress bar, card swipe animations, stacked card depth effect
> - style(super): simplify PKMer AI model selector; truncate long tool call previews with ellipsis
> - style(chat): add chat view styles for inline Super conversations
> - style(search): redesign search bar with filter chips and dropdown panels
> - style(tag): add pinned tag indicator, emoji badge, and color dot styles
> - style(sidebar): add hidden-entry overflow toggle and "more" icon styles
> - style(editor): simplify clipboard paste button label
> - style(global): add button-group layout and count-text faint color styles
>
> ## Build
>
> - build: migrate to rolldown-vite and add node polyfills

> [!tips]+ 中文
>
> ## 新增
>
> - 新增（Journal）：新增 JOURNAL 保存模式 — 全新的周期笔记存储格式，支持日/周/月/年粒度，可独立配置文件夹、日期格式和模板；内置 periodic notes 接口实现，替代外部依赖；JOURNAL 模式免费使用（无需 Pro）；DAILY 模式标记为已弃用
> - 新增（Super）：AI 语义搜索与 Super 侧边栏，支持本地嵌入（ONNX/MiniLM）、向量存储，以及可选的 OpenAI/Anthropic 提供商
> - 新增（Super）：PKMer AI Agent 现在可以自动调用专用模型完成子任务 —— 生成图片、摘要文本、总结网页、快速分类
> - 新增（Super）：AI 对话增强，支持结构化工具调用渲染、推理/思考块和对话历史管理
> - 新增（Super）：在 ChatView 和 ThinoEditor 中新增内联 Super AI 对话，支持 @提及建议
> - 新增（Super）：为中文用户新增 PKMer AI 提供商
> - 新增（Super）：支持从本地文件夹导入嵌入模型和 WASM 运行时文件（适用于离线或内网环境）
> - 新增（复习）：升级 FSRS 算法，全面重构每日复习系统，IndexedDB → app.saveLocalStorage 迁移，可配置保留率/间隔/权重，自动跳过已删除 thino
> - 新增（复习）：每日复习和随机复习现在会应用当前查询筛选条件
> - 新增（画布）：Thino 画布整理器（Pro）— 支持将 Thino 拖放到画布上进行空间整理，双向同步
> - 新增（标签）：支持标签置顶、批量重命名、自定义 Emoji/颜色图标，右键菜单管理标签
> - 新增（侧边栏）：支持隐藏/显示侧边栏导航项，偏好持久化，新增溢出菜单
> - 新增（Thino）：新增「发送到文件」操作，可将选中 Thino 整理到库中文件，支持列表、Callout 或纯文本格式
> - 新增（Thino）：新增加密内容遮蔽与密码保护（Pro）— 支持基于正则的内容遮蔽，可选模糊或替换字符样式
> - 新增（查询）：查询创建对话框新增实时预览面板
> - 新增（编辑器）：聚焦编辑器时自动检测剪贴板内容，显示「粘贴」按钮，支持一键创建
> - 新增（图库）：改进本地图片解析，支持展示外部 HTTP 图片
> - 新增（CLI）：支持 Obsidian CLI，提供 `thino:add`、`thinos` 和 `thinos:search` 命令
> - 新增（搜索）：重构搜索栏，支持时间范围预设与 Super 语义搜索集成
> - 新增（Thino）：为纯链接 Thino 添加增强型链接卡片渲染
> - 新增（分组）：日期分组的折叠/展开状态现在会跨会话持久化
> - 新增：引入虚拟列表渲染与优化组件，在长列表下滚动更顺滑
> - 新增：内置「更新日志」页面，便于快速查看版本说明
> - 新增（列表）：添加 Thino 选择功能，支持批量操作
>
> ## 性能
>
> - 性能（渲染）：将大批量 Thino 加载标记为低优先级更新，减少启动时的界面卡顿；修复状态级联导致的重复渲染
> - 性能（CSS）：屏幕外的 Thino 元素自动跳过布局和绘制（减少约 200ms）
> - 性能（标签列表）：修复标签列表在每次 Thino 变化时都重渲染的问题
> - 性能（列表）：优化 Thino 列表渲染与筛选，添加实时操作快速更新方法
> - 性能：优化图表渲染与筛选重算效率
>
> ## 修复
>
> - 修复（同步）：外部文件变更（如 Obsidian 同步）现在能正确触发 Thino 列表更新
> - 修复（Super）：修复工具调用后模型重复输出内容；修复 API 代理重发导致的重复显示
> - 修复（复习）：切换筛选条件时重置复习状态；卸载时清除查询
> - 修复（每日）：修复每日 Thino 列表为空时日期卡片垂直居中的问题
> - 修复（设置）：修复桌面端 Capacitor Device 访问崩溃；修复设备 ID 获取模式
> - 修复（标签/编辑器）：标签颜色选择器按钮样式和光标自动滚动
> - 修复（核心）：改进图片正则与标签过滤逻辑
> - 修复（筛选）：修复 NOT_TAGGED、LINKED、IMAGED、CONNECTED 类型过滤；校正时长区间校验
> - 修复（Worker）：修复 Worker 池中 outstanding key 追踪问题
> - 修复（持久化）：直接返回对象以兼容 zustand v5 persist
> - 修复（Thino）：添加文件级乐观锁，防止创建时闪烁
> - 修复（日历）：移除日历建议的移动端平台限制
> - 修复（聊天）：加载历史记录时保持滚动位置
> - 修复（滚动）：恢复 Thino 列表的滚动功能
>
> ## 重构
>
> - 重构！：状态管理迁移至 Zustand
> - 重构（同步）：提取 SyncService — 将所有同步逻辑整合为单一服务
> - 重构（设置）：设置页迁移为侧边栏布局弹窗；将复习和 Super 设置提取为模块化标签组件
> - 重构（设置）：将 PKMer OAuth 验证流程集成到设置界面
> - 重构（国际化）：提取共享语言检测辅助函数，支持 navigator.language 回退
> - 重构（Flow）：使用基于 Hooks 的方式简化编辑器实现
> - 重构（列表）：移除虚拟列表并添加选择功能
>
> ## 样式
>
> - 样式（复习）：重新设计每日复习页面，新增进度条、卡片滑动动画、堆叠卡片纵深效果
> - 样式（Super）：简化 PKMer AI 模型选择器；工具调用预览文本过长时用省略号截断
> - 样式（聊天）：新增内联 Super 对话的聊天视图样式
> - 样式（搜索）：重新设计搜索栏，支持筛选标签与下拉面板
> - 样式（标签）：新增置顶标签指示器、Emoji 徽章和颜色圆点样式
> - 样式（侧边栏）：新增隐藏项溢出切换和「更多」图标样式
> - 样式（编辑器）：剪贴板粘贴按钮文案简化
> - 样式（全局）：新增按钮组布局和淡色计数文字样式
>
> ## 构建
>
> - 构建：迁移至 rolldown-vite 并添加 Node polyfills

---

> [!warning]+ English
> Other releases info are not listed here, you can view them on the [release page](https://github.com/Quorafind/Obsidian-Thino/blob/main/CHANGELOG_ARCHIVE.md).

> [!note]- 中文
> 其他版本信息未在此列出，您可以在[发布页面](https://github.com/Quorafind/Obsidian-Thino/blob/main/CHANGELOG_ARCHIVE.md)查看。
