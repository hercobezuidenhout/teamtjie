'use client';

import { useSession } from '@supabase/auth-helpers-react';
import mixpanel from 'mixpanel-browser';
import { PropsWithChildren, createContext, useContext } from 'react';

interface AnalyticsContextValue {
    trackEvent: (event: string, metadata?: any) => void;
}

export const AnalyticsContext = createContext<AnalyticsContextValue>({
    trackEvent: () => { }
});

export const AnalyticsProvider = ({ children }: PropsWithChildren) => {
    const session = useSession();

    mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN, { debug: true, track_pageview: true, persistence: 'localStorage', ignore_dnt: true });


    const trackEvent = (event: string, metadata: any) => {
        if (session?.user.id) {
            mixpanel.identify(session.user.id);
        }

        mixpanel.track(event, metadata);
    };

    return <AnalyticsContext.Provider value={{ trackEvent }}>{children}</AnalyticsContext.Provider>;
};

export const useAnalytics = () => useContext(AnalyticsContext);