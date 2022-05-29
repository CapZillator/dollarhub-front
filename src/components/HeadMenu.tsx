import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../utils/context';
import { setMyProposalsList, setUserData } from '../utils/reducer';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import '../styles/Main.scss';
import '../styles/Logo.scss';
//Иконки
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import HomeIcon from '@mui/icons-material/Home';
import LogoIcon from '../icons/LogoIcon';

function HeadMenu() {
    const {state, dispatch} = useContext(AppContext);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const navigate = useNavigate();
    const muiElSize = "small";//Размер компонентов MUI

    const onLogOutClick = () => {
        localStorage.clear();
        dispatch(setUserData({ authorized: false, id: 0, name: "", email: ""}));//Сбросить все личные данные пользователя
        dispatch(setMyProposalsList([]));//Сбросить список объявлений ползователя
        navigate('/');
    };

    const authBlock = state.userData.authorized ? 
        <div className="Header-menu-auth-wrapper">
            <div>
                <Tooltip title="Главная" className="Tooltip">
                    <IconButton className="Header-menu-icon" onClick={() => navigate('/')}>
                        <HomeIcon />
                    </IconButton>
                </Tooltip>
            </div>
            <div>
                <Tooltip title="Мои объявления" className="Tooltip">
                    <IconButton className="Header-menu-icon" onClick={() => navigate('/mylist')}>
                        <LibraryBooksIcon />
                    </IconButton>
                </Tooltip>
            </div>
            <div>
                <Tooltip title="Создать" className="Tooltip">
                    <IconButton className="Header-menu-icon" onClick={() => navigate('/create')}>
                        <AddCircleIcon />
                    </IconButton>
                </Tooltip>
            </div>
            <div>
                <Tooltip title="Профиль" className="Tooltip">
                    <IconButton className="Header-menu-icon" onClick={() => navigate('/profile')}>
                        <AccountCircleIcon />
                    </IconButton>
                </Tooltip>
            </div>
            <div>
                <Tooltip title="Выход" className="Tooltip">
                    <IconButton className="Header-menu-icon" onClick={onLogOutClick}>
                        <LogoutIcon />
                    </IconButton>
                </Tooltip>
            </div>
        </div>:
        <Tooltip title="Вход" className="Tooltip">
            <IconButton className="Header-menu-icon" onClick={() => navigate('/login')}>
                <LoginIcon />
            </IconButton>
        </Tooltip>;
    return (
        <div className="Header-menu-wrapper">
            <div onClick={() => navigate('/')}>
                <LogoIcon />
            </div>
            <div className="Header-menu-auth-wrapper">
                {authBlock}
            </div>
        </div>
    );
}

export default HeadMenu;