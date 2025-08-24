import { type NextRequest, NextResponse } from 'next/server';

import { allRoutes, publicRoutes } from './routes';

function convertUrlToKey(url: string) {
    return url.startsWith('/') ? url.slice(1) : url;
}

function treatRedirectUrl(request: NextRequest, destination: string) {
    const url = request.nextUrl.clone();
    const keyDestination = convertUrlToKey(destination);
    const authRoute = publicRoutes.find(route => route.key === keyDestination);

    if(!authRoute) {
        url.pathname =  destination;
        return url;
    }
    const keyPathname = convertUrlToKey(url.pathname);
    if(keyPathname !== keyDestination) {
        const host = request.headers.get('host') ?? undefined;
        const redirectToUrl = new URL(destination, url);
        url.host = !host ? redirectToUrl.host : host;
        url.searchParams.set('redirectTo', redirectToUrl.href);
    }
    url.searchParams.set('source', 'finance');
    url.searchParams.set('env', 'dev');
    url.pathname = authRoute.path;
    return url;
}

function redirectTo(
    request: NextRequest,
    redirectTo: string = '/dashboard',
): NextResponse {
    const destination = treatRedirectUrl(request, redirectTo);
    return NextResponse.redirect(destination);
}

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


function isAuthRoute(path: string): boolean {
    const authPaths = publicRoutes.map((item) => item.path);
    return authPaths.includes(path);
}


async function isTokenValid(token: string): Promise<boolean> {
    return true;
}


export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if(pathname === '/' ) {
        return redirectTo(request);
    }

    if(!isAppRoute(pathname)) {
        return NextResponse.next();
    }

    const token = request.cookies.get('financeAccessToken')?.value;

    const isAuth = isAuthRoute(pathname);

    const isAuthenticated = token ? await isTokenValid(token) : false;

    if(!isAuth && !isAuthenticated) {
        return redirectTo(request, '/sign-in');
    }

    if(isAuth && isAuthenticated) {
        return redirectTo(request);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|\\.well-known/.*).*)'],
};