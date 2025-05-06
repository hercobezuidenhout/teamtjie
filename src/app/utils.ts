import { cookies, headers } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { RequestOptions } from '@/services/network';

export const getSession = async () => {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const result = await supabase.auth.getSession();

  return result.data.session ?? undefined;
};

export const getServersideRequestOptions = (): RequestOptions => {
  const pageHeaders = Object.fromEntries(headers().entries());

  return {
    headers: pageHeaders,
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  };
};
