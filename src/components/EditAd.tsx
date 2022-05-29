import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchData } from '../api/fetch';
import { AppContext } from '../utils/context';
import { setCitiesList, setMyProposalsList } from '../utils/reducer';
import { getEditError } from '../utils/errors';
import { getCurrencyVal } from '../utils/proposalFormat';
import { findCity } from '../utils/search';
import HeadMenu from '../components/HeadMenu';
import Footer from '../components/Footer';
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
import FormHelperText from '@mui/material/FormHelperText';
import '../styles/Edit.scss';
//Иконки
import SaveIcon from '@mui/icons-material/Save';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

function EditAd() {
    const {state, dispatch} = useContext(AppContext);
    const [proposalID, setProposalID] = useState<number>(0);
    const [location, setLocation] = useState<string>('');
    const [locationHint, setLocationHint] = useState<Array<any>>([]);
    const [minAmount, setMinAmount] = useState<number>(1);
    const [maxAmount, setMaxAmount] = useState<number>(1000);
    const [exchangeVal, setExchangeVal] = useState<number>(100);
    const [curType, setCurType] = useState<number>(0);
    const [author, setAuthor] = useState<number>(0);
    const [errors, setErrors] = useState<Array<any>>([]);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [reqInProgress, setReqInProgress] = useState<boolean>(false);
    const [sendButtonState, setSendButtonState] = useState<boolean>(false);
    const [finishLoadData, setFinishLoadData] = useState<boolean>(false);
    const [finishLoadCitylist, setFinishLoadCitylist] = useState<boolean>(false);
    let params = useParams();
    const navigate = useNavigate();
    const muiElSize = "small";//Размер компонентов MUI
    
    useEffect(() => {
        if (!finishLoadCitylist){
            console.log('Get cities');
            setFinishLoadCitylist(true);
            fetchData('getCityList').then((r: any) => {
                if (r.isSucces){
                    dispatch(setCitiesList(r.data.list));
                }
            }).catch((err) => {
                console.log(err);
            });
        };
        if (!finishLoadData){
            console.log('Get Ad');
            let id = Number(params.proposalId);
            let currentProposal: any = state.myProposals.find(p => p.id === id);
            if (currentProposal) {
                setProposalID(currentProposal.id);
                setLocation(currentProposal.location);
                setCurType(currentProposal.currency);
                setMinAmount(currentProposal.amountMin);
                setMaxAmount(currentProposal.amountMax);
                setExchangeVal(currentProposal.exchangeRate);
                setAuthor(currentProposal.author);
                setFinishLoadData(true);
                delErr('internalServerError');
            }
            else {
                fetchData('getByID', {id: id}).then((r: any) => {
                    if (r.isSucces){
                        currentProposal = r.data.data;
                        setProposalID(currentProposal.id);
                        setLocation(currentProposal.location);
                        setCurType(currentProposal.currency);
                        setMinAmount(currentProposal.amountMin);
                        setMaxAmount(currentProposal.amountMax);
                        setExchangeVal(currentProposal.exchangeRate);
                        setAuthor(currentProposal.author);
                        setFinishLoadData(true);
                        delErr('internalServerError');
                    }
                }).catch((err) => {
                    console.log(err);
                    addErr('internalServerError');
                    setReqInProgress(false);
                });
            };
        };
    }, [finishLoadCitylist, finishLoadData]);

    const addErr = (errorType: string) => {
        let newError = getEditError(errorType);
        if (newError){
            let err = errors.find(e => e.type === errorType);
            if (!err) {
                let newErrors = errors.slice();
                newErrors.push(newError);
                setErrors(newErrors);
            };
        };
    }
    const delErr = (errorType: string) => {
        let errIndex = errors.findIndex(e => e.type === errorType);
        if (errIndex !== -1){
            let newErrors = errors.slice();
            newErrors.splice(errIndex);
            setErrors(newErrors);
        };
    }

    const onChangeLocation = (e: any) => {
        const city = e.target.value;
        setTimeout(() => {
            if (city.length < 2) {
                addErr('invalidCityName');
            }
            else {
                delErr('invalidCityName');
            }
        }, 500);
        setLocation(city);
        setLocationHint(findCity(city, state.cityList));
    };
    const onChangeMinAmount = (e: any) => {
        let amountVal = Number(e.target.value);
        setTimeout(() => {
            if (amountVal > maxAmount) {
                addErr('invalidAmountProportion');
            }
            else {
                delErr('invalidAmountProportion');
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
                addErr('invalidAmountProportion');
            }
            else {
                delErr('invalidAmountProportion');
            }
        }, 500);
        amountVal = amountVal > 99999999 ? 99999999: amountVal;
        if (amountVal > 0) setMaxAmount(amountVal);
        else setMaxAmount(1);
    };

    const onChangeExchange = (e: any) => {
        const ex = Number(e.target.value);
        setTimeout(() => {
            if (ex < 1) {
                addErr('invalidExchangeVal');
            }
            else {
                delErr('invalidExchangeVal');
            }
        }, 500);
        setExchangeVal(ex);
    };

    const onSendAd = () => {
        let aToken: any = localStorage.getItem('aToken');
        aToken = aToken ? JSON.parse(aToken): null;
        const now = Date.now()
        if (aToken){
            if (aToken.expires > now){
                if ((location.length > 1) && (minAmount > 0) && (maxAmount > 0) && (minAmount <= maxAmount)) {
                    setReqInProgress(true);
                    setSendButtonState(true);
                    const body = {
                        token: aToken.token, 
                        currency: curType, 
                        amountMin: minAmount,
                        amountMax: maxAmount,
                        exchangeRate: exchangeVal,
                        location: location,
                        id: proposalID
                    };
                    fetchData('updateProposal', body).then((r: any) => {
                        if (r.isSucces){
                            if (r.data.status === 200){
                                let errIndex = errors.findIndex(e => e.type === 'badRequest');
                                if (errIndex !== -1){
                                    let newErrors = errors.slice();
                                    newErrors.splice(errIndex);
                                    setErrors(newErrors);
                                } 
                                let newMyProps = state.myProposals.slice();
                                let currentProp = newMyProps.find(p => p.id === proposalID);
                                if (currentProp){
                                    currentProp.currency = curType;
                                    currentProp.amountMin = minAmount;
                                    currentProp.amountMax = maxAmount;
                                    currentProp.exchangeRate = exchangeVal;
                                    currentProp.location = location;
                                };
                                dispatch(setMyProposalsList(newMyProps));
                                setSuccessMessage('Объявление отредактировано успешно!');
                                setReqInProgress(false);
                                setTimeout(() => {
                                    navigate(-1);
                                }, 3000);
                            }
                            else {
                                addErr('badRequest');
                                setReqInProgress(false);
                            }
                        }
                    }).catch((e) => {
                        addErr('badRequest');
                        setReqInProgress(false);
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
    }
    const resultMessage = successMessage.length ? <Alert severity="success" className="Alert-wrapper">{successMessage}</Alert>: null;
    const sendButton = sendButtonState ? 
        <Button variant="contained" startIcon={<SaveIcon />} size={muiElSize} disabled>Сохранить</Button>: 
        <Button variant="contained" startIcon={<SaveIcon />} onClick={onSendAd} size={muiElSize}>Сохранить</Button>;
    const inputBlock = state.userData.authorized ? <div>
        <h1>Редактировать</h1>
        <div>
            {resultMessage}
            {errList}
        </div>
        <h3>ID #{proposalID}</h3>
        <div>
            <TextField size={muiElSize} autoComplete="off" id="city-search" label="Город" type="search" value={location}
                onChange={onChangeLocation} className="Edit-input-el"/>
            {cityListBlock}
        </div>
        <div>
            <FormControl size={muiElSize} className="Currency-select">
              <InputLabel id="select-currency-label">Валюта</InputLabel>
              <Select
                id="select-currency"
                label="Валюта"
                labelId="select-currency-label"
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
        <div className="Buttons-group-wrapper">{sendButton} <Button variant="contained" startIcon={<KeyboardBackspaceIcon  />} onClick={() => navigate(-1)} size={muiElSize}>
                        Назад
            </Button>
        </div>
    </div>: null;
    let content;
    if (state.userData.authorized){
        content = (finishLoadCitylist && finishLoadData) ?
            <div className="Edit-wrapper">
                {inputBlock}
            </div>: <div className="App-center-wrapper">
            <CircularProgress color="inherit" />
        </div>;
    }
    else {
        content = <AccessDenied />;
    };
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
                open={reqInProgress}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}

export default EditAd;