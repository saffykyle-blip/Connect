import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // /install is accessible in two cases:
  //   1. User has the connect_access cookie (paid subscriber)
  //   2. URL contains ?code=CUS_... (just came from payment callback or restore)
  // This lets the Paystack redirect land without being bounced back to home.
  if (pathname.startsWith('/install')) {
    const hasAccess = request.cookies.get('connect_access')?.value === 'true';
    const hasCode = searchParams.get('code')?.startsWith('CUS_');
    if (!hasAccess && !hasCode) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // /builder still requires the subscriber cookie
  if (pathname.startsWith('/builder')) {
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
