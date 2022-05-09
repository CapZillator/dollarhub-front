import React from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import '../App.scss';

function NoMatch() {
  const navigate = useNavigate();

  return (
    <div className='App'>
      <div className="App-center-wrapper">
        <h1 className="Page-main-header">404</h1>
        <p className="Page-error-p">Похоже, такой страницы не существует.</p>
        <Button variant="contained" onClick={() => navigate('/')}>На главную</Button>
      </div>
    </div>
  );
}

export default NoMatch;