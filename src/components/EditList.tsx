import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchData, fetchDataExtendedUrl } from '../api/fetch';
import { AppContext,Ad } from '../utils/context';
import { setMyProposalsList } from '../utils/reducer';
import { getCurrencyVal, getStringDate, formatAmount } from '../utils/proposalFormat';
import HeadMenu from '../components/HeadMenu';
import Footer from '../components/Footer';
import AccessDenied from './AccessDenied';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import '../styles/Main.scss';
//Иконки
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import PaymentsIcon from '@mui/icons-material/Payments';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';


function EditList() {
    const {state, dispatch} = useContext(AppContext);
    const [proposalReq, setProposalReq] = useState<boolean>(false);
    const [adToDelID, setAdToDelID] = useState<number>(0);
    const [open, setOpen] = useState<boolean>(false);
    const [delButtonBlocked, setDelButtonBlocked] = useState<boolean>(false);
    const navigate = useNavigate();
    const muiElSize = "small";//Размер компонентов MUI
    
    useEffect(() => {
        if (!proposalReq){
            setProposalReq(true);
            if (state.myProposals && state.myProposals.length){
                setProposalReq(false);
            } 
            else {
                if (state.userData.authorized){
                    fetchData('getByAuthor', {id: state.userData.id}).then((r: any) => {
                        if (r.isSucces){
                            if (r.data.status === 200){
                                let proposals: Array<Ad> = r.data.data;
                                dispatch(setMyProposalsList(proposals));
                            };
                            setProposalReq(false);
                        }
                    }).catch((err) => {
                        console.log(err);
                        setProposalReq(false);
                    });
                };
            };
        };
    }, [state.myProposals]);

    const onDelAdClick = (id: number) => {
        setAdToDelID(id);
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setAdToDelID(0);
    };
    const onConfirmDel = () => {
        setDelButtonBlocked(true);
        let aToken: any = localStorage.getItem('aToken');
        aToken = aToken ? JSON.parse(aToken): null;
        const now = Date.now();
        if (aToken && aToken.expires > now) {
            fetchDataExtendedUrl('delete', {token: aToken.token}, String(adToDelID)).then((r: any) => {
                if (r.isSucces){
                    if (r.data.status === 200){
                        let newAds = state.myProposals.slice();
                        const i = newAds.findIndex(a => a.id === adToDelID);
                        if (i >= 0) {
                            newAds.splice(i);
                            dispatch(setMyProposalsList(newAds));
                            setAdToDelID(0);
                        };
                        setDelButtonBlocked(false);
                        handleClose();
                    };
                }
            }).catch((err) => {
                console.log(err);
            });
        };
    }

    const delButton = delButtonBlocked ? <Button variant="outlined" disabled size={muiElSize} className="Button-outlined">Да</Button>: 
        <Button variant="outlined" onClick={onConfirmDel} size={muiElSize} className="Button-outlined">Да</Button>;
    let listingsBlock = <div><Box>
            <CircularProgress color="inherit"/>
        </Box></div>;
    if (state.myProposals.length > 0){
        let pArray = state.myProposals.slice();
        let sortFunc = (a: any, b: any) => {
            if (a.date < b.date) return 1;
            else if (a.date === b.date) return 0;
            else return -1;
        };
        pArray.sort(sortFunc);
        const list = pArray.map((p: any, i) => {
            return <div key={p.id} id={p.id} className="Single-proposal">
                <div className="Single-proposl-meta">
                    <div className="Single-proposl-currency">{getCurrencyVal(p.currency)}</div>
                    <div className="Single-proposl-id">#{p.id}</div>
                </div>
                <h4 className="Single-proposal-header">{p.location}</h4>
                <div className="Single-proposal-body-wrapper">
                    <div className="In-row-left">
                        <PaymentsIcon className="Info-icon" fontSize="inherit"/> 
                        <span>От {formatAmount(p.amountMin)} до {formatAmount(p.amountMax)} {getCurrencyVal(p.currency)}</span>
                    </div>
                    <div className="In-row-left">
                        <CurrencyExchangeIcon className="Info-icon" fontSize="inherit"/> 
                        <span>1{getCurrencyVal(p.currency)} - {p.exchangeRate}₽</span>
                    </div>
                    <div className="In-row-left">
                        <CalendarMonthIcon className="Info-icon" fontSize="inherit"/> 
                        <span>{getStringDate(p.date)}</span>
                    </div>
                </div>
                <Button variant="contained" startIcon={<EditIcon  />} onClick={() => navigate(`/edit/${p.id}`)} 
                    size={muiElSize} className="Edit-Button">
                        Редактировать
                </Button>
                <Button variant="contained" startIcon={<DeleteIcon  />} onClick={() => onDelAdClick(p.id)} 
                    size={muiElSize} className="Edit-Button">
                        Удалить
                </Button>
            </div>;
        });
        listingsBlock = <div className="My-proposals">{list}</div>
    };
    let mainContent = <Box>
            <CircularProgress color="inherit"/>
        </Box>;
    if (state.userData.authorized) {
        mainContent = <div className="Page-content-flex-wrapper-full-height">
            <div className="Content-flex-column-space-between">
                <header className="Page-header-top-indent">
                <h1>Мои объявления</h1>
                </header>
                {listingsBlock}
                <div className="Alone-button">
                    <Button variant="contained" startIcon={<KeyboardBackspaceIcon  />} onClick={() => navigate(-1)} size={muiElSize}>
                        Назад
                    </Button>
                </div>
                <Dialog onClose={handleClose} open={open}>
                    <DialogTitle>Подтвердите действие</DialogTitle>
                    <DialogContent>
                        Удалить объявление?
                    </DialogContent>
                    <DialogActions>
                        {delButton}
                        <Button variant="contained" autoFocus onClick={handleClose} size={muiElSize}>Нет</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>;
    }
    else {
        mainContent = <div className="Page-content-flex-wrapper"><AccessDenied /></div>;
    };
    return (
        <div className="App">
            <HeadMenu />
            <div className="App-content-wrapper">
                {mainContent}
                <Footer />
            </div>
        </div>
    );
}

export default EditList;