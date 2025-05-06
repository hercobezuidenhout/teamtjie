import { HStack, Heading, Text, VStack } from "@chakra-ui/react";

export const FeedHeader = () => (
    <HStack justifyContent="space-between" w="full">
        <VStack align="stretch" gap={0}>
            <Heading>Feed</Heading>
            <Text>Posts from all your teams</Text>
        </VStack>
    </HStack>
);