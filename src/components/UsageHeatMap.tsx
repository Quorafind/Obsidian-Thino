import {useCallback, useContext, useEffect, useRef} from 'react';
import useState from 'react-usestateref';
import appContext from '../stores/appContext';
import {dailyNotesService, globalStateService, locationService} from '../services';
import {DAILY_TIMESTAMP} from '../helpers/consts';
import utils from '../helpers/utils';
import '../less/usage-heat-map.less';
import React from 'react';
import {moment, Platform} from 'obsidian';
import {t} from '../translations/helper';
import {getDailyNote} from 'obsidian-daily-notes-interface';

const tableConfig = {
  width: 12,
  height: 7,
};

const getInitialUsageStat = (usedDaysAmount: number, beginDayTimestamp: number): DailyUsageStat[] => {
  const initialUsageStat: DailyUsageStat[] = [];
  for (let i = 1; i <= usedDaysAmount; i++) {
    initialUsageStat.push({
      timestamp: parseInt(moment(beginDayTimestamp).add(i, 'days').format('x')),
      count: 0,
    });
  }
  return initialUsageStat;
};

interface DailyUsageStat {
  timestamp: number;
  count: number;
}

// interface FromTo {
//   begin: string;
// }

interface Props {}

// let FromTo: string = '';

const UsageHeatMap: React.FC<Props> = () => {
  const todayTimeStamp = utils.getDateStampByDate(moment().format('YYYY-MM-DD HH:mm:ss'));
  const todayDay = new Date(todayTimeStamp).getDay() || 7;
  const nullCell = new Array(7 - todayDay).fill(0);
  const usedDaysAmount = (tableConfig.width - 1) * tableConfig.height + todayDay;
  const beginDayTimestamp = utils.getDateStampByDate(todayTimeStamp - usedDaysAmount * DAILY_TIMESTAMP);
  const startDate = moment().subtract(usedDaysAmount, 'days').endOf('day');

  const {
    memoState: {memos},
  } = useContext(appContext);
  const [allStat, setAllStat] = useState<DailyUsageStat[]>(getInitialUsageStat(usedDaysAmount, beginDayTimestamp));
  const [popupStat, setPopupStat] = useState<DailyUsageStat | null>(null);
  const [currentStat, setCurrentStat] = useState<DailyUsageStat | null>(null);
  const [fromTo, setFromTo, fromToRef] = useState('');
  const containerElRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  // const newFromTo = {
  //   begin: "from",
  // } as FromTo;

  useEffect(() => {
    const newStat: DailyUsageStat[] = getInitialUsageStat(usedDaysAmount, beginDayTimestamp);
    for (const m of memos) {
      const creationDate = moment(m.createdAt.replaceAll('/', '-'));
      const index = creationDate.diff(startDate, 'days');
      // const index = (utils.getDateStampByDate(m.createdAt) - beginDayTimestamp) / (1000 * 3600 * 24) - 1;
      // if(index != newStat.length) { }
      if (index >= 0 && index < newStat.length) {
        newStat[index].count += 1;
      }
    }
    setAllStat([...newStat]);
  }, [memos]);

  const handleUsageStatItemMouseEnter = useCallback((event: React.MouseEvent, item: DailyUsageStat) => {
    setPopupStat(item);
    if (!popupRef.current) {
      return;
    }

    const {isMobileView} = globalStateService.getState();
    const targetEl = event.target as HTMLElement;
    const sidebarEl = document.querySelector('.memos-sidebar-wrapper') as HTMLElement;
    popupRef.current.style.left = targetEl.offsetLeft - (containerElRef.current?.offsetLeft ?? 0) + 'px';
    let topValue = targetEl.offsetTop;
    if (!isMobileView) {
      topValue -= sidebarEl.scrollTop;
    }
    popupRef.current.style.top = topValue + 'px';
  }, []);

  const handleUsageStatItemMouseLeave = useCallback(() => {
    setPopupStat(null);
  }, []);

  const handleUsageStatItemClick = useCallback((event: React.MouseEvent, item: DailyUsageStat) => {
    if (
      locationService.getState().query.duration?.from === item.timestamp &&
      moment(locationService.getState().query.duration?.from).diff(
        locationService.getState().query.duration?.to,
        'day',
      ) == 0
    ) {
      locationService.setFromAndToQuery(0, 0);
      setCurrentStat(null);
      setFromTo(null);
    } else if (
      locationService.getState().query.duration?.from !== item.timestamp &&
      locationService.getState().query.duration?.from > 0 &&
      event.shiftKey
    ) {
      const timeStampDays = moment(item.timestamp)
        .endOf('day')
        .diff(locationService.getState().query.duration?.to, 'day');
      if (
        timeStampDays > 0 &&
        moment(locationService.getState().query.duration?.from).diff(
          locationService.getState().query.duration?.to,
          'day',
        ) == 0
      ) {
        setFromTo('from');
      } else if (
        timeStampDays < 0 &&
        moment(locationService.getState().query.duration?.from).diff(
          locationService.getState().query.duration?.to,
          'day',
        ) == 0
      ) {
        setFromTo('to');
      }
      if (moment(locationService.getState().query.duration?.from).isBefore(item.timestamp)) {
        if (fromToRef.current === 'to') {
          if (timeStampDays < 0) {
            locationService.setFromAndToQuery(item.timestamp, locationService.getState().query.duration?.to);
          } else {
            locationService.setFromAndToQuery(
              parseInt(moment(locationService.getState().query.duration?.to).startOf('day').format('x')),
              parseInt(moment(item.timestamp).endOf('day').format('x')),
            );
            setFromTo('from');
          }
        } else if (fromToRef.current === 'from') {
          if (timeStampDays < 0) {
            locationService.setFromAndToQuery(
              locationService.getState().query.duration?.from,
              parseInt(moment(item.timestamp).endOf('day').format('x')),
            );
          } else {
            locationService.setFromAndToQuery(
              locationService.getState().query.duration?.from,
              parseInt(moment(item.timestamp).endOf('day').format('x')),
            );
          }
        }
      } else {
        // const days = moment(locationService.getState().query.duration?.from).diff(locationService.getState().query.duration?.to, 'day');
        if (fromToRef.current === 'to') {
          locationService.setFromAndToQuery(item.timestamp, locationService.getState().query.duration?.to);
        } else if (fromToRef.current === 'from') {
          locationService.setFromAndToQuery(
            item.timestamp,
            parseInt(moment(locationService.getState().query.duration?.from).endOf('day').format('x')),
          );
          setFromTo('to');
        }
      }
    } else if (locationService.getState().query.duration?.from === 0 && event.shiftKey) {
      locationService.setFromAndToQuery(item.timestamp, parseInt(moment().endOf('day').format('x')));
    } else if (item.count > 0 && (event.ctrlKey || event.metaKey)) {
      const {app, dailyNotes} = dailyNotesService.getState();

      const file = getDailyNote(moment(item.timestamp), dailyNotes);
      if (!Platform.isMobile) {
        const leaf = app.workspace.splitActiveLeaf();
        leaf.openFile(file);
      } else {
        let leaf = app.workspace.activeLeaf;
        if (leaf === null) {
          leaf = app.workspace.getLeaf(true);
        }
        leaf.openFile(file);
      }
    } else if (item.count > 0 && !event.shiftKey && !event.ctrlKey && !event.metaKey) {
      if (!['/', '/recycle'].includes(locationService.getState().pathname)) {
        locationService.setPathname('/');
      }
      locationService.setFromAndToQuery(
        item.timestamp,
        utils.getTimeStampByDate(
          moment(item.timestamp + DAILY_TIMESTAMP)
            .subtract(1, 'days')
            .endOf('day')
            .format('YYYY-MM-DD HH:mm:ss'),
        ),
      );
      setCurrentStat(item);
    }
  }, []);

  return (
    <div className="usage-heat-map-wrapper" ref={containerElRef}>
      <div className="day-tip-text-container">
        <span className="tip-text">{t('weekDaysShort')[0]}</span>
        <span className="tip-text"></span>
        <span className="tip-text">{t('weekDaysShort')[2]}</span>
        <span className="tip-text"></span>
        <span className="tip-text">{t('weekDaysShort')[4]}</span>
        <span className="tip-text"></span>
        <span className="tip-text">{t('weekDaysShort')[6]}</span>
      </div>

      {/* popup */}
      <div ref={popupRef} className={'usage-detail-container pop-up ' + (popupStat ? '' : 'hidden')}>
        {popupStat?.count} memos on{' '}
        <span className="date-text">{new Date(popupStat?.timestamp as number).toDateString()}</span>
      </div>

      <div className="usage-heat-map">
        {allStat.map((v, i) => {
          const count = v.count;
          const colorLevel =
            count <= 0
              ? ''
              : count <= 1
              ? 'stat-day-L1-bg'
              : count <= 2
              ? 'stat-day-L2-bg'
              : count <= 4
              ? 'stat-day-L3-bg'
              : 'stat-day-L4-bg';

          return (
            <span
              className={`stat-container ${colorLevel} ${currentStat === v ? 'current' : ''} ${
                todayTimeStamp === v.timestamp ? 'today' : ''
              }`}
              key={i}
              onMouseEnter={(e) => handleUsageStatItemMouseEnter(e, v)}
              onMouseLeave={handleUsageStatItemMouseLeave}
              onClick={(e) => handleUsageStatItemClick(e, v)}
            ></span>
          );
        })}
        {nullCell.map((v, i) => (
          <span className="stat-container null" key={i}></span>
        ))}
      </div>
    </div>
  );
};

export default UsageHeatMap;
