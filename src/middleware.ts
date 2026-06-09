import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isSubscriberArea =
    request.nextUrl.pathname.startsWith('/builder') ||
    request.nextUrl.pathname.startsWith('/install');

  if (isSubscriberArea) {
    const hasAccess = request.cookies.get('connect_access')?.value === 'true';
    if (!hasAccess) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/builder/:path*', '/install/:path*'],
};
