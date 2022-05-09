import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { fetchData, fetchDataExtendedUrl } from '../api/fetch';
//import { ContextApp, initData, reducer } from '../reducer/reducer';
import { AppContext, Ad, Page } from '../utils/context';
import { setProposalsList, setCitiesList, setPage } from '../utils/reducer';
import { getCurrencyVal, getStringDate, formatAmount } from '../utils/proposalFormat';
import { findCity } from '../utils/search';
import HeadMenu from '../components/HeadMenu';
import Footer from '../components/Footer';
import LoaderCash from '../components/LoaderCash';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import '../styles/Main.scss';
import '../styles/Logo.scss';
//Иконки
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import PaymentsIcon from '@mui/icons-material/Payments';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SearchIcon from '@mui/icons-material/Search';
import SearchParamsIcon from '../icons/SearchParamsIcon';

function Main() {
    const { state, dispatch } = useContext(AppContext);
    const [proposalList, setProposalList] = useState<Array<Ad>>([]);
    const [loadDataState, setLoadDataState] = useState(false);
    const [curFilter, setCurFilter] = useState<Array<any>>(new Array(4).fill(true));
    const [searchAmount, setSearchAmount] = useState<number>(100);
    const [searchCity, setSearchCity] = useState<string>('');
    const [cityList, setCityList] = useState<Array<any>>(state.cityList);
    const [locationHint, setLocationHint] = useState<Array<any>>([]);
    const [sortBy, setSortBy] = useState(0);
    const [searchParamsQueryFinished, setSearchParamsQueryFinished] = useState<boolean>(true);
    const [switchPageState, setSwitchPageState] = useState<boolean>(false);
    const [searchedByParams, setSearchedByParams] = useState<boolean>(false);
    const [searchParamsForm, setSearchParamsForm] = useState(false);
    const navigate = useNavigate();
    const muiElSize = "small";
    let search: any = useLocation().search;
    const pageState = new URLSearchParams(search).get('type');
    const adsPerPage: number = 15;//Кол-во объявлений на странице

    useEffect(() => {
        if(pageState && pageState === "refresh"){
            if(!loadDataState){
                const sortFilter = sortBy ? 'currency': 'date';
                fetchDataExtendedUrl('getProposals', null, `?page=${state.page.current}&sortby=${sortFilter}`).then((r: any) => {  
                    if (r.isSucces){
                        console.log('load p from server');
                        let newPage: Page = {current: r.data.meta.page, total: r.data.meta.total, isset: true};
                        setProposalList(r.data.data);
                        dispatch(setProposalsList(r.data.data));
                        dispatch(setPage(newPage));
                    }
                    setLoadDataState(true);
                }).catch((err) => {
                    console.log(err);
                });
            };
        }
        else {
            if (!loadDataState){
                if (state.proposalsList.length) {
                    console.log('load p from state')
                    setProposalList(state.proposalsList);
                    setLoadDataState(true);
                }
                else {
                    const sortFilter = sortBy ? 'currency': 'date';
                    fetchDataExtendedUrl('getProposals', null, `?page=${state.page.current}&sortby=${sortFilter}`).then((r: any) => {  
                        if (r.isSucces){
                            console.log('load p from server');
                            let newPage: Page = {current: r.data.meta.page, total: r.data.meta.total, isset: true};
                            setProposalList(r.data.data);
                            dispatch(setProposalsList(r.data.data));
                            dispatch(setPage(newPage));
                        }
                        setLoadDataState(true);
                    }).catch((err) => {
                        console.log(err);
                    });
                };
            };
        };
        //Получить список городов, если его нет
        if (!state.cityList.length){
            fetchData('getCityList').then((r: any) => {
                console.log('fetching citylist')
                if (r.isSucces){
                    console.log(r.data.list);
                    setCityList(r.data.list);
                    dispatch(setCitiesList(r.data.list));
                };
            }).catch((err) => {
                console.log(err);
            });
        }
    }, [loadDataState, cityList]);

    const onChangeCurFilter = (i: number) => {
        let newVals = curFilter.slice();
        newVals[i] = newVals[i] ? false: true;
        setCurFilter(newVals);
    }
    const onChangeSearchAmount = (e: any) => {
        let amount = Number(e.target.value);
        amount = amount > 0 ? amount: 1;
        setSearchAmount(amount);
        //setTimeout(onApplySearchParams, 500);
    };
    const onChangeSearchCity = (e: any) => {
        let city = e.target.value;
        setSearchCity(city);
        setLocationHint(findCity(city, cityList));
        //setTimeout(onApplySearchParams, 500);
    }
    const onHintClick = (l: string) => {
        setSearchCity(l);
        setLocationHint([]);
    };
    const onSearchClick = () => {
        setSearchParamsQueryFinished(false);
        if (!searchedByParams) setSearchedByParams(true);
        let curVal: string = JSON.stringify(curFilter);
        const sortFilter = sortBy ? 'currency': 'date';
        fetchData('searchByParams', {currency: curVal, amount: searchAmount, location: searchCity, sortby: sortFilter, page: 1}).then((r: any) => {
            if (r.isSucces){
                if (r.data.status === 200) {
                    let newPage: Page = {current: r.data.meta.page, total: r.data.meta.total, isset: true};
                    setProposalList(r.data.data);
                    dispatch(setProposalsList(r.data.data));
                    dispatch(setPage(newPage));
                }
                else if (r.data.status === 404){
                    let newPage: Page = {current: 1, total: 1, isset: true};
                    setProposalList([]);
                    dispatch(setProposalsList([]));
                    dispatch(setPage(newPage));
                };
            };
            setSearchParamsQueryFinished(true);
            setSearchParamsForm(false);
        }).catch((err) => {
            console.log(err);
            setSearchParamsQueryFinished(true);
            setSearchParamsForm(false);
        });
    };
    const onChangeSortBy = (e: any) => {
        const newSort = e.target.value;
        setSwitchPageState(true);
        setSortBy(newSort);
        const sortFilter = newSort ? 'currency': 'date';
        console.log(`Sort by: ${sortFilter}`);
        //Если все объявления помещаются на 1 страницу, сортируем имеющиеся
        if (state.page.total <= adsPerPage){
            let pArray = proposalList.slice();
            let sortFunc = newSort ? (a: any, b: any) => {
                if (a.exchangeRate > b.exchangeRate) return 1;
                else if (a.exchangeRate === b.exchangeRate) return 0;
                else return -1;
            }
            : (a: any, b: any) => {
                if (a.date < b.date) return 1;
                else if (a.date === b.date) return 0;
                else return -1;
            };
            pArray.sort(sortFunc);
            setProposalList(pArray);
            dispatch(setProposalsList(pArray));
            setSwitchPageState(false);
        }
        //Иначе получаем данные с сервера
        else {
            //Если заданы параметры для поиска
            if (searchedByParams){
                let curVal: string = JSON.stringify(curFilter);
                fetchData('searchByParams', {currency: curVal, amount: searchAmount, location: searchCity, sortby: sortFilter, page: state.page.current}).then((r: any) => {
                    if (r.isSucces){
                        if (r.data.status === 200) {
                            let newPage: Page = {current: r.data.meta.page, total: r.data.meta.total, isset: true};
                            setProposalList(r.data.data);
                            dispatch(setProposalsList(r.data.data));
                            dispatch(setPage(newPage));
                        };
                    };
                    setSwitchPageState(false);
                }).catch((err) => {
                    console.log(err);
                    setSwitchPageState(false);
                });
            }
            else {
                fetchDataExtendedUrl('getProposals', null, `?page=${state.page.current}&sortby=${sortFilter}`).then((r: any) => {  
                    if (r.isSucces){
                        console.log('load p from server');
                        let newPage: Page = {current: r.data.meta.page, total: r.data.meta.total, isset: true};
                        setProposalList(r.data.data);
                        dispatch(setProposalsList(r.data.data));
                        dispatch(setPage(newPage));
                    }
                    setSwitchPageState(false);
                }).catch((err) => {
                    console.log(err);
                    setSwitchPageState(false);
                });
            };
        };
    };
    const onNavPageClick = (nav: string) => {
        setSwitchPageState(true);
        let page = Number(state.page.current);
        if (nav === "n") page += 1;
        else if (nav === "p") page -= 1;
        const sortFilter = sortBy ? 'currency': 'date';
        if (searchedByParams){
            let curVal: string = JSON.stringify(curFilter);
            fetchData('searchByParams', {currency: curVal, amount: searchAmount, location: searchCity, sortby: sortFilter, page: page}).then((r: any) => {
                if (r.isSucces){
                    if (r.data.status === 200) {
                        let newPage: Page = {current: r.data.meta.page, total: r.data.meta.total, isset: true};
                        setProposalList(r.data.data);
                        dispatch(setProposalsList(r.data.data));
                        dispatch(setPage(newPage));
                    }
                };
                setSwitchPageState(false);
            }).catch((err) => {
                console.log(err);
                setSwitchPageState(false);
            });
        }
        else {
            fetchDataExtendedUrl('getProposals', null, `?page=${page}&sortby=${sortFilter}`).then((r: any) => {  
                if (r.isSucces){
                    console.log(`On navPage click. Start fetching page ${page}`);
                    let newPage: Page = {current: r.data.meta.page, total: r.data.meta.total, isset: true};
                    setProposalList(r.data.data);
                    dispatch(setProposalsList(r.data.data));
                    dispatch(setPage(newPage));
                };
                setSwitchPageState(false);
            }).catch((err) => {
                console.log(err);
                setSwitchPageState(false);
            });
        };
    };
    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setSearchParamsForm(open);
    };
    let listingsBlock: any = null;
    let listingsMeta: any = null;
    let searchResultHeader: any = null;

    if (loadDataState || !searchParamsQueryFinished){
        if (proposalList.length > 0){
            listingsBlock = proposalList.map((p: any) => {
                return <div key={p.id} id={p.id} className='Single-proposal' onClick={() => navigate(`/proposals/${p.id}`)}>
                    <h4 className="Single-proposal-header">{p.location}</h4>
                    <div className="Single-proposal-body-wrapper">
                        <div className="In-row-left">
                            <PaymentsIcon className="Info-icon" fontSize="inherit"/> 
                            <span>От {formatAmount(p.amountMin)} до {formatAmount(p.amountMax)} {getCurrencyVal(p.currency)}</span>
                        </div>
                        <div className="In-row-left">
                            <CurrencyExchangeIcon className="Info-icon" fontSize="inherit"/> 
                            <span>1{getCurrencyVal(p.currency)} - {p.exchangeRate}₽</span>
                        </div>
                        <div className="In-row-left">
                            <CalendarMonthIcon className="Info-icon" fontSize="inherit"/> 
                            <span>{getStringDate(p.date)}</span>
                        </div>
                    </div>
                    <div className="Single-proposal-background-sign">
                    {getCurrencyVal(p.currency)}
                    </div>
                </div>;
            });
            listingsBlock = <div className="Main-proposals">{listingsBlock}</div>;
            let nextPage = (state.page.current * adsPerPage < state.page.total) ? 
                <div onClick={() => onNavPageClick('n')} className="Nav-page-link">
                    <div>Вперёд</div>
                    <NavigateNextIcon />
                </div>: <div></div>;
            let prevPage = (state.page.current * adsPerPage > adsPerPage) ? 
                <div onClick={() => onNavPageClick('p')} className="Nav-page-link">
                    <NavigateBeforeIcon />
                    <div>Назад</div>
                </div>: <div></div>;
            listingsMeta = <div>
                    <div className="Nav-page-wrapper">
                        {prevPage}
                        {nextPage}</div>
                </div>;
            searchResultHeader = <div className="Main-select-wrapper">
                <div className="Proposal-counter">Найдено {state.page.total} предложений(ие)</div>
                <div>
                    <FormControl size="small" className="Filter-select">
                        <InputLabel id="sort-proposals-by-label" sx={{color: "#fff"}}>Сначала</InputLabel>
                        <Select
                            labelId="sort-proposals-by-label"
                            id="sort-proposals-by"
                            value={sortBy}
                            label="Сначала"
                            onChange={onChangeSortBy}
                            >
                            <MenuItem value={0}>самые свежие</MenuItem>
                            <MenuItem value={1}>лучший курс</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>;
        }
        else {
            listingsBlock = <div className="Main-proposals-center-wrapper"><p className="No-proposals">Предложений нет</p></div>;
        }
    }
    else listingsBlock = <div className="Main-proposals-center-wrapper">
            <Box className="Circular-loader-wrapper">
                <CircularProgress className="Standart-circular-loader"/>
            </Box>
        </div>;
    
    let locationHintBlock = null;
    if (locationHint.length){
        const hintList = locationHint.map((l, i) => {
            return <li key={`hint-li-${i}`} onClick={() => onHintClick(l)}>{l}</li>;
        });
        locationHintBlock = <div><ul className="City-list-hint-main">{hintList}</ul></div>;
    }
    const curFilterInput = curFilter.map((c, i) => {
        return <div key={`input-wrapper-${i}`}>
                    <Checkbox id={`currency-checkbox-${i}`} value={i} checked={curFilter[i]} onChange={() => onChangeCurFilter(i)} className="Checkbox-currency"/>
                    <label htmlFor={`currency-checkbox-${i}`} className="Label-currency">{getCurrencyVal(i)}</label>
                </div>;
    });
    const searchParamsButton = searchParamsQueryFinished ? 
        <Button variant="contained" onClick={onSearchClick} startIcon={<SearchIcon />}>Показать</Button>: 
        <Button variant="contained"  disabled><CircularProgress size="1em" color="primary" className="ButtonLoader" />Показать</Button>;
    return (
        <div className="App">
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={switchPageState}
            >
                <LoaderCash />
            </Backdrop>
            <HeadMenu />
            <div className="App-content-wrapper">
                <main className="MainContentWrapper">
                    <div className="Main-search-params-wrapper">
                        <div onClick={toggleDrawer(true)} className="Search-param-icon-wrapper">
                            <SearchParamsIcon iconClass="Search-param-icon" elClass="Search-param-icon-el"/>
                        </div>
                    </div>
                    <div className="Main-proposals-filter-wrapper">
                        {searchResultHeader}
                    </div>
                    <div className="Main-proposals-wrapper">
                        {listingsBlock}
                    </div>
                    <div className="Main-proposals-meta-wrapper">
                        {listingsMeta}
                    </div>
                </main>
                <Footer />
            </div>
            <SwipeableDrawer
                anchor="left"
                open={searchParamsForm}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
                >
                <div className="Main-search-params-aside">
                    <h4>Мне нужны</h4>
                    <div className="Currency-types-wrapper">
                        {curFilterInput}
                    </div>
                    <div>
                        <TextField
                            size="small"
                            id="currency-amount-input"
                            label="Сумма"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={onChangeSearchAmount}
                            className="Search-input-el"
                            value={searchAmount}
                            />
                    </div>
                    <div>
                        <TextField size={muiElSize} id="city-search" label="Город" type="search" value={searchCity}
                        onChange={onChangeSearchCity} color="primary" className="Search-input-el" autoComplete="off"/>
                    </div>
                    {locationHintBlock}
                    {searchParamsButton}
                </div>
          </SwipeableDrawer>
        </div>
    );
}

export default Main;