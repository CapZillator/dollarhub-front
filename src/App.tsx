import React, { useReducer, useEffect, useState } from 'react';
import './App.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Registration from './components/Registration';
import Login from './components/Login';
import NoMatch from './components/NoMatch';
import Main from './components/Main';
import Proposal from './components/Proposal';
import Proposals from './components/Proposals';
import Profile from './components/Profile';
import Edit from './components/Edit';
import EditAd from './components/EditAd';
import CreateAd  from './components/CreateAd';
import EditList from './components/EditList';
import LoaderCash from './components/LoaderCash';
import Confirm from './components/Confirm';
import { fetchData } from './api/fetch';
import { AppContext, User, initData, Authors, City } from './utils/context';
import { appReducer, setUserData, setAuthors, setCitiesList } from './utils/reducer';
import theme from './components/theme';
import { ThemeProvider } from '@mui/material/styles';
import { StyledEngineProvider } from '@mui/material/styles';
import Backdrop from '@mui/material/Backdrop';

function App() {
  const [state, dispatch] = useReducer(appReducer, initData);
  //const [loadFlags, setLoadFlags] = useState<Array<number>>(new Array(3).fill(0));
  const [authState, setAuthState] = useState<number>(0);
  const [citiesState, setCitiesState] = useState<number>(0);
  const [authorState, setAuthorState] = useState<number>(0);
  const [loadComplete, setLoadComplete] = useState<boolean>(true);
  
  useEffect(() => {
    if (!authState){//Флаг авторизация
      console.log('Start auth in App component...');
      setAuthState(1);
      let aToken: any = localStorage.getItem('aToken');
      let rToken: any = localStorage.getItem('rToken');
      aToken = aToken ? JSON.parse(aToken): null;
      rToken = rToken ? JSON.parse(rToken): null;
      const now = Date.now();
      if (aToken) {//Удалось получить токен авторизации
        console.log("auth with aToken...")
        if (aToken.expires > now){
          console.log("token is fresh")
          fetchData('tokenLogin', {token: aToken.token}).then((r: any) => {
              if (r.isSucces){
                switch (r.data.status){
                  case 200: {
                    console.log(r.data);
                    let u: User = { authorized: true, id: r.data.userid, name: r.data.username, email: ''};
                      dispatch(setUserData(u));
                      setAuthState(2);
                      console.log('!!! Authorized');
                  }; break;
                  case 301: {
                      requestRefreshTokens(rToken.token);
                  }; break;
                };
              };
            }).catch((err) => {
              console.log(err.message);
              //Сбросить флаг прохождения авторизации через 5 сек.
              setTimeout(() => {
                setAuthState(0);
              }, 5000);
            });
        }
        else {
          console.log("token is too old")
          console.log(rToken)
          if (rToken){
            requestRefreshTokens(rToken.token);
          }
        }
      }
    };
    if (!citiesState){//Флаг списка городов
      console.log('Start requesting citieslist in App component...');
      setCitiesState(1);
      fetchData('getCityList').then((r: any) => {
        console.log('fetching citylist')
        if (r.isSucces){
          if (r.data.status === 200) {
            dispatch(setCitiesList(r.data.list));
            setCitiesState(2);
          };
        };
      }).catch((err) => {
          console.log(err);
          //Сбросить флаг получения списка городов через 5 сек.
          setTimeout(() => {
            setCitiesState(0);
          }, 5000);
      });
    };
    if (!authorState){//Флаг списка авторов объявлений
      console.log('Start requesting authorslist in App component...');
      setAuthorState(1);
      fetchData('getAllAuthors').then((r: any) => {
        if (r.isSucces){
          if (r.data.status === 200) {
            dispatch(setAuthors(r.data.data));
            setAuthorState(2);
          };
        };
      }).catch((err) => {
          console.log(err);
          //Сбросить флаг получения списка авторов объявлений через 5 сек.
          setTimeout(() => {
            setAuthorState(0);
          }, 5000);
      });
    };
    if ((citiesState == 2) && (authorState == 2)) setLoadComplete(false);
    console.log(`${authState} ${citiesState} ${authorState}`);
  }, [authState, citiesState, authorState]);

  const requestRefreshTokens = (rToken: string) => {
    fetchData('refreshTokens', {token: rToken}).then((r: any) => {
        if (r.isSucces){
          switch (r.data.status){
            case 201: {
                console.log('Tokens refreshed!');
                localStorage.setItem('aToken', JSON.stringify(r.data.tokens.accessToken));
                localStorage.setItem('rToken', JSON.stringify(r.data.tokens.refreshToken));
                let u: User = { authorized: true, id: r.data.userid, name: r.data.username, email: ''};
                dispatch(setUserData(u));
                setAuthState(2);
                console.log('!!! Authorized');
            }; break;
          };
        }
    });
  };
  let content = <Backdrop
    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    open={loadComplete}
    >
      <LoaderCash />
  </Backdrop>;
  if ((citiesState === 2) && (authorState === 2)) content = <BrowserRouter>
    <Routes>
      <Route path='/' element={<Main />}/>
      <Route path='/proposals' element={<Proposals />}>
        <Route path=':proposalId' element={<Proposal />} />
      </Route>
      <Route path='/edit' element={<Edit />}>
        <Route path=':proposalId' element={<EditAd />} />
      </Route>
      <Route path='/mylist' element={<EditList />} />
      <Route path='/registration' element={<Registration />} />
      <Route path='/login' element={<Login />} />
      <Route path='/create' element={<CreateAd />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='/confirm' element={<Confirm />} />
      <Route path='*' element={<NoMatch />} />
    </Routes>
  </BrowserRouter>;
  return (
    <AppContext.Provider value={{state, dispatch}}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          {content}
        </ThemeProvider>
      </StyledEngineProvider> 
    </AppContext.Provider>
  );
}

export default App;
