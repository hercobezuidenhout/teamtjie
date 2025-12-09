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
    Divider
} from '@chakra-ui/react';
import { FiCheck, FiTrendingUp, FiActivity, FiCreditCard } from 'react-icons/fi';

interface UpgradeCardProps {
    scopeId: number;
    onUpgrade?: () => void;
}

export function UpgradeCard({ scopeId, onUpgrade }: UpgradeCardProps) {
    const handleUpgrade = () => {
        if (onUpgrade) {
            onUpgrade();
        } else {
            // Phase 4 will implement actual payment flow
            console.log('Upgrade clicked for scope:', scopeId);
        }
    };

    return (
        <Card>
            <CardHeader>
                <HStack justify="space-between" align="center">
                    <VStack align="start" spacing={1}>
                        <Heading size="md">Premium Plan</Heading>
                        <Text fontSize="sm" color="chakra-subtle-text">
                            Unlock advanced team features
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
                                R99
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
                                            <FiTrendingUp />
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
                                            <FiActivity />
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
                                        <HStack spacing={2}>
                                            <FiCreditCard />
                                            <Text fontWeight="medium">Secure Billing</Text>
                                        </HStack>
                                        <Text fontSize="sm" color="chakra-subtle-text">
                                            Managed through PayFast - South Africa&apos;s trusted payment gateway
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
                            leftIcon={<FiCreditCard />}
                        >
                            Upgrade to Premium
                        </Button>
                        <Text fontSize="xs" color="chakra-subtle-text" textAlign="center">
                            You&apos;ll be redirected to PayFast to complete your payment securely
                        </Text>
                    </VStack>
                </VStack>
            </CardBody>
        </Card>
    );
}