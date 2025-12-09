'use client';

import {
    Card,
    CardHeader,
    CardBody,
    Button,
    Heading,
    Text,
    VStack,
    HStack,
    Badge,
    Divider,
    useToast,
    Alert,
    AlertIcon,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    useDisclosure,
    Icon,
} from '@chakra-ui/react';
import { FiCheck, FiX, FiCreditCard } from 'react-icons/fi';
import { useRef } from 'react';
import { format } from 'date-fns';
import { useCancelSubscriptionMutation } from '@/services/subscription/mutations/use-cancel-subscription-mutation';

interface ManageSubscriptionProps {
    scopeId: number;
    subscription: {
        id: number;
        status: string;
        amount: number;
        currency: string;
        currentPeriodStart?: string | null;
        currentPeriodEnd?: string | null;
        cancelAtPeriodEnd?: boolean;
        createdAt: string;
    };
}

export function ManageSubscription({ scopeId, subscription }: ManageSubscriptionProps) {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement>(null);
    const cancelMutation = useCancelSubscriptionMutation();

    const handleCancelSubscription = async () => {
        try {
            await cancelMutation.mutateAsync({
                scopeId,
                immediate: false, // Cancel at period end
            });

            toast({
                title: 'Subscription Cancelled',
                description: 'Your subscription will remain active until the end of the current billing period.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

            onClose();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to cancel subscription. Please try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const isActive = subscription.status === 'ACTIVE';
    const isCancelled = subscription.status === 'CANCELLED';
    const isPendingCancellation = isActive && subscription.cancelAtPeriodEnd;

    return (
        <>
            <Card>
                <CardHeader>
                    <HStack justify="space-between" align="center">
                        <VStack align="start" spacing={1}>
                            <Heading size="md">Premium Plan</Heading>
                            <Text fontSize="sm" color="chakra-subtle-text">
                                Your subscription details
                            </Text>
                        </VStack>
                        <Badge
                            colorScheme={
                                isPendingCancellation
                                    ? 'orange'
                                    : isActive
                                    ? 'green'
                                    : 'gray'
                            }
                            fontSize="sm"
                        >
                            {isPendingCancellation
                                ? 'CANCELLING'
                                : subscription.status}
                        </Badge>
                    </HStack>
                </CardHeader>

                <CardBody>
                    <VStack align="stretch" spacing={6}>
                        {/* Status Message */}
                        {isPendingCancellation && (
                            <Alert status="warning" borderRadius="md">
                                <AlertIcon />
                                <VStack align="start" spacing={1}>
                                    <Text fontWeight="bold" fontSize="sm">
                                        Subscription Cancelling
                                    </Text>
                                    <Text fontSize="sm">
                                        Your subscription will end on{' '}
                                        {subscription.currentPeriodEnd
                                            ? format(new Date(subscription.currentPeriodEnd), 'MMM d, yyyy')
                                            : 'the current period end'}
                                        . Premium features will remain active until then.
                                    </Text>
                                </VStack>
                            </Alert>
                        )}

                        {isCancelled && (
                            <Alert status="info" borderRadius="md">
                                <AlertIcon />
                                <Text fontSize="sm">
                                    Your subscription has been cancelled. Upgrade again to restore premium features.
                                </Text>
                            </Alert>
                        )}

                        {/* Pricing */}
                        <VStack spacing={2}>
                            <HStack spacing={1} align="baseline">
                                <Text fontSize="4xl" fontWeight="bold" color="chakra-primary-color">
                                    R{subscription.amount}
                                </Text>
                                <Text color="chakra-subtle-text">/month</Text>
                            </HStack>
                            <Text fontSize="sm" color="chakra-subtle-text">
                                Billed monthly
                            </Text>
                        </VStack>

                        <Divider />

                        {/* Billing Info */}
                        <VStack align="stretch" spacing={3}>
                            <Heading size="sm">Billing Information</Heading>

                            <HStack justify="space-between">
                                <Text fontSize="sm" color="chakra-subtle-text">
                                    Status
                                </Text>
                                <HStack spacing={2}>
                                    <Icon
                                        as={isActive ? FiCheck : FiX}
                                        color={isActive ? 'green.500' : 'red.500'}
                                    />
                                    <Text fontSize="sm" fontWeight="medium">
                                        {isPendingCancellation ? 'Active (Cancelling)' : subscription.status}
                                    </Text>
                                </HStack>
                            </HStack>

                            {subscription.currentPeriodStart && (
                                <HStack justify="space-between">
                                    <Text fontSize="sm" color="chakra-subtle-text">
                                        Current Period
                                    </Text>
                                    <Text fontSize="sm" fontWeight="medium">
                                        {format(new Date(subscription.currentPeriodStart), 'MMM d, yyyy')}
                                    </Text>
                                </HStack>
                            )}

                            {subscription.currentPeriodEnd && (
                                <HStack justify="space-between">
                                    <Text fontSize="sm" color="chakra-subtle-text">
                                        {isPendingCancellation ? 'Active Until' : 'Next Billing Date'}
                                    </Text>
                                    <Text fontSize="sm" fontWeight="medium">
                                        {format(new Date(subscription.currentPeriodEnd), 'MMM d, yyyy')}
                                    </Text>
                                </HStack>
                            )}

                            <HStack justify="space-between">
                                <Text fontSize="sm" color="chakra-subtle-text">
                                    Subscribed Since
                                </Text>
                                <Text fontSize="sm" fontWeight="medium">
                                    {format(new Date(subscription.createdAt), 'MMM d, yyyy')}
                                </Text>
                            </HStack>
                        </VStack>

                        <Divider />

                        {/* Actions */}
                        {isActive && !isPendingCancellation && (
                            <VStack spacing={3}>
                                <Button
                                    colorScheme="red"
                                    variant="outline"
                                    size="md"
                                    w="full"
                                    onClick={onOpen}
                                    leftIcon={<Icon as={FiX} />}
                                >
                                    Cancel Subscription
                                </Button>
                                <Text fontSize="xs" color="chakra-subtle-text" textAlign="center">
                                    You can cancel anytime. Access continues until period end.
                                </Text>
                            </VStack>
                        )}

                        {isPendingCancellation && (
                            <Text fontSize="sm" color="chakra-subtle-text" textAlign="center">
                                Cancellation scheduled. Premium features remain active until{' '}
                                {subscription.currentPeriodEnd
                                    ? format(new Date(subscription.currentPeriodEnd), 'MMM d, yyyy')
                                    : 'period end'}
                                .
                            </Text>
                        )}
                    </VStack>
                </CardBody>
            </Card>

            {/* Confirmation Dialog */}
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Cancel Subscription?
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            <VStack align="stretch" spacing={3}>
                                <Text>
                                    Your subscription will be cancelled, but you&apos;ll keep access to premium features until the end of your current billing period.
                                </Text>
                                {subscription.currentPeriodEnd && (
                                    <Text fontWeight="medium">
                                        Access until: {format(new Date(subscription.currentPeriodEnd), 'MMM d, yyyy')}
                                    </Text>
                                )}
                                <Text fontSize="sm" color="chakra-subtle-text">
                                    You can resubscribe anytime.
                                </Text>
                            </VStack>
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Keep Subscription
                            </Button>
                            <Button
                                colorScheme="red"
                                onClick={handleCancelSubscription}
                                ml={3}
                                isLoading={cancelMutation.isPending}
                            >
                                Cancel Subscription
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
}
