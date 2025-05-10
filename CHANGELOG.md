# 2.7.10

> [!tips]+ English
>
> ## Feat
>
> - feat: support gallery view for images
>
> ## Fix
>
> - fix: when word count is 0, it should not be checked
>
> [!note]- 中文
>
> ## 功能
>
> - 功能：支持图片的画廊视图；
>
> ## 修复
>
> - 修复：当字数限制为 0 时，不应该进行检查；

# 2.7.9

> [!tips]+ English
>
> ## Improve
>
> - style: update style of tab group of settings page

> [!note]- 中文
>
> ## 改进
>
> - 样式：更新设置页面中标签组的样式

# 2.7.8

> [!tips]+ English
>
> ## Improve
>
> - improve: add button in about section to open change log
>
> ## Fix
>
> - fix: filter type "Type" not working

> [!note]- 中文
>
> ## 改进
>
> - 改进：在关于页面中添加按钮打开更新日志
>
> ## 修复
>
> - 修复：过滤类型 "Type" 不生效的问题

# 2.7.7

> [!tips]+ English
>
> ## Improve
>
> - improve: refactor the settings page
> - improve: [Pro] add pro badge in the settings page

> [!note]- 中文
>
> ## 优化
>
> - 优化：重构设置页面
> - 优化：[Pro] 在设置页面中添加专业版徽标

# 2.7.6

> [!tips]+ English
>
> ## Improve
>
> - improve: new ui for settings
> - style: revert text-wrap for link text

> [!note]- 中文
>
> ## 优化
>
> - 优化：新的设置页面样式
> - 样式：还原链接文本的换行

# 2.7.5

> [!tips]+ English
>
> ## Improve
>
> - improve: updated settings descriptions
>   - Clarified that drag behavior settings only apply when using diary as source
> - improve: removed unnecessary console logs

> [!note]- 中文
>
> ## 优化
>
> - 优化：更新设置的内容说明
>   - 对于拖动行为的设置，该项仅在日记来源情况下会生效
> - 优化：去除一些不必要的控制台提示

# 2.7.4

> [!tips]+ English
>
> ## Fix
>
> - fix: display issues in archive view
> - fix: block ID handling in multi-line Thinos
>   - Block IDs now correctly insert at the end of the last non-list/quote line
>   - Metadata no longer displays after block IDs
>
> ## Improve
>
> - improve: reduced bundle size by approximately 200kb
> - improve: added new paste options for users
>   - "Text" option maintains previous behavior
>   - "Block-link" option uses Obsidian's native drag logic

> [!note]- 中文
>
> ## 修复
>
> - 修复：打开归档视图错误显示内容的问题
> - 修复：Block ID 在修改 Thino 时候的一些问题
>   - Blockid 在多行 Thino 中现在能正确插入到最后的一个非列表、引用的行末
>   - 元数据不再在 block ID 之后展示
>
> ## 优化
>
> - 优化：打包后体积大小（缩减大概 200kb）
> - 优化：提供新的选项允许用户选择粘贴行为
>   - 选择为 Text 的时候恢复之前的使用逻辑
>   - 选择为 Block-link 的时候则使用 Obsidian 自带的拖动逻辑

# 2.7.3

> [!tips]+ English
>
> ## Fix
>
> - fix: list of thinos not updated correctly after editing;

> [!note]- 中文
>
> ## 修复
>
> - 修复：Thino 更新后列表没有及时更新；

# 2.7.2

> [!tips]+ English
>
> ## Fix
>
> - fix: thino not updated when daily notes are updated;

> [!note]- 中文
>
> ## 修复
>
> - 修复：Thino 在 Daily Notes 更新时没有正确更新；

> [!note]- 中文
>
> ## 功能
>
> - 功能：增加是否显示所有 Thino 视图中的滚动条的设置；

# 2.7.1

> ## Fix
>
> - fix: style issues causing page width to jump repeatedly;
> - fix: used tags showing as 0;
>
> ## Improve
>
> - improve: added option to show/hide "Scroll to top" button;
> - improve: added setting to include/exclude archived content in random review;
> - improve: remember fit-to-view option when clicking preview images;
> - improve: [pro] added toggle for comments display in dynamic view;
> - improve: support for duplicate query;

