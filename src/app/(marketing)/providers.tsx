'use client';

import { PropsWithChildren } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '@/theme/theme';

export const MarketingProviders = ({ children }: PropsWithChildren) => {
  return (
    <>
      <ChakraProvider theme={theme}>
        {children}
      </ChakraProvider>
    </>
  );
};
