import { t } from '../translations/helper';
import { IMAGE_URL_REG, LINK_REG, MEMO_LINK_REG, NOP_FIRST_TAG_REG, TAG_REG } from './consts';
import { moment, Notice } from 'obsidian';

export const relationConsts = [
  { text: 'AND', value: 'AND' },
  { text: 'OR', value: 'OR' },
];

export const filterConsts = {
  TAG: {
    value: 'TAG',
    text: t('TAG'),
    operators: [
      {
        text: t('INCLUDE'),
        value: 'CONTAIN',
      },
      {
        text: t('EXCLUDE'),
        value: 'NOT_CONTAIN',
      },
    ],
  },
  TYPE: {
    value: 'TYPE',
    text: t('TYPE'),
    operators: [
      {
        value: 'IS',
        text: t('IS'),
      },
      {
        value: 'IS_NOT',
        text: t('ISNOT'),
      },
    ],
    values: [
      {
        value: 'CONNECTED',
        text: t('LINKED'),
      },
      {
        value: 'NOT_TAGGED',
        text: t('NO TAGS'),
      },
      {
        value: 'LINKED',
        text: t('HAS LINKS'),
      },
      {
        value: 'IMAGED',
        text: t('HAS IMAGES'),
      },
    ],
  },
  TEXT: {
    value: 'TEXT',
    text: t('TEXT'),
    operators: [
      {
        value: 'CONTAIN',
        text: t('INCLUDE'),
      },
      {
        value: 'NOT_CONTAIN',
        text: t('EXCLUDE'),
      },
    ],
  },
  DATE: {
    value: 'DATE',
    text: t('DATE'),
    operators: [
      {
        value: 'NOT_CONTAIN',
        text: t('BEFORE'),
      },
      {
        value: 'CONTAIN',
        text: t('AFTER'),
      },
    ],
  },
};

export const memoSpecialTypes = filterConsts['TYPE'].values;

export const getTextWithMemoType = (type: string): string => {
  for (const t of memoSpecialTypes) {
    if (t.value === type) {
      return t.text;
    }
  }
  return '';
};

export const getDefaultFilter = (): BaseFilter => {
  return {
    type: 'TAG',
    value: {
      operator: 'CONTAIN',
      value: '',
    },
    relation: 'AND',
  };
};

export const checkShouldShowMemoWithFilters = (memo: Model.Memo, filters: Filter[]) => {
  let shouldShow = true;

  for (const f of filters) {
    const { relation } = f;
    const r = checkShouldShowMemo(memo, f);
    if (relation === 'OR') {
      shouldShow = shouldShow || r;
    } else {
      shouldShow = shouldShow && r;
    }
  }

  return shouldShow;
};

export const checkShouldShowMemo = (memo: Model.Memo, filter: Filter) => {
  const {
    type,
    value: { operator, value },
  } = filter;

  if (value === '') {
    return true;
  }

  let shouldShow = true;

  if (type === 'TAG') {
    let contained = true;
    const tagsSet = new Set<string>();
    for (const t of Array.from(memo.content.match(TAG_REG) ?? [])) {
      const tag = t.replace(TAG_REG, '$1').trim();
      const items = tag.split('/');
      let temp = '';
      for (const i of items) {
        temp += i;
        tagsSet.add(temp);
        temp += '/';
      }
    }
    for (const t of Array.from(memo.content.match(NOP_FIRST_TAG_REG) ?? [])) {
      const tag = t.replace(NOP_FIRST_TAG_REG, '$1').trim();
      const items = tag.split('/');
      let temp = '';
      for (const i of items) {
        temp += i;
        tagsSet.add(temp);
        temp += '/';
      }
    }
    if (!tagsSet.has(value)) {
      contained = false;
    }
    if (operator === 'NOT_CONTAIN') {
      contained = !contained;
    }
    shouldShow = contained;
  } else if (type === 'TYPE') {
    let matched = false;
    if (value === 'NOT_TAGGED' && memo.content.match(TAG_REG) === null) {
      matched = true;
    } else if (value === 'LINKED' && memo.content.match(LINK_REG) !== null) {
      matched = true;
    } else if (value === 'IMAGED' && memo.content.match(IMAGE_URL_REG) !== null) {
      matched = true;
    } else if (value === 'CONNECTED' && memo.content.match(MEMO_LINK_REG) !== null) {
      matched = true;
    }
    if (operator === 'IS_NOT') {
      matched = !matched;
    }
    shouldShow = matched;
  } else if (type === 'TEXT') {
    let contained = memo.content.includes(value);
    if (operator === 'NOT_CONTAIN') {
      contained = !contained;
    }
    shouldShow = contained;
  } else if (type === 'DATE') {
    if (!(app as any).plugins.enabledPlugins.has('nldates-obsidian')) {
      new Notice(t('OBSIDIAN_NLDATES_PLUGIN_NOT_ENABLED'));
    } else {
      const nldatesPlugin = (app as any).plugins.getPlugin('nldates-obsidian');
      const parsedResult = nldatesPlugin.parseDate(value);
      let contained;
      if (parsedResult.date !== null) {
        contained = parsedResult.moment.isBefore(moment(memo.createdAt), 'day');
      }

      if (operator === 'NOT_CONTAIN') {
        contained = !contained;
      }
      shouldShow = contained;
    }
  }

  shouldShow = memo.linkId === '' ? shouldShow : false;

  return shouldShow;
};
