import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchData } from '../api/fetch';
import { AppContext } from '../utils/context';
import { setAuthors } from '../utils/reducer';
import { getEditError } from '../utils/errors';
import { getMessengerName, formatEmail } from '../utils/proposalFormat';
import HeadMenu from '../components/HeadMenu';
import Footer from '../components/Footer';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import '../styles/Edit.scss';
//Иконки
import SaveIcon from '@mui/icons-material/Save';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import EditIcon from '@mui/icons-material/Edit';
import KeyIcon from '@mui/icons-material/Key';
import ChatIcon from '@mui/icons-material/Chat';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

interface authorData {
    email: string,
    messanger: {
        type: number,
        value: string
    },
    adsCounter: number
}

function Profile() {
    const {state, dispatch} = useContext(AppContext);
    const [ aData, setAData ] = useState<authorData>({email: '', messanger: {type: 0, value: ''}, adsCounter: 0});
    const [ loadState, setLoadState ] = useState<number>(0);
    const [ confirmState, setConfirmState ] = useState<number>(0);
    const [ errors, setErrors ] = useState<Array<any>>([]);
    const [ editBlockState, setEditBlockState ] = useState<number>(0);
    const [ succesMessage, setSuccesMessage ] = useState('');
    const [ reqState, setReqState ] = useState(0);
    const [ oldPass, setOldPass ] = useState<string>('');
    const [ pass, setPass ] = useState<string>('');
    const [ confPass, setConfPass ] = useState<string>('');
    const [ oldPassFieldType, setOldPassFieldType ] = useState<string>('password');
    const [ passFieldType, setPassFieldType ] = useState<string>('password');
    const [ confPassFieldType, setConfPassFieldType ] = useState<string>('password');
    const navigate = useNavigate();
    const muiElSize = "small";//Размер компонентов MUI
    
    useEffect(() => {
        if (!loadState){
            setLoadState(1);
            if (state.userData.id){
                fetchData('getAuthorData', {id: state.userData.id}).then((r: any) => {
                    if (r.isSucces){
                        if (r.data.status === 200){
                            const aDataVal: authorData = {
                                email: r.data.data.email,
                                messanger: {
                                    type: r.data.data.mainContactType,
                                    value: r.data.data.mainContactVal
                                },
                                adsCounter: r.data.data.adsCounter
                            };
                            setAData(aDataVal);
                            setLoadState(2);
                        }
                    }
                }).catch((err) => {
                    console.log(err);
                    setTimeout(() => {
                        setLoadState(0)
                    }, 5000);
                });
            }
        }
    }, [loadState]);

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
    const onChangeMessangerType = (e: any) => {
        setAData({email: aData.email, messanger: {type: Number(e.target.value), value: aData.messanger.value}, adsCounter: aData.adsCounter});
    }
    const onChangeMessangerVal = (e: any) => {
        const newVal = e.target.value.trim();
        setAData({email: aData.email, messanger: {type: aData.messanger.type, value: newVal}, adsCounter: aData.adsCounter});
        setTimeout(() => {
            if (newVal.length < 1){
                addErr('invalidMessangerVal');
            }
            else {
                delErr('invalidMessangerVal');               
            };
        }, 500);
    }
    const onSaveMessanger = () => {
        if (aData.messanger.value.length){
            setReqState(1);
            delErr('failMessangerEdit');
            let aToken: any = localStorage.getItem('aToken');
            aToken = aToken ? JSON.parse(aToken): null;
            const now = Date.now();
            if (aToken) {//Удалось получить токен авторизации
                if (aToken.expires > now){
                    fetchData("editAuthMessanger", {token: aToken.token, mainContactVal: aData.messanger.value, mainContactType: aData.messanger.type}).then((r: any) => {
                        if (r.isSucces){
                            if (r.data.status === 200){
                                let newAuthors = state.authors.slice();
                                let authIndex = newAuthors.findIndex(a => a.id === state.userData.id);
                                if (authIndex >= 0){
                                    console.log('Update statemeneger');
                                    newAuthors[authIndex].messangerType = aData.messanger.type;
                                    newAuthors[authIndex].messangerVal = aData.messanger.value;
                                    dispatch(setAuthors(newAuthors));
                                };
                                setSuccesMessage('Данные мессенджера изменены успешно');
                                setReqState(2);
                                setTimeout(() => {
                                    setEditBlockState(0);
                                    setSuccesMessage('');
                                    setReqState(0);
                                }, 3000);
                            };
                        }
                        else {
                            addErr('internalServerError');
                            setReqState(0);
                        };
                    }).catch((err) => {
                        console.log(err);
                        addErr('failMessangerEdit');
                        setReqState(0);
                    });
                }
            };
        }
    };
    const onToggleOldPassField = () => {
        const newVal: string = oldPassFieldType === 'password' ? 'text': 'password';
        setOldPassFieldType(newVal);
    }
    const onTogglePassField = () => {
        const newVal: string = passFieldType === 'password' ? 'text': 'password';
        setPassFieldType(newVal);
    }
    const onToggleConfPassField = () => {
        const newVal: string = confPassFieldType === 'password' ? 'text': 'password';
        setConfPassFieldType(newVal);
    }
    const onSavePass = () => {
        if (oldPass.length > 5 && pass.length > 5 && confPass.length > 5 && pass === confPass){
            setReqState(1);
            fetchData("editUserPass", {id: state.userData.id, pass: oldPass, newPass: confPass}).then((r: any) => {
                if (r.isSucces){
                    if (r.data.status === 200){
                        setSuccesMessage('Парроль изменен успешно');
                        setReqState(2);
                        setTimeout(() => {
                            setEditBlockState(0);
                            setSuccesMessage('');
                            setReqState(0);
                        }, 3000);
                    }
                    else if(r.data.status === 403) {
                        addErr('wrongPass');
                        setReqState(0);
                    }
                    else {
                        addErr('failPassEdit');
                        setReqState(0);
                    };
                }
                else {
                    addErr('internalServerError');
                    setReqState(0);
                };
            }).catch((err) => {
                console.log(err);
                addErr('failPassEdit');
            });
        }
    };
    const onCancelClick = () => {
        //setReqState(0);
        setEditBlockState(0);
        setOldPass('');
        setPass('');
        setConfPass('');
        setErrors([]);
    };
    const onChangeOldPass = (e: any) => {
        let newPass = e.target.value.trim();
        setTimeout(() => {
            if (newPass.length < 6 || newPass.length > 30) {
                addErr('invalidPassLength');
            }
            else delErr('invalidPassLength');
        }, 500);        
        setOldPass(newPass);
    };
    const onChangePass = (e: any) => {
        let newPass = e.target.value.trim();
        setTimeout(() => {
            if (newPass.length < 6 || newPass.length > 30) {
                addErr('invalidNewPassLength');
            }
            else delErr('invalidNewPassLength');
            if (newPass.length > 5){
                if (newPass !== pass) addErr('passDoesntMatch');
                else delErr('passDoesntMatch');
            }
            else delErr('passDoesntMatch');
        }, 500);        
        setPass(newPass);
    };
    const onChangeConfPass = (e: any) => {
        let newPass = e.target.value.trim();
        setTimeout(() => {
            if (newPass.length < 6 || newPass.length > 30) {
                addErr('invalidNewPassLength');
            }
            else delErr('invalidNewPassLength');
            if (newPass.length > 5){
                if (newPass !== pass) addErr('passDoesntMatch');
                else delErr('passDoesntMatch');
            }
            else delErr('passDoesntMatch');
        }, 500);        
        setConfPass(newPass);
    };
    let succesBlock = succesMessage.length ? <div><Alert severity="success" className="Alert-wrapper">{succesMessage}</Alert></div>: null;
    let errorsList = errors.length ?
        <div><Stack spacing={1}>{errors.map(e => {
            return <Alert severity="error" key={e.type} className="Alert-wrapper">{e.message}</Alert>;
        })}</Stack></div>: 
        null;
    const cancelButton = <Button variant="contained" startIcon={<KeyboardBackspaceIcon  />} onClick={onCancelClick} 
            size={muiElSize}>
                Назад
        </Button>;
    let mailBlock = editBlockState === 0 ? <div>
                        <div className="Edit-inline-left-wrapper Profile-list-settings-margin-bottom">
                            <EmailIcon className="Edit-icon" fontSize="inherit"/> 
                            {formatEmail(aData.email)}
                        </div>
                    </div>: null;
    
    let saveMessanger, savePass;
    switch(reqState){
        case 0: {
            saveMessanger = <Button variant="contained" startIcon={<SaveIcon />} onClick={onSaveMessanger} size={muiElSize} >Сохранить</Button>
            savePass = <Button variant="contained" startIcon={<SaveIcon />} onClick={onSavePass} size={muiElSize} >Сохранить</Button>
        }; break;
        case 1: {
            saveMessanger = <Button variant="contained" size={muiElSize} disabled><CircularProgress className="ButtonLoader" size="1em" color="primary"/>Сохранить</Button>
            savePass = <Button variant="contained" onClick={onSavePass} size={muiElSize} disabled><CircularProgress className="ButtonLoader" size="1em" color="primary"/>Сохранить</Button>
        }; break;
        case 2: {
            saveMessanger = <Button variant="contained" startIcon={<SaveIcon />} size={muiElSize} disabled>Сохранить</Button>
            savePass = <Button variant="contained" startIcon={<SaveIcon />} onClick={onSavePass} size={muiElSize} disabled>Сохранить</Button>
        }; break;
    }
    let counterBlock: any = <div className="Edit-inline-left-wrapper Profile-list-settings-margin-bottom">
                <LibraryBooksIcon className="Edit-icon" fontSize="inherit"/>
                Объявлений {aData.adsCounter}/4
            </div>;
    let messangerBlock: any = <div className="Edit-inline-space-between">
            <div className="Edit-inline-left-wrapper">
                <ChatIcon className="Edit-icon" fontSize="inherit"/>
                {getMessengerName(aData.messanger.type)}
            </div>
            <div className="Edit-inline-left-wrapper">
                <IconButton onClick={() => setEditBlockState(1)}>
                    <EditIcon className="Edit-edit-icon"/>
                </IconButton>
            </div>
        </div>;
    let passBlock: any = <div className="Edit-inline-space-between">
            <div className="Edit-inline-left-wrapper">
                <KeyIcon className="Edit-icon" fontSize="inherit"/>
                Пароль
            </div>
            <div>
                <IconButton onClick={() => setEditBlockState(2)} >
                    <EditIcon className="Edit-edit-icon"/>
                </IconButton>
            </div>
        </div>;
    let returnButton = editBlockState === 0 ? <div>
            <Button variant="contained" startIcon={<KeyboardBackspaceIcon  />} onClick={() => navigate(-1)} 
                                size={muiElSize} className="Return-button">
                                    Назад
            </Button>
        </div>: null;
    if (editBlockState === 1) {
        messangerBlock = <div className="Edit-input-wrapper">
            <FormControl size="small" className="Standart-select Profile-select">
                <InputLabel id="select-messenger-label">Способ связи</InputLabel>
                <Select
                    id="select-messanger"
                    label="Способ связи"
                    labelId="select-messenger-label"
                    value={aData.messanger.type}
                    onChange={onChangeMessangerType}
                >
                    <MenuItem value={0}>Telegram</MenuItem>
                    <MenuItem value={1}>WhatsApp</MenuItem>
                    <MenuItem value={2}>Signal</MenuItem>
                </Select>
            </FormControl>
            <TextField size={muiElSize} autoComplete="off" id="messanger-val" label="Никнейм" value={aData.messanger.value}
                onChange={onChangeMessangerVal} className="Edit-input-el Profile-select"/>
            <div className="Buttons-group-wrapper">
                {saveMessanger}
                {cancelButton}
            </div>
            </div>;
        counterBlock = null;
        mailBlock = null;
        passBlock = null;
    }
    else if (editBlockState === 2) {
        passBlock = <div className="Edit-input-wrapper">
                    <FormControl variant="outlined" size="small">
                    <InputLabel htmlFor="old-password" className="Password-label">Пароль</InputLabel>
                    <OutlinedInput
                        id="old-password"
                        type={oldPassFieldType}
                        value={oldPass}
                        onChange={onChangeOldPass}
                        endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                            aria-label="toggle password visibility"
                            onClick={onToggleOldPassField}
                            onMouseDown={onToggleOldPassField}
                            edge="end"
                            className="Password-icon"
                            >
                            {oldPassFieldType === "text" ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                        }
                        label="Passwd"
                        className="Password-input"
                    />
                    </FormControl>
                    <FormControl variant="outlined" size="small">
                    <InputLabel htmlFor="new-password" className="Password-label">Новый пароль</InputLabel>
                    <OutlinedInput
                        id="new-password"
                        type={passFieldType}
                        value={pass}
                        onChange={onChangePass}
                        endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                            aria-label="toggle password visibility"
                            onClick={onTogglePassField}
                            onMouseDown={onTogglePassField}
                            edge="end"
                            className="Password-icon"
                            >
                            {passFieldType === "text" ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                        }
                        label="New-passwords"
                        className="Password-input"
                    />
                    </FormControl>
                    <FormControl variant="outlined" size="small">
                    <InputLabel htmlFor="new-password-confirm" className="Password-label">Ещё раз</InputLabel>
                    <OutlinedInput
                        id="new-password-confirm"
                        type={confPassFieldType}
                        value={confPass} 
                        onChange={onChangeConfPass} 
                        endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                            aria-label="toggle password visibility"
                            onClick={onToggleConfPassField}
                            onMouseDown={onToggleConfPassField}
                            edge="end"
                            className="Password-icon"
                            >
                            {confPassFieldType === "text" ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                        }
                        label="Passwrd"
                        className="Password-input"
                    />
                    </FormControl>
                <div className="Buttons-group-wrapper" >
                    {savePass}
                    {cancelButton}
                </div>
            </div>;
        counterBlock = null;
        mailBlock = null;
        messangerBlock = null;
    };
    
    let sendButton = <Button variant="contained" startIcon={<SaveIcon />} onClick={onSaveMessanger} size={muiElSize} >Сохранить</Button>;
    if (loadState === 1) sendButton = <Button variant="contained" startIcon={<SaveIcon />} size={muiElSize} disabled>Сохранить</Button>;
    else if (loadState === 1) sendButton = <Button variant="contained" startIcon={<SaveIcon />} size={muiElSize} disabled>Сохранить</Button>;

    const content = (loadState === 2 && aData) ? 
                        <div className="Prof-edit-wrapper">
                            {succesBlock}
                            {errorsList}
                            <div className="Prof-edit-main-block">
                                <div className="Prof-header-wrapper">
                                        <AccountCircleIcon className="Prof-header-icon" fontSize="inherit"/>
                                        <h1>{state.userData.name}</h1>
                                </div>
                                {counterBlock}
                                {mailBlock}
                                {messangerBlock}
                                {passBlock}
                            </div>
                            {returnButton}
                        </div>:
                        <CircularProgress color="inherit" />;
    return (
        <div className="App">
            <HeadMenu />
            <div className="App-content-wrapper">
                <div className="Page-content-flex-wrapper">
                    {content}
                </div>
                <Footer />
            </div>
        </div>
    );
}

export default Profile;