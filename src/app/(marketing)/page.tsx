import { VStack } from '@chakra-ui/react';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { HeroSection } from './components/HeroSection';
import { RefreshLoggedInUser } from './components/RefreshLoggedInUser';

const MarketingPage = async () => {
  const queryClient = new QueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RefreshLoggedInUser />
      <VStack alignItems="stretch" gap={32} pb={32}>
        <HeroSection />
      </VStack>
    </HydrationBoundary>
  );
};

export default MarketingPage;
