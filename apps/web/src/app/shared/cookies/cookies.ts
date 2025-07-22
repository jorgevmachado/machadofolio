import cookies from '@repo/services/cookies/cookies'

const domain = typeof window !== 'undefined' ? window.location.hostname : '.localhost';


export function getAccessToken() {
    return cookies.get('accessToken')
}

export function setAccessToken(token: string) {
    return cookies.set('accessToken', token, domain);
}

export function removeAccessToken() {
    return cookies.remove('accessToken', domain);
}