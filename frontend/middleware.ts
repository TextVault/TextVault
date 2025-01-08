import { NextResponse } from 'next/server';

export function middleware(req: any) {
  const origin = req.headers.get('origin');
  const allowedOrigin = 'https://textvault.ru';

  if (origin !== allowedOrigin) {
    return NextResponse.json({ message: 'CORS policy: No access from this origin' }, {status: 403});
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};