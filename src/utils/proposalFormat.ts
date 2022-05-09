export const getCurrencyVal = (code: any): string => {
    let result = '';
    switch(code){
        case 0: result = '$'; break;
        case 1: result = '€'; break;
        case 2: result = '£'; break;
        case 3: result = '¥'; break;
        default : result = '$';
    }
    return result;
}
export const getStringDate = (date: any): string => {
    let d = new Date(date);
    let m: any = d.getMonth() + 1;
    m = m < 10 ? `0${m}`: m;
    const  result = `${d.getDate()}.${m}.${d.getFullYear()}`;
    return result;
}
export const getEmojiCurrency = (code: any): string => {
    let result = '';
    switch(code){
        case 0: result = '💵'; break;
        case 1: result = '💶'; break;
        case 2: result = '💷'; break;
        case 3: result = '💴'; break;
        default : result = '💵';
    }
    return result;
}
export const getMessengerName = (code: any): string => {
    let result = '';
    switch(code){
        case 0: result = 'Telegram'; break;
        case 1: result = 'WhatsApp'; break;
        case 2: result = 'Signal'; break;
        case 3: result = 'Viber'; break;
        default : result = 'Telegram';
    }
    return result;
}
export const formatAmount = (amount: number): string => {
    let result = String(amount);
    if (result.length > 3){
        const tale = result.slice(-3);
        const head = result.slice(0, result.length - 3);
        result = `${head} ${tale}`;
    }
    return result;
}