'use client';

import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  HStack,
  useToast,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useParams } from 'next/navigation';
import { useDailySentimentQuery } from '@/services/sentiment/queries/use-daily-sentiment-query';
import { useCreateSentimentMutation } from '@/services/sentiment/mutations/use-upsert-sentiment-mutation';
import { useUpdateSentimentMutation } from '@/services/sentiment/mutations/use-update-sentiment-mutation';
import { SentimentForm } from './SentimentForm';
import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

export const DailySentimentWidget = () => {
  const params = useParams();
  const scopeId = parseInt(params['spaceId'] as string, 10);
  const toast = useToast();

  const { data: savedSentiment, isLoading } = useDailySentimentQuery({ scopeId });
  const createMutation = useCreateSentimentMutation();
  const updateMutation = useUpdateSentimentMutation();

  const [sentiment, setSentiment] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [currentSentimentId, setCurrentSentimentId] = useState<number | null>(null);

  // Sync state with saved sentiment when it loads
  useEffect(() => {
    if (savedSentiment) {
      setSentiment(savedSentiment.sentiment);
      setNote(savedSentiment.note || '');
      setCurrentSentimentId(savedSentiment.id);
    }
  }, [savedSentiment]);

  const handleSentimentChange = async (newSentiment: number) => {
    setSentiment(newSentiment);
    setShowInput(true);
    setNote(''); // Reset note for new entry

    // Create new sentiment record in DB
    try {
      const result = await createMutation.mutateAsync({
        scopeId,
        sentiment: newSentiment,
        note: '',
      });

      if (result) {
        setCurrentSentimentId(result.id);
      }
    } catch (error) {
      toast({
        title: 'Error saving sentiment',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSaveNote = async () => {
    if (currentSentimentId === null) return;

    try {
      await updateMutation.mutateAsync({
        id: currentSentimentId,
        note,
      });

      toast({
        title: 'Note saved',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });

      setShowInput(false);
    } catch (error) {
      toast({
        title: 'Error saving note',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Card>
      <CardHeader pb={2}>
        <HStack justify="space-between">
          <Heading size="sm">How are you feeling today?</Heading>
          {isLoading && <Spinner size="sm" />}
        </HStack>
      </CardHeader>
      <CardBody pt={0}>
        {!isLoading && (
          <VStack align="stretch" spacing={3}>
            <SentimentForm
              sentiment={sentiment}
              note={note}
              showInput={showInput}
              onSentimentChange={handleSentimentChange}
              onNoteChange={setNote}
              onSaveNote={handleSaveNote}
              isSubmitting={isSubmitting}
            />
            {savedSentiment && (
              <Text fontSize="xs" color="chakra-subtle-text">
                Last captured {formatDistanceToNow(new Date(savedSentiment.updatedAt), { addSuffix: true })}
              </Text>
            )}
          </VStack>
        )}
      </CardBody>
    </Card>
  );
};
