import React from 'react';
import { AppActions } from './actions';

export interface AppState {
    userData: User;
    proposalsList: Ad[];
    cityList: City[];
    myProposals: Ad[];
    authors: Authors[];
    page: Page;
}

export interface User {
    authorized: boolean;
    id: number;
    name: string;
}
export interface Ad {
    id: number;
    author: number,
    location: string;
    amountMin: number;
    amountMax: number;
    currency: number;
    exchangeRate: number;
    date: string;
}
export interface City {
    id: number;
    name: string;
}
export interface Authors {
    id: number;
    messangerType: number;
    messangerVal: string;
}
export interface Page {
    current: number;
    total: number;
    isset: boolean;
}

export const initData: AppState = {
    userData: { authorized: false, id: 0, name: '' },
    proposalsList: [], 
    cityList: [],
    myProposals: [],
    authors: [],
    page: { current: 1, total: 0, isset: false }
};


export const AppContext = React.createContext<{
    state: AppState;
    dispatch: React.Dispatch<AppActions>;
    }>({
        state: initData,
        dispatch: () => undefined,
    });