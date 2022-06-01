//const apiURL = 'https://api.dollarhub.me/';
let apiURL = 'https://api.dollarhub.me/';

export const fetchData = async (type: string, body?: any) => {
    //let apiUrl: string = 'http://localhost:4000/';
    let apiUrl: string = apiURL;
    let options: any = null;
    const mode = "cors";
    const origin = "*";
    switch (type){
      case 'checkLogin': {
        apiUrl += 'auth/checklogin';
        options = {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          mode: mode, // no-cors, *cors, same-origin
          headers: {
            'Origin': origin,
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type',
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify(body) 
        };
      }; break;
      case 'checkEmail': {
        apiUrl += 'auth/checkemail';
        options = {
          method: 'POST', 
          mode: mode, 
          headers: {
            'Origin': origin,
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body) 
        };
      }; break;
      case 'registerUser': {
        apiUrl += 'auth/register';
        options = {
          method: 'POST', 
          mode: mode,
          headers: {
            'Origin': origin,
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body) 
        };
      }; break;
      case 'standartLogin': {
        apiUrl += 'auth/login';
        options = {
          method: 'POST', 
          mode: mode, 
          headers: {
            'Origin': origin,
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body) 
        };
      }; break;
      case 'tokenLogin': {
        apiUrl += 'auth/loginwithtoken';
        options = {
          method: 'POST', 
          mode: mode, 
          headers: {
            'Origin': origin,
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body) 
        };
      }; break;
      case 'refreshTokens': {
        apiUrl += 'auth/refreshtokens';
        options = {
          method: 'POST', 
          mode: mode, 
          headers: {
            'Origin': origin,
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body) 
        };
      }; break;
      case 'getProposals': {
        apiUrl += 'exchange';
        options = {
          method: 'GET',
          mode: mode,
          headers: {
            'Origin': origin,
            'Access-Control-Request-Method': 'GET',
            'Access-Control-Request-Headers': 'Content-Type'
          },
        };
      }; break;
      case 'getCityList': {
        apiUrl += 'citylist';
        options = {
          method: 'GET',
          mode: mode,
          headers: {
            'Origin': origin,
            'Access-Control-Request-Method': 'GET',
            'Access-Control-Request-Headers': 'Content-Type'
          },
        };
      }; break;
      case 'getAuthorData': {
        apiUrl += 'auth/getauthor';
        options = {
          method: 'POST', 
          mode: mode, 
          headers: {
            'Origin': origin,
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body) 
        };
      }; break;
      case 'createProposal': {
        apiUrl += 'exchange';
        options = {
          method: 'POST', 
          mode: mode, 
          headers: {
            'Origin': origin,
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body) 
        };
      }; break;
      case 'searchByParams': {
        apiUrl += 'exchange/searchbyparams';
        options = {
          method: 'POST', 
          mode: mode, 
          headers: {
            'Origin': origin,
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body) 
        };
      }; break;
      case 'updateProposal': {
        apiUrl += 'exchange';
        options = {
          method: 'PUT', 
          mode: mode, 
          headers: {
            'Origin': origin,
            'Access-Control-Request-Method': 'PUT',
            'Access-Control-Request-Headers': 'Content-Type',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body) 
        };
      }; break;
      case 'getByID': {
        apiUrl += 'exchange/searchbyid';
        options = {
          method: 'POST', 
          mode: mode, 
          headers: {
            'Origin': origin,
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body) 
        };
      }; break;
      case 'getByAuthor': {
        apiUrl += 'exchange/searchbyauthor';
        options = {
          method: 'POST', 
          mode: mode, 
          headers: {
            'Origin': origin,
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body) 
        };
      }; break;
      case 'getAllAuthors': {
        apiUrl += 'auth/getallauthors';
        options = {
          method: 'GET', 
          mode: mode,
          headers: {
            'Origin': origin,
            'Access-Control-Request-Method': 'GET',
            'Access-Control-Request-Headers': 'Content-Type'
          },
        };
      }; break;
      case 'editAuthMessanger': {
        apiUrl += 'auth/editmessanger';
        options = {
          method: 'POST', 
          mode: mode,
          headers: {
            'Origin': origin,
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body) 
        };
      }; break;
      case 'editUserPass': {
        apiUrl += 'auth/edituserpass';
        options = {
          method: 'POST', 
          mode: mode,
          headers: {
            'Origin': origin,
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body) 
        };
      }; break;
      case 'activateCode': {
        apiUrl += 'auth/activate';
        options = {
          method: 'POST', 
          mode: mode,
          headers: {
            'Origin': origin,
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body) 
        };
      }; break;
    };
    let response = await fetch(apiUrl, options);
    let result = {isSucces: false, message: 'Ошибка отправки запроса на сервер: ', data: null}
    if (!response.ok) result.message += response.status;
    else {
        let data = await response.json();
        result = {isSucces: true, message: 'Запрос на сервер выполнен успешно.', data: data}
    };
    return result;
}

export const fetchDataExtendedUrl = async (type: string, body?: any, extendedUrl?: string) => {
  let apiUrl: string = apiURL;
  let options: any = null;
  const mode = "cors";
  const origin = "*";
  switch (type){
    case 'delete': {
      apiUrl += 'exchange/';
      options = {
        method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
        mode: mode, // no-cors, *cors, same-origin
        headers: {
          'Origin': origin,
          'Access-Control-Request-Method': 'DELETE',
          'Access-Control-Request-Headers': 'Content-Type',
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(body) 
      };
    }; break;
    case 'getProposals': {
      apiUrl += `exchange/`;
      options = {
        method: 'GET',
        mode: mode,
        headers: {
          'Origin': origin,
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Content-Type'
        },
      };
    }; break;
  };
  apiUrl += extendedUrl;
  let response = await fetch(apiUrl, options);
  let result = {isSucces: false, message: 'Ошибка отправки запроса на сервер: ', data: null}
  if (!response.ok) result.message += response.status;
  else {
      let data = await response.json();
      result = {isSucces: true, message: 'Запрос на сервер выполнен успешно.', data: data}
  };
  return result;
}