> [!note]- 中文
>
> ## 修复
>
> - 修复：样式问题导致页面宽度反复跳动；
> - 修复：使用过的标签显示为 0；
>
> ## 改进
>
> - 改进：增加是否显示"回到顶部"按钮的设置；
> - 改进：增加是否包含归档内容在随机回顾中的设置；
> - 改进：增加是否记住点击预览图片时的缩放选项；
> - 改进：[Pro] 增加动态视图中是否显示评论的设置；
> - 改进：支持复制查询；

# 2.7.0

> ## Fix
>
> - fix: path display pushing menu buttons out of view on narrower screens;
> - fix: nested list rendering issues;
> - fix: "Show thino editor" command preserving input content when reopened;
>
> ## Improve
>
> - improve: refactored filter logic for better performance;
> - improve: added real-time preview of filter data changes;
> - improve: refactored tag filtering for better performance;
> - improve: added indicators to show whether tags are from files or from Thino itself;
> - improve: refactored state data calculation;
> - improve: [pro] tags in files should not be used for filtering or display when metadata filtering is disabled;
> - improve: added option to configure whether editor automatically receives focus;

> [!note]- 中文
>
> ## 修复
>
> - 修复：路径展示的时候会意外将右上角的菜单按钮在比较窄的屏幕中挤出去；
> - 修复：嵌套的列表渲染异常的问题；
> - 修复：Show thino editor 的命令重复开启的情况下依旧保留了已输入的内容情况；
>
> ## 改进
>
> - 改进：重构筛选器逻辑以及提升性能；
> - 改进：支持实时预览筛选器的数据变更情况；
> - 改进：重构标签筛选以及提升性能；
> - 改进：标签筛选后，如果是来自文件的标签或者 Thino 本身的标签会分别展示对应的提示；
> - 改进：重构状态数据计算；
> - 改进：【PRO】没有选择通过元数据筛选 Thino 的功能时，在对应的文件中的标签不应该用于筛选或者展示；
> - 改进：设置中允许用户调整是否自动聚焦到编辑器；

# 2.6.2

> [!tips]+ English
>
> ## Fix
>
> - fix: compatibility with Kanban plugin;

> [!note]- 中文
>
> ## 修复
>
> - 修复：兼容 Kanban 插件；

# 2.6.1

> [!tips]+ English
>
> ## Fix
>
> - fix: block reference not working correctly when using the reference menu in the top-right corner of Thino;
> - fix: timestamp recognition errors when there is no space after the timestamp;
> - fix: global hotkey registration failure during startup;
> - fix: search command not working properly when launched directly;
>
> ## Improve
>
> - improve: add option to configure drag behavior to generate block reference links or copy the original text;

> [!note]- 中文
>
> ## 修复
>
> - 修复：通过 Thino 右上角菜单的引用没有正确实现块引用方案；
> - 修复：时间戳后边没有空格的话会导致意外的识别错误；
> - 修复：启动时的全局快捷键注册失败的问题；
> - 修复：直接启动搜索的命令没有正常生效；
>
> ## 改进
>
> - 改进：支持设置拖动时生成块引用链接或者直接将原文拖过去；

# 2.6.0

> [!tips]+ English
>
> ## Feat
>
> - feat: [pro] support link groups at the bottom of Thino;
> - feat: [pro] support link groups in non-basic views (table, calendar, etc.) via right-click;
> - feat: [pro] add link group display button in moments and waterfall views;
> - feat: [pro] allow setting maximum character count and current character count;
> - feat: [pro] support hiding specific folders to prevent metadata changes during MULTI indexing;
> - feat: add configurable double-click behavior for Thino;
> - feat: allow mobile devices to use default header instead of Thino's top bar;
> - feat: support i18n for additional countries;
>
> ## Improve
>
> - improve: migrate all default menu styles to Obsidian's native menus for consistency;
> - improve: prevent Esc from exiting editor when Vim mode is enabled;
>
> ## Fix
>
> - fix: length-related statistics not displaying correctly in Stat page;
> - fix: placeholder not showing properly when editor is empty;
> - fix: prevent Esc from exiting editor when Vim mode is enabled;
> - fix: color issues in daily review bar charts;
> - fix: [pro] remove bottom loading indicator in table mode;
> - fix: mobile top-left button spacing issues;
> - fix: Thino maximum width in lists should be 100% instead of overflowing;

