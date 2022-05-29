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
    let source = String(amount);
    let signQty = source.length;
    let result = '';
    while (signQty > 3){
        const tale = source.slice(-3);
        source = source.slice(0, source.length - 3);
        result = result.length ? `${tale} ${result}`: `${tale}`;
        signQty = signQty - 3;
    }
    result = `${source} ${result}`;
    return result;
}
export const formatEmail = (email: string): string => {
    const result = email.length > 16 ? `${email.slice(0, 8)}...${email.slice(-8)}`: email;
    return result;
}