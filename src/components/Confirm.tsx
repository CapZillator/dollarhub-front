import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchData } from '../api/fetch';
import { AppContext, User } from '../utils/context';
import HeadMenu from '../components/HeadMenu';
import Footer from '../components/Footer';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import MailLockIcon from '@mui/icons-material/MailLock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import PasswordIcon from '@mui/icons-material/Password';
import LoginIcon from '@mui/icons-material/Login';
import RefreshIcon from '@mui/icons-material/Refresh';
import ErrorIcon from '@mui/icons-material/Error';
import '../styles/Auth.scss';
import '../styles/Logo.scss';
import '../styles/Main.scss';


function Confirm() {
    const {state, dispatch} = useContext(AppContext);
    let search: any = useLocation().search;
    let confrirmMailVal = new URLSearchParams(search).get('email');
    let confrirmCodeVal = new URLSearchParams(search).get('code');
    let email = state.userData.email ? state.userData.email: confrirmMailVal;
    const [pageState, setPageState] = useState<number>(0);
    const [confCode, setConfCode] = useState<string>('');
    const [confEmail, setConfEmail] = useState(email);
    const [confReqState, setConfReqState] = useState(0);
    const [errMessage, setErrMessage] = useState('Похоже, что-то пошло не так. Пожалуйста, попробуйте еще раз.');
    const navigate = useNavigate();
    
    useEffect(() => {
        if (confrirmMailVal && confrirmCodeVal && pageState === 0){
            setPageState(1);
            setConfCode(confrirmCodeVal);
        };
        if (!confEmail || confEmail.length === 0){
            setPageState(4);
            setErrMessage('Не можем получить адрес вашей электронной почты, завершение процедуры регистрации невозможно!');
        };
    }, [confEmail]);

    const onConfirmCodeSend = () => {
        if (confEmail && confEmail.length && confCode && confCode.length){
            setConfReqState(1);
            fetchData('activateCode', {email: confEmail, code: confCode}).then((r: any) => {
                if (r.isSucces){
                    console.log(r.data.status);
                    switch (r.data.status){
                        case 200: {
                        setPageState(2);
                        setConfReqState(0);
                        }; break;
                        case 400: {
                            setPageState(4);
                            setConfReqState(0);
                        }; break;
                        case 403: {
                            setPageState(4);
                            setConfReqState(0);
                            setErrMessage('Похоже, вы указали неверный код активации. Проверьте свою почту, новый код уже там.');
                        }; break;
                        case 404: {
                            setPageState(4);
                            setConfReqState(0);
                            setErrMessage('Пользователь не найден!');
                        }; break;
                        default: {
                            setPageState(4);
                            setConfReqState(0);
                        }; break;
                    };
                }
              }).catch((err) => {
                setConfReqState(4);
                setConfReqState(0);
              });
        }
        else {
            setPageState(4);
            setErrMessage('Не указан email/код активации!');
        };
    }

    let content = <div className="Confirm-content">
                    <MarkEmailUnreadIcon className="Confirm-email-icon"/>
                    <h1>Подтвердите email</h1>
                    <p>Мы выслали код активации на {state.userData.email}. Пожалуйста, проверьте вашу почту для завершения процедуры регистрации.</p>
                    <div><Button variant="contained" startIcon={<PasswordIcon  />} onClick={() => setPageState(1)}>Ввести код</Button></div>
                </div>;
    if (pageState === 1){//Экран ввода кода активации
        let button = confReqState ? <Button variant="contained" onClick={onConfirmCodeSend} disabled>
                        <CircularProgress className="ButtonLoader" size="1em"/>Активировать</Button>:
                        <Button variant="contained" startIcon={<LockOpenIcon  />} onClick={onConfirmCodeSend}>Активировать</Button>;
        content = <div className="Confirm-content">
                    <MailLockIcon className="Confirm-email-icon"/>
                    <h1>Подтвердите email</h1>
                    <p>Укажите код активации, полученный на почту.</p>
                    <TextField id="confirm-code-input" label="Код" size="small" value={confCode}
                        onChange={(e) => {setConfCode(e.target.value.trim())}} className="Confirm-input" autoComplete="off"/>
                    <div>{button}</div>
                </div>;
    }
    else if (pageState === 2){//Экран успешной активации
        content = <div className="Confirm-content">
                    <MarkEmailReadIcon className="Confirm-email-icon"/>
                    <h1>Аккаунт активирован!</h1>
                    <p>Готово, Dollarhub к вашим услугам. Войдите под своим логином/паролем и чувствуйте себя, как дома!</p>
                    <div><Button variant="contained" startIcon={<LoginIcon  />} onClick={() => navigate('/login')}>Вход</Button></div>
                </div>;
    }
    else if (pageState === 4){//Экран ошибки активации
        content = <div className="Confirm-content">
                    <ErrorIcon className="Confirm-email-icon"/>
                    <h1>Ошибка активации</h1>
                    <p>{errMessage}</p>
                    <div><Button variant="contained" startIcon={<RefreshIcon />} onClick={() => setPageState(1)}>Попробовать снова</Button></div>
                </div>;
    }

    return (
        <div className="App">
            <HeadMenu />
            <div className="App-content-wrapper">
                <main className="Confirm-email-wrapper">
                    {content}
                </main>
                <Footer />
            </div>
        </div>
    );
}

export default Confirm;