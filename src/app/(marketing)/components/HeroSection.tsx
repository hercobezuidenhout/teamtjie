import { Button, Heading, Text, VStack } from '@chakra-ui/react';
import Link from 'next/link';

export const HeroSection = () => {
  return (
    <VStack>
      <VStack gap={8}>
        <Heading size="2xl">
          Teamtjie
        </Heading>
        <Text>Helping teams build better cultures</Text>
        <Button size="lg" as={Link} href="/login">Get Started</Button>
      </VStack>
    </VStack >
  );
};
