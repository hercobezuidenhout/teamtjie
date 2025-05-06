import * as React from 'react';
import { PropsWithChildren, ReactNode } from 'react';
import { Box, Flex, VStack } from '@chakra-ui/react';
import { SpacesHeader } from './components/SpacesHeader';
import { getUserAndScopes } from './utils';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { SpacesProviders } from './providers';
import { redirect } from 'next/navigation';
import { PageProps } from '@/app/page-props';
import { getScopeProfile } from '@/prisma';
import { NavDrawer } from './components/NavDrawer';
import { TeamList } from './components/TeamList';

const headerHeight = '4rem';
const footerHeight = '0rem';
const mainHeight = `calc(100vh - ${headerHeight} - ${footerHeight})`;

export interface SpacesLayoutProps extends PropsWithChildren {
  menu: ReactNode;
  navigation: ReactNode;
}

const SpacesLayout = async ({ children, menu, params }: SpacesLayoutProps & PageProps) => {
  const data = await getUserAndScopes();
  const spaceId = params['spaceId'];

  if (!data) {
    redirect('/login');
  }

  const queryClient = new QueryClient();

  queryClient.setQueryData(['users', 'current'], data?.user);
  queryClient.setQueryData(['scopes'], data?.scopes);

  const scope = await getScopeProfile(Number(spaceId));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SpacesProviders>
        <VStack minH="100vh" gap={0}>
          <SpacesHeader />
          <Flex as="main" maxW="container.xl" width="full" marginInline="auto" marginTop={16}>
            <Box
              as="nav"
              alignItems="stretch"
              w={{ base: 0, md: 'xs' }}
              minW={{ base: 0, md: 'xs' }}
              visibility={{ base: 'collapse', md: 'visible' }}
              maxHeight={mainHeight}
              data-testid="menu-container"
              py={{ base: 0, md: 8 }}
              px={{ base: 0, md: 4 }}
              position="sticky"
              top={headerHeight}
            >
              <NavDrawer>
                <TeamList scope={scope} />
              </NavDrawer>
            </Box>
            <Box
              alignItems="stretch"
              justifyItems="stretch"
              overflow="auto"
              pb={10}
              p={{ base: 4, md: 8 }}
              flexGrow={1}
            >
              {children}
            </Box>
            <Box
              display={{ base: 'none', xl: 'block' }}
              maxH={mainHeight}
              w="sm"
              minW="xs"
              alignItems="stretch"
              justifyItems="stretch"
              overflow="auto"
              p={{ base: 4, md: 8 }}
              position="sticky"
              top={headerHeight}
            >
              {menu}
            </Box>
          </Flex>
        </VStack>
      </SpacesProviders>
    </HydrationBoundary>
  );
};

export default SpacesLayout;
