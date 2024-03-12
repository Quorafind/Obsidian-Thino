<div align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/Quorafind/Obsidian-Thino/blob/main/media/dark-thino.svg">
  <img alt="Light mode" style="" src="https://github.com/Quorafind/Obsidian-Thino/blob/main/media/light-thino.svg">
</picture>
<p>Thino: A new way for you to quick capture an idea in Obsidian.</p>
</div>

<div align="center">
  <a href="https://thino.pkmer.net/en/">English</a> | <a href="https://thino.pkmer.net/">中文</a>
</div>

> [!warning]  
> From version 2.0.0, thino is not open-source anymore. You can still use it for free, but you need to buy a license to use some advanced features. You can buy a pro license from [here](https://thino.pkmer.net/).
>
> v1's source codebase is still open-source via MIT license, you can visit it here: [v1 source code](https://github.com/Quorafind/Obsidian-Memos/tree/v1).

> [!note]  
> From version 2.0.0, obsidian-memos is renamed to thino, you can search thino in obsidian plugin market to install it.
>
> About the reason for the rename, please refer to [here](https://thino.pkmer.net/en/thino).

## Basic Introduction

1. All Thinos are sourced from your notes. If you are using the basic version, then all Thinos originate from your diary files. For more information, please visit [link](https://thino.pkmer.net/en/thino/01_thino-basic/01_thino-basic-tutorial/).
2. In diary mode, it accesses content under a specified title or the entire text of the diary, parsing it into Thinos. A common format is `- 12:00 abcd`.
3. Each Thino you input will be inserted at the end of your specified title or at the end of the full text.

You can read thinos from multi-source, please visit [link](https://thino.pkmer.net/en/).

## Additional Features

Please refer to our official documentation website: [link](https://thino.pkmer.net/en/thino).
  
---  

## How to Use

1. You need to activate the Daily Notes core plugin at a minimum (If you are a thino pro user, you can disable daily notes plugin when you disable the diary mode).
2. Before using, please configure at least two settings: processing under the specified title in diary mode and inserting under the specified title.
3. Open Thino, enter content, and click the `noteit` button.
4. The content you input will be automatically inserted into your diary file.

## Basic Example (Daily Note Mode)

The content you input will be transformed into the following format:

```markdown  
- 22:15 {your input content}  
```  

The following markdown text formats will be properly parsed in daily note mode:

```markdown  
- 19:00 abcd  
- [ ] 19:00 cdef  
```  
  
---  

## Thino Sync(Not yet available)

**Thino Sync** is a service that allows you to sync your Thinos across devices. It is a paid service. You can purchase a license from [link](https://thino.pkmer.net/en/).

We will not collect any of your data, and we will not be able to access your data.

- If you use Thino(PKMer) Sync, we store your data to provide the service.
- If your Sync or Publish subscription expires, your data remains stored on our servers for one month, then deleted permanently. If you cancel the subscription yourself, your data is deleted immediately.

## Pro vs Free

| Features                                                                | Free | Pro |  
|-------------------------------------------------------------------------|------|-----|  
| Daily Notes Mode                                                        | ✅    | ✅   |  
| Thino Share                                                             | ✅    | ✅   |  
| Global Editor                                                           | ✅    | ✅   |  
| [Live Preview Editor](https://thino.pkmer.net/en/)                      | ✅*   | ✅   |  
| [Multi Layout](https://thino.pkmer.net/en/)                             | ❌    | ✅   |  
| [Daily Progress Bar](https://thino.pkmer.net/en/)                       | ❌    | ✅   |  
| [Custom Suggester for Live Preview Editor](https://thino.pkmer.net/en/) | ❌    | ✅   |  
| [Random Review](https://thino.pkmer.net/en/)                            | ❌    | ✅   |  
| [Local Thino Server](https://thino.pkmer.net/en/)                       | ❌    | ✅   | 
| [Global Capture](https://thino.pkmer.net/en/)                           | ❌    | ✅   |  
| [Multiple Thino Sources](https://thino.pkmer.net/en/)                   | ❌    | ✅   |  

*: Support for live preview editor is limited in free version.

You can purchase a license to use the following features: [link](https://thino.pkmer.net/en/).

## How to Install

| Source                                                                  | Description                                                                                                                                                        |  
|-------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|  
| [Obsidian Plugin Market](https://obsidian.md/plugins?id=obsidian-memos) | Install from Obsidian's plugin market.                                                                                                                             |  
| [PKMer plugins](https://pkmer.cn/products/plugin/pluginMarket/)         | Install from PKMer plugins.                                                                                                                                        |  
| [GitHub](https://github.com/quorafind/obsidian-thino)                   | Download the latest release. Extract and put the three files (main.js, manifest.json, styles.css) to folder `{{obsidian_vault}}/.obsidian/plugins/Obsidian-Thino`. |  
| BRAT                                                                    | Add `Quorafind/Obsidian-Thino` to BRAT.                                                                                                                            |  

## Say Thank You

If you like this plugin, please consider buying license to support my work and enthusiasm. You can buy a license from [here](https://thino.pkmer.net/).
