import { moment, Notice, TFile } from 'obsidian';
import { createDailyNote } from 'obsidian-daily-notes-interface';
import { getDailyNoteSettings } from '_obsidian-daily-notes-interface@0.9.4@obsidian-daily-notes-interface';
import { t } from '../translations/helper';
import { UseDailyOrPeriodic } from '../memos';

namespace utils {
  export function getNowTimeStamp(): number {
    return parseInt(moment().format('x'));
  }

  export function getOSVersion(): 'Windows' | 'MacOS' | 'Linux' | 'Unknown' {
    const appVersion = navigator.userAgent;
    let detectedOS: 'Windows' | 'MacOS' | 'Linux' | 'Unknown' = 'Unknown';

    if (appVersion.indexOf('Win') != -1) {
      detectedOS = 'Windows';
    } else if (appVersion.indexOf('Mac') != -1) {
      detectedOS = 'MacOS';
    } else if (appVersion.indexOf('Linux') != -1) {
      detectedOS = 'Linux';
    }

    return detectedOS;
  }

  export function getTimeStampByDate(t: Date | number | string): number {
    if (typeof t === 'string') {
      t = t.replaceAll('-', '/');
    }
    return new Date(t).getTime();
  }

  export function getDateStampByDate(t: Date | number | string): number {
    const d = new Date(getTimeStampByDate(t));
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  }

  export function getDateString(t: Date | number | string): string {
    const d = new Date(getTimeStampByDate(t));

    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const date = d.getDate();

    return `${year}/${month}/${date}`;
  }

  export function getTimeString(t: Date | number | string): string {
    const d = new Date(getTimeStampByDate(t));

    const hours = d.getHours();
    const mins = d.getMinutes();

    const hoursStr = hours < 10 ? '0' + hours : hours;
    const minsStr = mins < 10 ? '0' + mins : mins;

    return `${hoursStr}:${minsStr}`;
  }

  // For example: 2021-4-8 17:52:17
  export function getDateTimeString(t: Date | number | string): string {
    const d = new Date(getTimeStampByDate(t));

    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const date = d.getDate();
    const hours = d.getHours();
    const mins = d.getMinutes();
    const secs = d.getSeconds();

    const monthStr = month < 10 ? '0' + month : month;
    const dateStr = date < 10 ? '0' + date : date;
    const hoursStr = hours < 10 ? '0' + hours : hours;
    const minsStr = mins < 10 ? '0' + mins : mins;
    const secsStr = secs < 10 ? '0' + secs : secs;
    // const secsStr = '00';

    return `${year}/${monthStr}/${dateStr} ${hoursStr}:${minsStr}:${secsStr}`;
  }

  export function dedupe<T>(data: T[]): T[] {
    return Array.from(new Set(data));
  }

  export function dedupeObjectWithId<T extends { id: string }>(data: T[]): T[] {
    const idSet = new Set<string>();
    const result = [];

    for (const d of data) {
      if (!idSet.has(d.id)) {
        idSet.add(d.id);
        result.push(d);
      }
    }

    return result;
  }

  export function debounce(fn: FunctionType, delay: number) {
    let timer: number | null = null;

    return () => {
      if (timer) {
        clearTimeout(timer);
        timer = setTimeout(fn, delay);
      } else {
        timer = setTimeout(fn, delay);
      }
    };
  }

  export function debouncePlus(fn: FunctionType, delay: number, immdiate = false, resultCallback) {
    let timer: number = null;
    let isInvoke = false;

    function _debounce(...arg: any[]) {
      if (timer) clearTimeout(timer);
      if (immdiate && !isInvoke) {
        const result = fn.apply(this, arg);
        if (resultCallback && typeof resultCallback === 'function') resultCallback(result);
        isInvoke = true;
      } else {
        timer = setTimeout(() => {
          const result = fn.apply(this, arg);
          if (resultCallback && typeof resultCallback === 'function') resultCallback(result);
          isInvoke = false;
          timer = null;
        }, delay);
      }
    }

    console.log('hi');

    _debounce.cancel = function () {
      if (timer) clearTimeout(timer);
      timer = null;
      isInvoke = false;
    };

    return _debounce;
  }

  export function throttle(fn: FunctionType, delay: number) {
    let valid = true;

    return () => {
      if (!valid) {
        return false;
      }
      valid = false;
      setTimeout(() => {
        fn();
        valid = true;
      }, delay);
    };
  }

  export function transformObjectToParamsString(object: KVObject): string {
    const params = [];
    const keys = Object.keys(object).sort();

    for (const key of keys) {
      const val = object[key];
      if (val) {
        if (typeof val === 'object') {
          params.push(...transformObjectToParamsString(val).split('&'));
        } else {
          params.push(`${key}=${val}`);
        }
      }
    }

    return params.join('&');
  }

  export function transformParamsStringToObject(paramsString: string): KVObject {
    const object: KVObject = {};
    const params = paramsString.split('&');

    for (const p of params) {
      const [key, val] = p.split('=');
      if (key && val) {
        object[key] = val;
      }
    }

    return object;
  }

  export function filterObjectNullKeys(object: KVObject): KVObject {
    if (!object) {
      return {};
    }

    const finalObject: KVObject = {};
    const keys = Object.keys(object).sort();

    for (const key of keys) {
      const val = object[key];
      if (typeof val === 'object') {
        const temp = filterObjectNullKeys(JSON.parse(JSON.stringify(val)));
        if (temp && Object.keys(temp).length > 0) {
          finalObject[key] = temp;
        }
      } else {
        if (val) {
          finalObject[key] = val;
        }
      }
    }

    return finalObject;
  }

