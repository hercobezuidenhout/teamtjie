import { PropsWithChildren } from 'react';
import { AppProviders } from './providers';
import { getSession } from '@/app/utils';
import { fonts } from './fonts';
import { ColorModeScript } from '@chakra-ui/react';
import { theme } from '@/theme/theme';

const RootLayout = async ({ children }: PropsWithChildren) => {
  const initialSession = await getSession();

  return (
    <html lang="en" className={fonts.dmSans.variable}>
      <body>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <AppProviders initialSession={initialSession}>{children}</AppProviders>
      </body>
    </html>
  );
};

export default RootLayout;
