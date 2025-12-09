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
    List,
    ListItem,
    ListIcon,
    Badge,
    Divider,
    useToast,
    Alert,
    AlertIcon,
    Icon,
} from '@chakra-ui/react';
import { FiCheck, FiTrendingUp, FiActivity, FiCreditCard } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { BILLING_CONFIG, isBillingConfigured } from '@/config/billing';
import { post } from '@/services/network';
import { useQueryClient } from '@tanstack/react-query';
import { TeamSelectionModal } from '@/app/(settings)/settings/[scopeId]/billing/components/TeamSelectionModal';

interface SubscribeCardProps {
    userEmail: string;
    userName: string;
    userScopes: Array<{ id: number; name: string; type: string; roles: Array<{ role: string }> }>;
}

export function SubscribeCard({ userEmail, userName, userScopes }: SubscribeCardProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [showTeamSelection, setShowTeamSelection] = useState(false);
    const [PaystackPop, setPaystackPop] = useState<any>(null);
    const toast = useToast();
    const queryClient = useQueryClient();

    // Load Paystack only on client side
    useEffect(() => {
        import('@paystack/inline-js').then((module) => {
            setPaystackPop(() => module.default);
        });
    }, []);

    // Filter teams where user is admin
    const adminTeams = userScopes
        .filter((scope) => scope.roles.some((r) => r.role === 'ADMIN'))
        .map((scope) => ({
            id: scope.id,
            name: scope.name,
            type: scope.type,
        }));

    // Validate environment configuration
    if (!isBillingConfigured()) {
        return (
            <Alert status="error">
                <AlertIcon />
                <VStack align="start" spacing={1}>
                    <Text fontWeight="bold">Configuration Error</Text>
                    <Text fontSize="sm">
                        Paystack public key is not configured. Please add NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY to your environment variables.
                    </Text>
                </VStack>
            </Alert>
        );
    }

    if (adminTeams.length === 0) {
        return (
            <Alert status="info" borderRadius="md">
                <AlertIcon />
                <VStack align="start" spacing={1}>
                    <Text fontWeight="bold">No Admin Teams</Text>
                    <Text fontSize="sm">
                        You need to be an admin of at least one team to subscribe to Teamtjie+. Create a team or get promoted to admin first.
                    </Text>
                </VStack>
            </Alert>
        );
    }

    const handleUpgrade = async () => {
        if (!PaystackPop) {
            toast({
                title: 'Loading',
                description: 'Payment system is loading, please try again in a moment.',
                status: 'info',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        if (!userEmail) {
            toast({
                title: 'Email Required',
                description: 'Please add an email address to your profile before upgrading.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        setIsLoading(true);

        try {
            // Step 1: Create user-level subscription (using first admin team as context)
            const createResponse = await post<{ success: boolean; reference: string }>(
                `/api/v1/billing/subscriptions/${adminTeams[0].id}/create`,
                {}
            );

            if (!createResponse.success || !createResponse.reference) {
                throw new Error('Failed to create subscription');
            }

            const reference = createResponse.reference;

            // Step 2: Show Paystack popup with backend-generated reference
            const paystack = new PaystackPop();
            paystack.newTransaction({
                key: BILLING_CONFIG.paystack.publicKey,
                email: userEmail,
                amount: BILLING_CONFIG.price.amountInKobo,
                currency: BILLING_CONFIG.price.currency,
                ref: reference,
                metadata: {
                    userName,
                    subscriptionType: 'TEAMTJIE_PLUS',
                },
                onSuccess: async (transaction) => {
                    console.log('Payment successful:', transaction);

                    try {
                        // Step 3: Verify payment and activate subscription
                        const verifyResponse = await post<{ success: boolean; showTeamSelection?: boolean }>(
                            '/api/v1/billing/subscriptions/verify',
                            {
                                reference: transaction.reference,
                            }
                        );

                        toast({
                            title: 'Payment Successful!',
                            description: 'Now select which teams to activate.',
                            status: 'success',
                            duration: 4000,
                            isClosable: true,
                        });

                        // Invalidate subscription query
                        queryClient.invalidateQueries({ queryKey: ['subscription'] });

                        setIsLoading(false);

                        // Show team selection modal
                        if (verifyResponse.showTeamSelection) {
                            setShowTeamSelection(true);
                        }
                    } catch (error) {
                        console.error('Activation error:', error);
                        toast({
                            title: 'Payment Received',
                            description: 'Payment successful but activation in progress. Please refresh in a moment.',
                            status: 'warning',
                            duration: 7000,
                            isClosable: true,
                        });
                        setIsLoading(false);
                    }
                },
                onCancel: () => {
                    console.log('Payment cancelled by user');
                    toast({
                        title: 'Payment Cancelled',
                        description: 'You can subscribe anytime.',
                        status: 'info',
                        duration: 3000,
                        isClosable: true,
                    });
                    setIsLoading(false);
                },
            });
        } catch (error) {
            console.error('Error initializing payment:', error);
            toast({
                title: 'Error',
                description: 'Failed to initialize payment. Please try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            setIsLoading(false);
        }
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <HStack justify="space-between" align="center">
                        <VStack align="start" spacing={1}>
                            <Heading size="md">Teamtjie+ Plan</Heading>
                            <Text fontSize="sm" color="chakra-subtle-text">
                                Up to 3 premium teams
                            </Text>
                        </VStack>
                        <Badge colorScheme="blue" fontSize="sm">
                            RECOMMENDED
                        </Badge>
                    </HStack>
                </CardHeader>

                <CardBody>
                    <VStack align="stretch" spacing={6}>
                        {/* Pricing */}
                        <VStack spacing={2}>
                            <HStack spacing={1} align="baseline">
                                <Text fontSize="sm" color="chakra-subtle-text">
                                    Only
                                </Text>
                                <Text fontSize="4xl" fontWeight="bold" color="chakra-primary-color">
                                    R{BILLING_CONFIG.price.monthly}
                                </Text>
                                <Text color="chakra-subtle-text">/month</Text>
                            </HStack>
                            <Text fontSize="sm" color="chakra-subtle-text">
                                Billed monthly • Cancel anytime
                            </Text>
                        </VStack>

                        <Divider />

                        {/* Features */}
                        <VStack align="stretch" spacing={4}>
                            <Heading size="sm">What&apos;s included:</Heading>

                            <List spacing={4}>
                                <ListItem>
                                    <HStack align="start" spacing={3}>
                                        <ListIcon as={FiCheck} color="green.500" mt={1} boxSize={5} />
                                        <VStack align="start" spacing={1}>
                                            <HStack spacing={2}>
                                                <Icon as={FiTrendingUp} />
                                                <Text fontWeight="medium">Daily Sentiments</Text>
                                            </HStack>
                                            <Text fontSize="sm" color="chakra-subtle-text">
                                                Track team mood and engagement daily
                                            </Text>
                                        </VStack>
                                    </HStack>
                                </ListItem>

                                <ListItem>
                                    <HStack align="start" spacing={3}>
                                        <ListIcon as={FiCheck} color="green.500" mt={1} boxSize={5} />
                                        <VStack align="start" spacing={1}>
                                            <HStack spacing={2}>
                                                <Icon as={FiActivity} />
                                                <Text fontWeight="medium">Health Checks</Text>
                                            </HStack>
                                            <Text fontSize="sm" color="chakra-subtle-text">
                                                Regular team health assessments and insights
                                            </Text>
                                        </VStack>
                                    </HStack>
                                </ListItem>

                                <ListItem>
                                    <HStack align="start" spacing={3}>
                                        <ListIcon as={FiCheck} color="green.500" mt={1} boxSize={5} />
                                        <VStack align="start" spacing={1}>
                                            <Text fontWeight="medium">Up to 3 Teams</Text>
                                            <Text fontSize="sm" color="chakra-subtle-text">
                                                Choose which teams get premium features
                                            </Text>
                                        </VStack>
                                    </HStack>
                                </ListItem>
                            </List>
                        </VStack>

                        <Divider />

                        {/* CTA */}
                        <VStack spacing={3}>
                            <Button
                                colorScheme="blue"
                                size="lg"
                                w="full"
                                onClick={handleUpgrade}
                                leftIcon={<Icon as={FiCreditCard} />}
                                isLoading={isLoading}
                                loadingText="Processing..."
                            >
                                Subscribe to Teamtjie+
                            </Button>
                            <Text fontSize="xs" color="chakra-subtle-text" textAlign="center">
                                Secure payment powered by Paystack
                            </Text>
                        </VStack>
                    </VStack>
                </CardBody>
            </Card>

            <TeamSelectionModal
                isOpen={showTeamSelection}
                onClose={() => setShowTeamSelection(false)}
                teams={adminTeams}
            />
        </>
    );
}
