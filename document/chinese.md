# Obsidian Memos

[English](../README.md)

用一个全新的方式来在 Obsidian 中记录日程，基于开源项目: [memos](https://github.com/justmemos/memos) 以及感谢: [flomo](https://flomoapp.com/)。

![memo-light](./Memos-in-light.png)
![memo-dark](./Memos-in-dark.png)
![memo-mobile](./Memos-in-dark-mobile.png)

## 介绍

1. 所有的 Memos 都来自于 Obsidian 的 Daily Notes， 所以你最好先开启 Obsidian 的 Daily Notes 插件。
2. 其中 Memos 可以根据你的设定来在某个指定标题下索引内容 ( 例如 `# 日程` )。
3. 当你创建一个 Query 的时候，会存放在你的日记文件夹中的 Query.md 中，请不要直接编辑它。
4. 当你删除一个 Memo 的时候，它会被发送到你的日记文件夹中的 Delete.md 中，请不要直接编辑它。

## 怎么用

1. 确认你的日记插件打开了；
2. 检查设置是否已经设置好对应的标题，而且日记中有没有对应的标题；
3. 打开 Memos 然后记录。

所有 Memos 都会附带时间戳，也允许以下格式的识别

- `- 19:00 中午吃饭了`
- `- [ ] 19:00 中午去吃饭`

## 功能

### Tag list

标签列表，用于展示 Memo 附带的标签列表。

### Query

Query 也就是检索，你可以设置多个同时存在或不同时存在的检索元素来限定 Memos。

### Heatmap

热点图，基于该 [CSS](./Heatmap-css-snippet.css) 和 Style setting 插件， 你可以自定义几种颜色。

### Clickable day

你可以点击 Day 上的数字来快速插件今天的所有日程，类似时间轴的方式。

### User banner

你可以设置用户名，而且在这里你可以找到设置和回收站入口。

### Editor

编辑器，允许你粘贴以及拖动图片，在最近的更新中加上了 Tag 的自动联想功能。

### Memo list

所有 Memo 的列表，你向下滚动可以看到所有的内容。

此外，

1. 你可以双击 Memo 来快速编辑；
2. Ctrl+click 可以让你快速跳转到笔记对应位置。

### Search and filter

检索，正如其名所示。

## 现在的问题

- [ ] 还没办法分享图片

## 安装

### 插件市场

还没上架

### BRAT

添加 `Quorafind/Obsidian-Memos` 到 BRAT 插件安装列表中.

### 手动安装

手动下载最新的安装包，然后将其中的三个文件解压到 (main.js, manifest.json, styles.css) `{{obsidian_vault}}/.obsidian/plugins/Obsidian-Memos` 文件夹即可.

# Say Thank You

如果你觉得 Obsidian-Memos 很有用，帮到了你，你可以考虑给我买杯咖啡： [https://www.buymeacoffee.com/boninall](https://www.buymeacoffee.com/boninall).

<a href="https://www.buymeacoffee.com/boninall"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=boninall&button_colour=6495ED&font_colour=ffffff&font_family=Lato&outline_colour=000000&coffee_colour=FFDD00"></a>
