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
