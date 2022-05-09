export const validateEmail = (email: string) => {
    return email
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
export const validateLogin = (login: string) => {
    return login
    .match(
        /^[A-Za-zА-Яа-я0-9_]{3,30}$/
    );
};
export const validatePass = (pass: string) => {
    return pass
    .match(
        /^.{6,30}$/
    );
};
export const validateMessangerId = (pass: string) => {
    return pass
    .match(
        /^.{3,30}$/
    );
};