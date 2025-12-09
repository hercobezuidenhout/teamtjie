'use client';

import {
  VStack,
  HStack,
  Heading,
  Text,
  Progress,
  IconButton,
  Button,
  Textarea,
  Card,
  CardBody,
  Tooltip,
  Icon,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useHealthCheckQuery } from '@/services/health-check/queries/use-health-check-query';
import { useSaveResponseMutation } from '@/services/health-check/mutations/use-save-response-mutation';
import { useSubscriptionQuery } from '@/services/subscription/queries/use-subscription-query';
import { PremiumFeatureGate } from '@/lib/components/PremiumFeatureGate/PremiumFeatureGate';
import { ICONS } from '@/lib/icons/icons';

const sentimentEmojis = ['😟', '😐', '🙂', '😊', '😄'];
const sentimentLabels = ['Poor', 'Fair', 'Good', 'Great', 'Excellent'];

interface Answer {
  questionId: number;
  score: number | null;
  note: string;
}

export default function HealthCheckPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const spaceId = parseInt(params['spaceId'] as string, 10);
  const checkId = parseInt(params['checkId'] as string, 10);

  // Call all hooks at the top
  const { data: subscriptionData, isLoading: subscriptionLoading } = useSubscriptionQuery(spaceId);
  const { data: healthCheck, isLoading } = useHealthCheckQuery({ healthCheckId: checkId });
  const saveResponseMutation = useSaveResponseMutation();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [initialized, setInitialized] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Show premium gate if no subscription
  if (!subscriptionLoading && !subscriptionData?.hasSubscription) {
    return <PremiumFeatureGate scopeId={spaceId} featureName="Health Checks" />;
  }

  // Initialize answers from existing response or empty (only once per checkId)
  useEffect(() => {
    if (healthCheck?.questions && healthCheck.questions.length > 0 && !initialized) {
      const existingResponse = healthCheck.responses?.[0];

      const initialAnswers = healthCheck.questions.map((q) => {
        const existingAnswer = existingResponse?.answers.find(
          (a) => a.questionId === q.id
        );
        return {
          questionId: q.id,
          score: existingAnswer?.score || null,
          note: existingAnswer?.note || '',
        };
      });

      setAnswers(initialAnswers);
      setCurrentStep(0); // Reset to first question on new health check
      setInitialized(true);
    }
  }, [healthCheck, checkId, initialized]);

  // Reset initialized flag when checkId changes
  useEffect(() => {
    setInitialized(false);
  }, [checkId]);

  if (isLoading) {
    return (
      <VStack minH="100vh" justify="center">
        <Text>Loading health check...</Text>
      </VStack>
    );
  }

  if (!healthCheck || !healthCheck.questions || healthCheck.questions.length === 0) {
    return (
      <VStack minH="100vh" justify="center">
        <Text>Health check not found</Text>
      </VStack>
    );
  }

  if (answers.length === 0) {
    return (
      <VStack minH="100vh" justify="center">
        <Text>Loading questions...</Text>
      </VStack>
    );
  }

  const currentQuestion = healthCheck.questions[currentStep];
  const currentAnswer = answers[currentStep];

  if (!currentQuestion || !currentAnswer) {
    return (
      <VStack minH="100vh" justify="center">
        <Text>Loading...</Text>
      </VStack>
    );
  }

  const isLastQuestion = currentStep === healthCheck.questions.length - 1;
  const progress = ((currentStep + 1) / healthCheck.questions.length) * 100;

  const handleScoreChange = (score: number) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = {
      ...newAnswers[currentStep],
      score,
    };
    setAnswers(newAnswers);
  };

  const handleNoteChange = (note: string) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = {
      ...newAnswers[currentStep],
      note,
    };
    setAnswers(newAnswers);
  };

  const handleNext = async () => {
    if (currentAnswer.score === null) {
      toast({
        title: 'Please select a rating',
        status: 'warning',
        duration: 2000,
      });
      return;
    }

    // Save draft
    await saveDraft();

    if (!isLastQuestion) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveDraft = async () => {
    try {
      await saveResponseMutation.mutateAsync({
        healthCheckId: checkId,
        answers: answers.filter((a) => a.score !== null),
        completed: false,
      });
    } catch (error) {
      // Silent fail for draft saves
      console.error('Error saving draft:', error);
    }
  };

  const handleSubmit = async () => {
    if (currentAnswer.score === null) {
      toast({
        title: 'Please select a rating',
        status: 'warning',
        duration: 2000,
      });
      return;
    }

    try {
      await saveResponseMutation.mutateAsync({
        healthCheckId: checkId,
        answers: answers.filter((a) => a.score !== null),
        completed: true,
      });

      toast({
        title: 'Health check completed!',
        description: 'Thank you for your feedback',
        status: 'success',
        duration: 3000,
      });

      router.push(`/spaces/${spaceId}`);
    } catch (error) {
      toast({
        title: 'Error submitting health check',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleExit = () => {
    onOpen();
  };

  const confirmExit = async () => {
    await saveDraft();
    router.push(`/spaces/${spaceId}`);
  };

  return (
    <>
      <VStack align="stretch" spacing={8} py={8}>
        {/* Header */}
        <HStack justify="space-between">
          <Button
            variant="ghost"
            leftIcon={<Icon as={ICONS.BackIcon} />}
            onClick={handleExit}
          >
            Exit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={saveDraft}
            isLoading={saveResponseMutation.isPending}
          >
            Save Draft
          </Button>
        </HStack>

        {/* Progress */}
        <VStack align="stretch" spacing={2}>
          <HStack justify="space-between">
            <Text fontSize="sm" color="chakra-subtle-text">
              Question {currentStep + 1} of {healthCheck.questions.length}
            </Text>
            <Text fontSize="sm" fontWeight="bold">
              {Math.round(progress)}%
            </Text>
          </HStack>
          <Progress value={progress} colorScheme="blue" borderRadius="full" />
        </VStack>

        {/* Question */}
        <Card>
          <CardBody>
            <VStack align="stretch" spacing={6}>
              <VStack align="stretch" spacing={2}>
                <Heading size="md">{currentQuestion.title}</Heading>
                <Text color="chakra-subtle-text">{currentQuestion.description}</Text>
              </VStack>

              {/* Emoji Selector */}
              <HStack spacing={3} width="full" justifyContent="center" py={4}>
                {sentimentEmojis.map((emoji, index) => {
                  const value = index + 1;
                  const isSelected = currentAnswer?.score === value;
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
                        icon={<Text fontSize="3xl">{emoji}</Text>}
                        onClick={() => handleScoreChange(value)}
                        variant={isSelected ? 'solid' : 'ghost'}
                        colorScheme={isSelected ? 'blue' : 'gray'}
                        size="lg"
                        height="auto"
                        py={4}
                        _hover={{
                          backgroundColor: isSelected ? undefined : 'chakra-subtle-bg'
                        }}
                      />
                    </Tooltip>
                  );
                })}
              </HStack>

              {/* Note */}
              <VStack align="stretch" spacing={1}>
                <Textarea
                  value={currentAnswer?.note || ''}
                  onChange={(e) => handleNoteChange(e.target.value)}
                  placeholder="Add a note (optional)"
                  maxLength={500}
                  rows={4}
                  size="md"
                />
                <Text fontSize="xs" color="chakra-subtle-text" textAlign="right">
                  {(currentAnswer?.note || '').length}/500
                </Text>
              </VStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Navigation */}
        <HStack justify="space-between">
          <Button
            variant="ghost"
            leftIcon={<Icon as={ICONS.BackIcon} />}
            onClick={handlePrevious}
            isDisabled={currentStep === 0}
          >
            Previous
          </Button>
          {isLastQuestion ? (
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={saveResponseMutation.isPending}
              isDisabled={currentAnswer?.score === null}
            >
              Submit
            </Button>
          ) : (
            <Button
              colorScheme="blue"
              rightIcon={<Icon as={ICONS.ArrowRightIcon} />}
              onClick={handleNext}
              isDisabled={currentAnswer?.score === null}
              isLoading={saveResponseMutation.isPending}
            >
              Next
            </Button>
          )}
        </HStack>
      </VStack>

      {/* Exit Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay zIndex={10000}>
          <AlertDialogContent zIndex={10001}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Exit Health Check?
            </AlertDialogHeader>

            <AlertDialogBody>
              Your progress will be saved as a draft. You can continue later.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={confirmExit} ml={3}>
                Save & Exit
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
