import { Box, Button, Heading, Text, VStack, Icon, HStack, Badge } from '@chakra-ui/react';
import { FiLock, FiTrendingUp, FiActivity } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface PremiumFeatureGateProps {
    scopeId: number;
    featureName?: string;
    onUpgrade?: () => void;
}

export function PremiumFeatureGate({
    scopeId,
    featureName = 'this feature',
    onUpgrade
}: PremiumFeatureGateProps) {
    const router = useRouter();

    const handleUpgrade = () => {
        if (onUpgrade) {
            onUpgrade();
        } else {
            // Navigate to billing page (will be implemented in Phase 3)
            router.push(`/settings/${scopeId}/billing`);
        }
    };

    return (
        <Box
            p={8}
            borderWidth="2px"
            borderRadius="lg"
            borderColor="purple.200"
            bg="purple.50"
            textAlign="center"
            maxW="600px"
            mx="auto"
            my={8}
        >
            <VStack spacing={4}>
                <Icon as={FiLock} boxSize={12} color="purple.500" />

                <Badge colorScheme="purple" fontSize="sm" px={3} py={1}>
                    PREMIUM FEATURE
                </Badge>

                <Heading size="lg" color="purple.900">
                    Upgrade to Premium
                </Heading>

                <Text color="gray.700" fontSize="lg">
                    {featureName} requires a Premium subscription
                </Text>

                <Box bg="white" p={6} borderRadius="md" w="full" boxShadow="sm">
                    <VStack spacing={4} align="stretch">
                        <HStack>
                            <Icon as={FiTrendingUp} color="purple.500" />
                            <Text fontWeight="medium">Daily Sentiments</Text>
                        </HStack>
                        <HStack>
                            <Icon as={FiActivity} color="purple.500" />
                            <Text fontWeight="medium">Health Checks</Text>
                        </HStack>
                    </VStack>
                </Box>

                <VStack spacing={2} pt={2}>
                    <HStack spacing={1} align="baseline">
                        <Text fontSize="3xl" fontWeight="bold" color="purple.600">
                            R99
                        </Text>
                        <Text color="gray.600">/month</Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.500">
                        Cancel anytime
                    </Text>
                </VStack>

                <Button
                    colorScheme="purple"
                    size="lg"
                    onClick={handleUpgrade}
                    w="full"
                    maxW="300px"
                >
                    Upgrade to Premium
                </Button>

                <Text fontSize="xs" color="gray.500" pt={2}>
                    Billing managed through PayFast
                </Text>
            </VStack>
        </Box>
    );
}