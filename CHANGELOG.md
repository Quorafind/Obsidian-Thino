
# 2.4.23

> [!tips]+ English
> - feat: support append task done date when complete task in thino;
> - feat: [PRO] support fetch notes with specific tags for `FILE`/`MULTI` file type;
> - style: fix thino editor wrapper margin-top issue;
> - fix: end mark should not place on same line where code block ends
> - fix: when detach editor in modal/codeblock should not cause editor in view to be destroyed;
> - chore: add a space between `📆` and date when select from Calendar suggester;
> - fix: open editor modal should not influence the editor in view;
> - fix: content in editor modal should not influence editor content in view;
> - feat: [PRO] fetch thinos when edit/delete/create thino with tags;
> - feat: support set default min-height for content when share thino;
> - feat: support share multi thinos with share thino;

> [!note]- 中文
> - 特性：在 Thino 中完成任务时支持追加完成日期；
> - 特性：[PRO] 支持为 FILE/MULTI 文件类型获取具有特定标签的笔记，例如你设置为 `#thino/file` 的文件会被索引为单文件类型文件；
> - 样式：修复 Thino 编辑器包装器的 margin-top 问题；
> - 修复：结束标记不应该放在代码块结束的同一行；
> - 修复：在模态框/代码块中关闭编辑器时不应该导致视图中的编辑器被销毁；
> - 杂项：在从日历建议器中选择时，在 `📆` 和日期之间添加一个空格；
> - 修复：打开编辑器模态框不应该影响视图中的编辑器；
> - 修复：模态框中的内容不应该影响视图中的编辑器内容；
> - 特性：[PRO] 当编辑/删除/创建带有标签的 Thino 时，获取 Thino；
> - 特性：在分享 Thino 时支持设置内容的默认最小高度；
> - 特性：支持分享多个 Thino；

# 2.4.22

> [!tips]+ English
> - fix: heatmap calendar cannot display data correctly;
> - fix：Thino time group issue related to YYYY format;
> - fix: when click on task input box to complete task in thino, should not make task line become a block;
> - feat: you can reset all settings via button in advanced settings now，but not includes password settings and pro verify settings;

> [!note]- 中文
> - 修复：热点图日历无法正确显示数据；
> - 修复：与 YYYY 格式相关的 Thino 时间组问题；
> - 修复：在 Thino 中点击任务输入框完成任务时，不应该使任务行变成一个块；
> - 特性：您现在可以通过高级设置中的设置重置按钮重置所有设置，但不包括密码设置和专业版验证设置；

# 2.4.21

> [!tips]+ English
> - fix: create thino file in thino folder should attach id and create time quickly;
> - fix: should not parse tags in codeblock;
> - style: fix sidebar width too narrow cause heatmap squeezed;

> [!note]- 中文
> - 修复：在 Thino 文件夹中创建 Thino 文件应该快速附加 id 和创建时间；
> - 修复：不应该解析代码块中的标签；
> - 样式：修复侧边栏的宽度过窄导致热点图被挤压的问题；

# 2.4.20

> [!tips]+ English
> - fix: overflow issue for thino's menu;
> - style: remove gap in content wrapper when using fluent/inline style for Chat view;
> - feat: [PRO] support rename after create MULTI file;
> - fix: daily thinos background issue when sharing;
> - fix: should not be able to hide editor when editing thino in Moments view;
> - fix: tasks plugin compatibility issue;
> - feat: [PRO] support split thino with heading 1/2/3;
> - feat: support call tasks insert modal via hotkey;

> [!note]- 中文
> - 修复：Thino 菜单的溢出问题；
> - 样式：在聊天视图中使用 fluent/inline 样式时，移除 content-wrapper 中的 gap 属性；
> - 特性：[PRO] 支持创建多文件后重命名；
> - 修复：分享时每日 Thino 的背景问题；
> - 修复：在 Moments 视图中编辑 Thino 时不应该能够隐藏编辑器；
> - 修复：Tasks 插件兼容性问题；
> - 特性：[PRO] 支持将带有一级/二级/三级标题的 Thino 分割成多个文件；
> - 特性：支持通过快捷键调用 Tasks 插入模态框；

# 2.4.19

> [!tips]+ English
> - fix: cannot use context-menu to share thino on mobile;
> - feat: support share thino via commands;