  export async function copyTextToClipboard(text: string) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
      } catch (error: unknown) {
        console.warn('Copy to clipboard failed.', error);
      }
    } else {
      console.warn('Copy to clipboard failed, methods not supports.');
    }
  }

  export function getImageSize(src: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve) => {
      const imgEl = new Image();

      imgEl.onload = () => {
        const { width, height } = imgEl;

        if (width > 0 && height > 0) {
          resolve({ width, height });
        } else {
          resolve({ width: 0, height: 0 });
        }
      };

      imgEl.onerror = () => {
        resolve({ width: 0, height: 0 });
      };

      imgEl.className = 'hidden';
      imgEl.src = src;
      document.body.appendChild(imgEl);
      imgEl.remove();
    });
  }

  export async function createDailyNoteCheck(date: any): Promise<TFile> {
    let file;

    if (window.app.plugins?.getPlugin('periodic-notes')?.calendarSetManager.getActiveConfig('day')?.enabled) {
      const periodicNotes = window.app.plugins.getPlugin('periodic-notes');
      file = await periodicNotes.createPeriodicNote('day', date);
      return file;
    }

    file = await createDailyNote(date);
    return file;
  }
}

export function getDailyNoteFormat(): string {
  let dailyNoteFormat = '';

  let dailyNoteTempForPeriodicNotes = '';
  const folderFromPeriodicNotesNew = window.app.plugins
    .getPlugin('periodic-notes')
    ?.calendarSetManager?.getActiveConfig('day')?.folder;
  const folderFromPeriodicNotes = window.app.plugins.getPlugin('periodic-notes')?.settings?.daily?.format;

  if (folderFromPeriodicNotesNew === undefined) {
    dailyNoteTempForPeriodicNotes = folderFromPeriodicNotes;
  } else {
    dailyNoteTempForPeriodicNotes = folderFromPeriodicNotesNew;
  }
  switch (UseDailyOrPeriodic) {
    case 'Daily':
      dailyNoteFormat = getDailyNoteSettings().format || 'YYYY-MM-DD';
      break;
    case 'Periodic':
      dailyNoteFormat = dailyNoteTempForPeriodicNotes || 'YYYY-MM-DD';
      break;
    default:
      dailyNoteFormat = getDailyNoteSettings().format || 'YYYY-MM-DD';
      break;
  }
  if (dailyNoteFormat === '' || dailyNoteFormat === undefined) {
    new Notice(t("You didn't set format for daily notes in both periodic-notes and daily-notes plugins."));
  }
  return dailyNoteFormat;
  // if (window.app.plugins.getPlugin('periodic-notes')?.calendarSetManager?.getActiveConfig('day').enabled) {
  //   const periodicNotes = window.app.plugins.getPlugin('periodic-notes');
  //   dailyNoteFormat = periodicNotes.calendarSetManager.getActiveConfig('day').format || 'YYYY-MM-DD';
  //   return dailyNoteFormat;
  // }
  // if (window.app.plugins.getPlugin('periodic-notes')?.settings?.daily) {
  //   const dailyNotes = window.app.plugins.getPlugin('periodic-notes');
  //   dailyNoteFormat = dailyNotes.settings.daily.format || 'YYYY-MM-DD';
  //   return dailyNoteFormat;
  // }
  // const dailyNotesSetting = getDailyNoteSettings();
  // dailyNoteFormat = dailyNotesSetting.format;
  // return dailyNoteFormat;
}

export function getDailyNotePath(): string {
  let dailyNotePath = '';
  let dailyNoteTempForPeriodicNotes = '';
  const folderFromPeriodicNotesNew = window.app.plugins
    .getPlugin('periodic-notes')
    ?.calendarSetManager?.getActiveConfig('day')?.folder;
  const folderFromPeriodicNotes = window.app.plugins.getPlugin('periodic-notes')?.settings?.daily?.folder;

  if (folderFromPeriodicNotesNew === undefined) {
    dailyNoteTempForPeriodicNotes = folderFromPeriodicNotes;
  } else {
    dailyNoteTempForPeriodicNotes = folderFromPeriodicNotesNew;
  }
  switch (UseDailyOrPeriodic) {
    case 'Daily':
      dailyNotePath = getDailyNoteSettings().folder || '';
      break;
    case 'Periodic':
      dailyNotePath = dailyNoteTempForPeriodicNotes || '';
      break;
    default:
      dailyNotePath = getDailyNoteSettings().folder || '';
      break;
  }
  // console.log(window.app.plugins.getPlugin('periodic-notes'));
  // const periodicNotes = window.app.plugins.getPlugin('periodic-notes');
  // if (folderFromPeriodicNotesNew !== '' && folderFromPeriodicNotesNew !== undefined) {
  //   // const periodicNotes = window.app.plugins.getPlugin('periodic-notes');
  //   dailyNotePath = window.app.plugins.getPlugin('periodic-notes').calendarSetManager.getActiveConfig('day').folder;
  //   return dailyNotePath;
  // }
  // if (folderFromPeriodicNotes !== undefined && folderFromPeriodicNotes !== '') {
  //   // const dailyNotes = window.app.plugins.getPlugin('periodic-notes');
  //   dailyNotePath = window.app.plugins.getPlugin('periodic-notes').settings.daily.folder;
  //   // console.log(dailyNotePath);
  //   return dailyNotePath;
  // }
  // const dailyNotesSetting = getDailyNoteSettings();
  // dailyNotePath = dailyNotesSetting.folder;
  if (dailyNotePath === '' || dailyNotePath === undefined) {
    new Notice(t("You didn't set folder for daily notes in both periodic-notes and daily-notes plugins."));
  }
  return dailyNotePath;
}

export default utils;
