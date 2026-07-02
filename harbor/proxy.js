import { NextResponse } from 'next/server';

export function proxy(request) {
  const url = request.nextUrl.clone();
  const { pathname } = url;

  if (pathname.startsWith('/academy-videos/')) {
    const file = decodeURIComponent(pathname.split('/').pop() || '');
    const requestHeaders = new Headers(request.headers);

    url.pathname = '/api/academy-videos';
    url.search = '';
    url.searchParams.set('file', file);
    requestHeaders.set('x-harbor-academy-asset-file', file);
    return NextResponse.rewrite(url, {
      request: {
        headers: requestHeaders,
      },
    });
  }

  if (pathname.startsWith('/academy-documents/customer/')) {
    const file = decodeURIComponent(pathname.split('/').pop() || '');
    const requestHeaders = new Headers(request.headers);

    url.pathname = '/api/academy-documents';
    url.search = '';
    url.searchParams.set('file', file);
    requestHeaders.set('x-harbor-academy-asset-file', file);
    return NextResponse.rewrite(url, {
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/academy-videos/:path*',
    '/academy-documents/customer/:path*',
  ],
};
