import { PropsWithChildren } from 'react';
import { AppProviders } from './providers';
import { getSession } from '@/app/utils';
import { fonts } from './fonts';

const RootLayout = async ({ children }: PropsWithChildren) => {
  const initialSession = await getSession();

  return (
    <html lang="en" className={fonts.dmSans.variable}>
      <body>
        <AppProviders initialSession={initialSession}>{children}</AppProviders>
      </body>
    </html>
  );
};

export default RootLayout;
