import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { type CookieOptions, createServerClient } from '@supabase/ssr';
import { getDeactivatedUserByEmail } from '@/prisma/queries/get-deactivated-user-by-email';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('redirectTo') ?? '/';

    if (code) {
        const cookieStore = cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        cookieStore.set({ name, value, ...options });
                    },
                    remove(name: string, options: CookieOptions) {
                        cookieStore.delete({ name, ...options });
                    },
                },
            }
        );

        try {
            const { error } = await supabase.auth.exchangeCodeForSession(code);
            const { data } = await supabase.auth.getUser();

            if (data.user?.email) {
                const deactivatedUser = await getDeactivatedUserByEmail(data.user.email);

                if (deactivatedUser) {
                    await supabase.auth.signOut();
                    return NextResponse.redirect(`${origin}/deactivated`);
                }
            }

            if (!error) {
                return NextResponse.redirect(`${origin}${next}`);
            } else {
                console.error(error);
            }
        } catch (error) {
            console.error(error);
        }
    } else {
        console.info('No code found in request');
    }

    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}