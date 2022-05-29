import React from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import NotFoundIcon from '../icons/NotFoundIcon';
import '../App.scss';

function NoMatch() {
  const navigate = useNavigate();

  return (
    <div className='App'>
      <div className="App-center-wrapper">
        <div>
          <NotFoundIcon iconClass="Not-Found-Wrapper" elClass="Not-Found-El"/>
        </div>
        <p className="Page-error-p">Похоже, такой страницы не существует.</p>
        <Button variant="contained" onClick={() => navigate('/')}>На главную</Button>
      </div>
    </div>
  );
}

export default NoMatch;