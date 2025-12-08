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
import { SpaceNavigation } from './components/SpaceNavigation';
import { NavDrawer } from './components/NavDrawer';

const headerHeight = '4rem';
const footerHeight = '0rem';
const mainHeight = `calc(100vh - ${headerHeight} - ${footerHeight})`;

interface SpacesLayoutProps extends PropsWithChildren {
  menu: ReactNode;
}

/**
 * Layout for space pages
 * Note: Last visited space tracking is handled in middleware
 */
const SpacesLayout = async ({ children, menu, params }: SpacesLayoutProps & PageProps) => {
  const data = await getUserAndScopes();
  const spaceId = params['spaceId'];

  if (!data) {
    redirect('/login');
  }

  // Check if user has access to this scope
  const numericSpaceId = Number(spaceId);
  const userHasAccess = data.scopes.some((scope: any) => scope.id === numericSpaceId);

  if (!userHasAccess) {
    // User doesn't have access to this scope (deleted or no permission)
    // Redirect to /spaces with a query param to clear the cookie
    redirect('/spaces?clearCookie=true');
  }

  const queryClient = new QueryClient();

  queryClient.setQueryData(['users', 'current'], data?.user);
  queryClient.setQueryData(['scopes'], data?.scopes);

  // Validate that scope exists in database, handle if it doesn't exist
  try {
    await getScopeProfile(numericSpaceId);
  } catch (error) {
    // Scope doesn't exist in database (deleted)
    // Redirect to /spaces with a query param to clear the cookie
    redirect('/spaces?clearCookie=true');
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SpacesProviders>
        <VStack minH="100vh" gap={0}>
          <SpacesHeader />
          <Flex as="main" maxW="container.xl" width="full" marginInline="auto" marginTop={16}>
            <Box
              as="nav"
              display={{ base: 'none', md: 'block' }}
              alignItems="stretch"
              w="sm"
              minW="xs"
              maxHeight={mainHeight}
              py={{ base: 0, md: 8 }}
              px={{ base: 0, md: 4 }}
              position="sticky"
              top={headerHeight}
            >
              <NavDrawer>
                <SpaceNavigation />
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
