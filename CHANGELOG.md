# 3.0.20

> [!note]- English
>
> ## Change
>
> Build output now lands in `dist/` at the repository root so Obsidian's automated build verification can locate the built `main.js`. No functional changes for users.

> [!tips]+ 中文
>
> ## 变更
>
> 生产构建产物改为输出到仓库根目录的 `dist/`，使 Obsidian 自动构建验证能够找到构建出的 `main.js`。对用户没有功能性变更。

# 3.0.19

> [!note]- English
>
> ## Change
>
> Reproducible release builds for Obsidian plugin review: the source repository now pins the exact toolchain (Node 22 + pnpm 10 with a frozen lockfile), documents the full build-verification steps, and every release is mirrored as an identically-named tag in the source repository so the published `main.js` / `styles.css` can be reproduced byte-for-byte.
> No functional changes for users.

> [!tips]+ 中文
>
> ## 变更
>
> 为 Obsidian 插件审核提供可复现的发布构建：源码仓库现在固定了完整工具链（Node 22 + pnpm 10 + 冻结 lockfile），提供了完整的构建验证文档，且每次发布都会在源码仓库打上同名 tag，发布的 `main.js` / `styles.css` 可逐字节复现。
> 对用户没有功能性变更。

# 3.0.18

> [!note]- English
>
> ## Fix
>
> Resolved all errors flagged by the Obsidian plugin review scan: removed dynamic `<style>` element injection (share-image export now inlines CSS during serialization, and Shadow DOM styles use constructable stylesheets), removed the `document.write` sandbox technique, and cleaned up every unscoped `eslint-disable` directive.
> Fixed hundreds of review warnings: timers now use `window.setTimeout`/`window.setInterval` for popout-window compatibility, unhandled promises are explicitly voided, deleting files respects your "Deleted files" preference (`FileManager.trashFile`), and command names no longer repeat the plugin name.
>
> ## Change
>
> Temporarily removed the local (Transformers.js) embedding engine — it relied on downloading and executing a runtime script, which the plugin review does not allow. Semantic search now works through API embedding providers (e.g. OpenAI-compatible); if you previously used the local engine, the setting is migrated automatically. The feature may return in a future release in a compliant form.

> [!tips]+ 中文
>
> ## 修复
>
> 解决了 Obsidian 插件审核扫描标记的全部错误：移除动态创建 `<style>` 元素的行为（分享图片导出改为在序列化阶段内联 CSS，Shadow DOM 样式改用 constructable stylesheet）、移除 `document.write` 沙箱写入、清理所有未限定规则的 `eslint-disable` 注释。
> 修复数百条审核警告：计时器统一使用 `window.setTimeout`/`window.setInterval` 以兼容弹出窗口、未处理的 Promise 显式标记、删除文件遵循用户的"已删除文件"偏好设置（`FileManager.trashFile`）、命令名不再重复插件名。
>
> ## 变更
>
> 暂时移除本地（Transformers.js）向量嵌入引擎——该功能依赖运行时下载并执行脚本，不符合插件审核要求。语义检索现在仅通过 API 嵌入服务商（如 OpenAI 兼容接口）提供；此前使用本地引擎的用户设置会自动迁移。该功能未来可能以合规形式回归。

# 3.0.16

> [!note]- English
>
> ## Fix
>
> Added compatibility with the new PKMer OAuth Thino device registration flow.
> After OAuth login, Thino now reports the current device to PKMer and verifies that the device is active before enabling Pro features.
> Improved OAuth failure handling for device-limit, missing-product and missing-scope responses.

> [!tips]+ 中文
>
> ## 修复
>
> 兼容新版 PKMer OAuth 的 Thino 设备注册流程。
> OAuth 登录后会向 PKMer 上报当前设备，并在启用 Pro 功能前确认当前设备处于可用状态。
> 优化设备数量超限、未购买产品、scope 不足等 OAuth 错误提示。

# 3.0.15

> [!note]- English
>
> ## Feat
>
> Exposed the current thinos on the global app object. You can now read them anywhere (console / other plugins) via `window.app.getThinos()`.
> Supported options:
>   * `window.app.getThinos()` — all normal thinos in the store
>   * `window.app.getThinos({ filtered: true })` — thinos currently shown in the active view (respects the active query, filter and sort)
>   * `window.app.getThinos({ status: 'ARCHIVED' })` — archived thinos
>   * `window.app.getThinos({ status: 'ALL' })` — every thino regardless of status
>   * `window.app.getThinos({ comments: true })` — comment thinos
> Returns a shallow copy, so the store is never mutated. The accessor is registered on plugin load and removed on unload.

