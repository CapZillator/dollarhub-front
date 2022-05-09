export interface ErrorFormat {
    type: string;
    message: string;
}

export const getEditError = (type: string) => {
    const eArchive: Array<ErrorFormat> = [
        {type: 'invalidCityName', message: 'Название города должно быть длиннее 1 символа!'},
        {type: 'invalidAmountProportion', message: 'Минимальная сумма не может быть больше максимальной!'},
        {type: 'invalidExchangeVal', message: 'Курс обмена валют должен быть выше 0!'},
        {type: 'badRequest', message: 'Ошибка редактирования объявления.'},
        {type: 'internalServerError', message: 'Ошибка обращения к серверу.'},
        {type: 'passDoesntMatch', message: 'Пароли не совпадают!'},
        {type: 'invalidPassLength', message: 'Пароль должен иметь длинну от 6 до 30 символов.'},
        {type: 'invalidNewPassLength', message: 'Новый пароль должен иметь длинну от 6 до 30 символов.'},
        {type: 'invalidMessangerVal', message: 'Никнейм мессенджера должен быть длиннее 2 символов!'},
        {type: 'failMessangerEdit', message: 'Ошибка редактирования никнейма мессенджера!'},
        {type: 'failPassEdit', message: 'Ошибка редактирования пароля!'},
        {type: 'wrongPass', message: 'Пароль указан неверно!'}
    ];
    let err = eArchive.find(e => e.type === type);
    if (err) return err;
    else return null;
}