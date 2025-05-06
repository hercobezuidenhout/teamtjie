import { Button, Flex, Heading, Link, Text, VStack } from '@chakra-ui/react'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { getFeatureFlags } from '@/prisma/queries/get-feature-flags'

const MarketingPage = async () => {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['feature-flags'],
    queryFn: () => getFeatureFlags(),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Flex width="full" justifyContent="space-around" height="90vh" alignItems="center">
        <VStack>
          <Heading>Teamtjie</Heading>
          <Text>Helping you understand your team</Text>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </VStack>
      </Flex>
    </HydrationBoundary>
  )
}

export default MarketingPage
