'use client';

import {
  Badge,
  HStack,
  Text,
  Tooltip,
  Spinner,
} from '@chakra-ui/react';
import { useSentimentAverageQuery } from '@/services/sentiment/queries/use-sentiment-average-query';
import { useScopeSettingsQuery } from '@/services/sentiment/queries/use-scope-settings-query';
import { useCurrentUserQuery } from '@/services/user/queries/use-current-user-query';
import { useUserScopeRoleQuery } from '@/services/user/queries/use-user-scope-role-query';

interface AverageSentimentBadgeProps {
  scopeId: number;
}

const sentimentEmojis = ['😟', '😐', '🙂', '😊', '😄'];

export const AverageSentimentBadge = ({ scopeId }: AverageSentimentBadgeProps) => {
  const { data: currentUser } = useCurrentUserQuery();
  const { data: userRole } = useUserScopeRoleQuery(currentUser?.id || '', scopeId);
  const { data: settings } = useScopeSettingsQuery({ scopeId });

  const isAdmin = userRole?.role === 'ADMIN';
  const canViewAverage = isAdmin || settings?.showAverageSentiment;

  const { data: average, isLoading } = useSentimentAverageQuery({
    scopeId,
    enabled: canViewAverage,
  });

  if (!canViewAverage || isLoading) {
    return isLoading ? <Spinner size="sm" /> : null;
  }

  if (!average || average.average === null || average.count === 0) {
    return null;
  }

  const roundedAverage = Math.round(average.average);
  const emoji = sentimentEmojis[roundedAverage - 1];

  return (
    <Tooltip
      label={`Based on ${average.count} team ${
        average.count === 1 ? 'member' : 'members'
      }`}
      borderRadius="md"
      backgroundColor="chakra-subtle-bg"
      color="chakra-subtle-text"
    >
      <Badge
        colorScheme="blue"
        px={3}
        py={2}
        borderRadius="md"
        cursor="help"
      >
        <HStack spacing={2}>
          <Text fontSize="sm">Team Average:</Text>
          <Text fontSize="lg">{emoji}</Text>
          <Text fontSize="sm" fontWeight="bold">
            {average.average.toFixed(1)}
          </Text>
        </HStack>
      </Badge>
    </Tooltip>
  );
};
