import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchData } from '../api/fetch';
import { AppContext, User } from '../utils/context';
import { setUserData } from '../utils/reducer';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LogoIcon from '../icons/LogoIcon';
import '../styles/Auth.scss';
import '../styles/Logo.scss';

function Login() {
  const [login, setLogin] = useState<string>('');
  const [pass, setPass] = useState<string>('');
  const [passFieldType, setPassFieldType] = useState<string>('password');
  const [queryInProgress, setQueryInProgress ] = useState<boolean>(false);
  const [queryComplete, setQueryComplete] = useState<boolean>(false);
  const [errMessage, setErrMessage] = useState('');
  const [resMessage, setResMessage]= useState('');
  const {state, dispatch} = useContext(AppContext);
  const navigate = useNavigate();

  const onLoginClick = () => {
    setQueryInProgress(true);
    fetchData('standartLogin', {email: login, pass: pass}).then((r: any) => {
      if (r.isSucces){
        switch (r.data.status){
          case 200: {
            localStorage.setItem('aToken', JSON.stringify(r.data.tokens.accessToken));
            localStorage.setItem('rToken', JSON.stringify(r.data.tokens.refreshToken));
            setResMessage(`Добро пожаловать, ${r.data.username}!`);
            if (errMessage.length) setErrMessage('');
            const user: User = {authorized: true, id: r.data.userid, name: r.data.username};
            dispatch(setUserData(user));
            setQueryComplete(true);
            setTimeout(() => {
              navigate('/');
            }, 1000);
          }; break;
          case 400: {
            if (resMessage.length) setResMessage('');
            setErrMessage('Ошибка обращения к базе данных');
            setQueryComplete(true);
          }; break;
          case 403: {
            if (resMessage.length) setResMessage('');
            setErrMessage('Email/пароль указаны неверно!');
            setQueryComplete(true);
          }; break;
          case 404: {
            if (resMessage.length) setResMessage('');
            setErrMessage('Пользователь не найден!');
            setQueryComplete(true);
          }; break;
          default: {
            if (resMessage.length) setResMessage('');
            setErrMessage('Ошибка авторизации');
            setQueryComplete(true);
          };
        };
      };
      setQueryInProgress(false);
    });
  }
  const onTogglePassField = () => {
    const newVal: string = passFieldType === 'password' ? 'text': 'password';
    setPassFieldType(newVal);
  }
  
  const authResultMessage = resMessage.length ? <div><Alert severity="success">{resMessage}</Alert></div>: null;
  const errMessageAlert = errMessage.length ? <div><Alert severity="error">{errMessage}</Alert></div>: null;
  const confrirmBlock = queryInProgress ? 
    <Button variant="contained" disabled><CircularProgress className="ButtonLoader" size="1em" color="primary"/>Готово</Button>: 
    <Button variant="contained" onClick={onLoginClick}>Готово</Button>;
  return (
    <div className="App">
        <div className="Auth-content-wrapper">
          <div className="Auth-logo-wrapper" onClick={() => navigate("/")}>
            <LogoIcon type="main" />
          </div>
          <div className="AuthForm">
            <h1>Авторизация</h1>
            {authResultMessage}
            {errMessageAlert}
            <div><TextField size="small" id="login-input" label="Email" value={login}
                  onChange={(e) => {setLogin(e.target.value.trim())}} color="primary" className="Standart-input" autoComplete="off"/>
            </div>
            <div>
              <FormControl variant="outlined" size="small">
                <InputLabel htmlFor="login-password" className="Password-label">Пароль</InputLabel>
                <OutlinedInput
                  id="login-password"
                  type={passFieldType}
                  value={pass}
                  onChange={(e) => {setPass(e.target.value.trim())}}
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
                  label="Passwd"
                  className="Password-input"
                />
              </FormControl>
            </div>
            <div>{confrirmBlock}</div>
            <div><Link to='/registration'>Нет аккаунта?</Link></div>
          </div>
          <p>© Dollarhub</p>
        </div>
    </div>
  );
}

export default Login;