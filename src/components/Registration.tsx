import React, { useState, useEffect, useContext } from 'react';
import { validateEmail, validateLogin, validatePass, validateMessangerId } from '../validator/validator';
import { fetchData } from '../api/fetch';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext, Ad, User} from '../utils/context';
import { setUserData } from '../utils/reducer';
import LogoIcon from '../icons/LogoIcon';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import '../styles/Auth.scss';
import '../styles/Logo.scss';

function Registration() {
  const { state, dispatch } = useContext(AppContext);
  const [ login, setLogin ] = useState<string>('');
  const [ email, setEmail ] = useState<string>('');
  const [ pass, setPass ] = useState<string>('');
  const [ confPass, setConfPass ] = useState<string>('');
  const [ connectType, setConnectType ] = useState<number>(0);
  const [ connectVal, setConnectVal ] = useState<string>('');
  const [ issues, setIssues ] = useState<Array<any>>([]);
  const [ validFields, setValidFields ] = useState<any>({login: 0, email: 0, pass: 0, messenger: 0});
  const [ passFieldType, setPassFieldType ] = useState<string>('password');
  const [ confPassFieldType, setConfPassFieldType ] = useState<string>('password');
  const [ queryInProgress, setQueryInProgress ] = useState<number>(0);
  const [ resultMessage, setResultMessage ] = useState<any>({type: 0, message: null});

  const navigate = useNavigate();

  const onLoginValidate = () => {
    const l: any = validateLogin(login);
    if (l && l.length > 0) {
      fetchData('checkLogin', {login: login}).then((r: any) => {
        if (r.isSucces){
          if (r.data.status === 200){
            let tempValidFields = validFields;
            tempValidFields.login = 1;
            setValidFields(tempValidFields);
            if (issues.length > 0){
              let newIssues = issues.slice();
              let errorIndex = issues.findIndex(e => e.type === 'loginFormat');
              if (errorIndex !== -1) newIssues.splice(errorIndex, 1);
              errorIndex = issues.findIndex(e => e.type === 'ApiQueryError');
              if (errorIndex !== -1) newIssues.splice(errorIndex, 1);
              errorIndex = issues.findIndex(e => e.type === 'loginExists');
              if (errorIndex !== -1) newIssues.splice(errorIndex, 1);
              setIssues(newIssues);
            }
          }
          else if (r.data.status === 403){
            let error = issues.find(i => i.type === 'loginExists');
            if (!error) {
              let newIssues = issues.slice();
              newIssues.push({type: 'loginExists', message: 'Такой Логин уже используется.'});
              setIssues(newIssues);
            };
          };
        }
        else {
          let error = issues.find(i => i.type === 'ApiQueryError');
          if (!error) {
            let newIssues = issues.slice();
            newIssues.push({type: 'ApiQueryError', message: 'Ошибка подключения к серверу.'})
            setIssues(newIssues);
          }
        }
      });
    }
    else {
      let error = issues.find(i => i.type === 'loginFormat');
      if (!error) {
        let newIssues = issues.slice();
        newIssues.push({type: 'loginFormat', message: 'Логин может содержать только латинские, кириллические или цифровые символы и иметь длинну от 3 до 30 знаков.'})
        setIssues(newIssues);
      };
      if (!validFields.login){
        let tempValidFields = validFields;
        tempValidFields.login = 0;
        setValidFields(tempValidFields);
      };
    }
  }

  const onEmailValidate = () => {
    const m: any = validateEmail(email);
    if (m && m.length > 0) {
      fetchData('checkEmail', {email: email}).then((r: any) => {
        if (r.isSucces){
          if (r.data.status === 200){
            let tempValidFields = validFields;
            tempValidFields.email = 1;
            setValidFields(tempValidFields);
            if (issues.length > 0){
              let newIssues = issues.slice();
              let errorIndex = issues.findIndex(e => e.type === 'emailFormat');
              if (errorIndex !== -1) newIssues.splice(errorIndex);
              errorIndex = issues.findIndex(e => e.type === 'ApiQueryError');
              if (errorIndex !== -1) newIssues.splice(errorIndex);
              errorIndex = issues.findIndex(e => e.type === 'emailExists');
              if (errorIndex !== -1) newIssues.splice(errorIndex);
              setIssues(newIssues);
            }
          }
          else if (r.data.status === 403){
            let error = issues.find(i => i.type === 'emailExists');
            if (!error) {
              let newIssues = issues.slice();
              newIssues.push({type: 'emailExists', message: 'Такой email уже используется.'});
              setIssues(newIssues);
            };
          };
        }
        else {
          let error = issues.find(i => i.type === 'ApiQueryError');
          if (!error) {
            let newIssues = issues.slice();
            newIssues.push({type: 'ApiQueryError', message: 'Ошибка подключения к серверу.'});
            setIssues(newIssues);
          }
        };
      });
    }
    else {
      let error = issues.find(i => i.type === 'emailFormat');
      if (!error) {
        let newIssues = issues.slice();
        newIssues.push({type: 'emailFormat', message: 'Email указан некорректно.'});
        setIssues(newIssues);
      };
      if (!validFields.email){
        let tempValidFields = validFields;
        tempValidFields.email = 0;
        setValidFields(tempValidFields);
      };
    }
  }

  const onBlurPass = () => {
    const pass1: any = validatePass(pass);
    let errToDel: Array<number> = [];
    let errToAdd: Array<any> = [];
    if ((pass1 && pass1.length > 0)){
      if (issues.length > 0){
        let errorIndex = issues.findIndex(e => e.type === 'passFormat');
        if (errorIndex !== -1) errToDel.push(errorIndex);
      }
    }
    else {
      let error = issues.find(i => i.type === 'passFormat');
      if (!error) {
        errToAdd.push({type: 'passFormat', message: 'Пароль должен иметь длинну от 6 до 30 символов.'});
      }
    };
    if (pass === confPass){
      if (issues.length > 0){
        let errorIndex = issues.findIndex(e => e.type === 'passConf');
        if (errorIndex !== -1) errToDel.push(errorIndex);
      }
    }
    else {
      let error = issues.find(i => i.type === 'passConf');
      if (!error) {
        errToAdd.push({type: 'passConf', message: 'Пароли не совпадают.'})
      }
    };
    if (errToAdd.length > 0){
      let newIssues = issues.slice();
      errToAdd.forEach(error => {
        newIssues.push(error);
      })
      setIssues(newIssues);
    };
    if (errToDel.length > 0){
      let newIssues = issues.slice();
      errToDel.forEach(errorIndex => {
        newIssues.splice(errorIndex, 1);
      })
      setIssues(newIssues);
    };
    
    if (pass.length > 5 && confPass.length > 5 && (pass === confPass)) {
      if (!validFields.pass){
        let tempValidFields = validFields;
        tempValidFields.pass = 1;
        setValidFields(tempValidFields);
      };
    }
    else {
      if (validFields.pass){
        let tempValidFields = validFields;
        tempValidFields.pass = 0;
        setValidFields(tempValidFields);
      };
    }
  }
  const onInputMessenger = (e: any) => {
    setConnectVal(e.target.value);
    setTimeout(() => {
      let m: any = validateMessangerId(e.target.value);
      if (m && m.length > 0) {
        if (!validFields.messenger){
          let tempValidFields = validFields;
          tempValidFields.messenger = 1;
          setValidFields(tempValidFields);
        };
        if (issues.length > 0){
          let errorIndex = issues.findIndex(e => e.type === 'messengerFormat');
          if (errorIndex !== -1){
            let newIssues = issues.slice();
            newIssues.splice(errorIndex, 1);
            setIssues(newIssues);
          }
        }
      }
      else {
        let error = issues.find(i => i.type === 'messengerFormat');
        if (!error) {
          let newIssues = issues.slice();
          newIssues.push({type: 'messengerFormat', message: 'ID мессенджера должен иметь длинну от 3 до 30 символов.'})
          setIssues(newIssues);
        };
        if (validFields.messenger){
          let tempValidFields = validFields;
          tempValidFields.messenger = 0;
          setValidFields(tempValidFields);
        };
      }
    }, 500);
  }
  const onConfirmRegistration = () => {
    if (validFields.login && validFields.email && validFields.pass && validFields.messenger){
      setQueryInProgress(1);
      fetchData('registerUser', {email: email, username: login, pass: pass, mainContactVal: connectVal, mainContactType: connectType}).then((r: any) => {
        if (r.isSucces){
          if (r.data.status === 200){
            console.log('User registerred succes');
            //localStorage.setItem('aToken', JSON.stringify(r.data.tokens.accessToken));
            //localStorage.setItem('rToken', JSON.stringify(r.data.tokens.refreshToken));
            let user: User = {authorized: false, id: r.data.userid, name: r.data.username, email: r.data.email};
            dispatch(setUserData(user));
            setQueryInProgress(2);
            setResultMessage({type: 1, message: 'Регистрация прошла успешно!'});
            setTimeout(() => {
              navigate('/confirm');
            }, 1000);
          }
          else {
            setResultMessage({type: 2, message: 'Ошибка регистрации пользователя!'});
            setQueryInProgress(0);
          };
        }
        else {
          setResultMessage({type: 2, message: 'Ошибка регистрации пользователя!'});
          setQueryInProgress(0);
        }
        //setQueryInProgress(false);
      }).catch((e) => {
        setResultMessage({type: 2, message: 'Ошибка соединения с БД'});
        setQueryInProgress(0);
      });
    }
  }
  const onTogglePassField = () => {
    const newVal: string = passFieldType === 'password' ? 'text': 'password';
    setPassFieldType(newVal);
  }
  const onToggleConfPassField = () => {
    const newVal: string = confPassFieldType === 'password' ? 'text': 'password';
    setConfPassFieldType(newVal);
  }

  const okSymbol = <span>&#128076;</span>;
  const invalidSymbol = <span>&#128078;</span>;
  const issuesList = <Stack spacing={1}>{issues.map((el, i) => <Alert severity="error" key={el.message} className="Alert-wrapper">{el.message}</Alert>)}</Stack>;
  const issuesBlock = issues.length > 0 ? issuesList: null;
  let rMessage = null;
  switch (resultMessage.type){
    case 1: rMessage = <Alert severity="success">{resultMessage.message}</Alert>; break;
    case 2: rMessage = <Alert severity="error">{resultMessage.message}</Alert>; break;
  }
  let confrirmBlock = null;
  switch (queryInProgress){
    case 0: confrirmBlock = <Button variant="contained" onClick={onConfirmRegistration}>Готово</Button>; break;
    case 1: confrirmBlock = <Button variant="contained" disabled><CircularProgress className="ButtonLoader" size="1em" color="primary"/>Готово</Button>; break;
    case 2: confrirmBlock = <Button variant="contained" disabled>Готово</Button>; break;
  };
  return (
    <div className="App">
      <div className="Auth-content-wrapper">
        <div className="Auth-logo-wrapper" onClick={() => navigate("/")}>
          <LogoIcon type="main" />
        </div>
        <div className="AuthForm">
          <h1>Регистрация</h1>
            {rMessage}
            {issuesBlock}
            <div>
              <TextField id="login-input" label="Логин" size="small" value={login}
              onChange={(e) => {setLogin(e.target.value.trim())}} onBlur={onLoginValidate} className="Standart-input" autoComplete="off"/>
            </div>
            <div>
              <TextField id="email-input" label="Email" size="small" value={email}
              onChange={(e) => {setEmail(e.target.value.trim())}} onBlur={onEmailValidate} className="Standart-input" autoComplete="off"/>
            </div>
            <div>
              <FormControl variant="outlined" size="small">
                <InputLabel htmlFor="registration-password" className="Password-label">Пароль</InputLabel>
                <OutlinedInput
                  id="registration-password"
                  type={passFieldType}
                  value={pass}
                  onChange={(e) => {setPass(e.target.value.trim())}}
                  onBlur={onBlurPass}
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
            <div>
              <FormControl variant="outlined" size="small">
                <InputLabel htmlFor="registration-password-confirm" className="Password-label">Ещё раз</InputLabel>
                <OutlinedInput
                  id="registration-password-confirm"
                  type={confPassFieldType}
                  value={confPass} 
                  onChange={(e) => {setConfPass(e.target.value.trim())}} 
                  onBlur={onBlurPass}
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
            </div>
            <div>
              <FormControl size="small" className="Standart-select Auth-select">
                <InputLabel id="select-messanger-type">Способ связи</InputLabel>
                <Select
                  label="Способ связи"
                  labelId="select-messanger-type"
                  id="select-messanger"
                  value={connectType}
                  onChange={(e) => {setConnectType(Number(e.target.value))}}
                >
                  <MenuItem value={0}>Telegram</MenuItem>
                  <MenuItem value={1}>WhatsApp</MenuItem>
                  <MenuItem value={2}>Signal</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div>
              <TextField id="messenger-input" label="Никнейм" size="small" value={connectVal}
                onChange={onInputMessenger} className="Standart-input" autoComplete="off"/>
            </div>
            {confrirmBlock}
            <p><Link to='/login'>Есть аккаунт?</Link></p>
          </div>
          <p>© Dollarhub</p>
      </div>
    </div>
  );
}

export default Registration;