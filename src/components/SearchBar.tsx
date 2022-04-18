import React, { useContext } from 'react';
import { moment } from 'obsidian';
import appContext from '../stores/appContext';
import { locationService } from '../services';
import { memoSpecialTypes } from '../helpers/filter';
import '../less/search-bar.less';
import Search from '../icons/search.svg?component';
import { t } from '../translations/helper';
import useToggle from '../hooks/useToggle';

// import useToggle from "../hooks/useToggle";

interface Props {}

export let searchBoxInput: HTMLInputElement;
// let isSearchBar = false as boolean;

const SearchBar: React.FC<Props> = () => {
  const {
    locationState: {
      query: { type: memoType },
    },
  } = useContext(appContext);
  const [isSearchBarShow, toggleSearchbar] = useToggle(false);

  const handleMemoTypeItemClick = (type: MemoSpecType | '') => {
    const { type: prevType } = locationService.getState().query;
    if (type === prevType) {
      type = '';
    }
    locationService.setMemoTypeQuery(type);
  };

  const handleTextQueryInput = (event: React.FormEvent<HTMLInputElement>) => {
    const text = event.currentTarget.value;
    if (!text.contains(' -time: ')) {
      locationService.setTextQuery(text);
      return;
    }

    const time = text.split(' -time: ')[1];
    const times = time.length > 10 ? time.match(/\d{4}-\d{2}-\d{2}/g) : null;
    if (times === null || times === undefined) {
      locationService.setTextQuery(text.split(' -time: ')[0]);
      return;
    }
    if (times.length === 1) {
      const startMoment = moment(times[0]);
      locationService.setTimeQuery({
        from: startMoment.startOf('day').valueOf(),
        to: startMoment.endOf('day').valueOf(),
      });
    } else if (times.length === 2) {
      const startMoment = moment(times[0]);
      const endMoment = moment(times[1]);
      locationService.setTimeQuery({
        from: startMoment.startOf('day').valueOf(),
        to: endMoment.endOf('day').valueOf(),
      });
    }
    locationService.setTextQuery(text.split(' -time: ')[0]);
    return;
  };

  const mouseIn = () => {
    toggleSearchbar(true);
  };

  const mouseOut = () => {
    toggleSearchbar(false);
  };

  // const handleSearchBarStatus = () => {
  //   if(isSearchBar){
  //     isSearchBar = false;
  //     toggleSearchbar(false);
  //   }else{
  //     isSearchBar = true;
  //     toggleSearchbar(true);
  //   }
  // }

  return (
    // <div className={`${isSearchBarShown ? "search-bar-container-long" : "search-bar-container-short"}`}>
    //   <div className={`${isSearchBarShown ? "search-bar-inputer-long" : "search-bar-inputer-short"}`}>
    <div className="search-bar-container">
      <div className="search-bar-inputer">
        {/*<img className="icon-img" src={search} />*/}
        <Search className="icon-img" />
        <input
          className="text-input"
          type="text"
          onMouseOver={mouseIn}
          onMouseOut={mouseOut}
          placeholder={isSearchBarShow ? 'Type Here' : ''}
          onChange={handleTextQueryInput}
        />
      </div>
      <div className="quickly-action-wrapper">
        <div className="quickly-action-container">
          <p className="title-text">{t('Quick filter')}</p>
          <div className="section-container types-container">
            <span className="section-text">{t('TYPE')}:</span>
            <div className="values-container">
              {memoSpecialTypes.map((t, idx) => {
                return (
                  <div key={t.value}>
                    <span
                      className={`type-item ${memoType === t.value ? 'selected' : ''}`}
                      onClick={() => {
                        handleMemoTypeItemClick(t.value as MemoSpecType);
                      }}
                    >
                      {t.text}
                    </span>
                    {idx + 1 < memoSpecialTypes.length ? <span className="split-text">/</span> : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
