import React from 'react';

interface AppContextProps {
  state: any;
  dispatch: ({ type }: { type: string }, { action }: {action: any}) => void;
}
export const ContextApp = React.createContext({} as AppContextProps);

export const initData: any = {
  authState: false,
  userName: 'Валютчик',
  proposalsList: []
};//Значения по умолчанию

export function reducer(state: any, action: any){
  switch (action.type){
    //Записываем данные в случае, если пользователь сообщил свои координаты
    case 'setAuthState': return {userName: state.userName, authState: action.authState, proposalsList: state.proposalsList};
    case 'setUserName': return {userName: action.userName, authState: state.authState, proposalsList: state.proposalsList};
    case 'setUserData': return {userName: action.userName, authState: action.authState, proposalsList: state.proposalsList};
    case 'setProposalsList': return {userName: state.userName, authState: state.authState, proposalsList: action.proposalsList};
    case 'setSet': return {userName: state.userName, authState: state.authState, proposalsList: [13, 17]};
    case 'exit': return {userName: state.userName, authState: false};
    default: throw new Error();
  }
}