// Credits go to Liam's Periodic Notes Plugin: https://github.com/liamcain/obsidian-periodic-notes
// import { TextInputSuggest } from "./obSuggest";
import memoService from '../services/memoService';

export const usedTags = (seletecText: string) => {
  const {tags} = memoService.getState();
  const lowerCaseInputStr = seletecText.toLowerCase();
  const usedTags = [] as any;

  tags.forEach((tag: string) => {
    if (tag && tag.toLowerCase().contains(lowerCaseInputStr)) {
      usedTags.push({
        name: tag as string,
        char: tag as string,
      });
    }
  });

  return usedTags;
};
