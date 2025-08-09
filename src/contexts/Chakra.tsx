import {
  ChakraProvider,
  cookieStorageManagerSSR,
  localStorageManager,
} from '@chakra-ui/react';
import { PropsWithChildren } from 'react';
import { WebNextRequest } from 'next/dist/server/base-http/web';
import { theme } from '@/theme/theme';

interface ChakraProps extends PropsWithChildren {
  cookies: string;
}

export const Chakra = ({ cookies, children }: ChakraProps) => {
  const colorModeManager = !!cookies
    ? cookieStorageManagerSSR(cookies)
    : localStorageManager;

  return (
    <ChakraProvider colorModeManager={colorModeManager} theme={theme}>
      {children}
    </ChakraProvider>
  );
};

export const getServerSideProps = ({ req }: { req: WebNextRequest }) => ({
  props: {
    cookies: req.headers.cookie ?? '',
  },
});
