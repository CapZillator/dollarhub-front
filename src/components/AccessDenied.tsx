import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import { AppContext } from '../utils/context';
import LoginIcon from '@mui/icons-material/Login';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function AccessDenied() {
    const {state, dispatch} = useContext(AppContext);

    const navigate = useNavigate();
    const muiElSize = "small";//Размер компонентов MUI


    return (
        <div className="Access-error-wrapper">
            <h1>Доступ запрещён!</h1>
            <p>У вас не хватает прав для доступа в данный раздел.</p>
            <Button variant="contained"  startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} size={muiElSize} className="Simple-button">
                Назад
            </Button>
            <Button variant="contained"  startIcon={<LoginIcon /> } onClick={() => navigate('/login')} size={muiElSize} className="Simple-button">
                Войти
             </Button>
        </div>
    );
}

export default AccessDenied;