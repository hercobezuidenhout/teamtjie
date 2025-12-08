import { type CookieOptions, createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';
import { getFirstSpaceId } from '@/prisma/queries/get-first-space-id';

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
      // Direct redirect to last visited space
      return NextResponse.redirect(new URL(`/spaces/${lastSpaceId}`, request.url));
    }

    // Fallback: Get user's first space from database
    try {
      const userId = session.data.session.user.id;
      const firstSpaceId = await getFirstSpaceId(userId);

      if (firstSpaceId) {
        // Direct redirect to first space
        return NextResponse.redirect(new URL(`/spaces/${firstSpaceId}`, request.url));
      }
    } catch (error) {
      console.error('Error getting first space:', error);
    }

    // Final fallback: redirect to /spaces (which will redirect to create)
    return NextResponse.redirect(new URL('/spaces', request.url));
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
