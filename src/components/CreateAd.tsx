import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchData } from '../api/fetch';
import Footer from '../components/Footer';
//import { ContextApp, initData, reducer } from '../reducer/reducer';
import { AppContext } from '../utils/context';
import { setCitiesList } from '../utils/reducer';
import { getCurrencyVal } from '../utils/proposalFormat';
import { findCity } from '../utils/search';
import HeadMenu from '../components/HeadMenu';
import AccessDenied from './AccessDenied';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import '../styles/Edit.scss';
//Иконки
import AddIcon from '@mui/icons-material/Add';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

function CreateAd() {
    const {state, dispatch} = useContext(AppContext);
    const [location, setLocation] = useState<string>('');
    const [locationHint, setLocationHint] = useState<Array<any>>([]);
    const [minAmount, setMinAmount] = useState<number>(1);
    const [maxAmount, setMaxAmount] = useState<number>(1000);
    const [exchangeVal, setExchangeVal] = useState<number>(100);
    const [curType, setCurType] = useState<number>(0);
    const [errors, setErrors] = useState<Array<any>>([]);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [reqInProgress, setReqInProgress] = useState<number>(0);
    const navigate = useNavigate();
    const muiElSize = "small"; 
    
    useEffect(() => {
        if (!state.cityList.length){
            fetchData('getCityList').then((r: any) => {
                if (r.isSucces){
                    console.log('Get cities CreateAd');
                    dispatch(setCitiesList(r.data.list));
                }
            }).catch((err) => {
                console.log(err);
            });
        };
    }, [state.cityList]);

    const onChangeLocation = (e: any) => {
        const city = e.target.value;
        setTimeout(() => {
            if (city.length < 2) {
                let err = errors.find(e => e.type === 'invalidCityName');
                if (!err) {
                    let newErrors = errors.slice();
                    newErrors.push({type: 'invalidCityName', message: 'Название города должно быть длиннее 1 символа!'});
                    setErrors(newErrors);
                }
            }
            else {
                let errIndex = errors.findIndex(e => e.type === 'invalidCityName');
                if (errIndex !== -1){
                    let newErrors = errors.slice();
                    newErrors.splice(errIndex);
                    setErrors(newErrors);
                }
            }
        }, 500);
        setLocation(city);
        setLocationHint(findCity(city, state.cityList));
    };
    const onChangeMinAmount = (e: any) => {
        let amountVal = Number(e.target.value);
        setTimeout(() => {
            if (amountVal > maxAmount) {
                let err = errors.find(e => e.type === 'invalidAmountProportion');
                if (!err) {
                    let newErrors = errors.slice();
                    newErrors.push({type: 'invalidAmountProportion', message: 'Минимальная сумма не может быть больше максимальной!'});
                    setErrors(newErrors);
                }
            }
            else {
                let errIndex = errors.findIndex(e => e.type === 'invalidAmountProportion');
                if (errIndex !== -1){
                    let newErrors = errors.slice();
                    newErrors.splice(errIndex);
                    setErrors(newErrors);
                }
            }
        }, 500);
        amountVal = amountVal > 99999999 ? 99999999: amountVal;
        if (amountVal > 0) setMinAmount(amountVal);
        else setMinAmount(1);
    };
    const onChangeMaxAmount = (e: any) => {
        let amountVal = Number(e.target.value);
        setTimeout(() => {
            if (minAmount > amountVal) {
                let err = errors.find(e => e.type === 'invalidAmountProportion');
                if (!err) {
                    let newErrors = errors.slice();
                    newErrors.push({type: 'invalidAmountProportion', message: 'Минимальная сумма не может быть больше максимальной!'});
                    setErrors(newErrors);
                }
            }
            else {
                let errIndex = errors.findIndex(e => e.type === 'invalidAmountProportion');
                if (errIndex !== -1){
                    let newErrors = errors.slice();
                    newErrors.splice(errIndex);
                     setErrors(newErrors);
                }
            }
        }, 500);
        amountVal = amountVal > 99999999 ? 99999999: amountVal;
        if (amountVal > 0) setMaxAmount(amountVal);
        else setMaxAmount(1);
    };

    const onChangeExchange = (e: any) => {
        const ex = isNaN(Number(e.target.value)) ? 1 : Number(e.target.value);
        setTimeout(() => {
            if (ex < 1) {
                let err = errors.find(e => e.type === 'invalidExchangeVal');
                if (!err) {
                    let newErrors = errors.slice();
                    newErrors.push({type: 'invalidExchangeVal', message: 'Курс обмена валют должен быть выше 0!'});
                    setErrors(newErrors);
                }
            }
            else {
                let errIndex = errors.findIndex(e => e.type === 'invalidExchangeVal');
                if (errIndex !== -1){
                    let newErrors = errors.slice();
                    newErrors.splice(errIndex);
                    setErrors(newErrors);
                }
            }
        }, 500);
        setExchangeVal(ex);
    };

    const onSendAd = () => {
        let aToken: any = localStorage.getItem('aToken');
        aToken = aToken ? JSON.parse(aToken): null;
        const now = Date.now();
        if (aToken){
            if (aToken.expires > now){
                if ((location.length > 1) && (minAmount > 0) && (maxAmount > 0) && (minAmount <= maxAmount)) {
                    const body = {
                        token: aToken.token, 
                        currency: curType, 
                        amountMin: minAmount,
                        amountMax: maxAmount,
                        exchangeRate: exchangeVal,
                        location: location
                    };
                    setReqInProgress(1);
                    fetchData('createProposal', body).then((r: any) => {
                        if (r.isSucces){
                            if (r.data.status === 200){
                                let errIndex = errors.findIndex(e => e.type === 'badRequest');
                                if (errIndex !== -1){
                                    let newErrors = errors.slice();
                                    newErrors.splice(errIndex);
                                    setErrors(newErrors);
                                } 
                                setSuccessMessage('Объявление добавлено успешно!');
                                setReqInProgress(2);
                                setTimeout(() => {
                                    navigate('/?type=refresh');
                                }, 3000);
                            }
                            else if (r.data.status === 405){
                                let err = errors.find(e => e.type === 'adsLimit');
                                if (!err) {
                                    let newErrors = errors.slice();
                                    newErrors.push({type: 'adsLimit', message: r.data.message});
                                    setErrors(newErrors);
                                };
                                setReqInProgress(2);
                            };
                        }
                    }).catch((e) => {
                        console.log(e);
                        let err = errors.find(e => e.type === 'badRequest');
                        if (!err) {
                            let newErrors = errors.slice();
                            newErrors.push({type: 'badRequest', message: `Ошибка создания объявления: ${e.message}`});
                            setErrors(newErrors);
                        }
                        setReqInProgress(2);
                    });
                }
            };
        };
    };
    
    let cityListBlock = null;
    if (locationHint.length){
        const list = locationHint.map((l, i) => {
            return <li key={i} onClick={() => {
                let errIndex = errors.findIndex(e => e.type === 'invalidCityName');
                if (errIndex !== -1){
                    let newErrors = errors.slice();
                    newErrors.splice(errIndex);
                    setErrors(newErrors);
                };
                setLocation(l); 
                setLocationHint([]);
            }}>{l}</li>;
        });
        cityListBlock = <div className="City-list-wrapper"><ul className="City-list-hint">{list}</ul></div>;
    };
    let errList = null;
    if (errors.length) {
        errList = errors.map((e, i) => {
            return <Alert severity="error" key={e.type} className="Alert-wrapper">{e.message}</Alert>;
        });
        errList = <Stack spacing={1}>{errList}</Stack>;
    };
    const resultMessage = successMessage.length ? <Alert severity="success" className="Alert-wrapper">{successMessage}</Alert>: null;
    let sendButton = reqInProgress === 0 ? <Button variant="contained" startIcon={<AddIcon />} onClick={onSendAd} size={muiElSize}>
    Добавить
    </Button>: 
    <Button variant="contained" startIcon={<AddIcon />} size={muiElSize} disabled>
        Добавить
    </Button>;
    const inputBlock = state.userData.authorized ? <div>
        <h1>Создать</h1>
        <div>
            {resultMessage}
            {errList}
        </div>
        <div>
            <TextField size={muiElSize} autoComplete="off" id="city-search" label="Город" type="search" value={location}
                onChange={onChangeLocation} className="Edit-input-el"/>
            {cityListBlock}
        </div>
        <div>
            <FormControl size="small" className="Currency-select">
              <InputLabel id="select-currency-label">Валюта</InputLabel>
              <Select
                label="Валюта"
                labelId="select-currency-label"
                id="select-currency"
                value={curType}
                onChange={(e) => {setCurType(Number(e.target.value))}}
              >
                <MenuItem value={0}>$</MenuItem>
                <MenuItem value={1}>€</MenuItem>
                <MenuItem value={2}>£</MenuItem>
                <MenuItem value={3}>¥</MenuItem>
              </Select>
            </FormControl>
        </div>
        <div>
            <TextField
                label="Курс обмена"
                value={exchangeVal} 
                onChange={onChangeExchange}
                InputProps={{
                    startAdornment: <InputAdornment position="start" className="Edit-helper-text">1{getCurrencyVal(curType)}</InputAdornment>,
                }}
                className="Edit-input-el"
                autoComplete="off"
                size={muiElSize}
            />
        </div>
        <div>
            <TextField
                label="Мин. сумма"
                value={minAmount} 
                onChange={onChangeMinAmount}
                InputProps={{
                    startAdornment: <InputAdornment position="start" className="Edit-helper-text">От</InputAdornment>,
                }}
                className="Edit-input-el"
                autoComplete="off"
                size={muiElSize}
            />
        </div>
        <div>
            <TextField
                label="Макс. сумма"
                value={maxAmount} 
                onChange={onChangeMaxAmount}
                InputProps={{
                    startAdornment: <InputAdornment position="start" className="Edit-helper-text">До</InputAdornment>,
                }}
                className="Edit-input-el"
                autoComplete="off"
                size={muiElSize}
            />
        </div>
        <div>{sendButton} <Button variant="contained" startIcon={<KeyboardBackspaceIcon  />} onClick={() => navigate(-1)} size={muiElSize}>
                        Назад
            </Button>
        </div>
    </div>: null;
    let content = state.userData.authorized ? 
                    <div className="Edit-wrapper">
                        {inputBlock}
                    </div>:
                    <AccessDenied />;
    
    return (
        <div className="App">
            <HeadMenu />
            <div className="App-content-wrapper">
                <div className="Page-content-flex-wrapper">
                    {content}
                </div>
                <Footer />
            </div>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={reqInProgress === 1 ? true: false}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}

export default CreateAd;