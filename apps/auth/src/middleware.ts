import { type NextRequest, NextResponse } from 'next/server';
import { allRoutes, publicRoutes } from './routes';

function isAppRoute(path: string): boolean {
    const validRoutes = allRoutes.map((item) => item.path);
    if (
        path === '/favicon.ico' ||
        path.startsWith('/.well-known') ||
        path.match(/\.(png|jpg|jpeg|gif|svg|ico)$/)
    ) {
        return false;
    }
    return validRoutes.includes(path);
}

function validateAuthRoute(path: string): boolean {
    const authPaths = publicRoutes.map((item) => item.path);
    return authPaths.includes(path);
}

function validateToken (request: NextRequest): boolean {
    const token = request.cookies.get('accessToken');
    if(!token) {
        return false;
    }
    try {
        const [, payload] = token.value.split('.');
        if(!payload) {
            request.cookies.delete('accessToken');
            return false;
        }
        const decodedPayload = JSON.parse(atob(payload));

        if (decodedPayload.exp) {
            const currentTime = Math.floor(Date.now() / 1000);
            const valid = decodedPayload.exp > currentTime;
            if(!valid) {
                request.cookies.delete('accessToken');
            }
            return  valid;
        }
        request.cookies.delete('accessToken');
        return false;
    } catch (error) {
        request.cookies.delete('accessToken');
        return false;
    }
}

function redirectToSource(request: NextRequest, source: string, destination: string) {
    const nextURL = request.nextUrl;
    const nextUrlClone = nextURL.clone();
    const redirectTo = nextURL.searchParams.get('redirectTo') ?? undefined;
    const url = new URL(destination, nextUrlClone);
    if(redirectTo) {
        url.searchParams.set('redirectTo', redirectTo);
    }

    switch (source) {
        case 'finance':
            url.pathname = `/systems/${source}`;
            return url;
        case 'geek':
            url.pathname = `/systems/${source}`;
            return url;
        case 'law':
            url.pathname = `/systems/${source}`;
            return url;
        default:
            return url;
    }
}

function treatRedirectUrl(request: NextRequest, destination: string) {
    const url = request.nextUrl.clone();
    const { searchParams } = request.nextUrl;
    const source = searchParams.get('source') ?? undefined;
    if(!source) {
        url.pathname =  destination;
        return url;
    }
    return redirectToSource(request, source, destination);
}

function redirectTo(request: NextRequest, redirectTo: string = '/dashboard') {
    const destination = treatRedirectUrl(request, redirectTo);
    return NextResponse.redirect(destination);
}

export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if(pathname === '/') {
        return redirectTo(request);
    }

    if(!isAppRoute(pathname)) {
        return NextResponse.next();
    }

    const isTokenValid = validateToken(request);
    const isAuthRoute = validateAuthRoute(pathname);

    if(isAuthRoute && isTokenValid) {
        return redirectTo(request);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|\\.well-known/.*).*)'],
};