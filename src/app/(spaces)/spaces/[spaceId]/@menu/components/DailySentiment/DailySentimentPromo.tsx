'use client';

import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  VStack,
  Button,
  HStack,
  Icon,
  Badge,
} from '@chakra-ui/react';
import { FiTrendingUp, FiLock } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface DailySentimentPromoProps {
  scopeId: number;
}

export const DailySentimentPromo = ({ scopeId }: DailySentimentPromoProps) => {
  const router = useRouter();

  const handleUpgrade = () => {
    router.push(`/settings/${scopeId}/billing`);
  };

  return (
    <Card>
      <CardHeader pb={2}>
        <HStack justify="space-between" align="center">
          <HStack spacing={2}>
            <Icon as={FiTrendingUp} boxSize={5} color="chakra-primary-color" />
            <Heading size="sm">Daily Sentiments</Heading>
          </HStack>
          <Badge colorScheme="blue" fontSize="xs">
            PREMIUM
          </Badge>
        </HStack>
      </CardHeader>
      <CardBody pt={0}>
        <VStack align="stretch" spacing={4}>
          <Text fontSize="sm" color="chakra-subtle-text">
            Track your team&apos;s mood and engagement daily. Get insights into team health and well-being over time.
          </Text>

          <Button
            size="sm"
            colorScheme="blue"
            variant="outline"
            onClick={handleUpgrade}
            leftIcon={<Icon as={FiLock} />}
          >
            Upgrade to Premium
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
};
