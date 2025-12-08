'use client';

import {
  IconButton,
  HStack,
  Textarea,
  VStack,
  Text,
  Tooltip,
  Button,
  Icon,
} from '@chakra-ui/react';
import { ICONS } from '@/lib/icons/icons';

interface SentimentFormProps {
  isSubmitting?: boolean;
  sentiment: number | null;
  note: string;
  showInput: boolean;
  onSentimentChange: (sentiment: number) => void;
  onNoteChange: (note: string) => void;
  onSaveNote: () => void;
}

const sentimentEmojis = ['😟', '😐', '🙂', '😊', '😄'];
const sentimentLabels = ['Poor', 'Fair', 'Good', 'Great', 'Excellent'];

export const SentimentForm = ({
  isSubmitting = false,
  sentiment,
  note,
  showInput,
  onSentimentChange,
  onNoteChange,
  onSaveNote,
}: SentimentFormProps) => {
  return (
    <VStack align="stretch" spacing={4}>
      <HStack spacing={2} width="full" justifyContent="space-between">
        {sentimentEmojis.map((emoji, index) => {
          const value = index + 1;
          const isSelected = sentiment === value;
          return (
            <Tooltip
              key={value}
              label={sentimentLabels[index]}
              borderRadius="md"
              backgroundColor="chakra-subtle-bg"
              color="chakra-subtle-text"
            >
              <IconButton
                aria-label={sentimentLabels[index]}
                icon={<Text fontSize="lg">{emoji}</Text>}
                onClick={() => onSentimentChange(value)}
                variant={isSelected ? 'solid' : 'ghost'}
                colorScheme={isSelected ? 'blue' : 'gray'}
                size="sm"
                isDisabled={isSubmitting}
                _hover={{
                  backgroundColor: isSelected ? undefined : 'chakra-subtle-bg'
                }}
              />
            </Tooltip>
          );
        })}
      </HStack>

      {showInput && (
        <VStack align="stretch" spacing={2}>
          <Textarea
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            placeholder="Add a note (optional)"
            maxLength={500}
            rows={3}
            size="sm"
          />
          <HStack justify="space-between">
            <Text fontSize="xs" color="chakra-subtle-text">
              {note.length}/500
            </Text>
            <Button
              variant="ghost"
              colorScheme="blue"
              leftIcon={<Icon as={ICONS.SaveIcon} />}
              onClick={onSaveNote}
              isLoading={isSubmitting}
            >
              Save
            </Button>
          </HStack>
        </VStack>
      )}
    </VStack>
  );
};