> [!note]- 中文
>
> ## 功能
>
> - 功能：[Pro] 在 Thino 底部支持链接组显示引用和被引用的链接；
> - 功能：[Pro] 支持在非基础视图（表格、日历等）通过右键唤起链接组展示；
> - 功能：[Pro] 在动态、瀑布流等视图的右上角添加链接组展示按钮；
> - 功能：[Pro] 允许设置最大字数限制和当前字数统计；
> - 功能：[Pro] 支持隐藏特定文件夹，避免在 MULTI 索引时更改对应的元数据；
> - 功能：增加可配置的 Thino 双击行为；
> - 功能：允许移动端使用默认的头部形式，而不是 Thino 的顶部；
> - 功能：支持更多国家的 i18n；
>
> ## 改进
>
> - 改进：开启 Vim 模式时，不触发 Esc 退出编辑器的行为；
> - 改进：迁移所有默认菜单样式为 Obsidian 自带的菜单，保证样式一致性；
>
> ## 修复
>
> - 修复：Stat 页面中长度相关的统计图显示不正确；
> - 修复：编辑器为空行时无法正常显示 Placeholder；
> - 修复：每日回顾柱状图颜色问题；
> - 修复：[Pro] 表格模式下不应该有底部的加载提示；
> - 修复：移动端左上角按钮的空间样式问题；
> - 修复：Thino 在列表中的最大宽度应为 100% 而非超出范围；

# 2.5.1

> [!tips]+ English
>
> ## Fix
>
> - fix: style issues in the top bar;
> - fix: style issues when sidebar is expanded;
> - fix: missing icon for "Copy embed link" in the right-click context menu;

> [!note]- 中文
>
> ## 修复
>
> - 修复：顶部栏的样式问题；
> - 修复：侧边栏展开时的样式问题；
> - 修复：右键 Thino 菜单中"复制嵌入链接"选项图标缺失的问题；

# 2.5.0

> [!tips]+ English
>
> ## Feat
>
> - feat: [pro] support thino stat;
> - feat: support history menu for thino editor;
> - feat: support query sort;
> - feat: support search for Source Type "Multi" paths;
> - feat: support both block references and original thino id references;
> - feat: add dropdown menu in three dots to clear Filter status on mobile;
> - feat: support adding fixed string (e.g., timestamp) at beginning or end;
> - feat: support copying thino block links and embedded block links;
>
> ## Fix
>
> - fix: clear editor content cache after save;
> - fix: image export functionality;
> - fix: style issues when generating images (caused by Stat page error);
> - fix: preserve Block id when updating content;
> - fix: compatibility with HH:mm-HH:mm format in Thino;
> - fix: lazy loading for thino;
>
> ## Style
>
> - style: update go home button style;
> - chore: update verify reg code process;

> [!note]- 中文
>
> ## 功能
>
> - 功能：[Pro] 支持 Thino 统计；
> - 功能：支持历史菜单；
> - 功能：支持查询（Query）排序；
> - 功能：支持搜索 Source Type 为 "Multi" 的路径；
> - 功能：同时支持块引用和原始 thino id 的引用，解决通过行引用日记中的 Thino 的问题；
> - 功能：移动端增加三点菜单中的下拉选项直接清除 Filter；
> - 功能：支持在开头或末尾添加固定字符串（如时间戳）；
> - 功能：支持复制 thino 的块链接和嵌入块链接；
>
> ## 修复
>
> - 修复：编辑器内容保存后，悬浮编辑器的缓存不会清空的问题；
> - 修复：图片导出的相关功能；
> - 修复：生成图片时的样式问题（由 Stat 页面导致的报错）；
> - 修复：更新内容时正确保留 Block id；
> - 修复：不支持 HH:mm-HH:mm 这种形式的 Thino 的兼容性问题；
> - 修复：无法懒加载 thino 的问题；
>
> ## 样式
>
> - 样式：更新返回主页按钮样式；
> - 杂务：更新验证注册码流程；

---

> [!warning]+ English
> Other releases info are not listed here, you can view them on the [release page](https://github.com/Quorafind/Obsidian-Thino/blob/main/CHANGELOG_ARCHIVE.md).

> [!note]- 中文
> 其他版本信息未在此列出，您可以在[发布页面](https://github.com/Quorafind/Obsidian-Thino/blob/main/CHANGELOG_ARCHIVE.md)查看。
