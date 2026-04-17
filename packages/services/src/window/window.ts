export function isBrowser(): boolean {
 return typeof window !== 'undefined';
}

export function isDocument(): boolean {
 return typeof document !== 'undefined';
}

export function documentCookie(): string {
 return isDocument() ? document.cookie : '';
}
