import {User, Ad, City, Authors, Page} from './context';

export enum ActionType {
    SetUserData,
    SetProposalsList,
    SetCityList,
    SetMyProposalsList,
    SetPage,
    SetAuthors
}
export interface SetUserData {
    type: ActionType.SetUserData;
    payload: User;
}

export interface SetProposalsList {
    type: ActionType.SetProposalsList;
    payload: Ad[];
}
export interface SetCityList {
    type: ActionType.SetCityList;
    payload: City[];
}
export interface SetMyProposalsList {
    type: ActionType.SetMyProposalsList;
    payload: Ad[];
}
export interface SetAuthors {
    type: ActionType.SetAuthors;
    payload: Authors[];
}
export interface SetPage {
    type: ActionType.SetPage;
    payload: Page;
}

export type AppActions = SetUserData | SetProposalsList | SetCityList | SetMyProposalsList | SetAuthors | SetPage ;