> [!note]- 中文
> - 修复：无法在手机上使用右键菜单分享 Thino；
> - 特性：支持通过命令分享 Thino；

# 2.4.18

![thino-share|300](https://raw.githubusercontent.com/quorafind/obsidian-thino/main/media/changelog/thino-share-context-menu.png)

> [!tips]+ English
> - fix: background issue for thino share;
> - fix: cannot load icon correctly for thino share;
> - feat: support `Gradient` style for thino share;
> - feat: support share via editor context menu;

> [!note]- 中文
> - 修复：Thino 分享的背景问题；
> - 修复：Thino 分享的图标无法正确加载；
> - 特性：支持 Thino 分享的 `Gradient` 样式；
> - 特性：支持在编辑器中通过右键菜单分享；

# 2.4.17

| Minimal                                                                                                         | Modern                                                                                                         | Clean                                                                                                         |
| --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| ![300](https://raw.githubusercontent.com/quorafind/obsidian-thino/main/media/changelog/thino-share-minimal.png) | ![300](https://raw.githubusercontent.com/quorafind/obsidian-thino/main/media/changelog/thino-share-modern.png) | ![300](https://raw.githubusercontent.com/quorafind/obsidian-thino/main/media/changelog/thino-share-clean.png) |

> [!tips]+ English
> - fix: bottom editor issue on mobile;
> - feat: support three share styles for thino;

> [!note]- 中文
> - 修复：手机上底部编辑器问题；
> - 特性：支持 Thino 的三种分享样式；

# 2.4.16

> [!tips]+ English
> - fix: cannot update webid correctly;
> - style: remove margin top for page-wrapper when using modern theme;
> - feat: click on editor should focus on the editor when using live-preview mode;
> - fix: cannot create webid correctly;
> - fix: should not replace block id for children list when update content in thino;

> [!note]- 中文
> - 修复：不能正确更新 webid；
> - 样式：在使用现代主题时，移除 page-wrapper 的顶部边距；
> - 特性：在使用实时预览模式时，点击编辑器应该聚焦到编辑器；
> - 修复：不能正确创建 webid；
> - 修复：在更新 Thino 内容时，不应该替换子列表的块 id；


# 2.4.15

> [!tips]+ English
> - fix: cannot update thino webid correctly;
> - fix: possible to load changelog that crash the app;
> - fix: dead loop cause by parent-children list;

> [!note]- 中文
> - 修复：无法正确更新 Thino 的 webid；
> - 修复：可能加载导致应用崩溃的更新日志；
> - 修复：由于父子列表导致的死循环；

# 2.4.14

> [!tips]+ English
> - fix: edit created thino cannot save correctly;
> - fix: cannot exit user setting guide correctly;

> [!note]- 中文
> - 修复：编辑创建的 Thino 无法正确保存；
> - 修复：无法正确退出用户设置向导；


# 2.4.13

> [!tips]+ English
> - fix: use tab to indent should not follow tab size;
> - fix: cannot delete thino correctly when set ProcessThinoBelow

> [!note]- 中文
> - 修复：使用 tab 缩进时不应该遵循 tab 大小；
> - 修复：当设置 ProcessThinoBelow 时无法正确删除 Thino；


# 2.4.12

> [!tips]+ English
> - feat: remove `<br>` dependency for thino in daily notes;
>   - newline use indent automatically;
>   - new thino will not include `<br>` tag;
>   - old thino will be updated automatically when you edit it next time;
>   - if your thino has special layout requirements, please update it manually;
> - fix: Thino should not be locked when user is on user guide;
> - fix: list cannot patch correctly in thino from daily notes;

> [!note]- 中文
> - 特性：在每日笔记中移除 Thino 的 `<br>` 依赖；
>   - 换行使用缩进自动完成；
>   - 新建的 Thino 不再包含 `<br>` 标签；
>   - 旧的 Thino 会在下次编辑时自动更新；
>   - 如果您的 Thino 有特殊的排版需求，请手动更新；
> - 修复：当用户在用户指南上时，Thino 不应该被锁定；
> - 修复：在每日笔记中，Thino 无法正确插入列表；

# 2.4.10

> [!tips]+ English
> - fix: path contains `'` can't be shown in Thino correctly;

> [!note]- 中文
> - 修复：路径包含 `'` 无法正确显示在 Thino 中；


# 2.4.9

> [!tips]+ English
> - fix: cannot save `InsertAfter` correctly in user setting guide;

> [!note]- 中文
> - 修复：在设置向导中无法正确保存 `InsertAfter`；


# 2.4.8

> [!tips]+ English
> - feat: support image selector for User icon;

> [!note]- 中文
> - 特性：支持用户图标的图片选择器；

# 2.4.7

> [!tips]+ English
> - fix: cannot share image when path contains CJK text;

> [!note]- 中文
> - 修复：当路径包含 CJK 文本时无法分享图片；

# 2.4.5

> [!tips]+ English
> - fix: don't support local image for sharing on mobile;

> [!note]- 中文
> - 修复：不支持在手机上分享本地图片；

# 2.4.4

> [!tips]+ English
> - fix: cannot load image correctly when sharing;

> [!note]- 中文
> - 修复：当分享时无法正确加载图片；

# 2.4.3

> [!tips]+ English
> - fix: cannot preview ::before when generate image;

> [!note]- 中文
> - 修复：生成图片时无法预览 ::before；

# 2.4.2

> [!tips]+ English
> - fix: load moments view issue;
> - feat: support different text action for sharing text/image to thino on mobile;
>   - support text input box, when input content, it will be added to the beginning or end according to the setting;
>   - support tag select box, when select tag, it will be added to the beginning or end according to the setting;
>   - support predefined text, when select predefined text, it will be added to the beginning or end according to the setting;
> - feat: support setting wizard on mobile;

> [!note]- 中文
> - 修复：加载 moments 视图问题；
> - 特性：支持在手机上分享文本/图片到 Thino 时的不同文本操作；
>   - 支持文本输入框，当输入内容，将会根据设定，自动添加到开头或者末尾；
>   - 支持标签选择框，当选择标签，将会根据设定，自动添加到开头或者末尾；
>   - 支持预定义文本，当选择预定义文本，将会根据设定，自动添加到开头或者末尾；
> - 特性：设置向导支持移动端；


# 2.4.1

> [!tips]+ English
> - chore: show different language's changelog automatically;

> [!note]- 中文
> - 杂项：自动显示不同语言的更新日志；

# 2.4.0

> [!warning]- Onboarding
> ![thino-onboarding|300](https://raw.githubusercontent.com/quorafind/obsidian-thino/main/media/changelog/thino-onboarding.gif)

> [!tips]+ English
> - chore: congrats! thino download count over 100000;
> - feat: better onboarding experience for Thino users;
>   - support user setting guide; 
>   - If you are a new user, you can see the user setting guide when you open the settings;
>   - If you are an old user, you can skip the guide;
> - feat: support local images from the library for user icon and background image;

> [!note]- 中文
> - 杂项：庆祝 Thino 下载量超过 100000；
> - 特性：更好的 Thino 用户入门体验；
>   - 支持用户设置向导； 
>   - 如果您是新用户，您可以在打开设置时看到用户设置向导；
>   - 如果您是老用户，您可以跳过向导；
> - 特性：用户图标和背景图均支持从库内部的本地图片；

# 2.3.61

> [!tips]+ English
> - fix: click on mark link in Thino editor cause create and open a new leaf;
> - feat: [PRO] different insert target for Task or List thino;

> [!note]- 中文
> - 修复：点击 Thino 编辑器中的标记链接导致创建并打开一个新的页面；
> - 特性：[PRO] 任务或列表 Thino 的不同插入目标；

# 2.3.60

> [!tips]+ English
> - fix: tag count issues;

> [!note]- 中文
> - 修复：标签计数问题；

# 2.3.59

![thino-group-moments|300](https://raw.githubusercontent.com/quorafind/obsidian-thino/main/media/changelog/thino-group-moments.png)

> [!tips]+ English
> - chore: remove unused hotkeys;
> - feat: [PRO] support day group for thino in moments view;
> - feat: [PRO] support hide pinned group for thino;

> [!note]- 中文
> - 杂项：删除未使用的快捷键；
> - 特性：[PRO] 支持 Thino 的日期分组；
> - 特性：[PRO] 支持隐藏固定组的 Thino；

# 2.3.58

> [!tips]+ English
> - fix: tag cound issues;
> - style: set image's width as 100% when only one image in thino;

> [!note]- 中文
> - 修复：标签计数问题；
> - 样式：当 Thino 中只有一张图片时，将图片的宽度设置为 100%；

# 2.3.57

> [!tips]+ English
> - fix: better word count. Thanks to better word count plugin.
> - fix: tag count issues;

> [!note]- 中文
> - 修复：更好的字数统计。感谢 better word count 插件。
> - 修复：标签计数问题；

# 2.3.56

> [!tips]+ English
> - feat: support `float editor` on mobile;

> [!note]- 中文
> - 特性：支持在手机上使用 `浮动编辑器`；

# 2.3.55 

<video width="300" src="https://i.imgur.com/GVF2wTB.mp4" autoplay></video>

> [!tips]+ English
> - feat: [PRO] support append/prepend text when share to thino on mobile;

> [!note]- 中文
> - 特性：[PRO] 支持在手机上分享到 Thino 时追加/前置文本；


# 2.3.54

> [!tips]+ English
> - feat: count child tags‘s count automatically in thino;
> - chore: remove unused jump to settings features for Chat View;

> [!note]- 中文
> - 特性：自动计算 Thino 中的子标签数量；
> - 杂项：删除聊天视图的跳转设置功能；

# 2.3.53

> [!tips]+ English
> - fix: cannot use templater in thino;

> [!note]- 中文
> - 修复：无法在 Thino 中使用 templater；

# 2.3.52

![thino-user-info|300](https://raw.githubusercontent.com/quorafind/obsidian-thino/main/media/changelog/thino-user-info.png)

> [!tips]+ English
> - feat: support user icon globally;
> - chore: rearrange settings;

> [!note]- 中文
> - 特性：全局支持用户图标；
> - 杂项：重新排列设置；


# 2.3.51

> [!tips]+ English
> - feat: [PRO/BASIC] support download image directly on phone;
> - style: better share image on phone;

> [!note]- 中文
> - 特性：[PRO/BASIC] 支持在手机上直接下载图片；
> - 样式：在手机上更好的分享图片；


# 2.3.50

| Dark           | Light                                                                                                      |
|----------------|------------------------------------------------------------------------------------------------------------|
| ![thino-share\|300](https://raw.githubusercontent.com/quorafind/obsidian-thino/main/media/changelog/thino-share-dark.png) | ![thino-share\|300](https://raw.githubusercontent.com/quorafind/obsidian-thino/main/media/changelog/thino-share-light.jpg) |

> [!tips]+ English
> - feat: [PRO/BASIC] Renew share image layout for Thino;

> [!note]- 中文
> - 特性：[PRO/BASIC] 更新 Thino 的分享图片布局；

# 2.3.49

![thino-hover-source|300](https://raw.githubusercontent.com/quorafind/obsidian-thino/main/media/changelog/thino-hover-source-of-thino.gif)

> [!tips]+ English
> - feat: [PRO/BASIC] support hover thino to show thino source; By pressing `Shift` and hover on thino, you can see the source of the thino;(Toggle settings for `Ctrl` key in hover preview settings of Obsidian)
> - fix: parse task error when using `HH:mm:ss` format in daily note for Thino;

> [!note]- 中文
> - 特性：[PRO/BASIC] 鼠标悬停在 Thino 上显示 Thino 源；通过按住 `Shift` 键并悬停在 Thino 上，您可以看到 Thino 的源；(在 Obsidian 的悬停预览设置中切换 `Ctrl` 键的设置)
> - 修复：在每日笔记中使用 Thino 的 `HH:mm:ss` 格式时解析任务错误；

# 2.3.48

> [!tips]+ English
> - fix: word wrap related to a.tag;
> - feat: [PRO] notice for multi file settings error;
> - feat: support `HH:mm:ss` format in daily note for Thino;

> [!note]- 中文
> - 修复：与 a.tag 相关的自动换行；
> - 特性：[PRO] 多文件设置错误的通知；
> - 特性：在每日笔记中支持 Thino 的 `HH:mm:ss` 格式；


# 2.3.47

> [!tips]+ English
> - style: tag or images issues related to moments view;
> - fix: cannot insert editor into thino directly;
> - fix: should not show editor modal when thino is not opened;
> - feat: [PRO] show `ddd`(Mon. etc.) near the time range mark;
> - style: image issue related to chat view;
> - feat: can toggle task or list directly when editing thino;

> [!note]- 中文
> - 样式：与 moments 视图相关的标签或图片问题；
> - 修复：无法直接将编辑器插入到 Thino 中；
> - 修复：当 Thino 没有打开时不应该显示编辑器模态框；
> - 特性：[PRO] 在时间范围标记附近显示 `ddd`(周一等)；
> - 样式：与聊天视图相关的图片问题；
> - 特性：在编辑 Thino 时可以直接切换任务或列表；

# 2.3.46

> [!tips]+ English
> - fix: set background image for share image not working;
> - feat: support http link for share dialog background image;

> [!note]- 中文
> - 修复：设置分享图片的背景图片不起作用；
> - 特性：支持分享对话框背景图片的 http 链接；

# 2.3.45

> [!tips]+ English
> - feat: [All source] navigate to thino's source would not open duplicate leaf anymore;
> - feat: [All source] navigate to thino's source would not open a split pane anymore;
> - style: menu wrapper padding issue;

> [!note]- 中文
> - 特性：导航到 Thino 的源不会再打开重复的页面；
> - 特性：导航到 Thino 的源不会再打开分割窗格；
> - 样式：菜单内边距问题；

> [!tips]- Highlights
> - Thanks to [**@izz00**'s daily outline plugin](https://github.com/iiz00/obsidian-daily-note-outline) for special support for `- HH:mm text` format in daily note for Thino.
> - 感谢 [**@izz00** 的 Daily Outline 插件](https://github.com/iiz00/obsidian-daily-note-outline) 为 Thino 所增加的对每日笔记中 `- HH:mm text` 格式的特殊支持。

# 2.3.44

![thino-canvas-menu|300](https://raw.githubusercontent.com/quorafind/obsidian-thino/main/media/changelog/thino-canvas-menu.gif)

- feat: [PRO] support thino canvas menu in `thino.canvas`. You need to open thino and then switch to `thino.canvas` to use it;
  - Note: This feature based on the `CANVAS` source type, you need to enable it in the settings;
- fix: [PRO] cannot show thino canvas menu correctly;

> [!note]- 中文
> - 功能：支持 `thino.canvas` 中的 Thino 画布菜单；你需要打开 Thino 然后切换到 `thino.canvas` 来使用它；
>   - 注意：这个功能基于 `CANVAS` 源类型，你需要在设置中启用它；
> - 修复：[PRO] 无法正确显示 Thino 画布菜单；


# 2.3.43

- feat: [PRO] support thino canvas menu in `thino.canvas`. You need to open thino and then switch to `thino.canvas` to use it;
  - Note: This feature based on the `CANVAS` source type, you need to enable it in the settings; 

> [!note]- 中文
> - 功能：支持 `thino.canvas` 中的 Thino 画布菜单；你需要打开 Thino 然后切换到 `thino.canvas` 来使用它；
>   - 注意：这个功能基于 `CANVAS` 源类型，你需要在设置中启用它；

# 2.3.42

- fix: click on editor cause reveal thino's leaf incorrectly;

> [!note]- 中文
> - 修复：点击编辑器导致错误地显示 Thino 的页面；


# 2.3.41

- fix: [PRO] cannot parse multi-files that includes `---` in the content;

> [!note]- 中文
> - 修复：[PRO] 无法解析内容中带有 `---` 以下的部分；

# 2.3.40

![thino-share|300](https://raw.githubusercontent.com/quorafind/obsidian-thino/main/media/changelog/thino-embed.gif)

- feat: [PRO/BASIC] list component in thino embed should place pinned thinos at the top;
- feat: [PRO/BASIC] support press enter key to unlock thino;
- feat: support open thino directly via code block;
- feat: double-click on thino in code block will reveal the thino's leaf;

> [!note]- 中文
> - 特性：[PRO/BASIC] Thino 嵌入中的列表组件应该将固定的 Thino 放在顶部；
> - 特性：[PRO/BASIC] 支持按回车键解锁 Thino；
> - 特性：支持通过代码块直接打开 Thino；
> - 特性：双击代码块中的 Thino 将跳转 Thino 的页面；

## Thino Embed | Thino 嵌入

`daily` can be true for current daily note, or a specific date like `2024/03/22 01:01:01`.

> [!note]- 中文
> - `daily` 可以是 true 表示当前每日笔记，或者是一个特定的日期，比如 `2024/03/22 01:01:01`。

````markdown
```thino
{
  list: true,
  calendar: true,
  heatmap: true,
  status: true,
  editor: true,
  daily: '2024/03/22 01:01:01', 
}
```
````

# 2.3.39

- feat: [PRO/BASIC] supercharge thino embed component; You can sort thino components by different types, like list/calendar/heatmap/status/editor/daily;

> [!note]- 中文
> - 特性：[PRO/BASIC] 强化 Thino 嵌入组件；你可以按不同类型排序 Thino 组件，比如列表/日历/热力图/状态/编辑器/每日；

# 2.3.38

- style: reduce thino modal height to 90vh;
- fix: cannot show thino list correctly;
- fix: daily notes issue related to thino;
- 
> [!note]- 中文
> - 样式：将 Thino 模态框高度减小到 90vh；
> - 修复：无法正确显示 Thino 列表；
> - 修复：与 Thino 相关的每日笔记问题；

# 2.3.37

- fix: cannot unpin thino correctly via context menu;
- feat: [PRO/BASIC] support insert editor to current markdown view;
- fix: tag list cause thino crashed;

> [!note]- 中文
> - 修复：无法通过上下文菜单正确取消固定 Thino；
> - 特性：[PRO/BASIC] 支持将编辑器插入到当前的 markdown 视图；
> - 修复：标签列表导致 Thino 崩溃；

## Insert Editor

![insert-editor|400](https://raw.githubusercontent.com/quorafind/obsidian-thino/main/media/changelog/thino-insert-editor.gif)

Using it via command or insert code block like:

````  
```thino  
{  
  editor: true;
}  
```  
````

# 2.3.36

- fix: cannot double-click on checkbox in thino to toggle it, it will trigger edit thino event;
- fix: click on checkbox in TASK-TODO thino should not toggle it done;

> [!note]- 中文
> - 修复：无法双击 Thino 中的复选框来切换它，它会触发编辑 Thino 事件；
> - 修复：点击 TASK-TODO Thino 中的复选框不应该切换它的状态；


# 2.3.35

![tag-filter|500](https://raw.githubusercontent.com/quorafind/obsidian-thino/main/media/changelog/thino-filter.gif)

- feat: [PRO] support tags multi-select filter when holding `ctrl` or `meta` key;
- feat: [PRO/BASIC] support click on task status item/ tags status item to filter thinos when using Modern theme;

> [!note]- 中文
> - 特性：[PRO] 支持标签多选过滤，按住 `ctrl` 或 `meta` 键；
> - 特性：[PRO/BASIC] 在 Modern 模式下，支持点击任务状态项/标签状态项来过滤 Thino；



# 2.3.34

![username|500](https://raw.githubusercontent.com/quorafind/obsidian-thino/main/media/changelog/thino-user-name.png)

- fix: bottom editor issues related to chat view;
- style: better images alignment in moments view;
- fix: text ellipsis for user name;

> [!note]- 中文
> - 修复：与聊天视图相关的底部编辑器问题；
> - 样式：更好的图片对齐样式；
> - 修复：用户名称的文本省略号；



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

![copy-image|500](https://raw.githubusercontent.com/quorafind/obsidian-thino/main/media/changelog/thino-context-menu-copy.png)

- fix: select `most active day` in `daily thino` view should cause the view to jump to the selected day;
- fix: icon's weight and height in moments view should be the same;
- fix: copy in table view as image should work correctly now;
- feat: support copy thino via context menu;

> [!note]- 中文
> - 修复：在 `每日 Thino` 视图中选择 `最活跃的一天` 应该导致视图跳转到所选的一天；
> - 修复：`moments` 视图中的图标的重量和高度应该是相同的；
> - 修复：在表视图中复制为图片应该可以正常工作；
> - 特性：支持通过上下文菜单复制 Thino；


# 2.3.30

![copy-image|500](https://raw.githubusercontent.com/quorafind/obsidian-thino/main/media/changelog/thino-share.gif)

- feat: [PRO/BASIC] support copy filtered thino as image;

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

![modern|500](https://raw.githubusercontent.com/quorafind/obsidian-thino/main/media/changelog/modern-layout.png)

- feat: support new theme `modern`;

> [!note]- 中文
> - 特性：支持新主题 `modern`；

- style: new theme settings for Thino, available for Pro and Basic users;
- fix: show editor in float window;

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
