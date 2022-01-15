# Obsidian Memos

[中文文档](./document/chinese.md)

A new way for you to quick capture an idea in Obsidian. Which is highly based on the awesome open source project: [memos](https://github.com/justmemos/memos) and awesome service: [flomo](https://flomoapp.com/).

![memo-light](./document/Memos-in-light.png)
![memo-dark](./document/Memos-in-dark.png)
![memo-mobile](./document/Memos-in-dark-mobile.png)

## Introduction

1. All the memos come from your daily notes, this requires the 'Daily Notes Plugin' to be enabled for this plugin to work.
2. Memos are taken from below the header you set in the configuration under 'Process Memos below' this is `# Journal` by default.
3. Memos are created under the heading set in the configuration as 'Insert After' this is `# Journal` by default.
4. When you create a query, a query.md file will be generated automatically in your daily note folder.
5. When you delete a memo, it will send to the delete.md in your daily note folder, please don't edit it directly.

## How to Use

1. First you ensure you have the 'Daily notes' plugin (the core plugin of Obsidian) enabled.
2. Then, you should check the setting to set your header to process below and insert new memos below, OR leave blank to write the entries to the bottom of the daily file.
3. Open memos and then click on 'NOTEIT'.

A entry will be added to your daily note using a bullet format with the current time.

### Example

```markdown
- 22:15 {Contents of memo you entered}
```

It uses the following formats when parsing to add memos to the list:

- `- 19:00` in daily notes.
- `- [ ] 19:00` in daily notes.

## Features

### Tag list

Build in tag list for JUST memos. The build in tag list will show the tags in your memos.

### Query

You can set a query that contains more than one variable to query memos. You can add it\pin it\Delete it

### Heatmap

You have a github heatmap like view to see your memos everyday, like dots in calendar. But all of them is clickable to filter that day's memos.

### Clickable day

You can click on the day and then see all your memos today, yesterday, and so on(it based on `day` not week or month)

### User banner

You can set your name in setting ,so don't forget to do it. And you can find the setting and trash box for memos when you click on the three dots near the user name.

### Editor

You can edit a memo and then click on NOTEIT button to add memo. Of course you can drag and drop images into the editor, which will put the images into your vault.(Will add the option to upload soon)

And after the ver 1.1.0, you have tag suggester to improve your life.

### Memo list

You can see all your memos here, just scroll down to see every day and so on.

In each memo, you can used MARK to make it link to another memo. And you can delete it, share it and so on.

What's more,

1. you can double click on the memo to edit the memo.
2. Ctrl+click to jump to the source of the memo.

Of course, internal link or image link in memo should be rendered as usual.

### Search and filter

Every time, you search in memos will filter the memos that matched (which are showed in one page), and in memos, there are already four build-in filters to help you for using memos easily.

## Problems NOW

- [ ] Share Image seems have some bugs.

## Install

### Plugin Market

Not yet

### BRAT

Add `Quorafind/Obsidian-Memos` to BRAT.

### Manual Install

Download the latest release. Extract and put the three files (main.js, manifest.json, styles.css) to folder `{{obsidian_vault}}/.obsidian/plugins/Obsidian-Memos`.

## Say Thank You

If you are enjoy using Obsidian-Memos then please support my work and enthusiasm by buying me a coffee on [https://www.buymeacoffee.com/boninall](https://www.buymeacoffee.com/boninall).

<a href="https://www.buymeacoffee.com/boninall"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=boninall&button_colour=6495ED&font_colour=ffffff&font_family=Lato&outline_colour=000000&coffee_colour=FFDD00"></a>