> [!tips]+ 中文
>
> ## 功能
>
> 将当前 thinos 暴露到全局 app 对象上。现在可以在任意位置（控制台 / 其他插件）通过 `window.app.getThinos()` 读取当前的 thinos。
> 支持的选项：
>   * `window.app.getThinos()` —— store 中所有正常状态的 thinos
>   * `window.app.getThinos({ filtered: true })` —— 当前视图中显示的 thinos（遵循当前查询、筛选与排序）
>   * `window.app.getThinos({ status: 'ARCHIVED' })` —— 已归档的 thinos
>   * `window.app.getThinos({ status: 'ALL' })` —— 不限状态的全部 thinos
>   * `window.app.getThinos({ comments: true })` —— 评论类 thinos
> 返回的是浅拷贝，不会影响 store。该接口在插件加载时注册，卸载时移除。

# 3.0.14

> [!note]- English
>
> ## Feat
>
> Added query mode for `thino` code blocks. You can now write YAML query fields inside a `thino` code block to render memo results directly in notes.
> Query mode is enabled automatically when any of the following fields appears: `view`, `keyword`, `query`, `search`, `table`, `cloud`, or `chart`.
> Added support for list, table, word cloud, and chart views.
> Supported query fields include:
>   * `view`: `list`, `table`, `cloud`, `chart`
>   * `keyword` / `query` / `search`: keyword search
>   * `tag`: tag filter with nested tag matching
>   * `source`: `DAILY`, `FILE`, `CANVAS`, `MULTI`, `JOURNAL`
>   * `path`: path substring matching
>   * `range`: `7d`, `30d`, `90d`, `thisWeek`, `thisMonth`, `thisYear`, `lastWeek`, `lastMonth`, `lastYear`
>   * `limit`: result limit
>   * `sort`: `desc` / `asc`
>   * `groupBy`: chart grouping by `day`, `week`, `month`, `tag`, or `source`
>   * `top`: word count or chart bar count for cloud/chart views
>   * `includeArchived` / `includeDeleted`: include archived or deleted memos
>   * `title`: custom block title
> Multiple query conditions are combined with AND logic.
> Word cloud items and `groupBy: tag` chart bars can be clicked to update the main view search.
>
> Example:
>
> ```thino
> query: project review
> ```
>
> ```thino
> view: table
> tag: reading
> range: 90d
> limit: 100
> ```
>
> ```thino
> view: chart
> groupBy: tag
> top: 15
> ```

> [!tips]+ 中文
>
> ## 功能
>
> 新增 `thino` 代码块查询模式。现在可以在笔记中通过 `thino` 代码块编写 YAML 查询字段，直接渲染对应的 Thino 结果。
> 当代码块中出现 `view`、`keyword`、`query`、`search`、`table`、`cloud` 或 `chart` 任一字段时，会自动进入查询模式。
> 新增列表、表格、词云和图表视图支持。
> 支持的查询字段包括：
>   * `view`：`list`、`table`、`cloud`、`chart`
>   * `keyword` / `query` / `search`：关键词检索
>   * `tag`：标签过滤，支持层级标签匹配
>   * `source`：`DAILY`、`FILE`、`CANVAS`、`MULTI`、`JOURNAL`
>   * `path`：路径包含匹配
>   * `range`：`7d`、`30d`、`90d`、`thisWeek`、`thisMonth`、`thisYear`、`lastWeek`、`lastMonth`、`lastYear`
>   * `limit`：结果数量上限
>   * `sort`：`desc` / `asc`
>   * `groupBy`：图表按 `day`、`week`、`month`、`tag` 或 `source` 分组
>   * `top`：词云词数或图表柱状数量
>   * `includeArchived` / `includeDeleted`：是否包含归档或回收站内容
>   * `title`：自定义代码块标题
> 多个查询条件会按 AND 逻辑叠加生效。
> 词云中的词，以及 `groupBy: tag` 图表中的标签柱，支持点击后联动主视图检索。
>
> 示例：
>
> ```thino
> query: 项目 复盘
> ```
>
> ```thino
> view: table
> tag: reading
> range: 90d
> limit: 100
> ```
>
> ```thino
> view: chart
> groupBy: tag
> top: 15
> ```

# 3.0.13

> [!note]- English
>
> ## Fix
> 
> - #916 Persistence for save type switching / JOURNAL-only writes
> - #874 / #786 frontmatter/properties tags participating in tag filtering and matched display
> - #917 More robust localized date parsing for Used days / date statistics
> - #896 Hierarchical list block links landing on the parent item
> - #927 Focus heatmap colors following the settings
> - #919 Long block-level math formulas scroll horizontally on narrow screens
> - #923 / #833 Mitigation for bottom obstruction of the Focus sidebar/editor on mobile
> - #893 Initialization wizard can scroll in small windows
> - #926 Mitigation for Focus filter overflow

