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
    // Check for last visited space in cookie
    const lastSpaceId = request.cookies.get('last-space-id')?.value;

    if (lastSpaceId) {
      // Direct redirect to last visited space (cookie-based, instant)
      return NextResponse.redirect(new URL(`/spaces/${lastSpaceId}`, request.url));
    }

    // No cookie: fallback to /spaces page which will handle the redirect
    // This only happens on first visit or after cookie expires
    return NextResponse.redirect(new URL('/spaces', request.url));
  }

  // Track last visited space by setting cookie when visiting space pages
  const isSpacePage = /^\/spaces\/\d+/.test(pathname);
  if (hasSession && isSpacePage) {
    const spaceIdMatch = pathname.match(/^\/spaces\/(\d+)/);
    if (spaceIdMatch) {
      const spaceId = spaceIdMatch[1];
      const currentCookie = request.cookies.get('last-space-id')?.value;

      // Only set cookie if it's different (avoid unnecessary cookie updates)
      if (currentCookie !== spaceId) {
        response.cookies.set('last-space-id', spaceId, {
          maxAge: 60 * 60 * 24 * 30, // 30 days
          path: '/',
          sameSite: 'lax',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
        });
      }
    }
  }

  if (!hasSession && isRoot) {
    return NextResponse.redirect(new URL('/login', request.url));
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
