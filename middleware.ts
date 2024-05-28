import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const protectedPaths = ['/vendors'];
  const currentPath = req.nextUrl.pathname;

  if (protectedPaths.includes(currentPath)) {
    const token = await getToken({ req, secret: process.env.SECRET });

    if (!token) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/vendors'],
};
