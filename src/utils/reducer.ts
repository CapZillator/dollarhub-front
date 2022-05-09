import { AppState, User, Ad, City, Authors, Page } from './context';
import { ActionType, AppActions, SetUserData, SetProposalsList, SetCityList, SetMyProposalsList, SetAuthors, SetPage } from './actions'

export function appReducer(state: AppState, action:  AppActions): AppState {
    switch (action.type) {
        case ActionType.SetUserData:
            return { ...state, userData: action.payload };
        case ActionType.SetProposalsList:
            return { ...state, proposalsList: action.payload };
        case ActionType.SetCityList:
            return { ...state, cityList: action.payload };
        case ActionType.SetMyProposalsList:
            return { ...state, myProposals: action.payload };
        case ActionType.SetAuthors:
            return { ...state, authors: action.payload };
        case ActionType.SetPage:
            return { ...state, page: action.payload };
        default:
            return state;
    }
}
// helper functions to simplify the caller
export const setUserData = (user: User): SetUserData => ({
    type: ActionType.SetUserData,
    payload: user,
});

export const setProposalsList = (proposalsList: Ad[]): SetProposalsList => ({
    type: ActionType.SetProposalsList,
    payload: proposalsList,
});

export const setCitiesList = (cityList: City[]): SetCityList => ({
    type: ActionType.SetCityList,
    payload: cityList,
});

export const setMyProposalsList = (myProposals: Ad[]): SetMyProposalsList => ({
    type: ActionType.SetMyProposalsList,
    payload: myProposals,
});

export const setAuthors = (authors: Authors[]): SetAuthors => ({
    type: ActionType.SetAuthors,
    payload: authors,
});

export const setPage = (page: Page): SetPage => ({
    type: ActionType.SetPage,
    payload: page,
});