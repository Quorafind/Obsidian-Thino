// // Credits go to Liam's Periodic Notes Plugin: https://github.com/liamcain/obsidian-periodic-notes
// import { TextInputSuggest } from "./obSuggest";
import memoService from '../services/memoService';

// // interface Tag {
// //     key: string;
// //     text: string;
// //     subTags: Tag[];
// // }

export const usedTags = (seletecText: string) => {
    
    const { tags } = memoService.getState();
    const lowerCaseInputStr = seletecText.toLowerCase();
    const usedTags = [] as any;

    tags.forEach((tag: string) => {
        if (
            tag &&
            tag.toLowerCase().contains(lowerCaseInputStr)
        ) {
            usedTags.push({
                name: tag,
                char: tag,
            });
        }
    });

    return usedTags;

//     renderSuggestion(tag: string, el: HTMLElement): void {
//         el.setText(tag);
//     }

//     selectSuggestion(tag: string): void {
//         this.inputEl.value = tag;
//         this.inputEl.trigger("input");
//         this.close();
//     }
}
