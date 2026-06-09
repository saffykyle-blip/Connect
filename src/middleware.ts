import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/builder')) {
    const hasAccess = request.cookies.get('connect_access')?.value === 'true';
    if (!hasAccess) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/builder/:path*'],
};
