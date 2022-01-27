import {useContext} from 'react';
import appContext from '../stores/appContext';
import {locationService} from '../services';
import {memoSpecialTypes} from '../helpers/filter';
import '../less/search-bar.less';
import React from 'react';
import search from '../icons/search.svg';
import { t } from '../translations/helper';
// import useToggle from "../hooks/useToggle";

interface Props {}

export let searchBoxInput: HTMLInputElement;
// let isSearchBar = false as boolean;

const SearchBar: React.FC<Props> = () => {
  const {
    locationState: {
      query: {type: memoType},
    },
  } = useContext(appContext);
  // const [isSearchBarShown, toggleSearchbar] = useToggle(false);

  const handleMemoTypeItemClick = (type: MemoSpecType | '') => {
    const {type: prevType} = locationService.getState().query;
    if (type === prevType) {
      type = '';
    }
    locationService.setMemoTypeQuery(type);
  };

  const handleTextQueryInput = (event: React.FormEvent<HTMLInputElement>) => {
    const text = event.currentTarget.value;
    locationService.setTextQuery(text);
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
        <img className="icon-img" src={search} />
        <input className="text-input" type="text" placeholder="" onChange={handleTextQueryInput} />
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
                      }}>
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
