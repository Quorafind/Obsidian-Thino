
# 2.3.37

- fix: cannot unpin thino correctly via context menu;
- feat: [PRO/BASIC] support insert editor to current markdown view;
- fix: tag list cause thino crashed;

> [!note]- 中文
> - 修复：无法通过上下文菜单正确取消固定 Thino；
> - 特性：[PRO/BASIC] 支持将编辑器插入到当前的 markdown 视图；
> - 修复：标签列表导致 Thino 崩溃；

## Insert Editor

Using it via command or insert code block like:

````  
```thino  
{  
  editor: true;
}  
```  
````

![insert-editor](https://raw.githubusercontent.com/quorafind/obsidian-thino/main/media/changelog/thino-insert-editor.gif)


# 2.3.36

- fix: cannot double-click on checkbox in thino to toggle it, it will trigger edit thino event;
- fix: click on checkbox in TASK-TODO thino should not toggle it done;

> [!note]- 中文
> - 修复：无法双击 Thino 中的复选框来切换它，它会触发编辑 Thino 事件；
> - 修复：点击 TASK-TODO Thino 中的复选框不应该切换它的状态；


# 2.3.35

- feat: [PRO] support tags multi-select filter when holding `ctrl` or `meta` key;
- feat: [PRO/BASIC] support click on task status item/ tags status item to filter thinos when using Modern theme;

> [!note]- 中文
> - 特性：[PRO] 支持标签多选过滤，按住 `ctrl` 或 `meta` 键；
> - 特性：[PRO/BASIC] 在 Modern 模式下，支持点击任务状态项/标签状态项来过滤 Thino；

![tag-filter|500](https://raw.githubusercontent.com/quorafind/obsidian-thino/main/media/changelog/thino-filter.gif)

# 2.3.34

- fix: bottom editor issues related to chat view;
- style: better images alignment in moments view;
- fix: text ellipsis for user name;

> [!note]- 中文
> - 修复：与聊天视图相关的底部编辑器问题；
> - 样式：更好的图片对齐样式；
> - 修复：用户名称的文本省略号；

![username|500](https://raw.githubusercontent.com/quorafind/obsidian-thino/main/media/changelog/thino-user-name.png)

# 2.3.33

- fix: cannot input tag when editing thino;
- fix: cannot show popover when mouse over heatmap in modern theme;

> [!note]- 中文
> - 修复：编辑 Thino 时无法输入标签；
> - 修复：在 Modern 主题中鼠标悬停在热力图上时无法显示弹出窗口；


# 2.3.32

- feat: support filter thino in random review mode, you would review only filtered thino;
- feat: copy debug info as codeblock;
- fix: cannot parse daily note if a tag below a header;

> [!note]- 中文
> - 特性：支持在随机复习模式下过滤 Thino，您只会复习过滤的 Thino；
> - 特性：将调试信息复制为代码块；
> - 修复：如果标签在标题下面，无法解析每日笔记；

# 2.3.31

- fix: select `most active day` in `daily thino` view should cause the view to jump to the selected day;
- fix: icon's weight and height in moments view should be the same;
- fix: copy in table view as image should work correctly now;
- feat: support copy thino via context menu;

> [!note]- 中文
> - 修复：在 `每日 Thino` 视图中选择 `最活跃的一天` 应该导致视图跳转到所选的一天；
> - 修复：`moments` 视图中的图标的重量和高度应该是相同的；
> - 修复：在表视图中复制为图片应该可以正常工作；
> - 特性：支持通过上下文菜单复制 Thino；

![copy-image|500](https://raw.githubusercontent.com/quorafind/obsidian-thino/main/media/changelog/thino-context-menu-copy.png)


# 2.3.30

- feat: [PRO/BASIC] support copy filtered thino as image;

![copy-image|500](https://raw.githubusercontent.com/quorafind/obsidian-thino/main/media/changelog/thino-share.gif)

> [!note]- 中文
> - 特性：[PRO/BASIC] 支持将过滤的 Thino 复制为图片；

# 2.3.29

- style: update all `var(--color-base-xx)` variables to use `var(--thino-xxxxx)`;
- style: update chat view paddings;

> [!note]- 中文
> - 样式：更新所有 `var(--color-base-xx)` 变量使用 `var(--thino-xxxxx)`；
> - 样式：更新聊天视图内边距；

# 2.3.28

- style: update changelog modal img style;
- fix: copy debug info issues;

> [!note]- 中文
> - 样式：更新 changelog 模态框 img 样式；
> - 修复：复制调试信息问题；

# 2.3.27

- fix: style issues related to share dialog/daily thino view/thino card dialog;
- fix: codeblock would not overflow share card dialog anymore;

> [!note]- 中文
> - 修复：分享页面悬浮框/每日 Thino 视图/Thino 卡片悬浮框相关的样式问题；
> - 修复：代码块不会再溢出分享卡片；

# 2.3.26

- style: new theme settings for Thino, available for Pro and Basic users;
- fix: show editor in float window;
- feat: support new theme `modern`;
![modern|500](https://raw.githubusercontent.com/quorafind/obsidian-thino/main/media/changelog/modern-layout.png)
> You can toggle it in theme settings;

# 2.3.25

- fix: cannot edit thino in moments view.

# 2.3.24

- style: update moments style;
- fix: cannot show editor at the bottom when use moments view;
- feat: [PRO/BASIC] support better daily thino layout;
- fix: bottom editor issues related to all views;
- fix: cannot scroll-x  on table view;
- fix: should not fetch daily note if not enable;
- fix: cannot filter thino via tag in daily review view;

# 2.3.23

- fix: scroll to bottom when clear query;

# 2.3.22

- feat: support better daily review page (via header of thino);

# 2.3.21

- style: hide header when navigate to archive/trash view;

# 2.3.20

- fix: [PRO] chat view css issues;
- fix: [PRO] moments view css issues;

# 2.3.19

- fix: [PRO] moments view issues fixed;

# 2.3.18

- fix: [PRO] update thino should not jump to top of the page;
- perf: [PRO] update chat view to improve performance;
- feat: [PRO] support moments view;

# 2.3.17

- style: hide pro features for basic users;
- style: mobile view header style;

# 2.3.16

- fix: style issue related to chat view;

# 2.3.15

- fix: style issue related to chat view;

# 2.3.14

- fix: style issue related to chat view;

# 2.3.13

- fix: style issue related to chat view;

# 2.3.12

- feat: [PRO] support toggle checkbox in chat view;
- feat: [PRO] support automatically add tags to thino content when filter by tags(or tags in query filter);
- style: add pro class name to pro features entry;
- feat: [PRO] support bulk tag operation in thino list when filtering;
- feat: [PRO] new chat view style, set it in theme settings of thino;


# 2.3.11

- fix: cannot select time when open calendar suggester
- fix: style when editor is at the bottom of the page
- fix: show wrong translation
- fix: should not destroy editor when open settings

# 2.3.10

- feat: [PRO] support filter in archive/recycle bin view;
- feat: [PRO] support search bar in archive/recycle bin view;
- feat: [PRO/BASIC] support basic search bar in daily thinos dialog;
- style: remove translatex in page wrapper;
- fix: [PRO] should not get archived thino in the thino list;
- feat: [PRO] support bulk delete/archive/restore/copy in all view(after filter);
- fix: [PRO] show day's list and task count correctly;
- style: update the style of default toggle list button, show list icon when select list type;
- feat: [PRO/BASIC] support basic password protection;
- fix: cannot copy id correctly;
- feat: [PRO/BASIC] support better password protection;
- feat: [PRO/BASIC] support lock via command;
- fix: command to lock thino should not show when disabled password protection;
- fix: dropdown menu cannot delete thino correctly;
- fix: don't show password protection modal when password is empty;
- fix: top-right menu delete button should not be influenced by last changed.
- feat: [PRO] support sort order when click on date of agenda;
- feat: [PRO] support share image of agenda view when right-click on the table header.
- fix: cannot edit content after obsidian 1.5.11;
- fix: compatibility issue with before obsidian 1.5.6;
- feat: [PRO] support sort time when in agenda view;
- fix: cannot edit thino correctly after obsidian 1.5.11;
- feat: [PRO] support chat view mode;
- style: fix some issue related to chat view;
- feat: [PRO] enable switch chat or list mode when is mobile view;
- style: [PRO] update chat view style; 
- style: [PRO] update chat view style;
- style: [PRO] time stamp show near the message now;

# 2.3.9

- feat: [PRO] support select thino source or thino type in table view;
- fix: [PRO] don't show JOURNAL icon correctly;
- feat: [PRO] support custom time mark range like day/week/month/year;

# 2.3.8

- fix: heatmap should not show deleted thinos;
- fix: [PRO] fix base64 issue with CJK characters;

# 2.3.7

- chore: keep console.error to show status when thino loaded;

# 2.3.6

- fix: storage issue to cause the thino crash;

# 2.3.5

- fix: [PRO] reg code will not be saved correctly;
- chore: [PRO] update reg code validation system;

# 2.3.4

- feat: [PRO/BASIC] support toggle check box in daily thinos dialog;
- style: update the style to use var(--font-size-medium), which is default 15px;
- fix: show the count of thinos in user banner;
- feat: [PRO/BASIC] support navigation from other view to Thino view, and support navigation from Thino view to other view; (Toggle in settings)
- fix: block id would not be deleted when content is updated;
- fix: influx plugin should not be shown in the editor;
- feat: [PRO/BASIC] support task type filter & source type filter;
- feat: [PRO/BASIC] support checkbox type to be shown in the thino card;
  - style: support custom style for checkbox;
- fix: filter dialog would be closed when title is empty;
- fix: [PRO] global copy is not working.
- feat: [PRO/BASIC] you can set open thino view when open obsidian on desktop or mobile;
- feat: [PRO/BASIC] support open note in current thino view;
- fix: [PRO/BASIC] search should not be case-sensitive;
