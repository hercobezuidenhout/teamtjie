import { Heading, Text, Textarea, VStack } from "@chakra-ui/react";

export interface PostDescriptionProps {
    description: string;
    setDescription: (description: string) => void;
}

export const PostDescription = ({ description, setDescription }: PostDescriptionProps) => (
    <VStack alignItems="stretch" width="full">
        <Heading size="sm">FOR</Heading>
        <Textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder='What happened?'

            resize="none"
            borderRadius="lg"
            borderColor="chakra-subtle-bg"
            _placeholder={{
                fontWeight: "bold",
                color: "#C8C8C8"
            }}
            backgroundColor="chakra-body-bg"
        />
        <Text fontSize="xs" color="chakra-subtle-text">Always be polite and respectful 😊</Text>
    </VStack>
);