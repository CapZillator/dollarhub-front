import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchData } from '../api/fetch';
import { AppContext } from '../utils/context';
import { getCurrencyVal, getStringDate, getMessengerName, formatAmount } from '../utils/proposalFormat';
import HeadMenu from '../components/HeadMenu';
import Footer from '../components/Footer';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import '../App.scss';
//Иконки
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import PaymentsIcon from '@mui/icons-material/Payments';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ChatIcon from '@mui/icons-material/Chat';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

function Proposal() {
    const {state, dispatch} = useContext(AppContext);
    const [proposal, setProposal] = useState<any>();
    const [author, setAuthor] = useState<any>();
    const [contactVisibility, setContactVisibility] = useState<boolean>(false);
    //const [finishLoad, setFinishLoad] = useState<boolean>(false);

    const [authorID, setAuthorID] = useState(0);
    const [proposalState, setProposalState] = useState<number>(0);
    const [authorState, setAuthorState] = useState<number>(0);
    let params = useParams();
    const navigate = useNavigate();
    const muiElSize = "small";
    
    useEffect(() => {
        if (!proposalState){
            setProposalState(1);
            let id = Number(params.proposalId);
            let currentProposal = state.proposalsList.find(p => p.id === id);
            if (currentProposal) {
                setProposal(currentProposal);
                setAuthorID(currentProposal.author);
                setProposalState(2);
            }
            else {
                fetchData('getProposals').then((r: any) => {
                    if (r.isSucces){
                        if (r.data.status === 200){
                            const freshProposals = r.data.data;
                            currentProposal = freshProposals.find((p: any) => p.id === id);
                            if (currentProposal){
                                setProposal(currentProposal);
                                setAuthorID(currentProposal.author);
                                setProposalState(2);
                            };
                        };
                    }
                }).catch((err) => {
                    console.log(err);
                    setTimeout(() => {
                        setProposalState(2);
                    }, 5000);
                });
            };
        } 
        else if (proposalState === 2){
            if (!authorState){
                setAuthorState(1);
                if (state.authors.length){
                    let a = state.authors.find(el => el.id === authorID);
                    if (a) {
                        setAuthor(a);
                        setAuthorState(2);
                    };
                }
                else {
                    fetchData('getAuthorData', {id: authorID}).then((r: any) => {
                        if (r.isSucces){
                            if (r.data.status === 200){
                                setAuthor(r.data.data);
                                setAuthorState(2);
                            }
                        }
                    }).catch((err) => {
                        console.log(err);
                        setTimeout(() => {
                            setAuthorState(0);
                        }, 5000);
                    });
                }
            };
        };
    }, [proposalState, authorState]);
    
    if (!params.proposalId){
        navigate('');
    }
    const onContactClick = () => {
        let s = contactVisibility ? false: true;
        setContactVisibility(s);
    };
    const contactInfo = contactVisibility ? <span className="HideContact">{author.mainContactVal}</span>:
        <span className="ShowContact" onClick={onContactClick}>показать</span>;
    let proposalBody = <div><CircularProgress color="inherit" /></div>;
    if (proposalState === 2 && authorState === 2) {
        proposalBody = <div className="Single-proposal-wrapper">
            <h1>{proposal.location}</h1>
            <div>
                <div className="In-row-left">
                    <div className="Proposal-id">ID</div>
                    <div className="Proposal-id">#{proposal.id}</div>
                </div>
                <div className="In-row-left">
                    <PaymentsIcon className="Info-icon" fontSize="inherit"/>От {formatAmount(proposal.amountMin)} до {formatAmount(proposal.amountMax)} {getCurrencyVal(proposal.currency)}
                </div>
                <div className="In-row-left">
                    <CurrencyExchangeIcon className="Info-icon" fontSize="inherit"/> 1{getCurrencyVal(proposal.currency)} - {proposal.exchangeRate}₽
                </div>
                <div className="In-row-left">
                    <CalendarMonthIcon className="Info-icon" fontSize="inherit"/> {getStringDate(proposal.date)}
                </div>
                <div className="In-row-left">
                    <AccountCircleIcon className="Info-icon" fontSize="inherit"/>{author.username}
                </div>
                <div className="In-row-left" style={{ width: (getMessengerName(author.mainContactType).length + author.mainContactVal.length - 2) + "rem" }}>
                    <ChatIcon className="Info-icon" fontSize="inherit"/> {getMessengerName(author.mainContactType)}{contactInfo}
                </div>
            </div>
            <div className="Button-wrapper">
                <Button variant="contained" startIcon={<KeyboardBackspaceIcon  />} onClick={() => navigate("/")} size={muiElSize}>Назад</Button>
            </div>
        </div>;
    };
    return (
        <div className="App">
            <HeadMenu />
            <div className="App-content-wrapper">
                <div className="Page-content-flex-wrapper">
                    {proposalBody}
                </div>
                <Footer />
            </div>
        </div>
    );
}

export default Proposal;