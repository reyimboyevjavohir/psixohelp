import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const accessToken = req.cookies.get('accessToken')?.value;
  const userRole = req.cookies.get('userRole')?.value;

  // Himoyalangan sahifalar — login talab qiladi
  const authRequired = ['/profil', '/admin', '/superadmin'];
  const isAuthRequired = authRequired.some((p) => pathname.startsWith(p));

  if (isAuthRequired && !accessToken) {
    return NextResponse.redirect(new URL('/kirish', req.url));
  }

  // Admin sahifalari
  if (pathname.startsWith('/admin') && userRole !== 'ADMIN' && userRole !== 'SUPERADMIN') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // SuperAdmin sahifalari
  if (pathname.startsWith('/superadmin') && userRole !== 'SUPERADMIN') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Kirgan foydalanuvchi kirish/royxat sahifalariga kirmaydi
  if ((pathname === '/kirish' || pathname === '/royxatdan-otish') && accessToken) {
    return NextResponse.redirect(new URL('/profil', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profil/:path*', '/admin/:path*', '/superadmin/:path*', '/kirish', '/royxatdan-otish'],
};
