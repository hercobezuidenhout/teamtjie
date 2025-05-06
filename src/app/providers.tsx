'use client';

import { AbilityContextProvider } from '@/contexts/AbilityContextProvider';
import { AnalyticsProvider } from '@/contexts/AnalyticsProvider';
import { DialogProvider } from '@/contexts/DialogProvider';
import { theme } from '@/theme/theme';
import { ChakraProvider } from '@chakra-ui/react';
import { Session, SessionContextProvider } from '@supabase/auth-helpers-react';
import { createBrowserClient } from '@supabase/ssr';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren, useState } from 'react';

const getBrowserClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

const getQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  });

interface AppProvidersProps extends PropsWithChildren {
  initialSession?: Session | null;
}

export const AppProviders = ({
  children,
  initialSession,
}: AppProvidersProps) => {
  const [supabaseClient] = useState(getBrowserClient);
  const [queryClient] = useState(getQueryClient);

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem("chakra-ui-color-mode", "light");
  }

  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <SessionContextProvider
          supabaseClient={supabaseClient}
          initialSession={initialSession}
        >
          <AnalyticsProvider>
            <AbilityContextProvider>
              <DialogProvider>
                {children}
              </DialogProvider>
            </AbilityContextProvider>
          </AnalyticsProvider>
        </SessionContextProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
};
