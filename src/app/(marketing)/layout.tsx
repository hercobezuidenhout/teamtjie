import { VStack } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';
import { MarketingProviders } from './providers';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Teamtjie',
  description: 'Helping teams build stronger, more engaged cultures.',
};


const MarketingLayout = ({ children }: PropsWithChildren) => {
  return (
    <MarketingProviders>
      <VStack minH="100vh" gap={0} alignItems="center" justifyContent="space-around">
          {children}
      </VStack>
    </MarketingProviders>
  );
};

export default MarketingLayout;
