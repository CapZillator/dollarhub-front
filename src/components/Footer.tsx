import React, { useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../utils/context';
import '../styles/Footer.scss';
import '../styles/Logo.scss';
//Иконки
import LogoIcon from '../icons/LogoIcon';

function Footer() {
    const {state, dispatch} = useContext(AppContext);

    const navigate = useNavigate();
    const muiElSize = "small";//Размер компонентов MUI
    /*
    const linksBlock = state.userData.authorized ? 
        <ul>
            <li><Link to="/">Главная</Link></li>
            <li><Link to="/mylist">Мои объявления</Link></li>
            <li><Link to="/create">Создать объявление</Link></li>
            <li><Link to="/profile">Профиль</Link></li>
        </ul>:
        <ul>
            <li><Link to="/">Главная</Link></li>
            <li><Link to="/login">Вход</Link></li>
            <li><Link to="/registration">Регистрация</Link></li>
        </ul>;
        */
    const year = new Date().getFullYear();

    return (
        <footer className="Footer-main-wrapper">
            <div className="Footer-main-content">
                <div>
                    <LogoIcon className="Footer-logo-icon" type="footer" onClick={() => navigate('/')}/>
                </div>
                <div>
                    <p>© Dollarhub - {year}</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;