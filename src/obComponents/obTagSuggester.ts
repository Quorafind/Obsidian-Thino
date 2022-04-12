// Credits go to Liam's Periodic Notes Plugin: https://github.com/liamcain/obsidian-periodic-notes
// import { TextInputSuggest } from "./obSuggest";
import memoService from '../services/memoService';
import dailyNotesService from '../services/dailyNotesService';
import { UseVaultTags } from '../memos';

const etTags = (): string[] => {
  const { app } = dailyNotesService.getState();
  //@ts-expect-error, private method
  const tags: any = app.metadataCache.getTags();
  return [...Object.keys(tags)].map((p) => p.split('#').pop());
};

export const usedTags = (seletecText: string) => {
  let allTags;

  if (UseVaultTags) {
    allTags = etTags();
  } else {
    const { tags } = memoService.getState();
    allTags = tags;
  }
  const lowerCaseInputStr = seletecText.toLowerCase();
  const usedTags = [] as any;

  allTags.forEach((tag: string) => {
    if (tag && tag.toLowerCase().contains(lowerCaseInputStr)) {
      usedTags.push({
        name: tag as string,
        char: tag as string,
      });
    }
  });

  return usedTags;
};
