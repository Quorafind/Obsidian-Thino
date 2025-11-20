# Obsidian Memos

[中文文档](./document/chinese.md)

> [!warning]
> Updated: It is now in internal testing on Pkmer, and you can try it out as a Thino insider. If you have previously donated to me through Buy me coffee or other means(before 2023.10), don't worry, I will give you a trial slot! Please feel free to message me privately.
> <br>
> 更新：现在它正在 Pkmer 网站上内测发布中，你可以购买 Thino insider 来测试它，如果你之前（在今年十月前）有任意形式捐赠过我，不管数额多少，你都可以随时联系我获取 thino insider 名额！

> [!note]
> Thino(Memos 2.1.x) is ready for test, if you are interested in it, please contact me @Boninall via Obsidian discord OR mail: Bonopengate@gmail.com
> 
> Thino(Memos 2.1.x) 正在封闭测试中，如果你对此感兴趣，请在 Obsidian discord 上联系我 @Boninall 或者邮件：Bonopengate@gmail.com
>
> Releases Note: https://ob.boninall.com/_Update/Obsidian+Memos+Update+MOC

A new way for you to quick capture an idea in Obsidian. Which is highly based on the awesome open source project: [memos](https://github.com/justmemos/memos) and awesome service: [flomo](https://flomoapp.com/).

![](https://raw.githubusercontent.com/Quorafind/Obsidian-Memos/main/document/Memos-Desktop.png)
![](https://raw.githubusercontent.com/Quorafind/Obsidian-Memos/main/document/Memos-Mobile.png)

## Introduction

1. All the memos come from your daily notes, this requires the 'Daily Notes Plugin' to be enabled for this plugin to work.
2. Memos are taken from below the header you set in the configuration under 'Process Memos below' this is `# Journal` by default.
3. Memos are created under the heading set in the configuration as 'Insert After' this is `# Journal` by default(Now you can set it to any other heading you like).
4. When you create a query, a query.md file will be generated automatically in your daily note folder.
5. When you delete a memo, it will send to the delete.md in your daily note folder, please don't edit it directly.

## How to Use

1. First you ensure you have the 'Daily notes' plugin (the core plugin of Obsidian) enabled.
2. Then, you should check the setting to set your header to process below and insert new memos below, OR leave blank to write the entries to the bottom of the daily file.
3. Open memos and then click on 'NOTEIT'.
4. If you allow comments one Memos, you need to ensure you have the 'dataview' plugin  enabled

A entry will be added to your daily note using a bullet format with the current time.

### Example

```markdown
- 22:15 {Contents of memo you entered}
```

It uses the following formats when parsing to add memos to the list:

- `- 19:00` in daily notes.
- `- [ ] 19:00` in daily notes.

## Features

### Memos list

Show all memos that from your daily notes, so you can read them in one page.

### Share memo and timeline

You can share any memo and daily memo through image.

### Tag list

Build in tag list for JUST memos. The build in tag list will show the tags in your memos. 

### Query list

You can set queries that contains more than one variable to query memos. You can add it\pin it\Delete it. 

### Memos Heatmap

You have a github heatmap like view to see your memos amount everyday, like dots in calendar. But all of them is clickable to filter that day's memos.

### User banner 

You can set your name in setting ,so don't forget to do it. And you can find the setting and trash box for memos when you click on the three dots near the user name.

In each memo, you can used MARK to make it link to another memo. And you can delete it, share it and so on.

TIPS: 

1. you can double click on the memo to edit the memo.
2. Ctrl+click to jump to the source of the memo.

### Search and filter

Every time, you search in memos will filter the memos that matched (which are showed in one page), and in memos, there are already four build-in filters to help you for using memos easily.

### More in settings

You can find many interesting stuff in settings, don't hesitate to try them.

### Set different color for the heatmap:

You can download css snippet here: [Heatmap-color](./document/Heatmap-css-snippet.css)

## How to Install

### From Plugin Market in Obsidian

💜: Directly install from Obsidian Market.

### From BRAT

🚗: Add `Quorafind/Obsidian-Memos` to BRAT.

### Download Manually

🚚: Download the latest release. Extract and put the three files (main.js, manifest.json, styles.css) to folder `{{obsidian_vault}}/.obsidian/plugins/Obsidian-Memos`. 

## Say Thank You

If you are enjoy using Obsidian-Memos then please support my work and enthusiasm by buying me a coffee on [https://www.buymeacoffee.com/boninall](https://www.buymeacoffee.com/boninall).

<a href="https://www.buymeacoffee.com/boninall"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=boninall&button_colour=6495ED&font_colour=ffffff&font_family=Lato&outline_colour=000000&coffee_colour=FFDD00"></a>
