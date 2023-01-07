import { moment } from 'obsidian';
import { AddBlankLineWhenDate, CommentOnMemos, DefaultMemoComposition, ShowDate, ShowTime } from '../memosView';
import { memoService } from '../services';
import utils, { getDailyNoteFormat } from '../helpers/utils';

export const getMemosByDate = (memos: Model.Memo[]) => {
  const dataArr = [] as any[];
  memos.map((mapItem) => {
    if (dataArr.length == 0) {
      dataArr.push({ date: moment(mapItem.createdAt, 'YYYY/MM/DD HH:mm:ss').format('YYYY-MM-DD'), have: [mapItem] });
    } else {
      const res = dataArr.some((item) => {
        //判断相同日期，有就添加到当前项
        if (item.date == moment(mapItem.createdAt, 'YYYY/MM/DD HH:mm:ss').format('YYYY-MM-DD')) {
          item.have.push(mapItem);
          return true;
        }
      });
      if (!res) {
        //如果没找相同日期添加一个新对象
        dataArr.push({ date: moment(mapItem.createdAt, 'YYYY/MM/DD HH:mm:ss').format('YYYY-MM-DD'), have: [mapItem] });
      }
    }
  });

  return dataArr;
};

export const getCommentMemos = (memos: Model.Memo) => {
  return memoService
    .getState()
    .commentMemos.filter((m) => m.linkId === memos.hasId)
    .sort((a, b) => utils.getTimeStampByDate(a.createdAt) - utils.getTimeStampByDate(b.createdAt))
    .map((m) => ({
      ...m,
      createdAtStr: utils.getDateTimeString(m.createdAt),
      dateStr: utils.getDateString(m.createdAt),
    }));
};

export const transferMemosIntoText = (memosArray: Array<any>): string => {
  let outputText = '' as string;
  let dataArr = [] as any[];
  let indent = '' as string;
  const dailyNotesformat = getDailyNoteFormat();
  memosArray.map((mapItem) => {
    dataArr = mapItem.have;
    if (ShowDate) {
      outputText = outputText + '- [[' + moment(mapItem.date, 'YYYY-MM-DD').format(dailyNotesformat) + ']]\n';
      indent = '    ';
    }
    if (ShowTime) {
      for (let i = 0; i < dataArr.length; i++) {
        const time = moment(dataArr[i].createdAt, 'YYYY/MM/DD HH:mm:ss').format('HH:mm');
        let formatContent;
        if (
          DefaultMemoComposition != '' &&
          /{TIME}/g.test(DefaultMemoComposition) &&
          /{CONTENT}/g.test(DefaultMemoComposition)
        ) {
          formatContent = DefaultMemoComposition.replace(/{TIME}/g, time).replace(/{CONTENT}/g, dataArr[i].content);
        } else {
          formatContent = time + ' ' + dataArr[i].content;
        }
        if (dataArr[i].memoType === 'JOURNAL') {
          outputText = outputText + indent + '- ' + formatContent + '\n';
        } else {
          if (dataArr[i].memoType === 'TASK-TODO') {
            outputText = outputText + indent + '- [ ] ' + formatContent + '\n';
          } else if (dataArr[i].memoType === 'TASK-DONE') {
            outputText = outputText + indent + '- [x] ' + formatContent + '\n';
          } else {
            const taskMark = dataArr[i].memoType.match(/TASK-(.*)?/g)[1];
            outputText = outputText + indent + '- [' + taskMark + '] ' + formatContent + '\n';
          }
        }
        outputText = outputText.replace(/ \^\S{6}/g, '');
        if (CommentOnMemos) {
          if (dataArr[i].hasId !== undefined) {
            const commentMemos = getCommentMemos(dataArr[i]);
            if (commentMemos.length > 0) {
              commentMemos.map((cm) => {
                let memoType = '- ';
                // console.log(cm.memoType);
                if (cm.memoType === 'TASK-TODO') {
                  memoType = '- [ ] ';
                } else if (cm.memoType === 'TASK-DONE') {
                  memoType = '- [x] ';
                } else if (cm.memoType.match(/TASK-(.*)?/g)) {
                  memoType = '- [' + cm.memoType.match(/TASK-(.*)?/g)[1] + '] ';
                }
                outputText =
                  outputText +
                  indent +
                  (ShowDate
                    ? '    ' + memoType + '[[' + moment(cm.createdAt).format(dailyNotesformat) + ']] '
                    : '    ' + memoType) +
                  moment(cm.createdAt).format('HH:mm') +
                  ' ' +
                  cm.content.replace(/comment:(.*)$/g, '').replace(/^\d{14}/g, '') +
                  '\n';
              });
            }
          }
        }
      }
    } else {
      for (let i = 0; i < dataArr.length; i++) {
        if (dataArr[i].memoType === 'JOURNAL') {
          outputText = outputText + indent + '- ' + dataArr[i].content + '\n';
        } else {
          if (dataArr[i].memoType === 'TASK-TODO') {
            outputText = outputText + indent + '- [ ] ' + dataArr[i].content + '\n';
          } else if (dataArr[i].memoType === 'TASK-DONE') {
            outputText = outputText + indent + '- [x] ' + dataArr[i].content + '\n';
          } else {
            const taskMark = dataArr[i].memoType.match(/TASK-(.*)?/g)[1];
            outputText = outputText + indent + '- [' + taskMark + '] ' + dataArr[i].content + '\n';
          }
        }
        outputText = outputText.replace(/ \^\S{6}/g, '');
        if (CommentOnMemos) {
          if (dataArr[i].hasId !== undefined) {
            const commentMemos = getCommentMemos(dataArr[i]);
            if (commentMemos.length > 0) {
              commentMemos.map((cm) => {
                let memoType = '- ';
                if (cm.memoType === 'TASK-TODO') {
                  memoType = '- [ ] ';
                } else if (cm.memoType === 'TASK-DONE') {
                  memoType = '- [x] ';
                } else if (cm.memoType.match(/TASK-(.*)?/g)) {
                  memoType = '- [' + cm.memoType.match(/TASK-(.*)?/g)[1] + '] ';
                }
                outputText =
                  outputText +
                  indent +
                  '    ' +
                  memoType +
                  cm.content.replace(/comment:(.*)$/g, '').replace(/^\d{14}/g, '') +
                  '\n';
              });
            }
          }
        }
      }
    }
    if (ShowDate && AddBlankLineWhenDate && !CommentOnMemos) {
      outputText = outputText + '\n';
    }
  });
  return outputText.replace(/<br>/g, '\n    ');
};
