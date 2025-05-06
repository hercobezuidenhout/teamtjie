import { type CookieOptions, createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

const protectedRoutes = [/^\/spaces/];

// Refer to https://supabase.com/docs/guides/auth/server-side/creating-a-client?environment=middleware
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
        },
      },
    }
  );

  const session = await supabase.auth.getSession();
  const pathname = request.nextUrl.pathname;

  const isApi = pathname.startsWith('/api/');

  if (isApi) {
    return response;
  }

  const hasSession = !!session.data.session;


  const isProtected = protectedRoutes.some((route) => route.test(pathname));

  if (!hasSession && isProtected) {
    return NextResponse.redirect(
      new URL(`/login?redirectTo=${pathname}`, request.url)
    );
  }

  const isRoot = pathname === '/';

  if (hasSession && isRoot) {
    return NextResponse.redirect(new URL('/spaces', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
