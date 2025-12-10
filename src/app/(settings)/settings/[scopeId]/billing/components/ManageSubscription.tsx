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
    Icon,
} from '@chakra-ui/react';
import { FiCheck, FiExternalLink, FiX } from 'react-icons/fi';
import { format } from 'date-fns';
import { useGetManagementLinkMutation } from '@/services/subscription/mutations/use-get-management-link-mutation';

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

export function ManageSubscription({ subscription }: ManageSubscriptionProps) {
    const toast = useToast();
    const getManagementLinkMutation = useGetManagementLinkMutation();

    const handleManageSubscription = async () => {
        try {
            const result = await getManagementLinkMutation.mutateAsync();

            if (!result) {
                throw new Error('Failed to get management link');
            }

            if (result.success && result.link) {
                // Open Paystack management page in new tab
                window.open(result.link, '_blank');

                toast({
                    title: 'Opening Management Page',
                    description: 'Manage your subscription on Paystack\'s secure page.',
                    status: 'info',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                throw new Error(result.message || 'Failed to get management link');
            }
        } catch (error: unknown) {
            toast({
                title: 'Unable to Open Management Page',
                description: error instanceof Error ? error.message : 'Please try again or contact support if the issue persists.',
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
                                    colorScheme="blue"
                                    variant="outline"
                                    size="md"
                                    w="full"
                                    onClick={handleManageSubscription}
                                    leftIcon={<Icon as={FiExternalLink} />}
                                    isLoading={getManagementLinkMutation.isPending}
                                >
                                    Manage Subscription on Paystack
                                </Button>
                                <Text fontSize="xs" color="chakra-subtle-text" textAlign="center">
                                    Cancel, update payment method, or view billing history on Paystack&apos;s secure page.
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
        </>
    );
}
