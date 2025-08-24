import { cookies } from '@repo/services'

const domain = typeof window !== 'undefined' ? window.location.hostname : '.localhost';


export function getAccessToken() {
    if(typeof window !== 'undefined') {
        return cookies.get('financeAccessToken')
    }
    return;
}

export function setAccessToken(token: string) {
    return cookies.set('financeAccessToken', token, domain);
}

export function removeAccessToken() {
    return cookies.remove('financeAccessToken', domain);
}