> [!tips]+ 中文
>
> ## 修复
> 
> - #916 保存类型切换持久化 / JOURNAL-only 写入
> - #874 / #786 frontmatter/properties tags 参与标签筛选与匹配显示
> - #917 Used days / 日期统计对本地化日期解析更稳
> - #896 层级列表块链接落到父项
> - #927 Focus 热力图颜色跟随设置
> - #919 长块级数学公式窄屏可横向滚动
> - #923 / #833 移动端 Focus 侧栏/编辑器底部遮挡缓解
> - #893 初始化向导小窗口可滚动
> - #926 Focus 筛选器溢出缓解

# 3.0.7~3.0.12

> [!note]- English
>
> ## Fix
> 
> - fix: ios clipboard issue
> - fix: some css issues in focus interface 

> [!tips]+ 中文
>
> ## 修复
>
> - 修复：ios 剪贴板复制的问题
> - 修复：Focus 主题下的样式问题

# 3.0.6

> [!note]- English
>
> ## 功能
> 
> - Feat: support focus interface

> [!tips]+ 中文
>
> ## 功能
>
> - 功能：支持专注外观


# 3.0.2~3.0.5

> [!note]- English
>
> ## Fix
>
> - fix: fix issues related to mobile

> [!tips]+ 中文
>
> ## 修复
>
> - 修复：修复移动端上的阻塞问题

# 3.0.1

> [!note]- English
>
> ## Feat
>
> - feat(journal): add JOURNAL save mode — a new periodic notes storage format supporting daily/weekly/monthly/yearly granularity with independent folder, date format, and template settings; replaces external `obsidian-daily-notes-interface` with built-in implementation; JOURNAL mode is free (no Pro required); DAILY mode marked as Deprecated
> - feat(super): add AI-powered semantic search and Super sidebar with local embedding (ONNX/MiniLM), vector store, and optional OpenAI/Anthropic provider support
> - feat(super): PKMer AI Agent can now automatically delegate tasks to specialized models — image generation, text summarization, web page summarization, and quick classification — without manual model switching
> - feat(super): enhance AI chat with structured tool call rendering, reasoning/thinking blocks, and conversation history management
> - feat(super): add inline Super AI chat in ChatView and ThinoEditor with @mention suggestions
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
> - fix(journal): fix "Custom" heading date format dropdown reverting immediately; use configured headingDateFormat for H2 parsing with regex fallback for format changes
> - fix(journal): fix time-only list items (e.g. `- 17:54` with content on next line) not extracting timestamp correctly
> - fix(journal): fix nested multi-line content losing blank lines; normalize line endings for cross-platform compatibility
> - fix(mobile): guard all top-level Node.js requires (`http`, `url`, `crypto`, `fs`, `path`, `child_process`, `readline`, `stream`, `electron`) with `Platform.isDesktop` to prevent startup crash on mobile; lazy-load WeChat module via dynamic `import()` since it depends entirely on Node.js runtime
>
> ## Refactor
>
> - refactor(settings): migrate settings page to sidebar-layout modal; extract Review and Super settings into modular tab components
> - refactor(settings): integrate PKMer OAuth verification flow into settings UI
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
> - 修复（Journal）：修复标题日期格式下拉框选择「自定义」后立即回退的问题；H2 标题解析使用配置的 headingDateFormat，并支持正则回退以兼容格式变更
> - 修复（Journal）：修复时间独占一行（如 `- 17:54`，内容在下一行缩进）时时间戳未被正确提取的问题
> - 修复（Journal）：修复多行嵌套内容丢失空行的问题；规范化换行符以兼容跨平台
> - 修复（移动端）：为所有顶层 Node.js 模块引用（`http`、`url`、`crypto`、`fs`、`path`、`child_process`、`readline`、`stream`、`electron`）添加 `Platform.isDesktop` 守卫，防止移动端启动崩溃；WeChat 模块改为动态 `import()` 延迟加载
>
> ## 重构
>
> - 重构（设置）：设置页迁移为侧边栏布局弹窗；将复习和 Super 设置提取为模块化标签组件
> - 重构（设置）：将 PKMer OAuth 验证流程集成到设置界面
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

---

> [!warning]+ English
> Other releases info are not listed here, you can view them on the [release page](https://github.com/Quorafind/Obsidian-Thino/blob/main/CHANGELOG_ARCHIVE.md).

> [!note]- 中文
> 其他版本信息未在此列出，您可以在[发布页面](https://github.com/Quorafind/Obsidian-Thino/blob/main/CHANGELOG_ARCHIVE.md)查看。
