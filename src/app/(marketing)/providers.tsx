'use client'

import { PropsWithChildren } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { useFeatureFlagsQuery } from '@/services/feature-flags/queries/use-feature-flags-query'
import { FeatureFlagProvider } from '@/contexts/FeatureFlagProvider'

export const MarketingProviders = ({ children }: PropsWithChildren) => {
  const featureFlags = useFeatureFlagsQuery()

  return (
    <>
      <ChakraProvider>
        <FeatureFlagProvider {...featureFlags}>{children}</FeatureFlagProvider>
      </ChakraProvider>
    </>
  )
}
