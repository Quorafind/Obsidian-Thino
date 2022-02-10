import {moment} from 'obsidian';
import {getDailyNoteSettings} from 'obsidian-daily-notes-interface';
import {AddBlankLineWhenDate, ShowDate, ShowTime, DefaultMemoComposition} from '../memos';

export const getMemosByDate = (memos: Model.Memo[]) => {
  const dataArr = [] as any[];
  memos.map((mapItem) => {
    if (dataArr.length == 0) {
      dataArr.push({date: moment(mapItem.createdAt, 'YYYY/MM/DD HH:mm:ss').format('YYYY-MM-DD'), have: [mapItem]});
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
        dataArr.push({date: moment(mapItem.createdAt, 'YYYY/MM/DD HH:mm:ss').format('YYYY-MM-DD'), have: [mapItem]});
      }
    }
  });

  return dataArr;
};

export const transferMemosIntoText = (dailyMemos: Array<any>): string => {
  let outputText = '' as string;
  let dataArr = [] as any[];
  let indent = '' as string;
  const {format} = getDailyNoteSettings();
  dailyMemos.map((mapItem) => {
    dataArr = mapItem.have;
    if (ShowDate) {
      outputText = outputText + '- [[' + moment(mapItem.date, 'YYYY-MM-DD').format(format) + ']]\n';
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
          // if (/<br>/g.test(dataArr[i].content)) {
          //   const formatedContent = dataArr[i].content.replace(/<br>/g, '\n    ');
          //   outputText = outputText + indent + '- ' + time + ' ' + formatedContent + '\n';
          // } else {
          outputText = outputText + indent + '- ' + formatContent + '\n';
          // }
        } else {
          if (dataArr[i].memoType === 'TASK-TODO') {
            // if (/<br>/g.test(dataArr[i].content)) {
            //   const formatedContent = dataArr[i].content.replace(/<br>/g, '\n    ');
            //   outputText = outputText + indent + '- [ ] ' + time + ' ' + formatedContent + '\n';
            // } else {
            outputText = outputText + indent + '- [ ] ' + formatContent + '\n';
            // }
          } else if (dataArr[i].memoType === 'TASK-DONE') {
            // if (/<br>/g.test(dataArr[i].content)) {
            //   const formatedContent = dataArr[i].content.replace(/<br>/g, '\n    ');
            //   outputText = outputText + indent + '- [x] ' + time + ' ' + formatedContent + '\n';
            // } else {
            outputText = outputText + indent + '- [x] ' + formatContent + '\n';
            // }
          } else {
            const taskMark = dataArr[i].memoType.match(/TASK-(.*)?/g)[1];
            // if (/<br>/g.test(dataArr[i].content)) {
            //   const formatedContent = dataArr[i].content.replace(/<br>/g, '\n    ');
            //   outputText = outputText + indent + '- [' + taskMark + '] ' + time + ' ' + formatedContent + '\n';
            // } else {
            outputText = outputText + indent + '- [' + taskMark + '] ' + formatContent + '\n';
            // }
          }
        }
      }
    } else {
      for (let i = 0; i < dataArr.length; i++) {
        // const time = moment(dataArr[i].createdAt, 'YYYY/MM/DD HH:mm:ss').format('HH:mm');
        if (dataArr[i].memoType === 'JOURNAL') {
          // if (/<br>/g.test(dataArr[i].content)) {
          //   const formatedContent = dataArr[i].content.replace(/<br>/g, '\n    ');
          //   outputText = outputText + indent + '- ' + formatedContent + '\n';
          // } else {
          outputText = outputText + indent + '- ' + dataArr[i].content + '\n';
          // }
        } else {
          if (dataArr[i].memoType === 'TASK-TODO') {
            // if (/<br>/g.test(dataArr[i].content)) {
            //   const formatedContent = dataArr[i].content.replace(/<br>/g, '\n    ');
            //   outputText = outputText + indent + '- [ ] ' + formatedContent + '\n';
            // } else {
            outputText = outputText + indent + '- [ ] ' + dataArr[i].content + '\n';
            // }
          } else if (dataArr[i].memoType === 'TASK-DONE') {
            // if (/<br>/g.test(dataArr[i].content)) {
            //   const formatedContent = dataArr[i].content.replace(/<br>/g, '\n    ');
            //   outputText = outputText + indent + '- [x] ' + formatedContent + '\n';
            // } else {
            outputText = outputText + indent + '- [x] ' + dataArr[i].content + '\n';
            // }
          } else {
            const taskMark = dataArr[i].memoType.match(/TASK-(.*)?/g)[1];
            // if (/<br>/g.test(dataArr[i].content)) {
            //   const formatedContent = dataArr[i].content.replace(/<br>/g, '\n    ');
            //   outputText = outputText + indent + '- [' + taskMark + '] ' + formatedContent + '\n';
            // } else {
            outputText = outputText + indent + '- [' + taskMark + '] ' + dataArr[i].content + '\n';
            // }
          }
        }
      }
    }
    if (ShowDate && AddBlankLineWhenDate) {
      outputText = outputText + '\n';
    }
  });
  const removeBrContent = outputText.replace(/<br>/g, '\n    ');
  return removeBrContent;
};
