import {useCallback, useContext, useEffect, useRef, useState} from 'react';
import appContext from '../stores/appContext';
import {globalStateService, locationService} from '../services';
import {DAILY_TIMESTAMP} from '../helpers/consts';
import utils from '../helpers/utils';
import '../less/usage-heat-map.less';
import React from 'react';
import {moment} from 'obsidian';
import i18next from 'i18next';

const tableConfig = {
  width: 12,
  height: 7,
};

const getInitialUsageStat = (usedDaysAmount: number, beginDayTimestamp: number): DailyUsageStat[] => {
  const initialUsageStat: DailyUsageStat[] = [];
  for (let i = 1; i <= usedDaysAmount; i++) {
    initialUsageStat.push({
      timestamp: beginDayTimestamp + DAILY_TIMESTAMP * i,
      count: 0,
    });
  }
  return initialUsageStat;
};

interface DailyUsageStat {
  timestamp: number;
  count: number;
}

interface Props {}

const UsageHeatMap: React.FC<Props> = () => {
  const todayTimeStamp = utils.getDateStampByDate(Date.now());
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
  const containerElRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

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

  const handleUsageStatItemClick = useCallback((item: DailyUsageStat) => {
    if (locationService.getState().query.duration?.from === item.timestamp) {
      locationService.setFromAndToQuery(0, 0);
      setCurrentStat(null);
    } else if (item.count > 0) {
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
        <span className="tip-text">{i18next.t('weekDaysShort', {returnObjects: true})[0]}</span>
        <span className="tip-text"></span>
        <span className="tip-text">{i18next.t('weekDaysShort', {returnObjects: true})[2]}</span>
        <span className="tip-text"></span>
        <span className="tip-text">{i18next.t('weekDaysShort', {returnObjects: true})[4]}</span>
        <span className="tip-text"></span>
        <span className="tip-text">{i18next.t('weekDaysShort', {returnObjects: true})[6]}</span>
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
              onClick={() => handleUsageStatItemClick(v)}></span>
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
