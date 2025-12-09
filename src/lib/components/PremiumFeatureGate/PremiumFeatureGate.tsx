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
    Icon,
} from '@chakra-ui/react';
import { FiCheck, FiTrendingUp, FiActivity, FiCreditCard } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { BILLING_CONFIG } from '@/config/billing';

interface PremiumFeatureGateProps {
    scopeId: number;
    featureName?: string;
    onUpgrade?: () => void;
    variant?: 'card' | 'inline';
}

export function PremiumFeatureGate({
    scopeId,
    featureName = 'this feature',
    onUpgrade,
    variant = 'card'
}: PremiumFeatureGateProps) {
    const router = useRouter();

    const handleUpgrade = () => {
        if (onUpgrade) {
            onUpgrade();
        } else {
            router.push(`/settings/${scopeId}/billing`);
        }
    };

    const content = (
        <VStack align="stretch" spacing={6}>
            {/* Header */}
            <VStack spacing={3}>
                <Badge colorScheme="blue" fontSize="sm" px={3} py={1}>
                    PREMIUM FEATURE
                </Badge>
                <Heading size="lg">
                    Upgrade to Premium
                </Heading>
                <Text color="chakra-subtle-text" textAlign="center">
                    {featureName} requires a Premium subscription
                </Text>
            </VStack>

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
                                <HStack spacing={2}>
                                    <Icon as={FiCreditCard} />
                                    <Text fontWeight="medium">Secure Billing</Text>
                                </HStack>
                                <Text fontSize="sm" color="chakra-subtle-text">
                                    Powered by Paystack
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
                >
                    Upgrade to Premium
                </Button>
                <Text fontSize="xs" color="chakra-subtle-text" textAlign="center">
                    Secure payment powered by Paystack
                </Text>
            </VStack>
        </VStack>
    );

    // Inline variant for modals - no card wrapper
    if (variant === 'inline') {
        return (
            <VStack maxW="600px" mx="auto" py={6} px={4}>
                {content}
            </VStack>
        );
    }

    // Card variant for full pages
    return (
        <Card maxW="600px" mx="auto" my={8}>
            <CardHeader>
                <VStack spacing={3}>
                    <Badge colorScheme="blue" fontSize="sm" px={3} py={1}>
                        PREMIUM FEATURE
                    </Badge>
                    <Heading size="lg">
                        Upgrade to Premium
                    </Heading>
                    <Text color="chakra-subtle-text" textAlign="center">
                        {featureName} requires a Premium subscription
                    </Text>
                </VStack>
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
                                        <HStack spacing={2}>
                                            <Icon as={FiCreditCard} />
                                            <Text fontWeight="medium">Secure Billing</Text>
                                        </HStack>
                                        <Text fontSize="sm" color="chakra-subtle-text">
                                            Powered by Paystack
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
                        >
                            Upgrade to Premium
                        </Button>
                        <Text fontSize="xs" color="chakra-subtle-text" textAlign="center">
                            Secure payment powered by Paystack
                        </Text>
                    </VStack>
                </VStack>
            </CardBody>
        </Card>
    );
}
