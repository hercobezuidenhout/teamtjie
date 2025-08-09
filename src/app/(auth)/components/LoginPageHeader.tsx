'use client';

import { Heading, Text, VStack } from '@chakra-ui/react';

interface LoginPageHeaderProps {
  signup?: boolean;
}

export const LoginPageHeader = ({ signup }: LoginPageHeaderProps) => (
  <VStack spacing={3}>
    <Heading as="h1" size="xl">
      {signup ? 'Get Started with Teamtjie' : 'Log in to Teamtjie'}
    </Heading>
    <Text>
      {signup ? 'Sign in to create an account.' : 'Please log in to your account.'}
    </Text>
  </VStack>
);