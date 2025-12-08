'use client';

import {
  Button,
  HStack,
  Text,
  VStack,
  Box,
} from '@chakra-ui/react';
import { formatDistanceToNow } from 'date-fns';
import { DailySentiment } from '@/services/sentiment/types';

interface SentimentDisplayProps {
  sentiment: DailySentiment;
  onEdit: () => void;
}

const sentimentEmojis = ['😟', '😐', '🙂', '😊', '😄'];
const sentimentLabels = ['Poor', 'Fair', 'Good', 'Great', 'Excellent'];

export const SentimentDisplay = ({ sentiment, onEdit }: SentimentDisplayProps) => {
  const emoji = sentimentEmojis[sentiment.sentiment - 1];
  const label = sentimentLabels[sentiment.sentiment - 1];

  return (
    <VStack align="stretch" spacing={4}>
      <HStack justify="space-between">
        <VStack align="start" spacing={0}>
          <HStack>
            <Text fontSize="4xl">{emoji}</Text>
            <VStack align="start" spacing={0}>
              <Text fontWeight="bold">{label}</Text>
              <Text fontSize="xs" color="chakra-subtle-text">
                Updated {formatDistanceToNow(new Date(sentiment.updatedAt), { addSuffix: true })}
              </Text>
            </VStack>
          </HStack>
        </VStack>
        <Button size="sm" variant="ghost" onClick={onEdit}>
          Edit
        </Button>
      </HStack>

      {sentiment.note && (
        <Box
          p={3}
          borderRadius="md"
          backgroundColor="chakra-subtle-bg"
        >
          <Text fontSize="sm">{sentiment.note}</Text>
        </Box>
      )}
    </VStack>
  );
};
