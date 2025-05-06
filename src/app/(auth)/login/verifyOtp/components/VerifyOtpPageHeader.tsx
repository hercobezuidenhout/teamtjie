'use client'

import { Heading, Text, VStack } from '@chakra-ui/react'

export const VerifyOtpPageHeader = () => (
  <VStack spacing={3}>
    <Heading as="h1" size="xl">
      Verify OTP
    </Heading>
    <Text>An OTP has been sent to your email.</Text>
  </VStack>
)