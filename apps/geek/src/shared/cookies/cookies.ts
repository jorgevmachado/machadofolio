import { cookies } from '@repo/services';

const domain = typeof window !== 'undefined' ? window.location.hostname : '.localhost';


export function getAccessToken() {
  if (typeof window !== 'undefined') {
    return cookies.get('accessToken');
  }
  return;
}

export function setAccessToken(token: string) {
  return cookies.set('accessToken', token, domain);
}

export function removeAccessToken() {
  return cookies.remove('accessToken', domain);
}