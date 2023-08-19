import { decodeJwt } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest} from "next/server";

export function middleware (request: NextRequest){
  const path = request.nextUrl.pathname
  const isPublicPath = path === '/sign-in' || path === '/sign-up';
  
  // verify jwt token
  const token = request.cookies.get('token')?.value;
  const verifiedToken = token && verifyJwtToken(token)

  if(!verifiedToken && !isPublicPath){
    const response = NextResponse.redirect(new URL('/sign-in', request.nextUrl));
    response.cookies.delete('token')
    return response;
  }

  if(isPublicPath && verifiedToken) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

}

function verifyJwtToken(token: string): Boolean {
  try {
    const payload = decodeJwt(token);
    return !!payload;
  } catch (error) {
    console.log('[jwtVerify]',error);
    return false;
  }
}

export const config = {
  // matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
  // matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)',],
  matcher: ['/cart', '/sign-in','/sign-up'],

};
