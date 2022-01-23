import {IMAGE_URL_REG, LINK_REG, MEMO_LINK_REG, NOP_FIRST_TAG_REG, TAG_REG} from './consts';

export const relationConsts = [
  {text: 'AND', value: 'AND'},
  {text: 'OR', value: 'OR'},
];

export const filterConsts = {
  TAG: {
    value: 'TAG',
    text: 'TAG',
    operators: [
      {
        text: 'INCLUDE',
        value: 'CONTAIN',
      },
      {
        text: 'EXCLUDE',
        value: 'NOT_CONTAIN',
      },
    ],
  },
  TYPE: {
    value: 'TYPE',
    text: 'TYPE',
    operators: [
      {
        value: 'IS',
        text: 'IS',
      },
      {
        value: 'IS_NOT',
        text: 'ISNOT',
      },
    ],
    values: [
      {
        value: 'CONNECTED',
        text: 'LINKED',
      },
      {
        value: 'NOT_TAGGED',
        text: 'NO TAGS',
      },
      {
        value: 'LINKED',
        text: 'HAS LINKS',
      },
      {
        value: 'IMAGED',
        text: 'HAS IMAGES',
      },
    ],
  },
  TEXT: {
    value: 'TEXT',
    text: 'TEXT',
    operators: [
      {
        value: 'CONTAIN',
        text: 'INCLUDE',
      },
      {
        value: 'NOT_CONTAIN',
        text: 'EXCLUDE',
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
    const {relation} = f;
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
    value: {operator, value},
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
  }

  return shouldShow;
};
